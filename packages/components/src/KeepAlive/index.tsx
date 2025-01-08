import { KeepAlive as AKeepAlive } from 'react-activation';

const KeepAlive = ({
  name,
  children,
}: {
  name?: string;
  children: React.ReactNode;
}) => <AKeepAlive name={name || location.pathname}>{children}</AKeepAlive>;

export default KeepAlive;
