import System from '../../device/system';
import ColorIOS from '../../ui/color';
import ImageIOS from '../../ui/image/image.ios';
import { default as IHeaderBar } from '../headerbar';
import { IHeaderBarItem } from '../headerbaritem/headerbaritem';
import { NativeMobileComponent } from '../../core/native-mobile-component';
import NavigationControllerIOS from './navigationcontroller.ios';
import { IColor } from '../color/color';
import { IFont } from '../font/font';
import { IView } from '../view/view';
import { IFlexLayout } from '../flexlayout/flexlayout';


export class HeaderBar extends NativeMobileComponent<__SF_UINavigationBar, IHeaderBar> implements IHeaderBar {
  appearance?: __SF_UINavigationBarAppearance;
  navigationController?: NavigationControllerIOS;
  leftItemEnabled: boolean;
  titleLayout?: IView;
  title: string;
  layout?: IFlexLayout;
  private _transparent: boolean;
  private _transparentEmptyImage: __SF_UIImage;
  private _titleColor: IColor;
  private _visible: boolean;
  private _backIndicatorImage: ImageIOS;
  private _backIndicatorTransitionMaskImage: ImageIOS;
  private _titleFont?: IFont;
  private _borderVisibility: boolean;
  private _backgroundColor?: IColor

  setItems(items: IHeaderBarItem[]): void { }
  setLeftItem(item: IHeaderBarItem): void { }
  constructor(params: Partial<IHeaderBar> & { navigationController?: NavigationControllerIOS }) {
    super(params);
  }

