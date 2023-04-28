import { ISvgImageView } from './svgimageview';
import { SvgImageViewEvents } from './svgimageview-events';
import ImageViewAndroid from '../imageview/imageview.android';
import SvgImageAndroid from '../svgimage/svgimage.android';
import AndroidConfig from '../../util/Android/androidconfig';
const NativeSFSvgImageView = requireClass("io.smartface.android.sfcore.ui.imageview.svg.SFSvgImageView");

export default class SvgImageViewAndroid<TEvent extends string = SvgImageViewEvents> extends ImageViewAndroid<TEvent | SvgImageViewEvents> implements ISvgImageView {
  private _svgImage: SvgImageAndroid;
  constructor(params: Partial<ISvgImageView> = {}) {
    super(params);
  }

  protected createNativeObject() {
    return new NativeSFSvgImageView(AndroidConfig.activity);
  }

  get svgImage(): SvgImageAndroid {
    return this._svgImage;
  }
  set svgImage(value: SvgImageAndroid) {
    this._svgImage = value;
    this.nativeObject.setImageDrawable(this._svgImage.nativeObject);
  }
}