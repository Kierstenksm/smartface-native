import FileIOS from '../../io/file/file.ios';
import { AbstractSvgImage, ISvgImage } from './svgimage';

export default class SvgImageIOS extends AbstractSvgImage {
  constructor(params: Partial<ISvgImage> = {}) {
    super(params);
  }
  protected createNativeObject(params: Partial<ISvgImage>) {
    return params.nativeObject
  }
  static createFromFile(path: string): ISvgImage | null {
    const file = new FileIOS({ path: path })
    const actualPath = file.nativeObject.getActualPath();

    let svgImage;
    __SF_SVGImageView.createFromFile(actualPath, (image) => {
      svgImage = image
    })

    return actualPath ? new SvgImageIOS({ nativeObject: svgImage }) : null
  }
}
