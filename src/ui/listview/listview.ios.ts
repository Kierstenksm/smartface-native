import { IListView, RowAnimation } from './listview';
import { Point2D } from '../../primitive/point2d';
import Color from '../color';
import ListViewItem from '../listviewitem';
import SwipeItem, { SwipeDirection, ISwipeItem } from '../swipeitem';
import ViewIOS from '../view/view.ios';
import { ListViewEvents } from './listview-events';

import ListViewItemIOS from '../listviewitem/listviewitem.ios';
import Invocation from '../../util/iOS/invocation';
import UIControlEvents from '../../util/iOS/uicontrolevents';
import { ViewEvents } from '../view/view-events';
import { EventListenerCallback } from '../../core/eventemitter';

export default class ListViewIOS<TEvent extends string = ListViewEvents> extends ViewIOS<TEvent | ListViewEvents, __SF_UITableView, IListView> implements IListView {
  protected createNativeObject() {
    const nativeObject = new __SF_UITableView();
    this.refreshControl = new __SF_UIRefreshControl();
    nativeObject.addSubview(this.refreshControl);
    nativeObject.separatorStyle = 0;
    nativeObject.showsVerticalScrollIndicator = false;
    nativeObject.setValueForKey(2, 'contentInsetAdjustmentBehavior');
    return nativeObject;
  }
  preConstruct(params?: IListView) {
    this._contentInset = { top: 0, bottom: 0 };
    this._listItemArray = [];
    this.addIOSProps(this.getIOSParams());
    this.addAndroidProps(this.getAndroidParams());
    this.setNativeObjectParams();
    this.onRowHeight = () => 0;
    super.preConstruct(params);
  }
  nativeInner: INativeInner;
  private refreshControl: __SF_UIRefreshControl;
  private _refreshEnabled: IListView['refreshEnabled'];
  private _onPullRefresh: IListView['onPullRefresh'];
  private _listItemArray: ListViewItemIOS[];
  private _onScroll: IListView['onScroll'];
  private _contentInset: IListView['contentInset'];
  constructor(params?: IListView) {
    super(params);
  }
  getFirstVisibleIndex(): number {
    const visibleIndexArray = this.nativeObject.getVisibleIndexArray();
    return visibleIndexArray[0];
  }
  getLastVisibleIndex(): number {
    const visibleIndexArray = this.nativeObject.getVisibleIndexArray();
    return visibleIndexArray[visibleIndexArray.length - 1];
  }
  setPullRefreshColors(value: Color[] | Color): void {
    if (Array.isArray(value)) {
      this.refreshControl.tintColor = value[0].nativeObject;
    } else {
      this.refreshControl.tintColor = value.nativeObject;
    }
  }
  refreshData(): void {
    this.nativeObject.reloadData();
  }
  deleteRowRange(params: { positionStart: number; itemCount: number; ios: Partial<{ animation: RowAnimation }> }): void {
    const animation = params?.ios?.animation || ListViewIOS.iOS.RowAnimation.AUTOMATIC;
    this.nativeObject.actionRowRange(1, params.positionStart, params.itemCount, animation);
  }
  insertRowRange(params: { positionStart: number; itemCount: number; ios: Partial<{ animation: RowAnimation }> }): void {
    const animation = params?.ios?.animation || ListViewIOS.iOS.RowAnimation.AUTOMATIC;
    this.nativeObject.actionRowRange(0, params.positionStart, params.itemCount, animation);
  }
  refreshRowRange(params: { positionStart: number; itemCount: number; ios?: { animation: RowAnimation } }): void {
    const animation = params?.ios?.animation || ListViewIOS.iOS.RowAnimation.AUTOMATIC;
    this.nativeObject.actionRowRange(2, params.positionStart, params.itemCount, animation);
  }
  scrollTo(index: number, animated?: boolean): void {
    const indexPath = __SF_NSIndexPath.indexPathForRowInSection(index, 0);
    this.nativeObject.scrollToRowAtIndexPathAtScrollPositionAnimated(indexPath, 1, !animated);
  }
  stopRefresh(): void {
    this.refreshControl.endRefreshing();
  }
  startRefresh(): void {
    throw new Error('Method not implemented.');
  }
  listViewItemByIndex(index: number): ListViewItem | undefined {
    const uuid = this.nativeObject.getUUIDByIndex(index);
    return uuid ? this._listItemArray[uuid] : undefined;
  }
  indexByListViewItem(item: ListViewItemIOS): number {
    return this.nativeObject.indexPathForCell(item.__nativeCell).row;
  }

  get onScroll(): IListView['onScroll'] {
    return this._onScroll;
  }

