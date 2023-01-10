import { IImageView, ImageFillType } from './imageview';
import File from '../../io/file';
import Color from '../color';
import ImageIOS from '../image/image.ios';
import ImageCacheType from '../shared/imagecachetype';
import ViewIOS from '../view/view.ios';
import { ImageViewEvents } from './imageview-events';
import { IImage } from '../image/image';

export const NativeFillTypeProps = {
  [ImageFillType.STRETCH]: 0,
  [ImageFillType.ASPECTFIT]: 1,
  [ImageFillType.ASPECTFILL]: 2,
  [ImageFillType.NORMAL]: 4
};

enum SDWebImageOptions {
    /**
     * By default, when a URL fail to be downloaded, the URL is blacklisted so the library won't keep trying.
     * This flag disable this blacklisting.
     */
     SDWebImageRetryFailed = 1 << 0,
    
     /**
      * By default, image downloads are started during UI interactions, this flags disable this feature,
      * leading to delayed download on UIScrollView deceleration for instance.
      */
     SDWebImageLowPriority = 1 << 1,
     
     /**
      * This flag enables progressive download, the image is displayed progressively during download as a browser would do.
      * By default, the image is only displayed once completely downloaded.
      */
     SDWebImageProgressiveLoad = 1 << 2,
     
     /**
      * Even if the image is cached, respect the HTTP response cache control, and refresh the image from remote location if needed.
      * The disk caching will be handled by NSURLCache instead of SDWebImage leading to slight performance degradation.
      * This option helps deal with images changing behind the same request URL, e.g. Facebook graph api profile pics.
      * If a cached image is refreshed, the completion block is called once with the cached image and again with the final image.
      *
      * Use this flag only if you can't make your URLs static with embedded cache busting parameter.
      */
     SDWebImageRefreshCached = 1 << 3,
     
     /**
      * In iOS 4+, continue the download of the image if the app goes to background. This is achieved by asking the system for
      * extra time in background to let the request finish. If the background task expires the operation will be cancelled.
      */
     SDWebImageContinueInBackground = 1 << 4,
     
     /**
      * Handles cookies stored in NSHTTPCookieStore by setting
      * NSMutableURLRequest.HTTPShouldHandleCookies = YES;
      */
     SDWebImageHandleCookies = 1 << 5,
     
     /**
      * Enable to allow untrusted SSL certificates.
      * Useful for testing purposes. Use with caution in production.
      */
     SDWebImageAllowInvalidSSLCertificates = 1 << 6,
     
     /**
      * By default, images are loaded in the order in which they were queued. This flag moves them to
      * the front of the queue.
      */
     SDWebImageHighPriority = 1 << 7,
     
     /**
      * By default, placeholder images are loaded while the image is loading. This flag will delay the loading
      * of the placeholder image until after the image has finished loading.
      * @note This is used to treate placeholder as an **Error Placeholder** but not **Loading Placeholder** by defaults. if the image loading is cancelled or error, the placeholder will be always set.
      * @note Therefore, if you want both **Error Placeholder** and **Loading Placeholder** exist, use `SDWebImageAvoidAutoSetImage` to manually set the two placeholders and final loaded image by your hand depends on loading result.
      */
     SDWebImageDelayPlaceholder = 1 << 8,
     
     /**
      * We usually don't apply transform on animated images as most transformers could not manage animated images.
      * Use this flag to transform them anyway.
      */
     SDWebImageTransformAnimatedImage = 1 << 9,
     
     /**
      * By default, image is added to the imageView after download. But in some cases, we want to
      * have the hand before setting the image (apply a filter or add it with cross-fade animation for instance)
      * Use this flag if you want to manually set the image in the completion when success
      */
     SDWebImageAvoidAutoSetImage = 1 << 10,
     
     /**
      * By default, images are decoded respecting their original size.
      * This flag will scale down the images to a size compatible with the constrained memory of devices.
      * To control the limit memory bytes, check `SDImageCoderHelper.defaultScaleDownLimitBytes` (Defaults to 60MB on iOS)
      * This will actually translate to use context option `.imageThumbnailPixelSize` from v5.5.0 (Defaults to (3966, 3966) on iOS). Previously does not.
      * This flags effect the progressive and animated images as well from v5.5.0. Previously does not.
      * @note If you need detail controls, it's better to use context option `imageThumbnailPixelSize` and `imagePreserveAspectRatio` instead.
      */
     SDWebImageScaleDownLargeImages = 1 << 11,
     
     /**
      * By default, we do not query image data when the image is already cached in memory. This mask can force to query image data at the same time. However, this query is asynchronously unless you specify `SDWebImageQueryMemoryDataSync`
      */
     SDWebImageQueryMemoryData = 1 << 12,
     
