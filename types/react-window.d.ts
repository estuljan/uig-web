declare module "react-window" {
  import type {
    Component,
    ComponentType,
    CSSProperties,
    MutableRefObject,
    Ref,
  } from "react";

  export type Align = "auto" | "smart" | "center" | "end" | "start";

  export interface ListOnItemsRenderedProps {
    overscanStartIndex: number;
    overscanStopIndex: number;
    visibleStartIndex: number;
    visibleStopIndex: number;
  }

  export interface ListOnScrollProps {
    scrollDirection: "forward" | "backward";
    scrollOffset: number;
    scrollUpdateWasRequested: boolean;
  }

  export interface ListChildComponentProps<ItemData = unknown> {
    data: ItemData;
    index: number;
    isScrolling?: boolean;
    isVisible?: boolean;
    style: CSSProperties;
  }

  export interface CommonListProps<ItemData = unknown> {
    children: ComponentType<ListChildComponentProps<ItemData>>;
    className?: string;
    height: number;
    innerElementType?:
      | keyof JSX.IntrinsicElements
      | ComponentType<Record<string, unknown>>;
    innerRef?: Ref<HTMLElement>;
    itemCount: number;
    itemData?: ItemData;
    itemKey?: (index: number, data: ItemData) => string | number;
    layout?: "horizontal" | "vertical";
    onItemsRendered?: (props: ListOnItemsRenderedProps) => void;
    onScroll?: (props: ListOnScrollProps) => void;
    outerElementType?:
      | keyof JSX.IntrinsicElements
      | ComponentType<Record<string, unknown>>;
    outerRef?: MutableRefObject<HTMLElement | null>;
    overscanCount?: number;
    style?: CSSProperties;
    useIsScrolling?: boolean;
    width: number | string;
  }

  export interface FixedSizeListProps<ItemData = unknown>
    extends CommonListProps<ItemData> {
    itemSize: number;
  }

  export class FixedSizeList<ItemData = unknown> extends Component<
    FixedSizeListProps<ItemData>
  > {
    scrollTo(scrollOffset: number): void;
    scrollToItem(index: number, align?: Align): void;
    resetAfterIndex(index: number, shouldForceUpdate?: boolean): void;
  }

  export type VariableSizeListProps<ItemData = unknown> = CommonListProps<ItemData> & {
    estimatedItemSize?: number;
    itemSize: (index: number) => number;
  };

  export class VariableSizeList<ItemData = unknown> extends Component<
    VariableSizeListProps<ItemData>
  > {
    scrollTo(scrollOffset: number): void;
    scrollToItem(index: number, align?: Align): void;
    resetAfterIndex(index: number, shouldForceUpdate?: boolean): void;
  }

  export interface FixedSizeGridProps<ItemData = unknown> {
    children: ComponentType<GridChildComponentProps<ItemData>>;
    columnCount: number;
    columnWidth: number;
    height: number;
    itemData?: ItemData;
    rowCount: number;
    rowHeight: number;
    width: number;
    className?: string;
    innerElementType?:
      | keyof JSX.IntrinsicElements
      | ComponentType<Record<string, unknown>>;
    innerRef?: Ref<HTMLElement>;
    outerElementType?:
      | keyof JSX.IntrinsicElements
      | ComponentType<Record<string, unknown>>;
    outerRef?: MutableRefObject<HTMLElement | null>;
    overscanColumnCount?: number;
    overscanRowCount?: number;
    style?: CSSProperties;
    useIsScrolling?: boolean;
    onItemsRendered?: (props: GridOnItemsRenderedProps) => void;
    onScroll?: (props: GridOnScrollProps) => void;
  }

  export interface VariableSizeGridProps<ItemData = unknown>
    extends Omit<FixedSizeGridProps<ItemData>, "columnWidth" | "rowHeight"> {
    columnWidth: (index: number) => number;
    rowHeight: (index: number) => number;
    estimatedColumnWidth?: number;
    estimatedRowHeight?: number;
  }

  export interface GridChildComponentProps<ItemData = unknown> {
    columnIndex: number;
    rowIndex: number;
    data: ItemData;
    isScrolling?: boolean;
    style: CSSProperties;
  }

  export interface GridOnScrollProps {
    horizontalScrollDirection: "forward" | "backward";
    scrollLeft: number;
    scrollTop: number;
    scrollUpdateWasRequested: boolean;
    verticalScrollDirection: "forward" | "backward";
  }

  export interface GridOnItemsRenderedProps {
    overscanColumnStartIndex: number;
    overscanColumnStopIndex: number;
    overscanRowStartIndex: number;
    overscanRowStopIndex: number;
    visibleColumnStartIndex: number;
    visibleColumnStopIndex: number;
    visibleRowStartIndex: number;
    visibleRowStopIndex: number;
  }

  export class FixedSizeGrid<ItemData = unknown> extends Component<
    FixedSizeGridProps<ItemData>
  > {
    scrollTo(scrollOffset: number): void;
    scrollToItem(params: {
      align?: Align;
      columnIndex?: number;
      rowIndex?: number;
    }): void;
    resetAfterColumnIndex(columnIndex: number, shouldForceUpdate?: boolean): void;
    resetAfterRowIndex(rowIndex: number, shouldForceUpdate?: boolean): void;
  }

  export class VariableSizeGrid<ItemData = unknown> extends Component<
    VariableSizeGridProps<ItemData>
  > {
    scrollTo(scrollOffset: number): void;
    scrollToItem(params: {
      align?: Align;
      columnIndex?: number;
      rowIndex?: number;
    }): void;
    resetAfterColumnIndex(columnIndex: number, shouldForceUpdate?: boolean): void;
    resetAfterRowIndex(rowIndex: number, shouldForceUpdate?: boolean): void;
  }
}
