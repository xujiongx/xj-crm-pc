export function convertBuffer(arrayBuffer: Float32Array) {
  const data = new Float32Array(arrayBuffer);
  const out = new Int16Array(arrayBuffer.length);
  for (let i = 0; i < data.length; i++) {
    const s = Math.max(-1, Math.min(1, data[i]));
    out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return out;
}
