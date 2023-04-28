import { SvgImageViewEvents } from './svgimageview-events';
import { ISvgImageView } from './svgimageview';
import SvgImageIOS from '../svgimage/svgimage.ios';
import ImageViewIOS, { SDWebImageOptions } from '../imageview/imageview.ios';
import { WithMobileOSProps } from '../../core/native-mobile-component';
import { ImageParams, ImageIOSProps, ImageAndroidProps } from '../image/image';
import ImageIOS from '../image/image.ios';
import ImageCacheType from '../shared/imagecachetype';
import File from '../../io/file';

export default class SvgImageViewIOS<TEvent extends string = SvgImageViewEvents> extends ImageViewIOS<TEvent | SvgImageViewEvents> implements ISvgImageView {
  constructor(params?: ISvgImageView) {
    super(params);
  }

  protected createNativeObject() {
    return new __SF_SVGImageView()
  }

  get svgImage(): SvgImageIOS {
    return this.nativeObject.svgImage
  }
  set svgImage(value: SvgImageIOS) {
    this.nativeObject.svgImage = value.nativeObject;
  }

  loadFromUrl(params: { url: string; headers?: { [name: string]: string; } | undefined; placeholder?: ImageIOS<__SF_UIImage, WithMobileOSProps<Partial<ImageParams>, ImageIOSProps, ImageAndroidProps>> | undefined; fade?: boolean | undefined; useHTTPCacheControl?: boolean | undefined; onSuccess?: (() => void) | undefined; onFailure?: (() => void) | undefined; android?: { useDiskCache?: boolean | undefined; useMemoryCache?: boolean | undefined; } | undefined; ios?: { isRefreshCached?: boolean | undefined; } | undefined; cache?: ImageCacheType | undefined; }): void {
    if (typeof params.url !== 'string') {
      throw new Error('url must be a string');
    }
    const options = params.ios?.isRefreshCached ? SDWebImageOptions.SDWebImageRefreshCached : params.useHTTPCacheControl ? SDWebImageOptions.SDWebImageRefreshCached : undefined;
    const fade = typeof params.fade === 'boolean' ? params.fade : true;

    this.nativeObject.loadFromURL(
      __SF_NSURL.URLWithString(params.url),
      params.placeholder ? params.placeholder.nativeObject : undefined,
      params.headers,
      options || undefined,
      (image, error, cache, url) => {
        if (!error) {
          if (cache === ImageCacheType.NONE && fade) {
            const alpha = this.nativeObject.alpha;
            this.nativeObject.alpha = 0;
            __SF_UIView.animation(
              0.3,
              0,
              () => {
                this.nativeObject.alpha = alpha;
              },
              () => { }
            );
          }

          __SF_Dispatch.mainAsync(() => {
            params.onSuccess?.();
          });
        } else {
          __SF_Dispatch.mainAsync(() => {
            params.onFailure?.();
          });
        }
      }
    );
  }

  loadFromFile(params: { file: File; fade?: boolean | undefined; width?: number | undefined; height?: number | undefined; android?: { useMemoryCache?: boolean | undefined; } | undefined; }): void {
    if (!params.file) {
      throw new Error("File is not specified");
    }

    const file = params.file;
    const filePath = file.nativeObject.getActualPath();
    this.nativeObject.loadFromFile(filePath, (image) => {
      if (params.fade && image) {
        this.nativeObject.image = image;
        const alpha = this.nativeObject.alpha;
        this.nativeObject.alpha = 0;
        __SF_UIView.animation(
          0.3,
          0,
          () => {
            this.nativeObject.alpha = alpha;
          },
          () => { }
        );
      } else {
        if (image) {
          this.nativeObject.image = image;
        }
      }
    })
  }
}
