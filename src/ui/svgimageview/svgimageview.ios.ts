import { SvgImageViewEvents } from './svgimageview-events';
import ImageViewIOS from '../imageview/imageview.ios';
import { ISvgImageView } from './svgimageview';

export default class SvgImageViewIOS<TEvent extends string = SvgImageViewEvents> extends ImageViewIOS<TEvent | SvgImageViewEvents> implements ISvgImageView {
  constructor(params?: ISvgImageView) {
    super(params);
  }
}
