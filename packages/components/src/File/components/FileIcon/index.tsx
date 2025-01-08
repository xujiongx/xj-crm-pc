import '../../index.less';

const FileIcon = ({
  format,
  width,
  height,
}: {
  format: string;
  width: number;
  height: number;
}) => {
  return (
    <span
      className="aicc-file-icon"
      file-suffix={format?.toLocaleLowerCase()}
      style={{ width: width, height: height }}
    />
  );
};

export default FileIcon;
