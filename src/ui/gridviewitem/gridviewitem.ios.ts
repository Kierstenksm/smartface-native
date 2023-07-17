import { IGridViewItem } from './gridviewitem';
import { FlexLayoutEvents } from '../flexlayout/flexlayout-events';
import FlexLayoutIOS from '../flexlayout/flexlayout.ios';

export default class GridViewItemIOS<TEvent extends string = FlexLayoutEvents, TNative = {}> extends FlexLayoutIOS<TEvent | FlexLayoutEvents, TNative, IGridViewItem> implements IGridViewItem {
  nativeInner: any;
  viewType: number;
  private __nativeCell: __SF_UICollectionViewCell;
  constructor(params: Partial<IGridViewItem> = {}) {
    super(params);
  }

  get flexGrow() {
    return this.nativeObject.yoga.flexGrow;
  }

  set flexGrow(value) {
    // flexGrow property setter not allowed because,
    // it is cause wrong calculation and re-cycle issue on the list.
  }
}
