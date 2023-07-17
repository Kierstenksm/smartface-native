import BlobAndroid from '../../global/blob/blob.android';
import { IImage, AbstractImage, Format, ImageAndroidProps, ImageIOSProps, ImageParams, RenderingMode } from './image';
import AndroidConfig from '../../util/Android/androidconfig';
import FileAndroid from '../../io/file/file.android';
import { MobileOSProps, WithMobileOSProps } from '../../core/native-mobile-component';
import { PathFileType } from '../../io/path/path';

const NativeBitmapFactory = requireClass('android.graphics.BitmapFactory');
const NativeBitmapDrawable = requireClass('android.graphics.drawable.BitmapDrawable');
const NativeBitmap = requireClass('android.graphics.Bitmap');
const NativeMatrix = requireClass('android.graphics.Matrix');
const NativeByteArrayOutputStream = requireClass('java.io.ByteArrayOutputStream');
const SFImage = requireClass('io.smartface.android.sfcore.ui.image.SFImage');
const NativeR = requireClass('android.R');
const NativeContextCompat = requireClass('androidx.core.content.ContextCompat');

const CompressFormat = [NativeBitmap.CompressFormat.JPEG, NativeBitmap.CompressFormat.PNG];
const androidResources = AndroidConfig.activityResources;

export default class ImageAndroid<TNative = any, TProps extends MobileOSProps<ImageIOSProps, ImageAndroidProps> = MobileOSProps<ImageIOSProps, ImageAndroidProps>> extends AbstractImage<
  TNative,
  TProps