  removeViewFromHeaderBar(view: Parameters<IHeaderBar['removeViewFromHeaderBar']>['0']): void {
    throw new Error('Method not implemented.');
  }
  addViewToHeaderBar(view: Parameters<IHeaderBar['addViewToHeaderBar']>['0']): void {
    throw new Error('Method not implemented.');
  }
  protected createNativeObject(params) {
    let nativeObject: any;
    if (params.navigationController) {
      nativeObject = params.navigationController.view.nativeObject.navigationBar;
      // Xcode 13.1 background bug fixes [NTVE-398]
      if (parseInt(System.OSVersion) >= 15) {
        this.appearance = new __SF_UINavigationBarAppearance();
        this.appearance.configureWithOpaqueBackground();
        nativeObject.standardAppearance = this.appearance;
        nativeObject.scrollEdgeAppearance = this.appearance;
      }
      this.navigationController = params.navigationController;
    }
    return nativeObject || null;
  }
  preConstruct(params) {
    this._visible = true;
    this._transparent = false;
    super.preConstruct(params);
    this.addIOSProps(this.iosProperties());
  }
  get transparent(): IHeaderBar['transparent'] {
    return this._transparent;
  }
  set transparent(value: IHeaderBar['transparent']) {
    if (value) {
      if (!this.nativeObject.backgroundImage) {
        const _transparentEmptyImage = __SF_UIImage.getInstance();
        this.nativeObject.backgroundImage = _transparentEmptyImage;
      }
      this.nativeObject.shadowImage = __SF_UIImage.getInstance();
      this.nativeObject.translucent = true;
      this.backgroundColor = ColorIOS.TRANSPARENT
      this._borderVisibility = false;
    } else {
      if (this.nativeObject.backgroundImage === this._transparentEmptyImage) {
        this.nativeObject.backgroundImage = undefined;
      }
      this.nativeObject.shadowImage = undefined;
      this.nativeObject.translucent = this._backgroundColor?.alpha() === 0;
      this._borderVisibility = true;
    }
    this._transparent = value;
  }
  get alpha(): IHeaderBar['alpha'] {
    return this.nativeObject.alpha;
  }
  set alpha(value: IHeaderBar['alpha']) {
    if (typeof value === 'number') {
      SF.dispatch_async(SF.dispatch_get_main_queue(), () => {
        this.nativeObject.alpha = value;
      });
    }
  }
  get titleColor(): IHeaderBar['titleColor'] {
    return this._titleColor;
  }
  set titleColor(value: IHeaderBar['titleColor']) {
    this._titleColor = value;
    this.__updateTitleTextAttributes();
  }
  get visible(): IHeaderBar['visible'] {
    return this._visible;
  }
  set visible(value: IHeaderBar['visible']) {
    this._visible = value;
    this.navigationController?.nativeObject.setNavigationBarHiddenAnimated(!value, true);
  }
  get itemColor(): IHeaderBar['itemColor'] {
    return new ColorIOS({
      color: this.nativeObject.tintColor
    });
  }
  set itemColor(value: IHeaderBar['itemColor']) {
    this.nativeObject.tintColor = value.nativeObject;
  }
  get backgroundColor(): IHeaderBar['backgroundColor'] {
    return new ColorIOS({
      color: this._backgroundColor?.nativeObject ?? this.nativeObject.barTintColor
    });
  }
  set backgroundColor(value: IHeaderBar['backgroundColor']) {
    if (this.transparent) { return }

    this._backgroundColor = value;

    if (value instanceof ColorIOS) {
      // Xcode 13.1 background bug fixes [NTVE-398]
      if (parseInt(System.OSVersion) >= 15) {
        if (this.appearance) {
          this.appearance.backgroundColor = value.nativeObject;
        }
        this.nativeObject.standardAppearance = this.appearance;
        this.nativeObject.scrollEdgeAppearance = this.appearance;
      } else {
        if (this.transparent) {
          this.nativeObject.backgroundColor = value.nativeObject;
        } else {
          this.nativeObject.barTintColor = value.nativeObject;
        }
      }
    }
  }
  get backgroundImage(): IHeaderBar['backgroundImage'] {
    return ImageIOS.createFromImage(this.nativeObject.backgroundImage);
  }
  set backgroundImage(value: IHeaderBar['backgroundImage']) {
    const backgroundImageValue = value instanceof ImageIOS ? value : ImageIOS.createFromFile(value as string);
    if (parseInt(System.OSVersion) >= 15) {
      if (this.appearance && backgroundImageValue) {
        this.appearance.backgroundImage = backgroundImageValue.nativeObject;
       }else if(this.appearance && this.appearance.backgroundImage){
        this.appearance.backgroundImage = undefined;
      }
      this.nativeObject.standardAppearance = this.appearance;
      this.nativeObject.scrollEdgeAppearance = this.appearance;
    } else {
      if (backgroundImageValue) {
        this.nativeObject.backgroundImage = backgroundImageValue.nativeObject;
      }
    }
  }
  get height(): IHeaderBar['height'] {
    return this.nativeObject.frame.height;
  }
  get borderVisibility(): IHeaderBar['borderVisibility'] {
    return this._borderVisibility;
  }
  set borderVisibility(value: IHeaderBar['borderVisibility']) {
    this._borderVisibility = value;

    if (parseInt(System.OSVersion) >= 15) {
      if (this.appearance) {
        this.appearance.shadowColor = value ? ColorIOS.GRAY.nativeObject : ColorIOS.TRANSPARENT.nativeObject;
      }
      this.nativeObject.standardAppearance = this.appearance;
      this.nativeObject.scrollEdgeAppearance = this.appearance;
    } else {
      this.nativeObject.shadowImage = value ? undefined : __SF_UIImage.getInstance();
    }
  }
  private __updateTitleTextAttributes() {
    // Xcode 13.1 background bug fixes [NTVE-398] 
    if (parseInt(System.OSVersion) >= 15) {
      if (this.appearance) {
        this.appearance.titleTextAttributes = {
          NSColor: this._titleColor.nativeObject,
          NSFont: this._titleFont as __SF_UIFont
        };
      }

      this.nativeObject.standardAppearance = this.appearance;
      this.nativeObject.scrollEdgeAppearance = this.appearance;
    } else {
      this.nativeObject.titleTextAttributes = {
        NSColor: this._titleColor.nativeObject,
        NSFont: this._titleFont as any
      };
    }
  }
  private iosProperties() {
    const self = this;
    return {
      get translucent(): IHeaderBar['ios']['translucent'] {
        return self.nativeObject.translucent;
      },
      set translucent(value: IHeaderBar['ios']['translucent']) {
        // Apple unhandle headerbar background color transparency by background color or transparent properties
        // So we force translucent to true if the background color assigned as transparent
        if (self._backgroundColor?.alpha() === 0 && parseInt(System.OSVersion) >= 15) {
          self.nativeObject.translucent = true;
        } else {
          self.nativeObject.translucent = value;
        }
      },
      get titleFont(): IHeaderBar['ios']['titleFont'] {
        return self._titleFont;
      },
      set titleFont(value: IHeaderBar['ios']['titleFont']) {
        self._titleFont = value;
        self.__updateTitleTextAttributes();
      },
      get prefersLargeTitles(): IHeaderBar['ios']['prefersLargeTitles'] {
        return self.nativeObject.prefersLargeTitles;
      },
      set prefersLargeTitles(value: IHeaderBar['ios']['prefersLargeTitles']) {
        self.nativeObject.prefersLargeTitles = value;
      },
      get backIndicatorImage(): IHeaderBar['ios']['backIndicatorImage'] {
        return self._backIndicatorImage;
      },
      set backIndicatorImage(value: IHeaderBar['ios']['backIndicatorImage']) {
        if (value instanceof ImageIOS) {
          self._backIndicatorImage = value;
          self.nativeObject.backIndicatorImage = self._backIndicatorImage.nativeObject;

          // General use
          self.ios.backIndicatorTransitionMaskImage = value;
        }
      },
      get backIndicatorTransitionMaskImage(): IHeaderBar['ios']['backIndicatorTransitionMaskImage'] {
        return self._backIndicatorTransitionMaskImage;
      },
      set backIndicatorTransitionMaskImage(value: IHeaderBar['ios']['backIndicatorTransitionMaskImage']) {
        if (value instanceof ImageIOS) {
          self._backIndicatorTransitionMaskImage = value;
          self.nativeObject.backIndicatorTransitionMaskImage = self._backIndicatorTransitionMaskImage.nativeObject;
        }
      },
      setVisible(visible: boolean, animated?: boolean) {
        if (typeof visible === 'boolean') {
          self._visible = visible;
          const _animated = !!animated;
          self.navigationController?.nativeObject.setNavigationBarHiddenAnimated(!self._visible, _animated);
        }
      }
    };
  }
}
