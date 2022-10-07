import { FontStyle } from '../font/font';
import FontIOS from '../font/font.ios';
import LabelIOS from '../label/label.ios';
import { IIcon } from './icon';

export default class IconIOS extends LabelIOS implements IIcon {
  private _glyph: string;
  private _unicode: string;
  private _text: string;
  /**
   * This hold the real text value that goes through the label. It will always be overridden by either glyph, unicode and text.
   */
  private _actualText: string;
  constructor(params: Partial<IIcon> = {}) {
    super(params);
    this.adjustFontSizeToFit = true;
  }
  protected preConstruct(params: Partial<IIcon> = {}) {
    this.font = FontIOS.create('FontAwesome5FreeRegular', 16, FontStyle.NORMAL);
    super.preConstruct(params);
  }
  get glyph(): string {
    return this._glyph;
  }
  set glyph(value: string) {
    this.setActualText(value);
    this._glyph = value;
  }
  get unicode(): string {
    return this._unicode;
  }
  set unicode(value: string) {
    this.setActualText(value);
    this._unicode = value;
  }
  get text(): string {
    return this._text;
  }
  set text(value: string) {
    this.setActualText(value);
    this._text = value;
  }

  private setActualText(value: string) {
    this._actualText = value;
    this.nativeObject.yoga.markDirty();
    this.nativeObject.text = this._actualText;
    __SF_UIView.applyToRootView();
  }
}
