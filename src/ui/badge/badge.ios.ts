import { IBadge } from './badge';
import NativeComponent from '../../core/native-component';
import Color from '../color';

const DEFAULT_MOVE_X = 18;

// Uses https://github.com/jkpang/PPBadgeView
export default class BadgeIOS extends NativeComponent implements IBadge {
  private _visible: boolean;
  private _text: string;
  private _backgroundColor: IBadge['backgroundColor'];
  private _borderColor: IBadge['borderColor'];
  private _textColor: IBadge['textColor'];
  private _font: IBadge['font'];
  private _borderWidth: number;
  private _height: number;
  private _isRTL: boolean;
  constructor(params: Partial<IBadge> = {}) {
    super(params);
    if (this.text) {
      this.move(this._isRTL ? 0 : DEFAULT_MOVE_X, 0);
    }
  }
  protected createNativeObject(params: Partial<IBadge> = {}) {
    return params.nativeObject;
  }
  preConstruct(params: Partial<IBadge> = {}) {
    this._text = '';
    this._visible = false;
    this._borderWidth = 0;
    this._height = 0;
    this._backgroundColor = null;
    this._textColor = null;
    const semanticContent = __SF_UIView.viewAppearanceSemanticContentAttribute();
    const UILayoutDirection = __SF_UIApplication.sharedApplication().userInterfaceLayoutDirection;

    const isLTR = semanticContent === 0 ? UILayoutDirection === 0 : semanticContent === 3;
    this._isRTL = !isLTR;
    super.preConstruct(params);
  }

  private completeInMainThread(block: () => void) {
    __SF_Dispatch.mainAsync(block);
  }

  get text(): IBadge['text'] {
    return this._text;
  }
  set text(value: IBadge['text']) {
    this._text = value;

    this.completeInMainThread(() => {
      this.nativeObject.pp_addBadgeWithText(value);
    })
  }
  get visible(): IBadge['visible'] {
    return this._visible;
  }
  set visible(value: IBadge['visible']) {
    this._visible = value;
    this.completeInMainThread(() => {
      if (this._visible) {
        this.nativeObject.pp_showBadge();
      } else {
        this.nativeObject.pp_hiddenBadge();
      }
    });
  }
  get backgroundColor(): IBadge['backgroundColor'] {
    return this._backgroundColor;
  }
  set backgroundColor(value: IBadge['backgroundColor']) {
    if (value instanceof Color) {
      this._backgroundColor = value;

      this.completeInMainThread(() => {
        this.nativeObject.pp_setBadgeBackgroundColor(value.nativeObject);
      })
    }
  }
  get textColor(): IBadge['textColor'] {
    return this._textColor;
  }
  set textColor(value: IBadge['textColor']) {
    if (value instanceof Color) {
      this._textColor = value;

      this.completeInMainThread(() => {
        // this.nativeObject.pp_setBadgeTextColor(value.nativeObject);
        this.nativeObject.badgeLabelTextColor = value.nativeObject
        console.info("badgeLabelTextColor:" ,this.nativeObject.badgeLabelTextColor.toString())

      })
    }
  }
  get font(): IBadge['font'] {
    return this._font;
  }
  set font(value: IBadge['font']) {
    this._font = value;
        
    if (value) {
      this.completeInMainThread(() => {
        this.nativeObject.pp_setBadgeTextFont(value);
      })
    } else {
      throw new Error("Font paramater can not be undefined")
    }
  }

  get height(): number {
    return this._height;
  }
  set height(value: number) {
    this._height = value;

    this.completeInMainThread(() => {
      this.nativeObject.pp_setBadgeHeight(Number(this._height) || 0);
    });
  }
  get borderColor(): IBadge['borderColor'] {
    return this._borderColor;
  }
  set borderColor(value: IBadge['borderColor']) {
    if (value instanceof Color) {
      this._borderColor = value;

      this.completeInMainThread(() => {
        this.nativeObject.pp_setBorderColor(value.nativeObject);
      });
    }
  }
  get borderWidth(): IBadge['borderWidth'] {
    return this._borderWidth;
  }
  set borderWidth(value: IBadge['borderWidth']) {
    this._borderWidth = value;

    this.completeInMainThread(() => {
      this.nativeObject.pp_setBorderWidth(Number(this._borderWidth) || 0);
    });
  }

  get isRTL(): boolean {
    return this._isRTL;
  }
  set isRTL(value: boolean) {
    this._isRTL = value;
    this.completeInMainThread(() => {
      this.nativeObject.pp_setIsRTL(value);
    });
  }
  move(x: number, y: number): void {
    this.completeInMainThread(() => {
      this.nativeObject.pp_moveBadgeWithXY(x, y);
    });
  }
}
