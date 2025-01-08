import Lame from '@breezystack/lamejs';
import { convertBuffer } from './utils';

interface RecorderConfig {
  stream?: MediaStream;
  sampleBits?: number;
  sampleRate?: number;
  format?: 'wav' | 'mp3';
}

interface WavEncoderType extends EncoderType {
  size: number;
  inputSampleRate: number;
  inputSampleBits: number;
  outputSampleRate: number;
  outputSampleBits: number;
  reset: () => void;
  compress: () => Float32Array;
}

interface Mp3EncoderType extends EncoderType {
  buffer: Float32Array[];
  input: (data: Float32Array) => void;
  appendBuffer: (data: Uint8Array) => void;
  encode: () => Blob;
}

interface EncoderType {
  buffer: Float32Array[];
  input: (data: Float32Array) => void;
  encode: () => Blob;
  reset: () => void;
}

/** 录音 */
class Recorder {
  config: RecorderConfig = {
    sampleBits: 16,
    sampleRate: 16000,
    format: 'wav',
  };

  /** 是否录音中 */
  recording = false;
  recorder?: ScriptProcessorNode;
  context?: AudioContext;
  audioInput?: MediaStreamAudioSourceNode;
  encoder?: EncoderType;

  constructor(config: RecorderConfig) {
    this.config = {
      ...this.config,
      ...(config || {}),
    };
    this.init();
  }

  private init() {
    if (!this.config.stream) return;
    const AudioContext =
      window.AudioContext || (window as any).webkitAudioContext;
    this.context = new AudioContext({ sampleRate: this.config.sampleRate });
    if (this.config.format === 'mp3') {
      this.encoder = this.initMp3Encoder();
    } else {
      this.encoder = this.initWavEncoder();
    }
    const createScript = this.context.createScriptProcessor;
    this.audioInput = this.context.createMediaStreamSource(this.config.stream);
    this.recorder = createScript.apply(this.context, [4096, 1, 1]);
    this.recorder!.onaudioprocess = (e) => {
      if (this.recording) {
        this.encoder?.input(e.inputBuffer.getChannelData(0));
      }
    };
  }

  private initMp3Encoder() {
    const lameEncoder = new Lame.Mp3Encoder(1, this.context!.sampleRate, 128);
    const encoder: Mp3EncoderType = {
      buffer: [], //录音缓存
      input(arrayBuffer) {
        const maxSamples = 1152;
        const samplesMono = convertBuffer(arrayBuffer);
        var remaining = samplesMono.length;
        for (var i = 0; remaining >= 0; i += maxSamples) {
          var left = samplesMono.subarray(i, i + maxSamples);
          var mp3buf = lameEncoder.encodeBuffer(left);
          this.appendBuffer(mp3buf);
          remaining -= maxSamples;
        }
      },
      appendBuffer(mp3Buf: Uint8Array) {
        this.buffer.push(new Int8Array(mp3Buf));
      },
      reset() {
        this.buffer = [];
      },
      encode() {
        this.appendBuffer(lameEncoder.flush());
        return new Blob(this.buffer, { type: 'audio/mp3' });
      },
    };

    return encoder;
  }

