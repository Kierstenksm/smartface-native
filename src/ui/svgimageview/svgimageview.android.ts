import { ISvgImageView } from './svgimageview';
import { SvgImageViewEvents } from './svgimageview-events';
import ImageViewAndroid from '../imageview/imageview.android';
import SvgImageAndroid from '../svgimage/svgimage.android';

export default class SvgImageViewAndroid<TEvent extends string = SvgImageViewEvents> extends ImageViewAndroid<TEvent | SvgImageViewEvents> implements ISvgImageView {
  constructor(params: Partial<ISvgImageView> = {}) {
    super(params);
  }
  get svgImage(): SvgImageAndroid {  }
  set svgImage(value: SvgImageAndroid) {  }
}