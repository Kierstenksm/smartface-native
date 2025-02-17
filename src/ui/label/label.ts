import { IFont } from '../font/font';
import TextAlignment from '../shared/textalignment';
import { ViewEvents } from '../view/view-events';
import { MobileOSProps } from '../../core/native-mobile-component';
import { IView, ViewAndroidProps, ViewIOSProps } from '../view/view';
import EllipsizeMode from '../shared/ellipsizemode';
import TextDirection from '../shared/textdirection';
import ViewState from '../shared/viewState';
import { IColor } from '../color/color';

export interface LabelAndroidProps extends ViewAndroidProps {
  /**
   * Gets/sets adjustable-font step granularity. It is used in conjunction with the minimum and maximum text size in order to build the set of text sizes the system uses to choose from when auto-sizing
   *
   * @android
   * @since 4.2.2
   */
  adjustableFontSizeStep?: number;
  /**
   * Gets/sets the text direction.
   *
   * @property {UI.Android.TextDirection} textDirection
   * @android
   * @since 4.0.2
   */
  textDirection?: TextDirection;

  /**
   * Gets/sets the whether Label includes extra top and bottom font padding to make space for the ascenders/descenders.
   *
   * @property {Boolean} [includeFontPadding = true]
   * @android
   * @since 5.1.1
   */
  includeFontPadding?: boolean;
}

export interface LabelIOSProps extends ViewIOSProps {}

export declare interface ILabel<TEvent extends string = ViewEvents, TMobile extends MobileOSProps<LabelIOSProps, LabelAndroidProps> = MobileOSProps<LabelIOSProps, LabelAndroidProps>>
  extends IView<TEvent, any, TMobile> {
  /**
   * Gets/sets font of a Label. When set to null label uses system font.
   * It is set to null by default.
   *
   *     @example
   *     import Label from '@smartface/native/ui/label';
   *     import Font from '@smartface/native/ui/font';
   *     const myLabel = new Label({
   *         text: "This is my label",
   *         visible: true
   *     });
   *     myLabel.font = Font.create("Arial", 16, Font.BOLD);
   *
   * @android
   * @ios
   * @since 0.1
   */
  font: IFont | null;
  /**
   * Sets the height of the Label to be at most maxLines tall. Setting 0 indicates that maxLines will be as much as given content.
   * @property {Number} [maxLines = 1]
   * @android
   * @ios
   * @since 4.0.2
   */
  maxLines: number;
  /**
   * Causes words in the text that are longer than the view's width to be ellipsized instead of broken in the middle. If {@link UI.Label#maxLines maxLines} has been used to set two or more lines, only {@link UI.EllipsizeMode#END EllipsizeMode.END} is supported
   *
   * @property {UI.EllipsizeMode} ellipsizeMode
   * @android
   * @ios
   * @since 4.0.2
   */
  ellipsizeMode: EllipsizeMode;
  /**
   * Gets/sets text on Label.
   *
   * @property {String} [text = ""]
   * @android
   * @ios
   * @since 0.1
   */
  text: string;
  /**
   * Gets/sets text alignment of a Label. UI.TextAlignment constants
   * can be used. Label textAlignment property only supports UI.TextAlignment.MIDLEFT, UI.TextAlignment.MIDCENTER, UI.TextAlignment.MIDRIGHT.
   *
   *     @example
   *     import Label from '@smartface/native/ui/label';
   *     import TextAlignment from '@smartface/native/ui/textalignment';
   *     var myLabel = new Label();
   *     myLabel.textAlignment = TextAlignment.MIDCENTER;
   *
   * @property {UI.TextAlignment} [textAlignment = UI.TextAlignment.MIDLEFT]
   * @android
   * @ios
   * @since 0.1
   */
  textAlignment: TextAlignment;
  /**
   * Gets/sets text color of Label.
   *
   * @property {UI.Color} [textColor = UI.Color.BLACK]
   * @android
   * @ios
   * @since 0.1
   */
  textColor: ViewState<IColor>;

  /**
   * This property adjusts font size according to view's fixed width. The adjustment of font size happens according to {@link UI.Label#minimumFontSize minimumFontSize} , maximum font size (which is current label font size) & {@link UI.Label#adjustableFontSizeStep adjustableFontSizeStep}(just Android)
   *
   * @property {Boolean} [adjustFontSizeToFit = false]
   * @ios
   * @android
   * @since 4.2.2
   * @see {@link UI.Label#minimumFontSize minimumFontSize}
   * @see {@link UI.Label#adjustableFontSizeStep adjustableFontSizeStep}
   */
  adjustFontSizeToFit: boolean;

  /**
   * Gets/sets minimum font size of Label.
   *
   * @property {Number} [minimumFontSize = 1]
   * @ios
   * @android
   * @since 4.2.2
   */
  minimumFontSize: number;
}
