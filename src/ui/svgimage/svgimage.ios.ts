import { AbstractSvgImage, ISvgImage } from './svgimage';

export default class SvgImageIOS extends AbstractSvgImage {
  constructor(params: Partial<ISvgImage> = {}) {
    super(params);
  }
  protected createNativeObject(params: Partial<ISvgImage>) {}
  static createFromFile(path: string): ISvgImage { }
}
