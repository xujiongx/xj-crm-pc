export interface Option {
  idKey?: string;
  parentKey?: string;
  childrenKey?: string;
  fieldNames?: {
    [key: string]: string;
  };
}

const BaseOption = {
  idKey: 'id',
  parentKey: 'pid',
  childrenKey: 'children',
  fieldNames: {},
};

/**
 * 列表转为树
 * @param data
 * @param option
 * @returns
 */
export function makeTree(data: any[], option?: Option) {
  const { idKey, childrenKey, parentKey, fieldNames } = {
    ...BaseOption,
    ...option,
  };
  const list = data.map((prevNode) => {
    const node = { ...prevNode };
    Object.keys(fieldNames).forEach((key) => {
      node[fieldNames[key]] = node[key];
      delete node[key];
    });
    return node;
  });
  const nodesMap = new Map<number, any>(
    list.map((node) => {
      const idVal = node[fieldNames[idKey] || idKey];

      return [idVal, node];
    }),
  );
  const virtualRoot = {} as Partial<any>;
  list.forEach((node) => {
    const parent =
      nodesMap.get(node[fieldNames[parentKey] || parentKey]) ?? virtualRoot;
    node.level = (parent.level || 0) + 1;
    (parent[childrenKey] ??= []).push(node);
  });

  return virtualRoot[childrenKey] ?? [];
}

/** 树转成列表 */
export function treeToList<T = any>(
  treeNodes: Array<T>,
  childKey = 'children',
): T[] {
  const result: T[] = [];
  const stack = [...treeNodes];
  while (stack.length > 0) {
    const node = stack.pop()!;
    result.push(node);
    const children = node[childKey] as Array<any> | undefined;
    if (Array.isArray(children) && children.length > 0) {
      stack.push(...children.reverse());
    }
  }
  return result;
}

export function treeFindByKey<T = any>(
  treeData: Array<T>,
  targetKey: string | number,
  option: Option,
): T | undefined {
  const { idKey, childrenKey } = { ...BaseOption, ...option };
  for (const node of treeData) {
    if (node[idKey] === targetKey) {
      return node;
    }
    if (node[childrenKey] && Array.isArray(node[childrenKey])) {
      const foundInChildren = treeFindByKey(
        node[childrenKey],
        targetKey,
        option,
      );
      if (foundInChildren !== undefined) {
        return foundInChildren;
      }
    }
  }

  return undefined;
}
