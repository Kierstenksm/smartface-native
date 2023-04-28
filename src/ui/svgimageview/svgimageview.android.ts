import { ISvgImageView } from './svgimageview';
import { SvgImageViewEvents } from './svgimageview-events';
import ImageViewAndroid from '../imageview/imageview.android';
import SvgImageAndroid from '../svgimage/svgimage.android';

export default class SvgImageViewAndroid<TEvent extends string = SvgImageViewEvents> extends ImageViewAndroid<TEvent | SvgImageViewEvents> implements ISvgImageView {
  private _svgImage: SvgImageAndroid;
  constructor(params: Partial<ISvgImageView> = {}) {
    super(params);
  }
  get svgImage(): SvgImageAndroid {
    return this._svgImage;
  }
  set svgImage(value: SvgImageAndroid) {
    this._svgImage = value;
    this.nativeObject.setImageDrawable(this._svgImage.nativeObject);
  }

  protected override isSvg(): boolean {
    return true;
  }
}