import { MobileOSProps } from '../../core/native-mobile-component';
import { Point2D } from '../../primitive/point2d';
import FlexLayout from '../flexlayout';
import ContentInsetAdjustment from '../shared/ios/contentinsetadjustment';
import { AbstractViewGroup, IViewGroup, ViewGroupAndroidProps, ViewGroupIOSProps } from '../viewgroup/viewgroup';
import { ScrollViewEvents } from './scrollview-events';

export enum ScrollViewEdge {
  LEFT = 'left',
  TOP = 'top',
  RIGHT = 'right',
  BOTTOM = 'bottom'
}

export enum ScrollViewAlign {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal'
}

export interface ScrollViewIOSProps extends ViewGroupIOSProps {
  decelerationRate: number;
  /**
   * If the value of this property is YES , scrolling is enabled, and if it is NO , scrolling is disabled. The default is YES.
   *
   * @property {Boolean} [scrollEnabled = true]
   * @ios
   * @since 3.1.3
   */
  scrollEnabled: boolean;
  /**
   * Sets/Gets the bounce effect when scrolling.
   *
   * @property {Boolean} bounces
   * @ios
   * @since 3.2.1
   */
  bounces: boolean;
  /**
   * The behavior for determining the adjusted content offsets.
   *
   * @property {UI.iOS.ContentInsetAdjustment} [contentInsetAdjustmentBehavior = UI.iOS.ContentInsetAdjustment.NEVER]
   * @ios
   * @since 4.0.0
   */
  contentInsetAdjustmentBehavior: ContentInsetAdjustment;
  /**
   * This event is called when the scroll view is about to start scrolling the content.
   *
   * @param {Object} contentOffset
   * @param {Number} contentOffset.x
   * @param {Number} contentOffset.y
   * @event onScrollBeginDragging
   * @ios
   * @since 3.2.1
   * @deprecated
   * @example
   * ```
   * import ScrollView from '@smartface/native/ui/scrollview';
   *
   * const scrollView = new ScrollView();
   * scrollView.on(ScrollView.Events.ScrollBeginDragging, (params) => {
   * 	console.info('onScrollBeginDragging', params);
   * });
   * ```
   */
  onScrollBeginDragging: (contentOffset: __SF_NSRect) => void;
  /**
   * This event is called when the scroll view is starting to decelerate the scrolling movement.
   *
   * @param {Object} contentOffset
   * @param {Number} contentOffset.x
   * @param {Number} contentOffset.y
   * @event onScrollBeginDecelerating
   * @ios
   * @since 3.2.1
   * @deprecated
   * @example
   * ```
   * import ScrollView from '@smartface/native/ui/scrollview';
   *
   * const scrollView = new ScrollView();
   * scrollView.on(ScrollView.Events.ScrollBeginDecelerating, (params) => {
   * 	console.info('onScrollBeginDecelerating', params);
   * });
   * ```
   */
  onScrollBeginDecelerating: (contentOffset: __SF_NSRect) => void;
  /**
   * This event is called when the scroll view has ended decelerating the scrolling movement.
   *
   * @param {Object} contentOffset
   * @param {Number} contentOffset.x
   * @param {Number} contentOffset.y
   * @event onScrollEndDecelerating
   * @ios
   * @since 3.2.1
   * @deprecated
   * @example
   * ```
   * import ScrollView from '@smartface/native/ui/scrollview';
   *
   * const scrollView = new ScrollView();
   * scrollView.on(ScrollView.Events.ScrollEndDecelerating, (params) => {
   * 	console.info('onScrollEndDecelerating', params);
   * });
   * ```
   */
  onScrollEndDecelerating: (contentOffset: __SF_NSRect) => void;
  /**
   * This event is called when dragging ended in the scroll view.
   *
   * @param {Object} contentOffset
   * @param {Number} contentOffset.x
   * @param {Number} contentOffset.y
   * @param {Boolean} decelerate
   * @event onScrollEndDraggingWillDecelerate
   * @ios
   * @since 3.2.1
   * @deprecated
   * @example
   * ```
   * import ScrollView from '@smartface/native/ui/scrollview';
   *
   * const scrollView = new ScrollView();
   * scrollView.on(ScrollView.Events.ScrollEndDraggingWillDecelerate, (params) => {
   * 	console.info('onScrollEndDraggingWillDecelerate', params);
   * });
   * ```
   */
  onScrollEndDraggingWillDecelerate: (contentOffset: __SF_NSRect, decelerate: boolean) => void;
  /**
   * This event is called when the user finishes scrolling the content.
   *
   * @param {Object} contentOffset
   * @param {Number} contentOffset.x
   * @param {Number} contentOffset.y
   * @param {Object} velocity
   * @param {Number} velocity.x
   * @param {Number} velocity.y
   * @param {Object} targetContentOffset
   * @param {Number} targetContentOffset.x
   * @param {Number} targetContentOffset.y
   * @event onScrollEndDraggingWithVelocityTargetContentOffset
   * @ios
   * @since 3.2.1
   * @deprecated
   * @example
   * ```
   * import ScrollView from '@smartface/native/ui/scrollview';
   *
   * const scrollView = new ScrollView();
   * scrollView.on(ScrollView.Events.ScrollEndDraggingWithVelocityTargetContentOffset, (params) => {
   * 	console.info('onScrollEndDraggingWithVelocityTargetContentOffset', params);
   * });
   * ```
   */
  onScrollEndDraggingWithVelocityTargetContentOffset: (contentOffset: __SF_NSRect, velocity: __SF_NSRect, targetContentOffset: Point2D) => void;
}

