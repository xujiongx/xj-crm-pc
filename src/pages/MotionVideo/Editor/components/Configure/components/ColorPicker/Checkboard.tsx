import React, { useMemo } from 'react';
import './Checkboard.less';

interface CheckboardProps {
  size?: number;
  white?: string;
  grey?: string;
}

const checkboardCache: { [key: string]: string | null } = {};

const renderCheckboard = (white: string, grey: string, size: number) => {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size * 2;
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  ctx.fillStyle = white;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = grey;
  ctx.fillRect(0, 0, size, size);
  ctx.translate(size, size);
  ctx.fillRect(0, 0, size, size);
  return canvas.toDataURL();
};

const getCheckboard = (white: string, grey: string, size: number) => {
  const key = `${white},${grey},${size}`;
  if (checkboardCache[key]) return checkboardCache[key];

  const checkboard = renderCheckboard(white, grey, size);
  checkboardCache[key] = checkboard;
  return checkboard;
};

const Checkboard: React.FC<CheckboardProps> = ({ size = 8, white = '#fff', grey = '#e6e6e6' }) => {
  const bgStyle = useMemo(() => {
    const checkboard = getCheckboard(white, grey, size);
    return { backgroundImage: `url(${checkboard})` };
  }, [white, grey, size]);

  return <div className="checkerboard" style={bgStyle}></div>;
};


export default Checkboard;
