import { GifImageViewEvents } from './gifimageview-events';
import ImageViewIOS from '../imageview/imageview.ios';
import { IGifImageView } from './gifimageview';
import ImageiOS from '../image/image.ios';
import { IFile } from '../../io/file/file';
import GifImageIOS from '../gifimage/gifimage.ios';
import { IGifImage } from '../gifimage/gifimage';
import ImageCacheType from '../shared/imagecachetype';
import { IImage } from '../image/image';

export default class GifImageViewIOS<TEvent extends string = GifImageViewEvents> extends ImageViewIOS<TEvent | GifImageViewEvents> implements IGifImageView {
  private _gifimage: IGifImage;
  private _loopCompletionCallback: (loopCountRemain: number) => void;
  private _isAnimating: boolean;
  constructor(params?: IGifImageView) {
    super(params);
  }

  createNativeObject(): any {
    return new __SF_FLAnimatedImageView();
  }
  protected preConstruct(params?: Partial<Record<string, any>>): void {
    this._isAnimating = false;
    super.preConstruct(params);
  }
  get gifImage(): IGifImage {
    return this._gifimage;
  }
  set gifImage(value: IGifImage) {
    this._gifimage = value;
    this.nativeObject.animatedImage = value.nativeObject;
    this._isAnimating = true;
  }

  get currentFrame(): IImage {
    // TODO Recheck again after build
    return ImageiOS.createFromImage(this.nativeObject.currentFrame);
  }

  get currentFrameIndex(): number {
    return this.nativeObject.currentFrameIndex;
  }

  get isAnimating(): boolean {
    return this._isAnimating;
  }

  startAnimating(): void {
    this.nativeObject.startAnimating();
    this._isAnimating = true;
  }

  stopAnimating(): void {
    this.nativeObject.stopAnimating();
    this._isAnimating = false;
  }

  get loopCompletionCallback(): (loopCountRemain: number) => void {
    return this._loopCompletionCallback;
  }
  set loopCompletionCallback(value: (loopCountRemain: number) => void) {
    this._loopCompletionCallback = value;
    this.nativeObject.setLoopCompletionBlockWithJSValue(this.loopCompletionCallback);
  }

  loadFromFile(params: { file: IFile; fade?: boolean | undefined; width?: number | undefined; height?: number | undefined; android?: { useMemoryCache?: boolean | undefined } | undefined }): void {
    if (!params?.file) {
      return;
    }
    const file = params.file;
    const filePath = file.nativeObject.getActualPath();
    const gifImage = GifImageIOS.createFromFile(filePath);
    this.gifImage = gifImage;
  }

  loadFromUrl(params: {
    url: string;
    headers?: { [name: string]: string };
    placeholder?: ImageiOS;
    fade?: boolean;
    useHTTPCacheControl?: boolean;
    onSuccess?: () => void;
    onFailure?: () => void;
    android?: { useDiskCache?: boolean; useMemoryCache?: boolean };
    ios?: { isRefreshCached?: boolean };
    cache?: ImageCacheType;
  }): void {
    this.nativeObject.loadURLCallback(params.url, (image) => {
      if (image) {  
        const gifAnimatedImage = __SF_FLAnimatedImage.animatedImageWithGIFData(image);
        this.gifImage = new GifImageIOS({ nativeObject: gifAnimatedImage });
        params.onSuccess?.();
      } else {
        params.onFailure?.()
      }
    })
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
    this.nativeObject.fetchFromURLCallback(params.url, (image) => {
      if (image) {
        params.onSuccess?.(ImageiOS.createFromImage(image), 1);
      } else {
        params.onFailure?.()
      }
    })
  }
}