  private initWavEncoder() {
    const encoder: WavEncoderType = {
      size: 0, //录音文件长度
      buffer: [], //录音缓存
      inputSampleRate: this.context!.sampleRate, //输入采样率
      inputSampleBits: 16, //输入采样数位 8, 16
      outputSampleRate: this.config.sampleRate!, //输出采样率
      outputSampleBits: this.config.sampleBits!, //输出采样数位 8, 16
      reset() {
        this.buffer = [];
        this.size = 0;
      },
      input(data: Float32Array) {
        this.buffer.push(new Float32Array(data));
        this.size += data.length;
      },
      compress() {
        //合并
        const data = new Float32Array(this.size);
        let offset = 0;
        for (let i = 0; i < this.buffer.length; i++) {
          data.set(this.buffer[i], offset);
          offset += this.buffer[i].length;
        }
        //压缩
        const compression = Math.floor(
          this.inputSampleRate / this.outputSampleRate,
        );
        const length = data.length / compression;
        const result = new Float32Array(length);
        let index = 0,
          j = 0;
        while (index < length) {
          result[index] = data[j];
          j += compression;
          index++;
        }
        return result;
      },
      encode() {
        const sampleRate = Math.min(
          this.inputSampleRate,
          this.outputSampleRate,
        );
        const sampleBits = Math.min(
          this.inputSampleBits,
          this.outputSampleBits,
        );
        const bytes = this.compress();
        const dataLength = bytes.length * (sampleBits / 8);
        const buffer = new ArrayBuffer(44 + dataLength);
        const data = new DataView(buffer);

        const channelCount = 1; //单声道
        let offset = 0;

        const writeString = function (str: string) {
          for (let i = 0; i < str.length; i++) {
            data.setUint8(offset + i, str.charCodeAt(i));
          }
        };

        // 资源交换文件标识符
        writeString('RIFF');
        offset += 4;
        // 下个地址开始到文件尾总字节数,即文件大小-8
        data.setUint32(offset, 36 + dataLength, true);
        offset += 4;
        // WAV文件标志
        writeString('WAVE');
        offset += 4;
        // 波形格式标志
        writeString('fmt ');
        offset += 4;
        // 过滤字节,一般为 0x10 = 16
        data.setUint32(offset, 16, true);
        offset += 4;
        // 格式类别 (PCM形式采样数据)
        data.setUint16(offset, 1, true);
        offset += 2;
        // 通道数
        data.setUint16(offset, channelCount, true);
        offset += 2;
        // 采样率,每秒样本数,表示每个通道的播放速度
        data.setUint32(offset, sampleRate, true);
        offset += 4;
        // 波形数据传输率 (每秒平均字节数) 单声道×每秒数据位数×每样本数据位/8
        data.setUint32(
          offset,
          channelCount * sampleRate * (sampleBits / 8),
          true,
        );
        offset += 4;
        // 快数据调整数 采样一次占用字节数 单声道×每样本的数据位数/8
        data.setUint16(offset, channelCount * (sampleBits / 8), true);
        offset += 2;
        // 每样本数据位数
        data.setUint16(offset, sampleBits, true);
        offset += 2;
        // 数据标识符
        writeString('data');
        offset += 4;
        // 采样数据总数,即数据总大小-44
        data.setUint32(offset, dataLength, true);
        offset += 4;
        // 写入采样数据
        if (sampleBits === 8) {
          for (var i = 0; i < bytes.length; i++, offset++) {
            var s = Math.max(-1, Math.min(1, bytes[i]));
            var val = s < 0 ? s * 0x8000 : s * 0x7fff;
            val = Math.floor(255 / (65535 / (val + 32768)));
            data.setInt8(offset, val);
          }
        } else {
          for (var i = 0; i < bytes.length; i++, offset += 2) {
            var s = Math.max(-1, Math.min(1, bytes[i]));
            data.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
          }
        }
        return new Blob([data], { type: 'audio/wav' });
      },
    };
    return encoder;
  }

  /** 开始录音 */
  start() {
    if (!this.context) return;
    this.recording = true;
    this.audioInput?.connect(this.recorder!);
    this.recorder?.connect(this.context?.destination);
  }

  /** 停止录音 */
  stop() {
    this.recording = false;
  }

  /** 重制录音 */
  clear() {
    this.encoder?.reset();
  }

  /** 获取录音 Blob */
  getBlob() {
    this.stop();
    return this.encoder!.encode();
  }

  /** 获取录音 Base64 */
  getBase64() {
    this.stop();
    return new Promise<string>((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      fileReader.readAsDataURL(this.encoder!.encode());
      fileReader.onerror = () => {
        reject(new Error('blobToBase64 error'));
      };
    });
  }
}

export default Recorder;
