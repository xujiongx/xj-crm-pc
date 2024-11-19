import { uid } from '@aicc/shared/es';
import { Button } from 'antd';
import useStore from '../../store';

const commonAttrs = {
  body: {
    fill: '#fff',
    stroke: '#8f8f8f',
    strokeWidth: 1,
  },
  label: {
    refX: 0.5,
    refY: '100%',
    refY2: 4,
    textAnchor: 'middle',
    textVerticalAnchor: 'top',
  },
};

const Operate = (props: any) => {
  const { graph, state } = props;

  const exportGraph = () => {
    const json = graph.toJSON();
    console.log('json:', json);
    localStorage.setItem('graph', JSON.stringify(json));
  };

  const addDemo = () => {
    graph.addNode({
      shape: 'demo',
      x: 0,
      y: 0,
      label: '请输入',
      ports: {
        items: [
          {
            id: uid(),
            group: 'top',
          },
          {
            id: uid(),
            group: 'top',
          },
          {
            id: uid(),
            group: 'bottom',
          },
          {
            id: uid(),
            group: 'bottom',
          },
        ],
      },
    });
  };

  const addRect = () => {
    graph.addNode({
      shape: 'rect',
      x: 40,
      y: 40,
      width: 80,
      height: 40,
      label: 'rect',
      attrs: commonAttrs,
    });
  };
  const addCircle = () => {
    graph.addNode({
      shape: 'circle',
      x: 180,
      y: 40,
      width: 40,
      height: 40,
      label: 'circle',
      attrs: commonAttrs,
    });
  };
  const addEllipse = () => {
    graph.addNode({
      shape: 'ellipse',
      x: 280,
      y: 40,
      width: 80,
      height: 40,
      label: 'ellipse',
      attrs: commonAttrs,
    });
  };
  const addPath = () => {
    graph.addNode({
      shape: 'path',
      x: 420,
      y: 40,
      width: 40,
      height: 40,
      // https://www.svgrepo.com/svg/13653/like
      path: 'M24.85,10.126c2.018-4.783,6.628-8.125,11.99-8.125c7.223,0,12.425,6.179,13.079,13.543c0,0,0.353,1.828-0.424,5.119c-1.058,4.482-3.545,8.464-6.898,11.503L24.85,48L7.402,32.165c-3.353-3.038-5.84-7.021-6.898-11.503c-0.777-3.291-0.424-5.119-0.424-5.119C0.734,8.179,5.936,2,13.159,2C18.522,2,22.832,5.343,24.85,10.126z',
      attrs: commonAttrs,
      label: 'path',
    });
  };
  const addPolygon = () => {
    graph.addNode({
      shape: 'polygon',
      x: 60,
      y: 150,
      width: 40,
      height: 40,
      points: '100,10 40,198 190,78 10,78 160,198',
      attrs: commonAttrs,
      label: 'polygon',
    });
  };
  const addPolygon2 = () => {
    graph.addNode({
      shape: 'polyline',
      x: 180,
      y: 150,
      width: 40,
      height: 40,
      label: 'polyline',
      attrs: {
        body: {
          ...commonAttrs.body,
          refPoints: '0,0 0,10 10,10 10,0',
        },
        label: commonAttrs.label,
      },
    });
  };
  const addImage = () => {
    graph.addNode({
      shape: 'image',
      x: 290,
      y: 150,
      width: 60,
      height: 40,
      imageUrl:
        'https://gw.alipayobjects.com/os/s/prod/antv/assets/image/logo-with-text-73b8a.svg',
      label: 'image',
      attrs: commonAttrs,
    });
  };

  return (
    <>
      <Button
        onClick={() => {
          useStore.getState().deleteNode();
        }}
      >
        删除
      </Button>
      <Button onClick={() => graph.centerContent()}>centerContent</Button>
      <Button onClick={() => graph.undo()} disabled={!state.canUndo}>
        撤销
      </Button>
      <Button onClick={() => graph.redo()} disabled={!state.canRedo}>
        重做
      </Button>
      <Button onClick={() => exportGraph()}>保存</Button>
      <Button onClick={() => addDemo()}>新增Demo</Button>
      <Button onClick={() => addRect()}>addRect</Button>
      <Button onClick={() => addCircle()}>addCircle</Button>
      <Button onClick={() => addEllipse()}>addEllipse</Button>
      <Button onClick={() => addPath()}>addPath</Button>
      <Button onClick={() => addPolygon()}>addPolygon</Button>
      <Button onClick={() => addPolygon2()}>addPolygon2</Button>
      <Button onClick={() => addImage()}>addImage</Button>
      <Button onClick={() => addRect()}>addRect</Button>
    </>
  );
};

export default Operate;
