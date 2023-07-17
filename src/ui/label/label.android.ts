import TextAlignment from '../shared/textalignment';
import ViewAndroid from '../view/view.android';
import { ILabel, LabelAndroidProps } from './label';
import { IColor } from '../color/color';
import { IFont } from '../font/font';
import { ViewEvents } from '../view/view-events';
import { IViewState } from '../shared/viewState';
import EllipsizeMode from '../shared/ellipsizemode';
import AndroidUnitConverter from '../../util/Android/unitconverter';
import TextDirection from '../shared/textdirection';
import AndroidConfig from '../../util/Android/androidconfig';
import TypeValue from '../../util/Android/typevalue';
import isViewState from '../../util/isViewState';
import ColorAndroid from '../color';
import FontAndroid from '../font/font.android';

const NativeTextView = requireClass('androidx.appcompat.widget.AppCompatTextView');
const NativeTextViewCompat = requireClass('androidx.core.widget.TextViewCompat');
const NativeColorStateList = requireClass('android.content.res.ColorStateList');
const NativeTextUtils = requireClass('android.text.TextUtils');

const TextAlignmentDic = {
  [TextAlignment.MIDLEFT]: 16 | 3, // Gravity.CENTER_VERTICAL | Gravity.LEFT
  [TextAlignment.MIDCENTER]: 17, // Gravity.CENTER
  [TextAlignment.MIDRIGHT]: 16 | 5 // Gravity.CENTER_VERTICAL | Gravity.RIGHT
};

const NativeEllipsizeMode = {
  [EllipsizeMode.START]: NativeTextUtils.TruncateAt.START,
  [EllipsizeMode.MIDDLE]: NativeTextUtils.TruncateAt.MIDDLE,
  [EllipsizeMode.END]: NativeTextUtils.TruncateAt.END,
  [EllipsizeMode.NONE]: null
};

const MAX_INT_VALUE = 2147483647;
const AUTO_SIZE_TEXT_TYPE_NONE = 0;
const MINIMUM_FONT_SIZE = 7;
const DEFAULT_MAX_LINES = 1;