export interface ScrollViewAndroidParams extends ViewGroupAndroidProps {

}

/**
 * @class UI.ScrollView
 * @extends UI.ViewGroup
 * @since 0.1
 *
 * ScrollView enables user to view pages with large content exceeding screen size via scroll action.
 * ScrollView can have only one child layout. The layout should be added if there are child views more
 * than one.
 *
 *     @example
 *     import FlexLayout from '@smartface/native/ui/flexlayout';
 *     import ScrollView from '@smartface/native/ui/scrollview';
 *     import Button from '@smartface/native/ui/button';
 *     import Color from '@smartface/native/ui/color';
 *
 *     var scrollView = new ScrollView({
 *        flexGrow: 1,
 *        backgroundColor: Color.GREEN,
 *        alignSelf: FlexLayout.AlignSelf.STRETCH
 *     });
 *     scrollView.layout.height = 2000;
 *     scrollView.layout.backgroundColor = Color.RED;
 *     scrollView.layout.alignItems = FlexLayout.AlignItems.CENTER;
 *     var buttonTop = new Button({
 *       height: 100,
 *       width: 100,
 *       top:10,
 *       text: "Scroll to 1100",
 *       backgroundColor: Color.BLUE,
 *       onPress: function(){
 *           scrollView.scrollToCoordinate(1100);
 *       }
 *     });
 *     var buttonBottom = new Button({
 *       height: 100,
 *       width: 100,
 *       top: 1000,
 *       text: "Scroll to 10",
 *       backgroundColor: Color.BLUE,
 *       onPress: function(){
 *           scrollView.scrollToCoordinate(10);
 *       }
 *     });
 *     scrollView.layout.addChild(buttonTop);
 *     scrollView.layout.addChild(buttonBottom);
 */
