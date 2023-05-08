import { IImageView } from '../imageview/imageview';
import { ISvgImage } from '../svgimage/svgimage';
import { SvgImageViewEvents } from './svgimageview-events';

export interface ISvgImageView<TEvent extends string = SvgImageViewEvents> extends IImageView<TEvent | SvgImageViewEvents> {
  /**
   * Gets/sets the svgImage. SvgImage object can be set.
   *
   * @property {UI.SvgImage}  [svgImage = undefined]
   * @android
   * @ios
   * @since 5.1.1
   */
  svgImage: string | undefined | ISvgImage;
}
