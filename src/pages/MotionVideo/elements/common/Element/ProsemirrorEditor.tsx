import { HistorySnapshot } from '@/pages/MotionVideo/components/PPTEditor/hooks/useHistorySnapshot';
import { MainStoreType } from '@/pages/MotionVideo/components/PPTEditor/store/main';
import { SlidesStoreType } from '@/pages/MotionVideo/components/PPTEditor/store/slides';
import clsx from 'clsx';
import { debounce } from 'lodash';
import { lift, toggleMark, wrapIn } from 'prosemirror-commands';
import { EditorView } from 'prosemirror-view';
import React, { MouseEvent, useEffect, useRef } from 'react';

import { TextFormatPainterKeys } from '@/pages/MotionVideo/types/edit';
import emitter, {
  EmitterEvents,
  RichTextAction,
  RichTextCommand,
} from '@/pages/MotionVideo/utils/emitter';

import {
  createDocument,
  initProsemirrorEditor,
} from '@/pages/MotionVideo/utils/prosemirror';
import { setListStyle } from '@/pages/MotionVideo/utils/prosemirror/commands/setListStyle';
import { alignmentCommand } from '@/pages/MotionVideo/utils/prosemirror/commands/setTextAlign';
import {
  indentCommand,
  textIndentCommand,
} from '@/pages/MotionVideo/utils/prosemirror/commands/setTextIndent';
import { toggleList } from '@/pages/MotionVideo/utils/prosemirror/commands/toggleList';
import {
  addMark,
  autoSelectAll,
  findNodesWithSameMark,
  getFontsize,
  getTextAttrs,
  isActiveOfParentNodeType,
  markActive,
} from '@/pages/MotionVideo/utils/prosemirror/utils';