export interface IScrollView<TEvent extends string = ScrollViewEvents, TMobile extends MobileOSProps<ScrollViewIOSProps, ScrollViewAndroidParams> = MobileOSProps<ScrollViewIOSProps, {}>>
  extends IViewGroup<TEvent | ScrollViewEvents, any, TMobile> {

  /**
   * Gets/sets the alignment of the scrollview. If alignment is HORIZONTAL, the ScrollView
   * will scroll horizontally, otherwise will scroll vertically.
   * It must be set as constructor parameter. This property cannot be set after the object is initialized.
   *
   * @property {UI.ScrollView.Align} [align = UI.ScrollView.Align.VERTICAL]
   * @android
   * @ios
   * @readonly
   * @since 0.1
   */
  align: ScrollViewAlign;
  /**
   * Gets layout of the ScrollView. Use this property to add a child to the ScrollView instead of {@link ScrollView#addChild}
   *
   * @property {UI.FlexLayout} [layout = UI.FlexLayout]
   * @android
   * @ios
   * @readonly
   * @since 1.1.10
   */
  layout: FlexLayout;
  /**
   * Gets/sets the visibility of the scrollbar.
   *
   * @property {Boolean} [scrollBarEnabled = true]
   * @android
   * @ios
   * @since 0.1
   */
  scrollBarEnabled: boolean;
  /**
   * Scrollview layout size will be calculated by device automatically when autoSizeEnabled is true. To do the automatic calculation, you need to set scrollview.autoSizeEnabled property true.
   *
   * @property {Boolean} [autoSizeEnabled = false]
   * @android
   * @ios
   * @since 3.0.2
   * @deprecated since 5.1.1
   */
  autoSizeEnabled: boolean;

  /**
   * Immediately scrolls to the edge set.
   *
   * @method scrollToEdge
   * @android
   * @ios
   * @param {UI.ScrollView.Edge} edge
   * @since 0.1
   */
  scrollToEdge(edge: ScrollViewEdge): void;
  /**
   * Immediately scrolls to the given coordinate. Coordinate is X position for horizontal alignment and
   * Y position for vertical alignment.
   *
   * @method scrollToCoordinate
   * @android
   * @ios
   * @param {Number} coordinate
   * @since 0.1
   */
  scrollToCoordinate(coordinate: number, animate?: boolean): void;

  /**
   * This event is called when a ScrollView is scrolled.
   * For better performance, don't set any callback if does not
   * necessary.
   *
   * @event onScroll
   * @deprecated
   * @param {Object} params
   * @param {Object} params.translation
   * @param {Number} params.translation.x
   * @param {Number} params.translation.y
   * @param {Object} params.contentOffset
   * @param {Number} params.contentOffset.x
   * @param {Number} params.contentOffset.y
   * @android
   * @ios
   * @since 1.1.13
   * @example
   * ```
   * import ScrollView from '@smartface/native/ui/scrollview';
   *
   * const scrollView = new ScrollView();
   * scrollView.on(ScrollView.Events.Scroll, (params) => {
   * 	console.info('onScroll', params);
   * });
   * ```
   */
  onScroll: (params: { translation: Point2D; contentOffset: Point2D }) => void;
  /**
   * Gets contentOffset of the ScrollView.
   *
   * @property contentOffset
   * @android
   * @ios
   * @readonly
   * @return {Object}
   * @return {Number} return.x
   * @return {Number} return.y
   * @since 1.1.13
   */
  readonly contentOffset: Point2D;

  on(eventName: 'scroll', callback: (params: { translation: Point2D; contentOffset: Point2D }) => void): () => void;
  on(eventName: 'scrollBeginDecelerating', callback: (contentOffset:Point2D) => void): () => void;
  on(eventName: 'scrollBeginDragging', callback: (contentOffset:Point2D) => void): () => void;
  on(eventName: 'scrollEndDecelerating', callback: (contentOffset:Point2D) => void): () => void;
  on(eventName: 'scrollEndDraggingWillDecelerate', callback: (contentOffset:Point2D,decelerate:boolean) => void): () => void;
  on(eventName: ScrollViewEvents, callback: (...args: any[]) => void): () => void;

  off(eventName: 'scroll', callback: (params: { translation: Point2D; contentOffset: Point2D }) => void): void;
  off(eventName: 'scrollBeginDecelerating', callback: (contentOffset:Point2D) => void): void;
  off(eventName: 'scrollBeginDragging', callback: (contentOffset:Point2D) => void): void;
  off(eventName: 'scrollEndDecelerating', callback: (contentOffset:Point2D) => void): void;
  off(eventName: 'scrollEndDraggingWillDecelerate', callback: (contentOffset:Point2D,decelerate:boolean) => void): void;
  off(eventName: ScrollViewEvents, callback: (...args: any[]) => void): void;

  emit(eventName: 'scroll', params: { translation: Point2D; contentOffset: Point2D }): void;
  emit(eventName: 'scrollBeginDecelerating', contentOffset:Point2D): void;
  emit(eventName: 'scrollBeginDragging', contentOffset:Point2D): void;
  emit(eventName: 'scrollEndDecelerating', contentOffset:Point2D): void;
  emit(eventName: 'scrollEndDraggingWillDecelerate', contentOffset:Point2D,decelerate:boolean): void;
  emit(eventName: ScrollViewEvents, ...args: any[]): void;

  once(eventName: 'scroll', callback: (params: { translation: Point2D; contentOffset: Point2D }) => void): () => void;
  once(eventName: 'scrollBeginDecelerating', callback: (contentOffset:Point2D) => void): () => void;
  once(eventName: 'scrollBeginDragging', callback: (contentOffset:Point2D) => void): () => void;
  once(eventName: 'scrollEndDecelerating', callback: (contentOffset:Point2D) => void): () => void;
  once(eventName: 'scrollEndDraggingWillDecelerate', callback: (contentOffset:Point2D,decelerate:boolean) => void): () => void;
  once(eventName: ScrollViewEvents, callback: (...args: any[]) => void): () => void;

  prependListener(eventName: 'scroll', callback: (params: { translation: Point2D; contentOffset: Point2D }) => void): void;
  prependListener(eventName: 'scrollBeginDecelerating', callback: (contentOffset:Point2D) => void): void;
  prependListener(eventName: 'scrollBeginDragging', callback: (contentOffset:Point2D) => void): void;
  prependListener(eventName: 'scrollEndDecelerating', callback: (contentOffset:Point2D) => void): void;
  prependListener(eventName: 'scrollEndDraggingWillDecelerate', callback: (contentOffset:Point2D,decelerate:boolean) => void): void;
  prependListener(eventName: ScrollViewEvents, callback: (...args: any[]) => void): void;

  prependOnceListener(eventName: 'scroll', callback: (params: { translation: Point2D; contentOffset: Point2D }) => void): void;
  prependOnceListener(eventName: 'scrollBeginDecelerating', callback: (contentOffset:Point2D) => void): void;
  prependOnceListener(eventName: 'scrollBeginDragging', callback: (contentOffset:Point2D) => void): void;
  prependOnceListener(eventName: 'scrollEndDecelerating', callback: (contentOffset:Point2D) => void): void;
  prependOnceListener(eventName: 'scrollEndDraggingWillDecelerate', callback: (contentOffset:Point2D,decelerate:boolean) => void): void;
  prependOnceListener(eventName: ScrollViewEvents, callback: (...args: any[]) => void): void;
}

