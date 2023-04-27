import { SVGImageViewEvents } from './svgimageview-events';
import ImageViewIOS from '../imageview/imageview.ios';
import { ISVGImageView } from './svgimageview';

export default class SVGImageViewIOS<TEvent extends string = SVGImageViewEvents> extends ImageViewIOS<TEvent | SVGImageViewEvents> implements ISVGImageView {
  constructor(params?: ISVGImageView) {
    super(params);
  }
}
