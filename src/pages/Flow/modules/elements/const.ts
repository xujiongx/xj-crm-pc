import { Node } from '@antv/x6';

export type ElementType = Node.Metadata;

export const commonAttrs = {
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

export const list: ElementType[] = [
  {
    id: '1',
    shape: 'rect',
    label: 'rect',
    width: 80,
    height: 40,
    attrs: commonAttrs,
    ports: {
      groups: {
        top: {
          attrs: {
            circle: {
              r: 6,
              magnet: true,
              stroke: '#8f8f8f',
              strokeWidth: 1,
              fill: '#fff',
            },
            text: {
              fontSize: 12,
              fill: '#888',
            },
          },
          position: {
            name: 'absolute',
          },
        },
        bottom: {
          attrs: {
            circle: {
              r: 6,
              magnet: true,
              stroke: '#8f8f8f',
              strokeWidth: 1,
              fill: '#fff',
            },
            text: {
              fontSize: 12,
              fill: '#888',
            },
          },
          position: {
            name: 'absolute',
          },
        },
      },
      items: [
        {
          group: 'top',
          args: { x: 0, y: 0 },
          attrs: {
            text: { text: 1 },
          },
          label: {
            position: {
              name: 'left',
            },
          },
        },
        {
          group: 'top',
          args: { x: '100%', y: 0 },
          attrs: {
            text: { text: 2 },
          },
          label: {
            position: {
              name: 'right',
            },
          },
        },
        {
          group: 'bottom',
          args: { x: 0, y: '100%' },
          attrs: {
            text: { text: 3 },
          },
          label: {
            position: {
              name: 'left',
            },
          },
        },
        {
          group: 'bottom',
          args: { x: '100%', y: '100%' },
          attrs: {
            text: { text: 4 },
          },
          label: {
            position: {
              name: 'right',
            },
          },
        },
      ],
    },
  },
  {
    id: '2',
    shape: 'circle',
    label: 'circle',
    attrs: commonAttrs,
    width: 40,
    height: 40,
    ports: {
      groups: {
        top: {
          attrs: {
            circle: {
              r: 6,
              magnet: true,
              stroke: '#8f8f8f',
              strokeWidth: 1,
              fill: '#fff',
            },
            text: {
              fontSize: 12,
              fill: '#888',
            },
          },
          position: {
            name: 'ellipse',
            args: {
              start: 0,
              step: 90,
            },
          },
        },
        bottom: {
          attrs: {
            circle: {
              r: 6,
              magnet: true,
              stroke: '#8f8f8f',
              strokeWidth: 1,
              fill: '#fff',
            },
            text: {
              fontSize: 12,
              fill: '#888',
            },
          },
          position: {
            name: 'ellipse',
            args: {
              start: -180,
              step: -90,
            },
          },
        },
      },
      items: [
        {
          group: 'top',
          attrs: { text: { text: 1 } },
        },
        {
          group: 'top',
          attrs: { text: { text: 2 } },
          label: {
            position: {
              name: 'right',
            },
          },
        },
        {
          group: 'bottom',
          attrs: { text: { text: 3 } },
        },
        {
          group: 'bottom',
          attrs: { text: { text: 4 } },
          label: {
            position: {
              name: 'right',
            },
          },
        },
      ],
    },
  },
];