export declare class AbstractScrollView<TEvent extends string = ScrollViewEvents> extends AbstractViewGroup<TEvent | ScrollViewEvents, any, IScrollView> implements IScrollView {
  constructor(params?: Partial<IScrollView>);
  align: ScrollViewAlign;
  layout: FlexLayout;
  scrollBarEnabled: boolean;
  autoSizeEnabled: boolean;
  scrollToEdge(edge: ScrollViewEdge): void;
  scrollToCoordinate(coordinate: number, animate?: boolean): void;
  onScroll: (params: { translation: Point2D; contentOffset: Point2D }) => void;
  contentOffset: Point2D;
  static Align: typeof ScrollViewAlign;
  static Edge: typeof ScrollViewEdge;

  on(eventName: 'scroll', callback: (params: { translation: Point2D; contentOffset: Point2D }) => void): () => void;
  on(eventName: 'scrollBeginDecelerating', callback: (contentOffset:Point2D) => void): () => void;
  on(eventName: 'scrollBeginDragging', callback: (contentOffset:Point2D) => void): () => void;
  on(eventName: 'scrollEndDecelerating', callback: (contentOffset:Point2D) => void): () => void;
  on(eventName: 'scrollEndDraggingWillDecelerate', callback: (contentOffset:Point2D,decelerate:boolean) => void): () => void;
  on(eventName: ScrollViewEvents, callback: (...args: any[]) => void): () => void;

