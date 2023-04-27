import { AbstractSvgImage, ISvgImage } from './svgimage';

export default class SvgImageAndroid extends AbstractSvgImage {
  constructor(params: Partial<ISvgImage> = {}) {
    super(params);
  }

  protected createNativeObject(params?: Partial<AbstractSvgImage>) { }

  static createFromFile(path: string, width?: number, height?: number) : ISvgImage {}
}
