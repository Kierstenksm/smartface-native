import { Point2D } from '../../primitive/point2d';
import { Boundary } from '../../primitive/boundary';
import NativeComponent from '../../core/native-component';
import { INativeComponent } from '../../core/inative-component';
import { MobileOSProps, NativeMobileComponent } from '../../core/native-mobile-component';



/**
 * Constants indicating the direction of scrolling for the layout.
 * @class UI.LayoutManager.ScrollDirection
 * @readonly
 * @ios
 * @since 3.0.2
 */
export enum ScrollDirection {
  /**
   * @property {Number} HORIZONTAL
   * @ios
   * @static
   * @readonly
   * @since 3.0.2
   */
  HORIZONTAL,
  /**
   * @property {Number} VERTICAL
   * @ios
   * @static
   * @readonly
   * @since 3.0.2
   */
  VERTICAL
}

/**
 * @class UI.LayoutManager
 * @since 3.0.2
 * Layout calculation class for GridView. It behaves iOS’s UICollectionViewFlowLayout and Android’s StaggeredGridLayout.
 *
 * spanCount and scrollDirection are 2 important parameters of this class.
 *
 * If user sets scrollDirection to “vertical”, spanCount represents count of colons.
 * For example; scrollDirection: vertical, spanCount: 2 means user can scroll vertically, object has 2 colons and width property of items are fixed numbers depends on colon count.
 * If user sets scrollDirection to “horizontal”, spanCount represents count of rows.
 * For example; scrollDirection: horizontal, spanCount : 2 means user can scroll horizontally, object has 2 rows and height property of items are fixed numbers depends on row count
 *
 *      @example
 *      var layoutManager = new LayoutManager({
 *           spanCount: 2,
 *           scrollDirection: LayoutManager.ScrollDirection.VERTICAL
 *      });
 *
 *
 */
export declare interface ILayoutManager extends INativeComponent, MobileOSProps {
  /**
   * User must return a length value for scrollDirection that user lays out the objects.
   * If vertical, length value will be height of item. If horizontal, length value will be width of item.
   *
   * @event onItemLength
   * @android
   * @ios
   * @since 3.0.2
   * @example
   * ```
   * import LayoutManager from '@smartface/native/ui/layoutmanager';
   *
   * const layoutManager = new LayoutManager();
   * layoutManager.on(LayoutManager.Events.ItemLength, (params) => {
   *  console.info('onItemLength', params);
   * });
   * ```
   */
  onItemLength: null | ((length: number) => number);
  /**
   * This event used to define specified gridview item  to fully occupy width/height  based on direction. According to direction return value must be either desired height or width of gridview item. If the direction
   * is {@link UI.LayoutManager.ScrollDirection#VERTICAL VERTICAL} then return value must be height or vice versa. Returning undefined indicates that
   * the gridview item will not modified.
   *
   * @event onFullSpan
   * @android
   * @ios
   * @since 4.0.1
   * @example
   * ```
   * import LayoutManager from '@smartface/native/ui/layoutmanager';
   *
   * const layoutManager = new LayoutManager();
   * layoutManager.on(LayoutManager.Events.FullSpan, (params) => {
   *  console.info('onFullSpan', params);
   * });
   * ```
   */
  onFullSpan: null | ((type: number) => number);

  /**
   * Gets/sets colon or row count depends on scrolling direction of layout.
   * If vertical it represents colon, if horizontal it represent row count.
   *
   * @property {Number} [spanCount = 1]
   * @android
   * @ios
   * @since 3.0.2
   */
  spanCount: number;
  /**
   * Gets/sets the custom distance that the content view is inset from the scroll view edges.
   *
   * @property {Number} [contentInset = {top:0, left:0, bottom:0, right:0}]
   * @android
   * @ios
   * @since 3.0.2
   */
  contentInset: Boundary;
  /**
   * The scroll direction of GridView.
   *
   * @property {LayoutManager.ScrollDirection} [scrollDirection = 0]
   * @android
   * @ios
   * @since 3.0.2
   */
  scrollDirection: ScrollDirection;
  lineSpacing: number;
  itemSpacing: number;
}

export abstract class AbstractLayoutManager<TNative = any> extends NativeMobileComponent<TNative, ILayoutManager> implements ILayoutManager {
  constructor(params: Partial<ILayoutManager>) {
    super(params);
  }

  abstract get itemSpacing(): number;
  abstract set itemSpacing(value: number);
  abstract get lineSpacing(): number;
  abstract set lineSpacing(value: number);
  abstract get spanCount(): number;
  abstract set spanCount(value: number);
  abstract get contentInset(): Boundary;
  abstract set contentInset(value: Boundary);
  abstract get scrollDirection(): ScrollDirection;
  abstract set scrollDirection(value: ScrollDirection);
  abstract get onFullSpan(): ILayoutManager['onFullSpan'];
  abstract set onFullSpan(value: ILayoutManager['onFullSpan']);
  abstract get onItemLength(): ILayoutManager['onItemLength'];
  abstract set onItemLength(value: ILayoutManager['onItemLength']);
  static ScrollDirection: typeof ScrollDirection;
}

export declare class LayoutManagerImpl extends AbstractLayoutManager {
  get itemSpacing(): number;
  set itemSpacing(value: number);
  get lineSpacing(): number;
  set lineSpacing(value: number);
  get spanCount(): number;
  set spanCount(value: number);
  get contentInset(): Boundary;
  set contentInset(value: Boundary);
  get scrollDirection(): ScrollDirection;
  set scrollDirection(value: ScrollDirection);
  get onFullSpan(): ((type: number) => number) | null;
  set onFullSpan(value: ((type: number) => number) | null);
  get onItemLength(): ((length: number) => number) | null;
  set onItemLength(value: ((length: number) => number) | null);
  protected createNativeObject(params?: Partial<Record<string, any>>);
  constructor(params: Partial<ILayoutManager>);
}