  off(eventName: 'scroll', callback: (params: { translation: Point2D; contentOffset: Point2D }) => void): void;
  off(eventName: 'scrollBeginDecelerating', callback: (contentOffset:Point2D) => void): void;
  off(eventName: 'scrollBeginDragging', callback: (contentOffset:Point2D) => void): void;
  off(eventName: 'scrollEndDecelerating', callback: (contentOffset:Point2D) => void): void;
  off(eventName: 'scrollEndDraggingWillDecelerate', callback: (contentOffset:Point2D,decelerate:boolean) => void): void;
  off(eventName: ScrollViewEvents, callback: (...args: any[]) => void): void;

  emit(eventName: 'scroll', params: { translation: Point2D; contentOffset: Point2D }): void;
  emit(eventName: 'scrollBeginDecelerating', contentOffset:Point2D): void;
  emit(eventName: 'scrollBeginDragging', contentOffset:Point2D): void;
  emit(eventName: 'scrollEndDecelerating', contentOffset:Point2D): void;
  emit(eventName: 'scrollEndDraggingWillDecelerate', contentOffset:Point2D,decelerate:boolean): void;
  emit(eventName: ScrollViewEvents, ...args: any[]): void;

  once(eventName: 'scroll', callback: (params: { translation: Point2D; contentOffset: Point2D }) => void): () => void;
  once(eventName: 'scrollBeginDecelerating', callback: (contentOffset:Point2D) => void): () => void;
  once(eventName: 'scrollBeginDragging', callback: (contentOffset:Point2D) => void): () => void;
  once(eventName: 'scrollEndDecelerating', callback: (contentOffset:Point2D) => void): () => void;
  once(eventName: 'scrollEndDraggingWillDecelerate', callback: (contentOffset:Point2D,decelerate:boolean) => void): () => void;
  once(eventName: ScrollViewEvents, callback: (...args: any[]) => void): () => void;

  prependListener(eventName: 'scroll', callback: (params: { translation: Point2D; contentOffset: Point2D }) => void): void;
  prependListener(eventName: 'scrollBeginDecelerating', callback: (contentOffset:Point2D) => void): void;
  prependListener(eventName: 'scrollBeginDragging', callback: (contentOffset:Point2D) => void): void;
  prependListener(eventName: 'scrollEndDecelerating', callback: (contentOffset:Point2D) => void): void;
  prependListener(eventName: 'scrollEndDraggingWillDecelerate', callback: (contentOffset:Point2D,decelerate:boolean) => void): void;
  prependListener(eventName: ScrollViewEvents, callback: (...args: any[]) => void): void;

  prependOnceListener(eventName: 'scroll', callback: (params: { translation: Point2D; contentOffset: Point2D }) => void): void;
  prependOnceListener(eventName: 'scrollBeginDecelerating', callback: (contentOffset:Point2D) => void): void;
  prependOnceListener(eventName: 'scrollBeginDragging', callback: (contentOffset:Point2D) => void): void;
  prependOnceListener(eventName: 'scrollEndDecelerating', callback: (contentOffset:Point2D) => void): void;
  prependOnceListener(eventName: 'scrollEndDraggingWillDecelerate', callback: (contentOffset:Point2D,decelerate:boolean) => void): void;
  prependOnceListener(eventName: ScrollViewEvents, callback: (...args: any[]) => void): void;
}