export default class LabelAndroid<TEvent extends string = ViewEvents, TNative = LabelAndroidProps, TProps extends ILabel = ILabel>
  extends ViewAndroid<TEvent, TNative, TProps>
  implements ILabel<TEvent, TProps>
{
  private _ellipsizeMode: ILabel['ellipsizeMode'];
  protected _textAlignment: TextAlignment;
  protected viewNativeDefaultTextAlignment: number;
  private skipDefaults: boolean;
  private _adjustFontSizeToFit: boolean;
  private _minimumFontSize: number;
  private _textDirection: TextDirection;
  private _adjustableFontSizeStep: number;
  private fontInitial: IFont | null;
  protected _textColor: ILabel['textColor'];
  private _paddingRight: ILabel['paddingRight'];
  private _paddingLeft: ILabel['paddingLeft'];
  private _paddingTop: ILabel['paddingBottom'];
  private _paddingBottom: ILabel['paddingTop'];
  private _padding: number;
  constructor(params: Partial<TProps>) {
    super(params);
  }
  protected preConstruct(params?: Partial<TProps>): void {
    this._adjustFontSizeToFit = false;
    this._minimumFontSize = MINIMUM_FONT_SIZE;
    this._adjustableFontSizeStep = 1;
    this.fontInitial = null;
    this._textColor = ColorAndroid.BLUE;
    this.viewNativeDefaultTextAlignment = TextAlignmentDic[TextAlignment.MIDLEFT];
    this.textAlignment = TextAlignment.MIDLEFT;
    this.maxLines = this.getDefaultMaxLine();
    super.preConstruct(params);
    this.initAndroidProps();
  }

  protected createNativeObject() {
    return new NativeTextView(AndroidConfig.activity);
  }

  toString() {
    return 'Label';
  }

  private initAndroidProps() {
    const self = this;
    this.addAndroidProps({
      get textDirection(): TextDirection {
        return self._textDirection;
      },
      set textDirection(value: TextDirection) {
        self._textDirection = value;
        self.nativeObject.setTextDirection(value);
      },
      get adjustableFontSizeStep(): LabelAndroid['_adjustableFontSizeStep'] {
        return self._adjustableFontSizeStep;
      },
      set adjustableFontSizeStep(value: LabelAndroid['_adjustableFontSizeStep']) {
        self._adjustableFontSizeStep = value;
        if (value) {
          self.setAutoSizeTextTypeUniformWithConfiguration();
        }
      },
      get includeFontPadding(): boolean {
        return self.nativeObject.getIncludeFontPadding();
      },
      set includeFontPadding(value: boolean) {
        self.nativeObject.setIncludeFontPadding(value);
      }
    });
  }

  private setAutoSizeTextTypeUniformWithConfiguration() {
    const maximumTextSize = AndroidUnitConverter.pixelToDp(this.nativeObject.getTextSize());
    if (maximumTextSize <= this.minimumFontSize) {
      throw new Error(`Maximum auto-size text size (${maximumTextSize}) is less or equal to minimum auto-size text size (${this.minimumFontSize})`);
    }
    NativeTextViewCompat.setAutoSizeTextTypeUniformWithConfiguration(this.nativeObject, this.minimumFontSize, maximumTextSize, this.android.adjustableFontSizeStep, TypeValue.COMPLEX_UNIT_DIP);
  }

  private createColorStateList(textColors: IViewState<IColor>) {
    const colorsSets: IColor[] = [];
    const statesSet: any[] = [];
    if (textColors.normal) {
      statesSet.push(ViewAndroid.State.STATE_NORMAL);
      colorsSets.push(textColors.normal.nativeObject);
    }
    if (textColors.disabled) {
      statesSet.push(ViewAndroid.State.STATE_DISABLED);
      colorsSets.push(textColors.disabled.nativeObject);
    }
    if (textColors.selected) {
      statesSet.push(ViewAndroid.State.STATE_SELECTED);
      colorsSets.push(textColors.selected.nativeObject);
    }
    if (textColors.pressed) {
      statesSet.push(ViewAndroid.State.STATE_PRESSED);
      colorsSets.push(textColors.pressed.nativeObject);
    }
    if (textColors.focused) {
      statesSet.push(ViewAndroid.State.STATE_FOCUSED);
      colorsSets.push(textColors.focused.nativeObject);
    }
    return new NativeColorStateList(array(statesSet), array(colorsSets, 'int'));
  }

  get font() {
    const nativeTypeface = this.nativeObject.getTypeface();
    const textSize = AndroidUnitConverter.pixelToDp(this.nativeObject.getTextSize());
    return new FontAndroid({
      nativeObject: nativeTypeface,
      size: textSize
    });
  }
  set font(value: ILabel['font']) {
    this.updateFont(value);
  }
  get maxLines(): ILabel['maxLines'] {
    const mMaxLines = this.nativeObject.getMaxLines();
    return mMaxLines === MAX_INT_VALUE ? 0 : mMaxLines;
  }
  set maxLines(value: ILabel['maxLines']) {
    const valueInt = isNaN(value) || value === null ? DEFAULT_MAX_LINES : value;
    if(this.yogaNode) {
      this.dirty();
    }
    this.nativeObject.setMaxLines(valueInt === 0 ? MAX_INT_VALUE : valueInt);
  }
  get ellipsizeMode(): ILabel['ellipsizeMode'] {
    return this._ellipsizeMode;
  }
  set ellipsizeMode(value: ILabel['ellipsizeMode']) {
    this._ellipsizeMode = value;
    this.nativeObject.setEllipsize(NativeEllipsizeMode[value]);
  }
  get text(): ILabel['text'] {
    return this.nativeObject.getText().toString();
  }
  set text(value: ILabel['text']) {
    this.updateText(value);
  }
  get textAlignment(): ILabel['textAlignment'] {
    return this._textAlignment;
  }
  set textAlignment(value: ILabel['textAlignment']) {
    this._textAlignment = value;
    this.nativeObject.setGravity(TextAlignmentDic[this._textAlignment]);
  }
  get textColor(): ILabel['textColor'] {
    return this._textColor;
  }
  set textColor(value: ILabel['textColor']) {
    if (value instanceof ColorAndroid && value.nativeObject) {
      this._textColor = value;
      this.nativeObject.setTextColor(value.nativeObject);
    } else if (isViewState(value)) {
      this._textColor = value;
      const textColorStateListDrawable = this.createColorStateList(value);
      this.nativeObject.setTextColor(textColorStateListDrawable);
    }
  }
  get adjustFontSizeToFit(): ILabel['adjustFontSizeToFit'] {
    return this._adjustFontSizeToFit;
  }
  set adjustFontSizeToFit(value: ILabel['adjustFontSizeToFit']) {
    this._adjustFontSizeToFit = value;
    if (value) {
      this.setAutoSizeTextTypeUniformWithConfiguration();
    } else {
      NativeTextViewCompat.setAutoSizeTextTypeWithDefaults(this.nativeObject, AUTO_SIZE_TEXT_TYPE_NONE);
    }
  }
  get minimumFontSize(): ILabel['minimumFontSize'] {
    return this._minimumFontSize;
  }
  set minimumFontSize(value: ILabel['minimumFontSize']) {
    this._minimumFontSize = value;
    if (this.adjustFontSizeToFit) {
      this.setAutoSizeTextTypeUniformWithConfiguration();
    }
  }

  get padding() {
    return this._padding;
  }
  set padding(value: ILabel['padding']) {
    this._padding = value;
    const paddingNative = AndroidUnitConverter.dpToPixel(value);
    const paddingLeft = this._paddingLeft !== undefined ? this._paddingLeft : paddingNative;
    const paddingTop = this._paddingTop !== undefined ? this._paddingTop : paddingNative;
    const paddingRight = this._paddingRight !== undefined ? this._paddingRight : paddingNative;
    const paddingBottom = this._paddingBottom !== undefined ? this.paddingBottom : paddingNative;
    this.dirty();
    this.nativeObject.setPaddingRelative(paddingLeft, paddingTop, paddingRight, paddingBottom);
  }
  get paddingLeft(): number {
    return AndroidUnitConverter.pixelToDp(this.nativeObject.getPaddingLeft());
  }
  set paddingLeft(value: ILabel['paddingLeft']) {
    this._paddingLeft = value;
    const paddingBottom = this.paddingBottom;
    const paddingRight = this.paddingRight;
    const paddingTop = this.paddingTop;
    this.dirty();
    this.nativeObject.setPaddingRelative(
      AndroidUnitConverter.dpToPixel(value),
      AndroidUnitConverter.dpToPixel(paddingTop),
      AndroidUnitConverter.dpToPixel(paddingRight),
      AndroidUnitConverter.dpToPixel(paddingBottom)
    );
  }
  get paddingRight(): number {
    return AndroidUnitConverter.pixelToDp(this.nativeObject.getPaddingRight());
  }
  set paddingRight(value: ILabel['paddingRight']) {
    this._paddingRight = value;
    const paddingLeft = this.paddingLeft;
    const paddingBottom = this.paddingBottom;
    const paddingTop = this.paddingTop;
    this.dirty();
    this.nativeObject.setPaddingRelative(
      AndroidUnitConverter.dpToPixel(paddingLeft),
      AndroidUnitConverter.dpToPixel(paddingTop),
      AndroidUnitConverter.dpToPixel(value),
      AndroidUnitConverter.dpToPixel(paddingBottom)
    );
  }
  get paddingTop(): number {
    return AndroidUnitConverter.pixelToDp(this.nativeObject.getPaddingTop());
  }
  set paddingTop(value: ILabel['paddingTop']) {
    this._paddingTop = value;
    const paddingLeft = this.paddingLeft;
    const paddingBottom = this.paddingBottom;
    const paddingRight = this.paddingRight;
    this.dirty();
    this.nativeObject.setPaddingRelative(
      AndroidUnitConverter.dpToPixel(paddingLeft),
      AndroidUnitConverter.dpToPixel(value),
      AndroidUnitConverter.dpToPixel(paddingRight),
      AndroidUnitConverter.dpToPixel(paddingBottom)
    );
  }
  get paddingBottom(): number {
    return AndroidUnitConverter.pixelToDp(this.nativeObject.getPaddingBottom());
  }
  set paddingBottom(value: ILabel['paddingBottom']) {
    this._paddingBottom = value;
    const paddingLeft = this.paddingLeft;
    const paddingTop = this.paddingTop;
    const paddingRight = this.paddingRight;
    this.dirty();
    this.nativeObject.setPaddingRelative(
      AndroidUnitConverter.dpToPixel(paddingLeft),
      AndroidUnitConverter.dpToPixel(paddingTop),
      AndroidUnitConverter.dpToPixel(paddingRight),
      AndroidUnitConverter.dpToPixel(value)
    );
  }

  protected updateText(value: string) {
    this.dirty();
    this.nativeObject.setText(String(value));
  }

  protected updateFont(value: IFont | null) {
    this.fontInitial = value;
    this.dirty();
    this.nativeObject.setTypeface(value?.nativeObject);
    if (value?.size && typeof value.size === 'number') {
      this.nativeObject.setTextSize(TypeValue.COMPLEX_UNIT_DIP, value.size);
    }
  }

  protected getDefaultMaxLine() {
    return DEFAULT_MAX_LINES;
  }
}
