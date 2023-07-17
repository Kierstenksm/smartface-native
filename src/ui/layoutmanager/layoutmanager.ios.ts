import { AbstractLayoutManager, ILayoutManager, ScrollDirection } from './layoutmanager';
import Invocation from '../../util/iOS/invocation';
import { isNotEmpty } from '../../util/type';

const DEFAULT_ITEM_LENGTH = 50;

// On iOS, those values are in reverse
const NativeScrollDirection = {
  VERTICAL: 0,
  HORIZONTAL: 1
};

export const ScrollDirectionMapping = {
  [ScrollDirection.VERTICAL]: NativeScrollDirection.VERTICAL,
  [ScrollDirection.HORIZONTAL]: NativeScrollDirection.HORIZONTAL
};

export default class LayoutManagerIOS extends AbstractLayoutManager<__SF_UICollectionViewFlowLayout> implements ILayoutManager {
  private _spanCount: ILayoutManager['spanCount'];
  private _lineSpacing: ILayoutManager['lineSpacing'];
  private _itemSpacing: ILayoutManager['itemSpacing'];
  private _scrollDirection: ILayoutManager['scrollDirection'];
  private _contentInset: ILayoutManager['contentInset'];
  private _onItemLength: ILayoutManager['onItemLength'];
  private _onFullSpanCallback: ILayoutManager['onFullSpan'];
  collectionView: __SF_UICollectionView | null;
  onItemType: (index: number) => number;
  private _sectionInset: ILayoutManager['contentInset'];
  private _itemLength: number;
  constructor(params: Partial<ILayoutManager> = {}) {
    super(params);
  }
  protected preConstruct(params?: Partial<Record<string, any>>): void {
    this.lineSpacing = 0;
    this.itemSpacing = 0;
    this._itemLength = DEFAULT_ITEM_LENGTH;
    this._sectionInset = { bottom: 0, left: 0, right: 0, top: 0 };
    this._contentInset = { bottom: 0, left: 0, right: 0, top: 0 };
    this._onItemLength = () => DEFAULT_ITEM_LENGTH;
    this.scrollDirection = ScrollDirection.VERTICAL;
    this.collectionView = null;
    super.preConstruct(params);
  }
  protected createNativeObject() {
    const nativeObject = new __SF_UICollectionViewFlowLayout();

    nativeObject.prepareLayoutCallback = () => {
      const retval = this.calculateItemSize(this.spanCount);
      if (this.onFullSpan && this.collectionView) {
        const __fullSpanSize = this.calculateItemSize(1);
        this.collectionView.sizeForItemAtIndexPath = (collectionView: LayoutManagerIOS['collectionView'], indexPath: __SF_NSIndexPath) => {
          const span = Number(this.onItemType?.(indexPath.row));
          const itemLength = this.onFullSpan?.(span);
          if (itemLength === undefined) {
            return retval;
          }

          return {
            width: this.scrollDirection === NativeScrollDirection.VERTICAL ? __fullSpanSize.width : itemLength,
            height: this.scrollDirection === NativeScrollDirection.VERTICAL ? itemLength : __fullSpanSize.height
          };
        };
      } else if (this.collectionView) {
        this.collectionView.sizeForItemAtIndexPath = undefined;
        const argumentSize = new Invocation.Argument({
          type: 'CGSize',
          value: retval
        });
        Invocation.invokeInstanceMethod(this.nativeObject, 'setItemSize:', [argumentSize]);
      }
    };
    return nativeObject;
  }
  get spanCount(): ILayoutManager['spanCount'] {
    return this._spanCount;
  }
  set spanCount(value: ILayoutManager['spanCount']) {
    this._spanCount = value;
  }
  get lineSpacing(): ILayoutManager['lineSpacing'] {
    return this._lineSpacing;
  }
  set lineSpacing(value: ILayoutManager['lineSpacing']) {
    this._lineSpacing = value;
    this.nativeObject.minimumLineSpacing = value;
  }
  get itemSpacing(): ILayoutManager['itemSpacing'] {
    return this._itemSpacing;
  }
  set itemSpacing(value: ILayoutManager['itemSpacing']) {
    this._itemSpacing = value;
    this.nativeObject.minimumInteritemSpacing = value;
  }
  get contentInset(): ILayoutManager['contentInset'] {
    return this._contentInset;
  }
  set contentInset(value: ILayoutManager['contentInset']) {
    this._contentInset = value;
    if (this.collectionView) {
      this.collectionView.contentInsetDictionary = value;
    }
  }
  get scrollDirection(): ILayoutManager['scrollDirection'] {
    return this._scrollDirection;
  }
  set scrollDirection(value: ILayoutManager['scrollDirection']) {
    this._scrollDirection = ScrollDirectionMapping[value];
    this.nativeObject.scrollDirection = this._scrollDirection;
  }
  get onItemLength(): ILayoutManager['onItemLength'] {
    return this._onItemLength;
  }
  set onItemLength(value: ILayoutManager['onItemLength']) {
    this._onItemLength = value;
  }
  get onFullSpan(): ILayoutManager['onFullSpan'] {
    return this._onFullSpanCallback;
  }
  set onFullSpan(value: ILayoutManager['onFullSpan']) {
    this._onFullSpanCallback = value;
  }
  private get itemLength(): number {
    return this._itemLength;
  }
  private set itemLength(value: number) {
    this._itemLength = value;
  }
  private get sectionInset(): ILayoutManager['contentInset'] {
    return this._sectionInset;
  }
  private set sectionInset(value: ILayoutManager['contentInset']) {
    this._sectionInset = value;

    const argSectionInset = new Invocation.Argument({
      type: 'UIEdgeInsets',
      value: value
    });
    Invocation.invokeInstanceMethod(this.nativeObject, 'setSectionInset:', [argSectionInset]);
  }

