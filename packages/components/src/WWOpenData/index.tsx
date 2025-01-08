// @ts-nocheck
import { useRef, useLayoutEffect } from 'react';

type WWOpenDataProps = {
  workWx?: boolean;
  authenticated?: boolean;
  type?: 'userName' | 'departmentName';
  openid?: string;
  onError?: (err: any) => void;
};

export default function WWOpenData({
  workWx,
  authenticated = true,
  type = 'userName',
  openid,
  onError = () => {},
}: WWOpenDataProps) {
  const ref = useRef(null);

  const isWordWx = type === 'userName' ? openid?.indexOf('wo') === 0 : workWx;

  useLayoutEffect(() => {
    if (authenticated && isWordWx && window.WWOpenData) {
      window.WWOpenData.bind(ref.current);
      window.WWOpenData.on('error', onError);
    }
  }, [authenticated, isWordWx]);

  return isWordWx && authenticated ? (
    <ww-open-data ref={ref} type={type} openid={openid} />
  ) : (
    <>{openid}</>
  );
}
