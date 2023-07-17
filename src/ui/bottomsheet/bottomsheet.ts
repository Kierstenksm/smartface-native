import { IEventEmitter } from '../../core/eventemitter';
import { INativeMobileComponent, MobileOSProps } from '../../core/native-mobile-component';
import { IView } from '../view/view';
import { BottomSheetEvents } from './bottomsheet-events';

/**
 * @class UI.BottomSheet
 * @since 5.0.4
 * @android
 *
 * BottomSheet represents a bottom sheet. A bottom sheet helps people perform a scoped task that’s closely related to their current context. 
 * This component only supported on Android.
 *      
 *     @example
 *     ```
 *     const content = new FlexLayout();
 *     content.height = 300;
 *     content.width = 300;
 *     const bottomSheet = new BottomSheet({
 *        view: content,
 *        borderRadius: 10,
 *        detents: detents,
 *     });
 *     bottomSheet.on('dismissed', () => {
 *       console.log("on dismissed, isShowing: ", bottomSheet.isShowing);
 *     })
 *     bottomSheet.show();
 *     ```
 */
export interface IBottomSheet<TEvent extends string = BottomSheetEvents> extends INativeMobileComponent<any, MobileOSProps>, IEventEmitter<TEvent | BottomSheetEvents> {

  /**
   * Determines the view of the bottom sheet.
   *
   * @property {UI.IView} view
   * @android
   * @since 5.0.4
   */
  view: IView;

  /**
   * Determines the borderRadius of the bottom sheet.
   *
   * @property {Number} [borderRadius = 0]
   * @android
   * @since 5.0.4
   */
  borderRadius: number;

  /**
   * Determines the heights where the bottom sheet can rest.
   *
   * @property {('large' | 'medium')[]} [detents = ['medium']]
   * @android
   * @since 5.0.4
   */
  detents: ('large' | 'medium')[];

  /**
   * Gets status of the bottom sheet. Returns true if the bottom sheet is currently displayed on the screen.
   * @android
   * @property
   * @since 5.0.4
   */
  isShowing: boolean;

  /**
  * Show the bottom sheet.
  *
  * @method show
  * @android
  * @since 5.0.4
  */
  show(): void;

  /**
   * Dismiss the bottom sheet.
   *
   * @method dismiss
   * @android
   * @since 5.0.4
   */
  dismiss(): void;

  /**
   * This function called when displayed bottom sheet dismissed.
   * @param {void} callback function called when bottom sheet dismissed.
   * @android
   * @since 5.0.4
   */
  onDismissed: () => void;
}