  private calculateItemSize(spanCount: ILayoutManager['spanCount']) {
    const retval = {
      width: 0,
      height: 0
    };
    let insetSize = 0;
    if (this.scrollDirection === NativeScrollDirection.VERTICAL) {
      if (isNotEmpty(this.collectionView) && isNotEmpty(this.collectionView.frame.width) && isNotEmpty(this.onItemLength)) {
        const calculatedSizes = this.calculateSize(this.collectionView.frame.width, spanCount);
        retval.width = calculatedSizes.cellSize;
        retval.height = this.onItemLength(retval.width);
        // Include contentInset values to calculation
        // ContentInset refers to margin based on left, right
        calculatedSizes.insetSize -= this._contentInset.left ?? 0
        calculatedSizes.insetSize -= this._contentInset.right ?? 0
        insetSize = calculatedSizes.insetSize / 2;
        this.sectionInset = {
          top: 0,
          left: insetSize,
          bottom: 0,
          right: insetSize
        };
      }
    } else if (this.scrollDirection === NativeScrollDirection.HORIZONTAL) {
      if (isNotEmpty(this.collectionView) && isNotEmpty(this.collectionView.frame.height) && isNotEmpty(this.onItemLength)) {
        const calculatedSizes = this.calculateSize(this.collectionView.frame.height, spanCount);
        retval.height = calculatedSizes.cellSize;
        retval.width = this.onItemLength(retval.height);
        // Include contentInset values to calculation
        // ContentInset refers to margin based on top,bottom
        calculatedSizes.insetSize -= this._contentInset.top ?? 0
        calculatedSizes.insetSize -= this._contentInset.bottom ?? 0
        insetSize = calculatedSizes.insetSize / 2;
        this.sectionInset = {
          top: insetSize,
          left: 0,
          bottom: insetSize,
          right: 0
        };
      }
    }
    return retval;
  }
  private calculateSize(collectionViewSize: number, spanCount: ILayoutManager['spanCount']) {
    let cellSize = this.roundDown(collectionViewSize / spanCount, 1);
    const splitSize = (cellSize + '').split('.');
    let insetSize = 0;
    if (splitSize[1] !== undefined) {
      const precision = parseFloat(splitSize[1]);
      const scale = __SF_UIScreen.mainScreen().scale;
      const decimal = Math.floor(precision / Math.floor((1 / scale) * 10)) * (1 / scale);
      const fixedSize = parseFloat(splitSize[0]) + decimal;
      insetSize = this.roundDown(collectionViewSize - fixedSize * spanCount, 2);
      cellSize = parseFloat(fixedSize as unknown as string); //TODO: Left intentionally to not break any functionaliy
    }
    return {
      cellSize: cellSize,
      insetSize: insetSize
    };
  }
  private roundDown(number: number, decimals: number) {
    decimals = decimals || 0;
    return Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

  private sizeForItemAtIndexPath(collectionView: LayoutManagerIOS['collectionView'], collectionViewLayout: any, indexPath: __SF_NSIndexPath) {
    const retval = {
      width: 0,
      height: 0
    };

    if (this.scrollDirection === NativeScrollDirection.VERTICAL) {
      const columnCount = this.spanCount;
      const itemWidth = columnCount ? (collectionView?.frame.width || 0) / columnCount : 0;
      const itemHeight = this.onItemLength?.(0) || 0;
      retval.width = itemWidth;
      retval.height = itemHeight;
    } else if (this.scrollDirection === NativeScrollDirection.HORIZONTAL) {
      const rowCount = this.spanCount;
      const itemHeight = rowCount ? (collectionView?.frame.height || 0) / rowCount : 0;
      const itemWidth = this.onItemLength?.(0) || 0;
      retval.width = itemWidth;
      retval.height = itemHeight;
    }
    return retval;
  }

  static ScrollDirection = ScrollDirection;
}