interface ProsemirrorEditorProps {
  elementId: string;
  defaultColor: string;
  defaultFontName: string;
  value: string;
  editable?: boolean;
  autoFocus?: boolean;
  hanldeUpdate: (payload: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onMouseDown: (event: MouseEvent<HTMLDivElement>) => void;
  style: any;
  store: {
    useMainStore: MainStoreType;
    useSlidesStore: SlidesStoreType;
    useHistorySnapshot: HistorySnapshot;
  };
}

const ProsemirrorEditor: React.FC<ProsemirrorEditorProps> = ({
  elementId,
  defaultColor,
  defaultFontName,
  value,
  editable = false,
  autoFocus = false,
  style = {},
  hanldeUpdate,
  onFocus = () => {},
  onBlur = () => {},
  onMouseDown,
  store,
}) => {
  const { useMainStore } = store;

  const setDisableHotkeysState = useMainStore(
    (store) => store.setDisableHotkeysState,
  );
  const setRichtextAttrs = useMainStore((store) => store.setRichtextAttrs);

  const handleElementId = useMainStore((store) => store.activeElementId);
  const textFormatPainter = useMainStore((store) => store.textFormatPainter);
  const richTextAttrs = useMainStore((store) => store.richTextAttrs);
  const editorViewRef = useRef<HTMLDivElement>(null);

  const editorViewMainRef = useRef<EditorView | null>(null);

  const handleElementIdRef = useRef(handleElementId);

  useEffect(() => {
    handleElementIdRef.current = handleElementId;
  }, [handleElementId]);

  const textFormatPainterRef = useRef(textFormatPainter);

  useEffect(() => {
    textFormatPainterRef.current = textFormatPainter;
  }, [textFormatPainter]);

  const handleInput = debounce(
    (editorView) => {
      if (editorView) {
        hanldeUpdate(editorView.dom.innerHTML);
      }
    },
    300,
    { trailing: true },
  );

  const handleFocus = () => {
    setDisableHotkeysState(true);
    onFocus();
  };

  const handleBlur = () => {
    setDisableHotkeysState(false);
    onBlur();
  };

  const handleClick = debounce(
    (editorView) => {
      if (editorView) {
        const attrs = getTextAttrs(editorView, {
          color: defaultColor,
          fontname: defaultFontName,
        });
        setRichtextAttrs(attrs);
      }
    },
    30,
    { trailing: true },
  );

  const handleKeydown = (view) => {
    handleInput(view);
    handleClick(view);
  };

  // 执行富文本命令（可以是一个或多个）
  // 部分命令在执行前先判断当前选区是否为空，如果选区为空先进行全选操作
  const execCommand = ({ target, action }: RichTextCommand) => {
    if (!editorViewMainRef.current) return;

    if (!target && handleElementIdRef.current !== elementId) return;
    if (target && target !== elementId) return;

    const actions = Array.isArray(action) ? action : [action];

    for (const item of actions) {
      if (item.command === 'fontname' && item.value) {
        const mark =
          editorViewMainRef.current.state.schema.marks.fontname.create({
            fontname: item.value,
          });
        autoSelectAll(editorViewMainRef.current);
        addMark(editorViewMainRef.current, mark);
      } else if (item.command === 'fontsize' && item.value) {
        const mark =
          editorViewMainRef.current.state.schema.marks.fontsize.create({
            fontsize: item.value,
          });
        autoSelectAll(editorViewMainRef.current);
        addMark(editorViewMainRef.current, mark);
        setListStyle(editorViewMainRef.current, {
          key: 'fontsize',
          value: item.value,
        });
      } else if (item.command === 'fontsize-add') {
        const step = item.value ? +item.value : 2;
        autoSelectAll(editorViewMainRef.current);
        const fontsize = getFontsize(editorViewMainRef.current) + step + 'px';
        const mark =
          editorViewMainRef.current.state.schema.marks.fontsize.create({
            fontsize,
          });
        addMark(editorViewMainRef.current, mark);
        setListStyle(editorViewMainRef.current, {
          key: 'fontsize',
          value: fontsize,
        });
      } else if (item.command === 'fontsize-reduce') {
        const step = item.value ? +item.value : 2;
        autoSelectAll(editorViewMainRef.current);
        let fontsize = getFontsize(editorViewMainRef.current) - step;
        if (fontsize < 12) fontsize = 12;
        const mark =
          editorViewMainRef.current.state.schema.marks.fontsize.create({
            fontsize: fontsize + 'px',
          });
        addMark(editorViewMainRef.current, mark);
        setListStyle(editorViewMainRef.current, {
          key: 'fontsize',
          value: fontsize + 'px',
        });
      } else if (item.command === 'color' && item.value) {
        const mark =
          editorViewMainRef.current.state.schema.marks.forecolor.create({
            color: item.value,
          });
        autoSelectAll(editorViewMainRef.current);
        addMark(editorViewMainRef.current, mark);
        setListStyle(editorViewMainRef.current, {
          key: 'color',
          value: item.value,
        });
      } else if (item.command === 'backcolor' && item.value) {
        const mark =
          editorViewMainRef.current.state.schema.marks.backcolor.create({
            backcolor: item.value,
          });
        autoSelectAll(editorViewMainRef.current);
        addMark(editorViewMainRef.current, mark);
      } else if (item.command === 'bold') {
        autoSelectAll(editorViewMainRef.current);
        toggleMark(editorViewMainRef.current.state.schema.marks.strong)(
          editorViewMainRef.current.state,
          editorViewMainRef.current.dispatch,
        );
      } else if (item.command === 'em') {
        autoSelectAll(editorViewMainRef.current);
        toggleMark(editorViewMainRef.current.state.schema.marks.em)(
          editorViewMainRef.current.state,
          editorViewMainRef.current.dispatch,
        );
      } else if (item.command === 'underline') {
        autoSelectAll(editorViewMainRef.current);
        toggleMark(editorViewMainRef.current.state.schema.marks.underline)(
          editorViewMainRef.current.state,
          editorViewMainRef.current.dispatch,
        );
      } else if (item.command === 'strikethrough') {
        autoSelectAll(editorViewMainRef.current);
        toggleMark(editorViewMainRef.current.state.schema.marks.strikethrough)(
          editorViewMainRef.current.state,
          editorViewMainRef.current.dispatch,
        );
      } else if (item.command === 'subscript') {
        toggleMark(editorViewMainRef.current.state.schema.marks.subscript)(
          editorViewMainRef.current.state,
          editorViewMainRef.current.dispatch,
        );
      } else if (item.command === 'superscript') {
        toggleMark(editorViewMainRef.current.state.schema.marks.superscript)(
          editorViewMainRef.current.state,
          editorViewMainRef.current.dispatch,
        );
      } else if (item.command === 'blockquote') {
        const isBlockquote = isActiveOfParentNodeType(
          'blockquote',
          editorViewMainRef.current.state,
        );
        if (isBlockquote)
          lift(
            editorViewMainRef.current.state,
            editorViewMainRef.current.dispatch,
          );
        else
          wrapIn(editorViewMainRef.current.state.schema.nodes.blockquote)(
            editorViewMainRef.current.state,
            editorViewMainRef.current.dispatch,
          );
      } else if (item.command === 'code') {
        toggleMark(editorViewMainRef.current.state.schema.marks.code)(
          editorViewMainRef.current.state,
          editorViewMainRef.current.dispatch,
        );
      } else if (item.command === 'align' && item.value) {
        alignmentCommand(editorViewMainRef.current, item.value);
      } else if (item.command === 'indent' && item.value) {
        indentCommand(editorViewMainRef.current, +item.value);
      } else if (item.command === 'textIndent' && item.value) {
        textIndentCommand(editorViewMainRef.current, +item.value);
      } else if (item.command === 'bulletList') {
        const listStyleType = item.value || '';
        const { bullet_list: bulletList, list_item: listItem } =
          editorViewMainRef.current.state.schema.nodes;
        const textStyle = {
          color: richTextAttrs.color,
          fontsize: richTextAttrs.fontsize,
        };
        toggleList(
          bulletList,
          listItem,
          listStyleType,
          textStyle,
        )(editorViewMainRef.current.state, editorViewMainRef.current.dispatch);
      } else if (item.command === 'orderedList') {
        const listStyleType = item.value || '';
        const { ordered_list: orderedList, list_item: listItem } =
          editorViewMainRef.current.state.schema.nodes;
        const textStyle = {
          color: richTextAttrs.color,
          fontsize: richTextAttrs.fontsize,
        };
        toggleList(
          orderedList,
          listItem,
          listStyleType,
          textStyle,
        )(editorViewMainRef.current.state, editorViewMainRef.current.dispatch);
      } else if (item.command === 'clear') {
        autoSelectAll(editorViewMainRef.current);
        const { $from, $to } = editorViewMainRef.current.state.selection;
        editorViewMainRef.current.dispatch(
          editorViewMainRef.current.state.tr.removeMark($from.pos, $to.pos),
        );
        setListStyle(editorViewMainRef.current, [
          { key: 'fontsize', value: '' },
          { key: 'color', value: '' },
        ]);
      } else if (item.command === 'link') {
        const markType = editorViewMainRef.current.state.schema.marks.link;
        const { from, to } = editorViewMainRef.current.state.selection;
        const result = findNodesWithSameMark(
          editorViewMainRef.current.state.doc,
          from,
          to,
          markType,
        );
        if (result) {
          if (item.value) {
            const mark =
              editorViewMainRef.current.state.schema.marks.link.create({
                href: item.value,
                title: item.value,
              });
            addMark(editorViewMainRef.current, mark, {
              from: result.from.pos,
              to: result.to.pos + 1,
            });
          } else {
            editorViewMainRef.current.dispatch(
              editorViewMainRef.current.state.tr.removeMark(
                result.from.pos,
                result.to.pos + 1,
                markType,
              ),
            );
          }
        } else if (markActive(editorViewMainRef.current.state, markType)) {
          if (item.value) {
            const mark =
              editorViewMainRef.current.state.schema.marks.link.create({
                href: item.value,
                title: item.value,
              });
            addMark(editorViewMainRef.current, mark);
          } else {
            toggleMark(markType)(
              editorViewMainRef.current.state,
              editorViewMainRef.current.dispatch,
            );
          }
        } else if (item.value) {
          autoSelectAll(editorViewMainRef.current);
          toggleMark(markType, { href: item.value, title: item.value })(
            editorViewMainRef.current.state,
            editorViewMainRef.current.dispatch,
          );
        }
      } else if (item.command === 'insert' && item.value) {
        editorViewMainRef.current.dispatch(
          editorViewMainRef.current.state.tr.insertText(item.value),
        );
      }
    }

    editorViewMainRef.current.focus();
    handleKeydown(editorViewMainRef.current);
  };

  // 鼠标抬起时，执行格式刷命令
  const handleMouseup = () => {
    if (!textFormatPainterRef.current) return;
    const { keep, ...newProps } = textFormatPainterRef.current;

    const actions: RichTextAction[] = [{ command: 'clear' }];
    for (const key of Object.keys(newProps) as TextFormatPainterKeys[]) {
      const command = key;
      const value = textFormatPainterRef.current[key];
      if (value === true) actions.push({ command });
      else if (value) actions.push({ command, value });
    }

    execCommand({ action: actions });
    if (!keep) useMainStore.getState().setTextFormatPainter(null);
  };

  useEffect(() => {
    if (!editorViewRef.current) return;
    const view = initProsemirrorEditor(editorViewRef.current, value, {
      handleDOMEvents: {
        focus: handleFocus,
        blur: handleBlur,
        keydown: (view) => handleKeydown(view),
        click: (view) => handleClick(view),
        mouseup: handleMouseup,
      },
      editable: () => editable,
    });
    editorViewMainRef.current = view;

    if (autoFocus) editorViewMainRef.current?.focus();
  }, []);

  useEffect(() => {
    emitter.on(EmitterEvents.RICH_TEXT_COMMAND, execCommand);
    emitter.on(EmitterEvents.SYNC_RICH_TEXT_ATTRS_TO_STORE, handleClick);
    return () => {
      if (editorViewMainRef.current) editorViewMainRef.current.destroy();
      emitter.off(EmitterEvents.RICH_TEXT_COMMAND, execCommand);
      emitter.off(EmitterEvents.SYNC_RICH_TEXT_ATTRS_TO_STORE, handleClick);
    };
  }, []);

  useEffect(() => {
    if (!editorViewMainRef.current) return;
    if (editorViewMainRef.current.hasFocus()) return;

    const { doc, tr } = editorViewMainRef.current.state;
    editorViewMainRef.current.dispatch(
      tr.replaceRangeWith(0, doc.content.size, createDocument(value)),
    );
  }, [value, editorViewMainRef.current]);

  useEffect(() => {
    if (editorViewMainRef.current) {
      editorViewMainRef.current.setProps({ editable: () => editable });
    }
  }, [editable, editorViewMainRef.current]);

  return (
    <div
      style={{
        position: 'relative',
        cursor: 'text',
        ...style,
      }}
      className={clsx(
        `prosemirror-editor ${textFormatPainter ? 'format-painter' : ''}`,
      )}
      ref={editorViewRef}
      onMouseDown={onMouseDown}
    ></div>
  );
};

export default ProsemirrorEditor;
