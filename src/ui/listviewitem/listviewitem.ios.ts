import { IListViewItem, ListViewItemIOSProperties } from './listviewitem';
import { FlexLayoutEvents } from '../flexlayout/flexlayout-events';
import FlexLayoutIOS from '../flexlayout/flexlayout.ios';

export default class ListViewItemIOS<TEvent extends string = FlexLayoutEvents, TNative = ListViewItemIOSProperties>
  extends FlexLayoutIOS<TEvent | FlexLayoutEvents, TNative, IListViewItem>
  implements IListViewItem
{
  __nativeCell: __SF_UICollectionViewCell;
  nativeInner: any;
  constructor(params: IListViewItem) {
    super(params);

    this.addIOSProps({
      expandSwipe: (direction) => {
        this.__nativeCell.expandSwipeAnimated(direction, true);
      }
    });
  }

  get flexGrow() {
    return this.nativeObject.yoga.flexGrow;
  }

  set flexGrow(value) {
    // flexGrow property setter not allowed because,
    // it is cause wrong calculation and re-cycle issue on the list.
  }
}