  set onScroll(value: IListView['onScroll']) {
    this._onScroll = value;
    this.nativeObject.didScroll = (e) => {
      this.emit('scroll', e);
      this.onScroll?.(e);
    };
  }
  get onPullRefresh() {
    return this._onPullRefresh;
  }
  set onPullRefresh(value) {
    this._onPullRefresh = value;
    this.refreshControl.addJSTarget(value.bind(this), UIControlEvents.valueChanged);
  }
  onRowType: (index?: number) => number;
  onRowCreate: (type?: number) => ListViewItemIOS;
  onRowHeight: (index?: number) => number;
  onRowBind: (item: ListViewItem, index: number) => void;
  onRowSelected: (item: ListViewItem, index: number) => void;
  onRowMoved: (source: number, destination: number) => void;
  onRowSwipe: (e: { index: number; direction: SwipeDirection; ios: Partial<{ expansionSettings: Partial<{ buttonIndex: number; fillOnTrigger: boolean; threshold: number }> }> }) => ISwipeItem[];
  onRowMove: (source: number, destination: number) => boolean;
  onRowCanMove: (index: number) => boolean;
  onRowCanSwipe: (index: number) => [SwipeDirection];

  private __onRowSwipeWrapper(object: Parameters<IListView['onRowSwipe']>['0']) {
    const items = this.onRowSwipe?.(object);

    const nativeItems: __SF_MGSwipeButton[] = [];
    items.forEach((swipeItem) => {
      const text = swipeItem.text;
      const backgroundColor = swipeItem.backgroundColor;
      const onPress = swipeItem.onPress;
      const padding = swipeItem.ios.padding || 0;
      const isAutoHide = !!swipeItem.ios.isAutoHide;
      const icon = swipeItem.icon;
      let nativeSwipeItem;
      if (icon) {
        nativeSwipeItem = __SF_MGSwipeButton.createMGSwipeButtonWithIconWithTitleIconColorPaddingJsActionIsAutoHide(
          text,
          icon.nativeObject,
          backgroundColor.nativeObject,
          padding,
          onPress,
          isAutoHide
        );
      } else {
        nativeSwipeItem = __SF_MGSwipeButton.createMGSwipeButtonWithTitleColorPaddingJsActionIsAutoHide(text, backgroundColor.nativeObject, padding, onPress, isAutoHide);
      }

      nativeSwipeItem.setTitleColor(swipeItem.textColor.nativeObject, 0);
      nativeSwipeItem.titleLabel.font = swipeItem.font;

      if (icon && text) {
        nativeSwipeItem.centerIconOverTextWithSpacing(swipeItem.ios.iconTextSpacing);
      }
      nativeItems.push(nativeSwipeItem);
    });
    return nativeItems;
  }
  private getIOSParams() {
    const self = this;
    return {
      get decelerationRate(): number {
        return self.nativeObject.decelerationRate;
      },
      set decelerationRate(value: number) {
        self.nativeObject.decelerationRate = value;
      },
      get bounces(): boolean {
        return self.nativeObject.valueForKey('bounces');
      },
      set bounces(value: boolean) {
        self.nativeObject.setValueForKey(value, 'bounces');
      },
      get leftToRightSwipeEnabled(): IListView['ios']['leftToRightSwipeEnabled'] {
        return self.nativeObject.leftToRightSwipeEnabled;
      },
      set leftToRightSwipeEnabled(value: IListView['ios']['leftToRightSwipeEnabled']) {
        self.nativeObject.leftToRightSwipeEnabled = !!value;
      },
      get rightToLeftSwipeEnabled(): IListView['ios']['rightToLeftSwipeEnabled'] {
        return self.nativeObject.rightToLeftSwipeEnabled;
      },
      set rightToLeftSwipeEnabled(value: IListView['ios']['rightToLeftSwipeEnabled']) {
        self.nativeObject.rightToLeftSwipeEnabled = !!value;
      },
      performBatchUpdates(updates: any, completion: { e: { finished: boolean } }) {
        self.nativeObject.js_performBatchUpdates(updates, completion);
      }
    };
  }
  private getAndroidParams() {
    return {
      saveInstanceState: () => {},
      restoreInstanceState: () => {},
      startDrag: () => {}
    };
  }
  private setScrollEvents() {
    this.nativeObject.onScrollBeginDecelerating = (scrollView: __SF_UIScrollView) => {
      const contentOffset = {
        x: scrollView.contentOffset.x + scrollView.contentInsetDictionary.left,
        y: scrollView.contentOffset.y + scrollView.contentInsetDictionary.top
      };
      this.emit('scrollBeginDecelerating', contentOffset);
      this.ios.onScrollBeginDragging?.(contentOffset);
    };
    this.nativeObject.onScrollViewWillBeginDragging = (scrollView: __SF_UIScrollView) => {
      const contentOffset = {
        x: scrollView.contentOffset.x + scrollView.contentInsetDictionary.left,
        y: scrollView.contentOffset.y + scrollView.contentInsetDictionary.top
      };
      this.ios.onScrollBeginDragging?.(contentOffset);
      this.emit('scrollBeginDragging', contentOffset);
    };
    this.nativeObject.onScrollEndDecelerating = (scrollView: __SF_UIScrollView) => {
      const contentOffset = {
        x: scrollView.contentOffset.x + scrollView.contentInsetDictionary.left,
        y: scrollView.contentOffset.y + scrollView.contentInsetDictionary.top
      };
      this.emit('scrollEndDecelerating', contentOffset);
      this.ios.onScrollBeginDragging?.(contentOffset);
    };
    this.nativeObject.onScrollViewDidEndDraggingWillDecelerate = (scrollView: __SF_UIScrollView, decelerate: any) => {
      const contentOffset = {
        x: scrollView.contentOffset.x + scrollView.contentInsetDictionary.left,
        y: scrollView.contentOffset.y + scrollView.contentInsetDictionary.top
      };
      this.emit('scrollEndDraggingWillDecelerate', contentOffset, decelerate);
      this.ios.onScrollEndDraggingWillDecelerate?.(contentOffset, decelerate);
    };
    this.nativeObject.onScrollViewWillEndDraggingWithVelocityTargetContentOffset = (scrollView: __SF_UIScrollView, velocity: Point2D, targetContentOffset: __SF_NSRect) => {
      const contentOffset = {
        x: scrollView.contentOffset.x + scrollView.contentInsetDictionary.left,
        y: scrollView.contentOffset.y + scrollView.contentInsetDictionary.top
      };
      targetContentOffset.x += +scrollView.contentInsetDictionary.left;
      targetContentOffset.y += +scrollView.contentInsetDictionary.top;
      this.emit('scrollEndDraggingWithVelocityTargetContentOffset', contentOffset, velocity, targetContentOffset);
      this.ios.onScrollEndDraggingWithVelocityTargetContentOffset?.(contentOffset, velocity, targetContentOffset);
    };
  }
  private setNativeObjectParams() {
    this.nativeObject.heightForRowAtIndex = (e) => {
      return this.onRowHeight(e.index);
    };

    this.nativeObject.onRowSwiped = (e) => {
      let index;

      if (e.index !== -1) {
        index = e.index;
      }

      if (this.ios.onRowSwiped) {
        //Deprecated on 4.1.4
        return this.ios.onRowSwiped(e.direction, e.expansionSettings, index);
      }

      if (this.onRowCanSwipe) {
        let returnOnRowCanSwipe = this.onRowCanSwipe(index);
        if (returnOnRowCanSwipe) {
          if (returnOnRowCanSwipe.includes(e.direction)) {
            let object = {
              index: index,
              direction: e.direction,
              ios: {
                expansionSettings: e.expansionSettings
              }
            };
            return this.__onRowSwipeWrapper(object);
          }
        }
      }

      return [];
    };

    this.nativeObject.cellForRowAt = (e) => {
      if (e.cell.contentView.subviews.length === 0) {
        const listViewItem = this.onRowCreate?.(parseInt(e.cell.reuseIdentifier));
        listViewItem.__nativeCell = e.cell;
        this._listItemArray[e.cell.uuid] = listViewItem;

        // Bug ID : IOS-2750
        if (this._listItemArray[e.cell.uuid].nativeObject.yoga.direction === 0 && this.nativeObject.superview) {
          this._listItemArray[e.cell.uuid].nativeObject.yoga.direction = this.nativeObject.superview.yoga.resolvedDirection;
        }
        ///////
        e.cell.contentView.addSubview(this._listItemArray[e.cell.uuid].nativeObject);
      }

      this.onRowBind?.(this._listItemArray[e.cell.uuid], e.indexPath.row);
      this._listItemArray[e.cell.uuid].applyLayout();
    };

    // var _cellIdentifier = "cell";
    this.nativeObject.cellIdentifierWithIndexPath = (e) => {
      // e.indexPath.row
      return String(this.onRowType?.(e.indexPath.row)) || '0';
    };

    this.nativeObject.didSelectRowAt = (e) => {
      this.emit('rowSelected', e.index);
      this.onRowSelected?.(this._listItemArray[e.uuid], e.index);
    };

    this.nativeObject.canMoveRowAt = (e) => {
      this.emit('rowCanMove', e.indexPath.row);
      this.onRowCanMove?.(e.indexPath.row);
    };
    this.nativeObject.moveRowAt = (e) => {
      this.emit('rowMoved', e.sourceIndexPath.row, e.destinationIndexPath.row);
      this.onRowMoved?.(e.sourceIndexPath.row, e.destinationIndexPath.row);
    };

    this.nativeObject.targetIndexPathForMoveFromRowAt = (e) => {
      this.emit('rowMove', e.sourceIndexPath.row, e.proposedDestinationIndexPath.row);
      return this.onRowMove?.(e.sourceIndexPath.row, e.proposedDestinationIndexPath.row) ? e.proposedDestinationIndexPath.row : e.sourceIndexPath.row;
    };
  }
  private deleteRow(index: number) {
    this.nativeObject.deleteRowIndexAnimation(index, RowAnimation.LEFT);
  }
  get paginationEnabled(): boolean {
    return this.nativeObject.valueForKey('pagingEnabled');
  }
  set paginationEnabled(value: boolean) {
    this.nativeObject.setValueForKey(value, 'pagingEnabled');
  }
  get contentOffset(): __SF_NSRect {
    return {
      x: this.nativeObject.contentOffset.x + this.nativeObject.contentInsetDictionary.left,
      y: this.nativeObject.contentOffset.y + this.nativeObject.contentInsetDictionary.top
    };
  }
  get swipeEnabled(): IListView['swipeEnabled'] {
    return this.nativeObject.rightToLeftSwipeEnabled && this.nativeObject.leftToRightSwipeEnabled;
  }
  set swipeEnabled(value: IListView['swipeEnabled']) {
    this.nativeObject.leftToRightSwipeEnabled = value;
    this.nativeObject.rightToLeftSwipeEnabled = value;
  }
  get itemCount(): number {
    return this.nativeObject.itemCount;
  }
  set itemCount(value: number) {
    this.nativeObject.itemCount = value;
  }
  get rowHeight(): number {
    return this.nativeObject.tableRowHeight;
  }
  set rowHeight(value: number) {
    this.nativeObject.tableRowHeight = value;
  }
  get verticalScrollBarEnabled(): boolean {
    return this.nativeObject.showsVerticalScrollIndicator;
  }
  set verticalScrollBarEnabled(value: boolean) {
    this.nativeObject.showsVerticalScrollIndicator = value;
  }
  get scrollEnabled(): boolean {
    return this.nativeObject.valueForKey('scrollEnabled');
  }
  set scrollEnabled(value: boolean) {
    this.nativeObject.setValueForKey(value, 'scrollEnabled');
  }
  get refreshEnabled() {
    return this._refreshEnabled;
  }
  set refreshEnabled(value) {
    this._refreshEnabled = value;
    if (value) {
      this.nativeObject.addSubview(this.refreshControl);
    } else {
      this.refreshControl.removeFromSuperview();
    }
  }
  get contentInset() {
    return this._contentInset;
  }
  set contentInset(value) {
    const contentInset = {
      top: value?.top || this._contentInset.top,
      bottom: value?.bottom || this._contentInset.bottom
    };
    this._contentInset = contentInset;

    const argContentInset = new Invocation.Argument({
      type: 'UIEdgeInsets',
      value: {
        top: this._contentInset.top,
        left: 0,
        bottom: this._contentInset.bottom,
        right: 0
      }
    });
    Invocation.invokeInstanceMethod(this.nativeObject, 'setContentInset:', [argContentInset]);
    this.nativeObject.contentOffset = {
      x: 0,
      y: -this._contentInset.top
    };
  }
  get rowMoveEnabled(): boolean {
    return this.nativeObject.isEditing;
  }
  set rowMoveEnabled(value: boolean) {
    this.nativeObject.setEditing(value);
  }

  on(eventName: ListViewEvents | ViewEvents, callback: EventListenerCallback) {
    if (eventName === 'scroll') {
      this.nativeObject.didScroll = (e) => {
        this.emit('scroll', e);
        this.onScroll?.(e);
      };
    } else if (
      eventName === 'scrollBeginDecelerating' ||
      eventName === 'scrollEndDecelerating' ||
      eventName === 'scrollEndDraggingWillDecelerate' ||
      eventName === 'scrollEndDraggingWithVelocityTargetContentOffset'
    ) {
      this.setScrollEvents();
    }
    return super.on(eventName, callback);
  }
  longPressDragEnabled: boolean;

  static iOS = {
    RowAnimation: RowAnimation,
    ...ViewIOS.iOS
  };
  static SwipeDirection: typeof SwipeDirection = SwipeDirection;
  static SwipeItem: typeof SwipeItem = SwipeItem;
}
