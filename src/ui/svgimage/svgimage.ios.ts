import { AbstractSvgImage, ISvgImage } from './svgimage';

export default class SvgImageIOS extends AbstractSvgImage {
  constructor(params: Partial<ISvgImage> = {}) {
    super(params);
  }
  protected createNativeObject(params: Partial<ISvgImage>) {
    return params.nativeObject
  }
  static createFromFile(path: string): ISvgImage {
    let svgImage;
    __SF_SVGImageView.createFromFile(path, (image) => {
      svgImage = image
    })

    return new SvgImageIOS({ nativeObject: svgImage })
  }
}
