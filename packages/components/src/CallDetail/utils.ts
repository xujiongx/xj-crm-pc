import type {
  ApiContentItem,
  ApiResult,
  MessageItem,
  SessionItem,
} from './interface';

/** 处理呼入明细数据格式 */
export function formatResult(data: ApiResult): SessionItem {
  const {
    common_user_name,
    telephone,
    searchAfter,
    nextFsSessionId,
    fsSessionId,
    audioPath,
    content,
    raw_var_list_map,
  } = data;

  const enableBreak = raw_var_list_map?.GlobalConfigHandleBreak === 'y';

  const message = (JSON.parse(content || '') as ApiContentItem[])?.reduce(
    (result, current, index) => {
      const { query, answer, rawVarListMap, req_id } = current;
      const isBegin = query?.includes('first');

      const {
        detail_audio_slice_start_time_index_second: startTime,
        detail_audio_slice_end_time_index_second: endTime,
        detail_break_tts,
        detail_play_last,
        detail_problem_status,
        detail_resp_node_id,
        detail_resp_node_name,
        detail_cond_type,
        detail_cond_name,
        detail_cond_id,
        detail_robot,
      } = rawVarListMap || {};

      const robot: MessageItem = {
        content: answer || '',
        role: 'robot',
        id: `query-${index}`,
        nodeId: detail_resp_node_id,
        nodeTitle: detail_resp_node_name,
      };

      const { matchModel, matchDetail, ...matchInfo } = JSON.parse(
        detail_robot || '{}',
      );
      const { regex, corpus } =
        (
          matchDetail as Array<
            Record<'type' | 'value' | 'name', string> & { score: number }
          >
        )?.reduce<Record<'corpus' | 'regex', MessageItem['regex']>>(
          (result, current) => {
            const item = {
              text: current?.value,
              title: current.name,
              score: Math.floor((current.score || 0) * 100) / 100,
            };
            if (current.type === '正则') {
              result.regex?.push(item);
            } else {
              result.corpus?.push(item);
            }
            return result;
          },
          {
            regex: [],
            corpus: [],
          },
        ) || {};

      const isKnowledge = detail_cond_type?.includes('知识库');

      const user: MessageItem = {
        knowledgeId: isKnowledge ? detail_cond_id : undefined,
        nodeId: isKnowledge ? undefined : detail_cond_id,
        nodeTitle: detail_cond_name,
        content: query === '_end_' ? '通话已结束' : query || '',
        question: answer,
        role: 'user',
        id: `${req_id}`,
        tags: current?.tags || [],
        interrupt: enableBreak
          ? query !== '_end_' && detail_break_tts === '1'
            ? detail_play_last === 'true'
            : undefined
          : undefined,
        noMatch: detail_problem_status === '-1',
        slots: startTime ? [Number(startTime), Number(endTime)] : undefined,
        regex,
        corpus,
        matchDetail: {
          matchModel,
          ...matchInfo,
        },
      };
      if (!isBegin) result.push(user);
      if (robot?.content) result.push(robot);
      return result;
    },
    [] as MessageItem[],
  );

  return {
    id: fsSessionId,
    src: audioPath,
    userName: common_user_name,
    phone: telephone,
    messages: message,
    next: nextFsSessionId
      ? {
          searchAfter: searchAfter!,
          id: nextFsSessionId!,
        }
      : undefined,
  };
}
