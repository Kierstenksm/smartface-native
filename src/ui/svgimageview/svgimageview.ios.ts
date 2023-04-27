import { SvgImageViewEvents } from './svgimageview-events';
import ImageViewIOS from '../imageview/imageview.ios';
import { ISvgImageView } from './svgimageview';
import SvgImageIOS from '../svgimage/svgimage.ios';

export default class SvgImageViewIOS<TEvent extends string = SvgImageViewEvents> extends ImageViewIOS<TEvent | SvgImageViewEvents> implements ISvgImageView {
  constructor(params?: ISvgImageView) {
    super(params);
  }
  get svgImage(): SvgImageIOS {  }
  set svgImage(value: SvgImageIOS) {  }
}
