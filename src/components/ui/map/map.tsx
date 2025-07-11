import * as React from 'react';

type MapProps<Item> = {
  items: Item[];
  renderItem: (item: Item, index: number) => React.JSX.Element;
};

export const Map = function <Item>({ items, renderItem }: MapProps<Item>): React.JSX.Element {
  return <React.Fragment>{items.map((item, index) => renderItem(item, index))}</React.Fragment>;
};
