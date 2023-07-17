import NSLineBreakMode from '../../util/iOS/nslinebreakmode';
import Color from '../color';
import { ViewEvents } from '../view/view-events';
import ViewIOS from '../view/view.ios';
import { ILabel } from './label';
import TextAlignment from '../shared/textalignment';

const DEFAULT_MINIMUM_FONT_SIZE = 1;

export default class LabelIOS<TEvent extends string = ViewEvents, TNative = any, TProps extends ILabel = ILabel> extends ViewIOS<TEvent, TNative, TProps> implements ILabel {
  private _minimumFontSize = DEFAULT_MINIMUM_FONT_SIZE;
  private _textAlignment = TextAlignment.MIDLEFT;
  protected _textColor: ILabel['textColor'] = Color.BLACK;
  constructor(params?: Partial<TProps>) {
    super(params);

    this.touchEnabled = true;
  }
  protected createNativeObject() {
    return new __SF_SMFUILabel();
  }

  get font() {
    return this.nativeObject.font;
  }
  set font(value: ILabel['font']) {
    this.nativeObject.font = value;
    this.minimumFontSize = this.minimumFontSize;
  }
  get adjustFontSizeToFit() {
    return this.nativeObject.adjustsFontSizeToFitWidth;
  }
  set adjustFontSizeToFit(value: ILabel['adjustFontSizeToFit']) {
    this.nativeObject.baselineAdjustment = DEFAULT_MINIMUM_FONT_SIZE;
    this.nativeObject.adjustsFontSizeToFitWidth = value;
  }
  get minimumFontSize() {
    return this._minimumFontSize;
  }
  set minimumFontSize(value: ILabel['minimumFontSize']) {
    this._minimumFontSize = value;
    this.nativeObject.minimumScaleFactor = this._minimumFontSize / (this.font as any).size;
  }
  get ellipsizeMode() {
    return NSLineBreakMode.nsLineBreakModeToEllipsizeMode(this.nativeObject.lineBreakMode);
  }
  set ellipsizeMode(value: ILabel['ellipsizeMode']) {
    this.nativeObject.lineBreakMode = NSLineBreakMode.ellipsizeModeToNSLineBreakMode(value);
  }
  get maxLines() {
    return this.nativeObject.numberOfLines;
  }
  set maxLines(value: ILabel['maxLines']) {
    this.nativeObject.numberOfLines = Number(value) || value === 0 ? value : 1; 
  }
  get text() {
    return this.nativeObject.text;
  }
  set text(value: ILabel['text']) {
    this.nativeObject.yoga.markDirty();
    this.nativeObject.text = value;

    __SF_UIView.applyToRootView();
  }
  get textAlignment() {
    return this._textAlignment;
  }
  set textAlignment(value: ILabel['textAlignment']) {
    this._textAlignment = value;
    this.nativeObject.textAlignment = value % 3;
  }
  get textColor() {
    return this._textColor;
  }
  set textColor(value: ILabel['textColor']) {
    if (value instanceof Color) {
      this._textColor = value;
      this.nativeObject.textColor = value.nativeObject;
    }
  }
}
