import { INativeComponent } from '../../core/inative-component';
import { MobileOSProps, NativeMobileComponent } from '../../core/native-mobile-component';

export type AndroidProps = {
  /**
   * This is an internal property. It hold the native drawable value of the svg image.
   * @private
   */
  drawable?: any;
};

export interface ISvgImage extends INativeComponent, MobileOSProps<any, AndroidProps> {
}

export abstract class AbstractSvgImage extends NativeMobileComponent<any, ISvgImage> implements ISvgImage {
  constructor(params?: Partial<ISvgImage>) {
    super(params);
  }

  /**
   * Creates an SvgImage instance from given file path. SvgImage's file should not be in images folder. You can use assets folder.
   *
   *     @example
   *     import SvgImage from '@smartface/native/ui/svgimage';
   *     const mySvgImage = SvgImage.createFromFile("assets://sample.svg");
   *
   * @param {String|IO.File} path SvgImage file path
   * @method createFromFile
   * @return {UI.SvgImage} An SvgImage instance.
   * @android
   * @ios
   * @static
   * @since 5.1.1
   */
  static createFromFile(path: string): ISvgImage | null {
    throw new Error('Method not implemented.');
  }
  protected abstract createNativeObject(params?: Partial<ISvgImage>): any;
}

/**
 * @class UI.SvgImage
 * @since 5.1.1
 *
 * SvgImage is used to store the svg data read from the filesystem.
 * It can be set to UI objects' properties (e.g. UI.SvgImage.svgImage).
 * SvgImage's file should not be in images folder. You can use assets folder.
 *
 *     @example
 *     import SvgImage from '@smartface/native/ui/svgimage';
 *     import SvgImageView from '@smartface/native/ui/svgimageview';
 *
 *     const mySvgImage = SvgImage.createFromFile("assets://sample.svg")
 *     const mySvgImageView = new SvgImageView({
 *         svgImage: mySvgImage,
 *         width: 200, height: 200
 *     });
 *
 *     myPage.layout.addChild(mySvgImageView);
 *
 */
export class SvgImageImpl extends AbstractSvgImage {
  protected createNativeObject(params?: Partial<ISvgImage>) {
    throw new Error('Method not implemented.');
  }
}
