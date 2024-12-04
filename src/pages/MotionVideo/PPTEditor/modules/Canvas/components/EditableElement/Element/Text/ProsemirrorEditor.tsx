import clsx from 'clsx';
import { debounce } from 'lodash';
import { lift, toggleMark, wrapIn } from 'prosemirror-commands';
import { EditorView } from 'prosemirror-view';
import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import useMainStore from '../../../../../../store/main';
import type { TextFormatPainterKeys } from '../../../../../../types/edit';
import emitter, {
  EmitterEvents,
  type RichTextAction,
  type RichTextCommand,
} from '../../../../../../utils/emitter';
import {
  createDocument,
  initProsemirrorEditor,
} from '../../../../../../utils/prosemirror';
import { setListStyle } from '../../../../../../utils/prosemirror/commands/setListStyle';
import { alignmentCommand } from '../../../../../../utils/prosemirror/commands/setTextAlign';
import {
  indentCommand,
  textIndentCommand,
} from '../../../../../../utils/prosemirror/commands/setTextIndent';
import { toggleList } from '../../../../../../utils/prosemirror/commands/toggleList';
import {
  addMark,
  autoSelectAll,
  findNodesWithSameMark,
  getFontsize,
  getTextAttrs,
  isActiveOfParentNodeType,
  markActive,
} from '../../../../../../utils/prosemirror/utils';
import styles from './index.less';

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
}) => {
  const mainStore = useMainStore();
  const handleElementId = useMainStore((store) => store.activeElementId);
  const textFormatPainter = useMainStore((store) => store.textFormatPainter);
  const richTextAttrs = useMainStore((store) => store.richTextAttrs);
  const editorViewRef = useRef<HTMLDivElement>(null);
  const [editorView, setEditorView] = useState<EditorView | null>(null);

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
    mainStore.setDisableHotkeysState(true);
    onFocus();
  };

  const handleBlur = () => {
    mainStore.setDisableHotkeysState(false);
    onBlur();
  };

  const handleClick = debounce(
    (editorView) => {
      if (editorView) {
        const attrs = getTextAttrs(editorView, {
          color: defaultColor,
          fontname: defaultFontName,
        });
        mainStore.setRichtextAttrs(attrs);
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
    if (!editorView) return;
    if (!target && handleElementId !== elementId) return;
    if (target && target !== elementId) return;

    const actions = Array.isArray(action) ? action : [action];

    for (const item of actions) {
      if (item.command === 'fontname' && item.value) {
        const mark = editorView.state.schema.marks.fontname.create({
          fontname: item.value,
        });
        autoSelectAll(editorView);
        addMark(editorView, mark);
      } else if (item.command === 'fontsize' && item.value) {
        const mark = editorView.state.schema.marks.fontsize.create({
          fontsize: item.value,
        });
        autoSelectAll(editorView);
        addMark(editorView, mark);
        setListStyle(editorView, { key: 'fontsize', value: item.value });
      } else if (item.command === 'fontsize-add') {
        const step = item.value ? +item.value : 2;
        autoSelectAll(editorView);
        const fontsize = getFontsize(editorView) + step + 'px';
        const mark = editorView.state.schema.marks.fontsize.create({
          fontsize,
        });
        addMark(editorView, mark);
        setListStyle(editorView, { key: 'fontsize', value: fontsize });
      } else if (item.command === 'fontsize-reduce') {
        const step = item.value ? +item.value : 2;
        autoSelectAll(editorView);
        let fontsize = getFontsize(editorView) - step;
        if (fontsize < 12) fontsize = 12;
        const mark = editorView.state.schema.marks.fontsize.create({
          fontsize: fontsize + 'px',
        });
        addMark(editorView, mark);
        setListStyle(editorView, { key: 'fontsize', value: fontsize + 'px' });
      } else if (item.command === 'color' && item.value) {
        const mark = editorView.state.schema.marks.forecolor.create({
          color: item.value,
        });
        autoSelectAll(editorView);
        addMark(editorView, mark);
        setListStyle(editorView, { key: 'color', value: item.value });
      } else if (item.command === 'backcolor' && item.value) {
        const mark = editorView.state.schema.marks.backcolor.create({
          backcolor: item.value,
        });
        autoSelectAll(editorView);
        addMark(editorView, mark);
      } else if (item.command === 'bold') {
        autoSelectAll(editorView);
        toggleMark(editorView.state.schema.marks.strong)(
          editorView.state,
          editorView.dispatch,
        );
      } else if (item.command === 'em') {
        autoSelectAll(editorView);
        toggleMark(editorView.state.schema.marks.em)(
          editorView.state,
          editorView.dispatch,
        );
      } else if (item.command === 'underline') {
        autoSelectAll(editorView);
        toggleMark(editorView.state.schema.marks.underline)(
          editorView.state,
          editorView.dispatch,
        );
      } else if (item.command === 'strikethrough') {
        autoSelectAll(editorView);
        toggleMark(editorView.state.schema.marks.strikethrough)(
          editorView.state,
          editorView.dispatch,
        );
      } else if (item.command === 'subscript') {
        toggleMark(editorView.state.schema.marks.subscript)(
          editorView.state,
          editorView.dispatch,
        );
      } else if (item.command === 'superscript') {
        toggleMark(editorView.state.schema.marks.superscript)(
          editorView.state,
          editorView.dispatch,
        );
      } else if (item.command === 'blockquote') {
        const isBlockquote = isActiveOfParentNodeType(
          'blockquote',
          editorView.state,
        );
        if (isBlockquote) lift(editorView.state, editorView.dispatch);
        else
          wrapIn(editorView.state.schema.nodes.blockquote)(
            editorView.state,
            editorView.dispatch,
          );
      } else if (item.command === 'code') {
        toggleMark(editorView.state.schema.marks.code)(
          editorView.state,
          editorView.dispatch,
        );
      } else if (item.command === 'align' && item.value) {
        alignmentCommand(editorView, item.value);
      } else if (item.command === 'indent' && item.value) {
        indentCommand(editorView, +item.value);
      } else if (item.command === 'textIndent' && item.value) {
        textIndentCommand(editorView, +item.value);
      } else if (item.command === 'bulletList') {
        const listStyleType = item.value || '';
        const { bullet_list: bulletList, list_item: listItem } =
          editorView.state.schema.nodes;
        const textStyle = {
          color: richTextAttrs.color,
          fontsize: richTextAttrs.fontsize,
        };
        toggleList(
          bulletList,
          listItem,
          listStyleType,
          textStyle,
        )(editorView.state, editorView.dispatch);
      } else if (item.command === 'orderedList') {
        const listStyleType = item.value || '';
        const { ordered_list: orderedList, list_item: listItem } =
          editorView.state.schema.nodes;
        const textStyle = {
          color: richTextAttrs.color,
          fontsize: richTextAttrs.fontsize,
        };
        toggleList(
          orderedList,
          listItem,
          listStyleType,
          textStyle,
        )(editorView.state, editorView.dispatch);
      } else if (item.command === 'clear') {
        autoSelectAll(editorView);
        const { $from, $to } = editorView.state.selection;
        editorView.dispatch(editorView.state.tr.removeMark($from.pos, $to.pos));
        setListStyle(editorView, [
          { key: 'fontsize', value: '' },
          { key: 'color', value: '' },
        ]);
      } else if (item.command === 'link') {
        const markType = editorView.state.schema.marks.link;
        const { from, to } = editorView.state.selection;
        const result = findNodesWithSameMark(
          editorView.state.doc,
          from,
          to,
          markType,
        );
        if (result) {
          if (item.value) {
            const mark = editorView.state.schema.marks.link.create({
              href: item.value,
              title: item.value,
            });
            addMark(editorView, mark, {
              from: result.from.pos,
              to: result.to.pos + 1,
            });
          } else {
            editorView.dispatch(
              editorView.state.tr.removeMark(
                result.from.pos,
                result.to.pos + 1,
                markType,
              ),
            );
          }
        } else if (markActive(editorView.state, markType)) {
          if (item.value) {
            const mark = editorView.state.schema.marks.link.create({
              href: item.value,
              title: item.value,
            });
            addMark(editorView, mark);
          } else {
            toggleMark(markType)(editorView.state, editorView.dispatch);
          }
        } else if (item.value) {
          autoSelectAll(editorView);
          toggleMark(markType, { href: item.value, title: item.value })(
            editorView.state,
            editorView.dispatch,
          );
        }
      } else if (item.command === 'insert' && item.value) {
        editorView.dispatch(editorView.state.tr.insertText(item.value));
      }
    }

    editorView.focus();
    handleKeydown(editorView);
  };

  // 鼠标抬起时，执行格式刷命令
  const handleMouseup = () => {
    if (!textFormatPainter) return;
    const { keep, ...newProps } = textFormatPainter;

    const actions: RichTextAction[] = [{ command: 'clear' }];
    for (const key of Object.keys(newProps) as TextFormatPainterKeys[]) {
      const command = key;
      const value = textFormatPainter[key];
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
    setEditorView(view);

    if (autoFocus) editorView?.focus();

    return () => {
      if (editorView) editorView.destroy();
      emitter.off(EmitterEvents.RICH_TEXT_COMMAND, execCommand);
      emitter.off(EmitterEvents.SYNC_RICH_TEXT_ATTRS_TO_STORE, handleClick);
    };
  }, []);

  useEffect(() => {
    emitter.on(EmitterEvents.RICH_TEXT_COMMAND, execCommand);
    emitter.on(EmitterEvents.SYNC_RICH_TEXT_ATTRS_TO_STORE, handleClick);
  }, [editorView]);

  useEffect(() => {
    if (!editorView) return;
    if (editorView.hasFocus()) return;

    const { doc, tr } = editorView.state;
    editorView.dispatch(
      tr.replaceRangeWith(0, doc.content.size, createDocument(value)),
    );
  }, [value]);

  useEffect(() => {
    if (editorView) {
      editorView.setProps({ editable: () => editable });
    }
  }, [editable]);

  return (
    <div
      style={style}
      className={clsx(
        `prosemirror-editor ${textFormatPainter ? 'format-painter' : ''}`,
        styles['text'],
      )}
      ref={editorViewRef}
      onMouseDown={onMouseDown}
    ></div>
  );
};

export default ProsemirrorEditor;