     /**
      * By default, when you only specify `SDWebImageQueryMemoryData`, we query the memory image data asynchronously. Combined this mask as well to query the memory image data synchronously.
      * @note Query data synchronously is not recommend, unless you want to ensure the image is loaded in the same runloop to avoid flashing during cell reusing.
      */
     SDWebImageQueryMemoryDataSync = 1 << 13,
     
     /**
      * By default, when the memory cache miss, we query the disk cache asynchronously. This mask can force to query disk cache (when memory cache miss) synchronously.
      * @note These 3 query options can be combined together. For the full list about these masks combination, see wiki page.
      * @note Query data synchronously is not recommend, unless you want to ensure the image is loaded in the same runloop to avoid flashing during cell reusing.
      */
     SDWebImageQueryDiskDataSync = 1 << 14,
     
     /**
      * By default, when the cache missed, the image is load from the loader. This flag can prevent this to load from cache only.
      */
     SDWebImageFromCacheOnly = 1 << 15,
     
     /**
      * By default, we query the cache before the image is load from the loader. This flag can prevent this to load from loader only.
      */
     SDWebImageFromLoaderOnly = 1 << 16,
     
     /**
      * By default, when you use `SDWebImageTransition` to do some view transition after the image load finished, this transition is only applied for image when the callback from manager is asynchronous (from network, or disk cache query)
      * This mask can force to apply view transition for any cases, like memory cache query, or sync disk cache query.
      */
     SDWebImageForceTransition = 1 << 17,
     
     /**
      * By default, we will decode the image in the background during cache query and download from the network. This can help to improve performance because when rendering image on the screen, it need to be firstly decoded. But this happen on the main queue by Core Animation.
      * However, this process may increase the memory usage as well. If you are experiencing a issue due to excessive memory consumption, This flag can prevent decode the image.
      */
     SDWebImageAvoidDecodeImage = 1 << 18,
     
     /**
      * By default, we decode the animated image. This flag can force decode the first frame only and produce the static image.
      */
     SDWebImageDecodeFirstFrameOnly = 1 << 19,
     
     /**
      * By default, for `SDAnimatedImage`, we decode the animated image frame during rendering to reduce memory usage. However, you can specify to preload all frames into memory to reduce CPU usage when the animated image is shared by lots of imageViews.
      * This will actually trigger `preloadAllAnimatedImageFrames` in the background queue(Disk Cache & Download only).
      */
     SDWebImagePreloadAllFrames = 1 << 20,
     
     /**
      * By default, when you use `SDWebImageContextAnimatedImageClass` context option (like using `SDAnimatedImageView` which designed to use `SDAnimatedImage`), we may still use `UIImage` when the memory cache hit, or image decoder is not available to produce one exactlly matching your custom class as a fallback solution.
      * Using this option, can ensure we always callback image with your provided class. If failed to produce one, a error with code `SDWebImageErrorBadImageData` will been used.
      * Note this options is not compatible with `SDWebImageDecodeFirstFrameOnly`, which always produce a UIImage/NSImage.
      */
     SDWebImageMatchAnimatedImageClass = 1 << 21,
     
     /**
      * By default, when we load the image from network, the image will be written to the cache (memory and disk, controlled by your `storeCacheType` context option)
      * This maybe an asynchronously operation and the final `SDInternalCompletionBlock` callback does not guarantee the disk cache written is finished and may cause logic error. (For example, you modify the disk data just in completion block, however, the disk cache is not ready)
      * If you need to process with the disk cache in the completion block, you should use this option to ensure the disk cache already been written when callback.
      * Note if you use this when using the custom cache serializer, or using the transformer, we will also wait until the output image data written is finished.
      */
     SDWebImageWaitStoreCache = 1 << 22,
     
     /**
      * We usually don't apply transform on vector images, because vector images supports dynamically changing to any size, rasterize to a fixed size will loss details. To modify vector images, you can process the vector data at runtime (such as modifying PDF tag / SVG element).
      * Use this flag to transform them anyway.
      */
     SDWebImageTransformVectorImage = 1 << 23
}

export default class ImageViewIOS<TEvent extends string = ImageViewEvents> extends ViewIOS<TEvent | ImageViewEvents, __SF_UIImageView, IImageView> implements IImageView {
  private _imageTemplate: ImageIOS | undefined;
  private _isSetTintColor: boolean;
  protected createNativeObject() {
    return new __SF_UIImageView();
  }
  constructor(params?: IImageView) {
    super(params);
    if (__SF_UIView.viewAppearanceSemanticContentAttribute() === 3) {
      this.nativeObject.setValueForKey(3, 'semanticContentAttribute');
    } else if (__SF_UIView.viewAppearanceSemanticContentAttribute() === 4) {
      this.nativeObject.setValueForKey(4, 'semanticContentAttribute');
    }
  }
  protected preConstruct(params?: Partial<Record<string, any>>): void {
    this.touchEnabled = true;
    this.imageFillType = ImageFillType.NORMAL;
    super.preConstruct(params);
  }

