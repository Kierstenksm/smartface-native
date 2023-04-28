import File from '../../io/file';
import { AbstractSvgImage, ISvgImage } from './svgimage';

const NativeRenderOptions = requireClass("com.caverock.androidsvg.RenderOptions");
const NativeSVG = requireClass("com.caverock.androidsvg.SVG");
const NativePictureDrawable = requireClass("android.graphics.drawable.PictureDrawable");
const NativeFileInputStream = requireClass('java.io.FileInputStream');

export default class SvgImageAndroid extends AbstractSvgImage {
  constructor(params: Partial<ISvgImage> = {}) {
    super(params);
  }

  protected createNativeObject(params?: Partial<AbstractSvgImage>) {
    const nativeObject = params?.android?.drawable || null;
    return nativeObject;
  }

  static createFromFile(path: string): ISvgImage {
    const file = new File({ path });
    const svgImage = NativeSVG.getFromInputStream(new NativeFileInputStream(file.nativeObject));
    const picture = svgImage.renderToPicture(NativeRenderOptions.create());
    const pictureDrawable = new NativePictureDrawable(picture);
    return new SvgImageAndroid({ android: { drawable: pictureDrawable } });
  }
}