> {
  private _systemIcon: IImage['android']['systemIcon'];
  constructor(params?: Partial<ImageParams>) {
    //Should be ImageParams
    super(params as any);
    if (typeof params !== 'object') {
      throw new Error('Constructor parameters needed for Image!');
    }

    if (params.android?.systemIcon) {
      this.android.systemIcon = params.android?.systemIcon;
    }
  }

  protected preConstruct(params?: Partial<Record<string, any>>): void {
    super.preConstruct(params);
    this.addAndroidProps(this.getAndroidProps());
    this.addIOSProps(this.getIOSProps());
  }

  protected createNativeObject(): any {
    return null;
  }

  // Some image types, such as system icon, do not support bitmap.
  // See android.graphics.drawable.NinePatchDrawable
  protected checkCanGetBitmapAndMaybeThrowError() {
    if (typeof this.nativeObject.getBitmap !== "function") {
      throw new Error("This property/method doesn't work with this image!");
    }
  }

  get height(): number {
    this.checkCanGetBitmapAndMaybeThrowError();
    return this.nativeObject.getBitmap().getHeight();
  }

  get width(): number {
    this.checkCanGetBitmapAndMaybeThrowError();
    return this.nativeObject.getBitmap().getWidth();
  }

  toBlob(): BlobAndroid {
    this.checkCanGetBitmapAndMaybeThrowError();
    const bitmap = this.nativeObject.getBitmap();
    const stream = new NativeByteArrayOutputStream();
    bitmap.compress(CompressFormat[1], 100, stream);
    return new BlobAndroid(stream.toByteArray(), {
      type: 'image'
    });
  }

  resize(width: number, height: number, onSuccess?: (e: { image: IImage }) => void, onFailure?: (e?: { message: string }) => void) {
    this.checkCanGetBitmapAndMaybeThrowError();
    let success = true;
    let newBitmap: any;
    try {
      const originalBitmap = this.nativeObject.getBitmap();
      newBitmap = NativeBitmap.createScaledBitmap(originalBitmap, Math.round(width), Math.round(height), false);
    } catch (err) {
      success = false;
      if (onFailure)
        onFailure({
          message: err
        });
      else return null;
    }
    if (success && !!newBitmap) {
      if (onSuccess)
        onSuccess({
          image: new ImageAndroid({
            bitmap: newBitmap
          })
        });
      else
        return new ImageAndroid({
          bitmap: newBitmap
        });
    }
  }

  crop(x: number, y: number, width: number, height: number, onSuccess: (e: { image: IImage }) => void, onFailure: (e?: { message: string }) => void) {
    this.checkCanGetBitmapAndMaybeThrowError();
    let success = true;
    let newBitmap: any;
    try {
      const originalBitmap = this.nativeObject.getBitmap();
      newBitmap = NativeBitmap.createBitmap(originalBitmap, Math.round(x), Math.round(y), Math.round(width), Math.round(height));
    } catch (err) {
      success = false;
      if (onFailure)
        onFailure({
          message: err
        });
      else return null;
    }
    if (success) {
      if (onSuccess)
        onSuccess({
          image: new ImageAndroid({
            bitmap: newBitmap
          })
        });
      else
        return new ImageAndroid({
          bitmap: newBitmap
        });
    }

    return null;
  }

  rotate(angle: number, onSuccess: (e: { image: IImage }) => void, onFailure: (e?: { message: string }) => void) {
    this.checkCanGetBitmapAndMaybeThrowError();
    let success = true;
    let newBitmap: any;
    try {
      const matrix = new NativeMatrix();
      matrix.postRotate(angle);
      const bitmap = this.nativeObject.getBitmap();
      const width = bitmap.getWidth(),
        height = bitmap.getHeight();
      newBitmap = NativeBitmap.createBitmap(bitmap, 0, 0, width, height, matrix, true);
    } catch (err) {
      success = false;
      if (onFailure)
        onFailure({
          message: err
        });
      else return null;
    }
    if (success) {
      if (onSuccess) {
        onSuccess({
          image: new ImageAndroid({
            bitmap: newBitmap
          })
        });
      } else
        return new ImageAndroid({
          bitmap: newBitmap
        });
    }
  }

  compress(format: Format, quality: number, onSuccess: (e: { blob: BlobAndroid }) => void, onFailure: (e?: { message: string }) => void) {
    this.checkCanGetBitmapAndMaybeThrowError();
    let success = true;
    let byteArray;
    try {
      const out = new NativeByteArrayOutputStream();
      const bitmap = this.nativeObject.getBitmap();
      bitmap.compress(CompressFormat[format], Math.round(quality), out);
      byteArray = out.toByteArray();
    } catch (err) {
      success = false;
      if (onFailure)
        onFailure({
          message: err
        });
      else return null;
    }
    if (success) {
      if (onSuccess)
        onSuccess({
          blob: new BlobAndroid(byteArray, {
            type: 'image'
          })
        });
      else
        return new BlobAndroid(byteArray, {
          type: 'image'
        });
    }
  }

  set autoMirrored(isAutoMirrored: boolean) {
    if (typeof isAutoMirrored !== 'boolean') return;
    this.nativeObject.setAutoMirrored(isAutoMirrored);
  }
  get autoMirrored(): any {
    return this.nativeObject.isAutoMirrored();
  }

  set bitmap(value) {
    this.nativeObject = new NativeBitmapDrawable(androidResources, value);
  }

  set path(value) {
    const bitmap = NativeBitmapFactory.decodeFile(value);
    this.nativeObject = new NativeBitmapDrawable(androidResources, bitmap);
  }

  set roundedBitmapDrawable(value) {
    this.nativeObject = value;
  }

  set drawable(value) {
    this.nativeObject = value;
  }

  getAndroidProps() {
    const self = this;
    return {
      round(radius: number) {
        self.checkCanGetBitmapAndMaybeThrowError();
        if (typeof radius !== 'number') throw new Error('radius value must be a number.');

        const roundedBitmapDrawable = ImageAndroid.getRoundedBitmapDrawable(self.nativeObject.getBitmap(), radius);
        return new ImageAndroid({
          roundedBitmapDrawable: roundedBitmapDrawable
        });
      },
      get systemIcon() {
        return self._systemIcon;
      },
      set systemIcon(systemIcon) {
        self._systemIcon = systemIcon;
        self.nativeObject = NativeContextCompat.getDrawable(AndroidConfig.activity, ImageAndroid.systemDrawableId(self._systemIcon));
      }
    };
  }
  getIOSProps() {
    const self = this;
    return {
      resizableImageWithCapInsetsResizingMode: (capinsets, resizingMode) => {
        return self as ImageAndroid;
      },
      imageWithRenderingMode(value) {
        return self as ImageAndroid;
      },
      imageFlippedForRightToLeftLayoutDirection() {
        return self as ImageAndroid;
      },
      get renderingMode() {
        return RenderingMode.AUTOMATIC;
      },
      get flipsForRightToLeftLayoutDirection() {
        return false;
      }
    };
  }
  static createFromFile(path: string, width?: number, height?: number) {
    const imageFile = new FileAndroid({
      path: path
    });
    if (imageFile?.nativeObject) {
      let bitmap;
      if (imageFile.type === PathFileType.DRAWABLE) {
        bitmap = imageFile.nativeObject;
      } else {
        if (width && height) {
          bitmap = ImageAndroid.decodeSampledBitmapFromResource(imageFile.fullPath, Math.round(width), Math.round(height));
        } else {
          bitmap = NativeBitmapFactory.decodeFile(imageFile.fullPath);
        }
      }
      return new ImageAndroid({
        bitmap: bitmap
      });
    }
    return null;
  }
  static createFromBlob(blob: BlobAndroid) {
    const newBitmap = NativeBitmapFactory.decodeByteArray(blob.nativeObject.toByteArray(), 0, blob.size);
    if (newBitmap) {
      return new ImageAndroid({
        bitmap: newBitmap
      });
    }
    return null;
  }
  static android = {
    createRoundedImage(params) {
      if (typeof params.path !== 'string') throw new Error('path value must be a string.');
      if (typeof params.radius !== 'number') throw new Error('radius value must be a number.');

      const imageFile = new FileAndroid({
        path: params.path
      });
      if (imageFile.type === PathFileType.ASSET || imageFile.type === PathFileType.DRAWABLE) {
        const image = ImageAndroid.createFromFile(params.path);
        return image?.android.round?.(params.radius) || null;
      } else {
        const roundedBitmapDrawable = ImageAndroid.getRoundedBitmapDrawable(imageFile.fullPath, params.radius);
        return new ImageAndroid({
          roundedBitmapDrawable: roundedBitmapDrawable
        });
      }
    },
    createSystemIcon(systemIcon: number | string) {
      return new ImageAndroid({
        android: {
          systemIcon
        }
      });
    }
  };

  static createImageFromPath = (path) => {
    if (typeof path === 'string') path = ImageAndroid.createFromFile(path);
    return path;
  };

  static systemDrawableId = (systemIcon) => {
    let resID;
    if (systemIcon.constructor === String) {
      resID = NativeR.drawable['' + systemIcon];
    } else {
      resID = systemIcon;
    }
    return resID;
  };
  private static getRoundedBitmapDrawable(imagePathOrBitmap, radius) {
    return SFImage.getRoundedBitmapDrawable(AndroidConfig.activityResources, imagePathOrBitmap, radius);
  }

  // Code taken from https://developer.android.com/topic/performance/graphics/load-bitmap.html
  private static decodeSampledBitmapFromResource(file, reqWidth, reqHeight) {
    const options = new NativeBitmapFactory.Options();
    options.inJustDecodeBounds = true;
    if (typeof file === 'string') NativeBitmapFactory.decodeFile(file, options);
    // assetsInputStream for reading from assets
    else NativeBitmapFactory.decodeStream(file, null, options);

    options.inSampleSize = ImageAndroid.calculateInSampleSize(options, reqWidth, reqHeight);
    options.inJustDecodeBounds = false;

    if (typeof file === 'string') return NativeBitmapFactory.decodeFile(file, options);
    return NativeBitmapFactory.decodeStream(file, null, options);
  }

  private static calculateInSampleSize(options, reqWidth, reqHeight) {
    // Raw height and width of image
    const height = options.outHeight;
    const width = options.outWidth;
    let inSampleSize = 1;

    if (height > reqHeight || width > reqWidth) {
      const halfHeight = height / 2;
      const halfWidth = width / 2;

      // Calculate the largest inSampleSize value that is a power of 2 and keeps both
      // height and width larger than the requested height and width.
      while (halfHeight / inSampleSize >= reqHeight && halfWidth / inSampleSize >= reqWidth) {
        inSampleSize *= 2;
      }
    }

    return inSampleSize;
  }
  static Format = Format;
}
