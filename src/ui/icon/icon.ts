import { MobileOSProps } from "../../core/native-mobile-component";
import { ILabel, LabelAndroidProps } from "../label/label";
import { ViewEvents } from '../view/view-events';


export interface IconAndroidProps extends LabelAndroidProps {
  /**
   * Gets/sets whether the Icon includes extra top and bottom padding to make room for accents that go above the normal ascent and descent.
   * 
   * Better icon placement can be achieved when the value is set to false.
   * 
   * @property {Boolean} [includeFontPadding = false]
   * @android
   * @since 5.0.4
   */
  includeFontPadding?: boolean;
}

/**
 * @class UI.ICon
 * @since 5.0.4
 * 
 * Icon is a customized label which will ease the job of using/creating icons.
 * FontAwesome5 is assigned as default but it is advised to assign a icon font regardless.
 */
export interface IIcon<TEvent extends string = ViewEvents, TMobile extends MobileOSProps<{}, IconAndroidProps> = MobileOSProps<{}, IconAndroidProps>> 
extends ILabel<TEvent, TMobile> {
  /**
   * Actual icon. Some typescript versions might throw error on using icons as string.
   * Will override unicode and text.
   * @android
   * @ios
   * @since 5.0.4
   * ```
   * this.icon1.glyph = '';
   * ```
   */
  glyph: string;
  /**
   * Unicode representation of the Icon.
   * Will override glyph and text.
   * @example
   * ```
   * this.icon1.unicode = '\u1234'; // Will try to resolve it's icon value.
   * ```
   * @android
   * @ios
   * @since 5.0.4
   */
  unicode: string;

  /**
   * Text representation of the icon. It will convert the value to icon in it's font value.
   * Will override glyph and unicode.
   * @example
   * ```
   * this.icon1.text = "location"; // will yield location icon if the font supports it.
   * ```
   * @android
   * @ios
   * @since 5.0.4
   */
  text: string;
}