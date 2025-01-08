import { ViewerProps } from '.';

type ImageViewerProps = ViewerProps & {};

const ImageViewer = ({ src, name, onEnded, onLoaded }: ImageViewerProps) => {
  return (
    <img
      src={src}
      alt={name}
      onLoad={() => {
        onLoaded?.();
        onEnded?.();
      }}
    />
  );
};

export default ImageViewer;
