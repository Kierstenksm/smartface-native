import { ISVGImageView } from './svgimageview';
import ImageViewAndroid from '../imageview/imageview.android';
import { SVGImageViewEvents } from './svgimageview-events';

export default class SVGImageViewAndroid<TEvent extends string = SVGImageViewEvents> extends ImageViewAndroid<TEvent | SVGImageViewEvents> implements ISVGImageView {
  constructor(params: Partial<ISVGImageView> = {}) {
    super(params);
  }
}