  get image(): ImageIOS | null {
    return this.nativeObject.image ? ImageIOS.createFromImage(this.nativeObject.image) : null;
  }

  set image(value: ImageIOS | string | null) {
    this._imageTemplate = undefined;
    if (!value) {
      this.nativeObject.loadImage(undefined);
      return;
    }
    const image = value instanceof ImageIOS ? value : ImageIOS.createFromFile(value);
    if (!image) {
      this.nativeObject.loadImage(undefined);
      return;
    }

    // TODO Recheck after build
    image.nativeObject = this._isSetTintColor ? image.nativeObject.imageWithRenderingMode(2) : image.nativeObject;
    if (this._isSetTintColor) {
      this._imageTemplate = image.nativeObject;
    }
    this.nativeObject.loadImage(image.nativeObject);
  }

  get tintColor(): Color {
    return new Color({
      color: this.nativeObject.tintColor
    });
  }
  set tintColor(value: Color) {
    if (this.nativeObject?.image) {
      if (!this._imageTemplate) {
        this._imageTemplate = this.nativeObject.image.imageWithRenderingMode(2);
      }
      this.nativeObject.image = this._imageTemplate;
    }

    this._isSetTintColor = true;
    this.nativeObject.tintColor = value.nativeObject;
  }

  get imageFillType(): ImageFillType {
    return this.nativeObject.contentMode;
  }
  set imageFillType(value: ImageFillType) {
    this.nativeObject.contentMode = NativeFillTypeProps[value] ?? value;
  }

  loadFromUrl(params: {
    url: string;
    headers?: { [name: string]: string };
    placeholder?: ImageIOS;
    fade?: boolean;
    useHTTPCacheControl?: boolean;
    onSuccess?: () => void;
    onFailure?: () => void;
    android?: { useDiskCache?: boolean; useMemoryCache?: boolean };
    ios?: { isRefreshCached?: boolean };
    cache?: ImageCacheType;
  }): void {
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
              () => {}
            );
          }

          __SF_Dispatch.mainAsync((innerIndex) => {
            /**
             * This is put here because it was overriding tintColor of the existing image.
             * We want the tintColor to be the same.
             */
            this.image = ImageIOS.createFromImage(image);
            params.onSuccess?.();
          });
        } else {
          __SF_Dispatch.mainAsync((innerIndex) => {
            params.onFailure?.();
          });
        }
      }
    );
  }

  loadFromFile(params: { file: File; fade?: boolean; width?: number; height?: number; android?: { useMemoryCache?: boolean } }): void {
    if (params.file) {
      const file = params.file;
      const filePath = file.nativeObject.getActualPath();
      const image = ImageIOS.createFromFile(filePath);
      const fade = typeof params.fade === 'boolean' ? params.fade : true;

      if (fade && image) {
        this.image = image;
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
          this.image = image;
        }
      }
    }
  }

  fetchFromUrl(params: {
    url: string;
    headers?: { [name: string]: string };
    placeholder?: IImage;
    useHTTPCacheControl?: boolean;
    onSuccess?: (image: IImage | null, cache: ImageCacheType) => void;
    onFailure?: () => void;
    android?: { useDiskCache?: boolean; useMemoryCache?: boolean };
    ios?: { isRefreshCached?: boolean };
    image: any;
    cache: ImageCacheType;
  }): void {
    let options = SDWebImageOptions.SDWebImageAvoidAutoSetImage;
    params.ios && params.ios.isRefreshCached && (options = options | SDWebImageOptions.SDWebImageRefreshCached); // Deprecated: Use useHTTPCacheControl option.
    params.useHTTPCacheControl && (options = options | SDWebImageOptions.SDWebImageRefreshCached);

    const headers = params.headers || {};
    this.nativeObject.loadFromURL(__SF_NSURL.URLWithString(params.url), params.placeholder?.nativeObject || undefined, headers, options || undefined, (image, error, cache, url) => {
      if (!error) {
        __SF_Dispatch.mainAsync((innerIndex) => {
          // TODO Recheck after build
          params.onSuccess?.(ImageIOS.createFromImage(image), cache);
        });
      } else {
        if (typeof params.onFailure === 'function') {
          __SF_Dispatch.mainAsync((innerIndex) => {
            params.onFailure?.();
          });
        }
      }
    }); //onFailure COR-1817
  }
  static FillType = ImageFillType;
}
