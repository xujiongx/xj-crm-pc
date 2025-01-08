import { DataDictionaryItemType, ChannelItem } from '@aicc/types';
import AsrModelConfig from './components/AsrModel';
import RecordTable from './components/Tape';
import UploadTape from './components/Upload';
import UploadFileName from './components/Upload/fileName';
import Record from './components/Tape/recorder';

const prefix = 'aicc-asr';

const formatChannel = (data?: DataDictionaryItemType[]) => {
  try {
    return data?.map(
      ({ itemValue }) => JSON.parse(itemValue || '{}') as ChannelItem,
    );
  } catch (error) {
    console.log(error, '解析渠道失败');
  }
};

export {
  prefix,
  formatChannel,
  AsrModelConfig,
  RecordTable,
  UploadTape,
  Record,
  UploadFileName,
};
