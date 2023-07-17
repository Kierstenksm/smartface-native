import { FontStyle } from '../font/font';
import FontAndroid from '../font/font.android';
import LabelAndroid from '../label/label.android';
import { IIcon } from './icon';

export default class IconAndroid extends LabelAndroid implements IIcon {
  private _glyph: string;
  private _unicode: string;
  private _text: string;
  /**
   * This hold the real text value that goes through the label. It will always be overrided by either glyph, unicode and text.
   */
  private _actualText: string;
  constructor(params: Partial<IIcon> = {}) {
    super(params);
    if (params?.font instanceof FontAndroid) {
      this.font = params.font;
    } else {
      this.font = FontAndroid.create('FontAwesome5FreeRegular', 16, FontStyle.NORMAL);
    }
    // Set includeFontPadding to false for better icon placement
    this.android.includeFontPadding = false;
  }
  protected preConstruct(params: Partial<IIcon> = {}) {
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
    this.dirty();
    this.nativeObject.setText(String(this._actualText));
  }
}
