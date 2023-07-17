import { ITextView } from './textview';
import { Size } from '../../primitive/size';
import LabelAndroid from '../label/label.android';
import TextAlignment from '../shared/textalignment';
import { TextViewEvents } from './textview-events';
import * as TextViewSizeCalculator from '../../util/Android/textviewsizecalculator';
import AndroidUnitConverter from '../../util/Android/unitconverter';
import { IFont } from '../font/font';

const NativeHtml = requireClass('android.text.Html');
const NativeBuild = requireClass('android.os.Build');
const NativeSpannableStringBuilder = requireClass('android.text.SpannableStringBuilder');
const NativeLineHeightSpan = requireClass('android.text.style.LineHeightSpan');
const NativeLinkMovementMethod = requireClass('android.text.method.LinkMovementMethod');
const NativeScrollingMovementMethod = requireClass('android.text.method.ScrollingMovementMethod');

const TextAlignmentDic = {
  [TextAlignment.TOPLEFT]: 48 | 3, // Gravity.TOP | Gravity.LEFT
  [TextAlignment.TOPCENTER]: 48 | 1, //Gravity.TOP | Gravity.CENTER_HORIZONTAL
  [TextAlignment.TOPRIGHT]: 48 | 5, //Gravity.TOP | Gravity.RIGHT
  [TextAlignment.MIDLEFT]: 16 | 3, // Gravity.CENTER_VERTICAL | Gravity.LEFT
  [TextAlignment.MIDCENTER]: 17, //Gravity.CENTER
  [TextAlignment.MIDRIGHT]: 16 | 5, // Gravity.CENTER_VERTICAL | Gravity.RIGHT
  [TextAlignment.BOTTOMLEFT]: 80 | 3, // Gravity.BOTTOM | Gravity.LEFT
  [TextAlignment.BOTTOMCENTER]: 80 | 1, // Gravity.BOTTOM | Gravity.CENTER_HORIZONTAL
  [TextAlignment.BOTTOMRIGHT]: 80 | 5 // Gravity.BOTTOM | Gravity.RIGHT
};

const MAX_INT_VALUE = 2147483647;
const DEFAULT_MAX_LINES = 0; // 0 indicates that maxLines will be as much as given content

export default class TextViewAndroid<TEvent extends string = TextViewEvents, TProps extends ITextView = ITextView> extends LabelAndroid<TEvent | TextViewEvents, any, TProps> implements ITextView {
  private _attributedStringBuilder: any;
  private _attributedStringArray: ITextView['attributedText'];
  private _onLinkClick: ITextView['onLinkClick'];
  private _letterSpacing: ITextView['letterSpacing'];
  private _lineSpacing: ITextView['lineSpacing'];
  private _scrollEnabled: ITextView['scrollEnabled'];
  private _htmlText: ITextView['htmlText'];
  private linkMovementMethodCreated: boolean;
  private scrollableMovementMethodCreated: boolean;
  constructor(params: Partial<TProps> = {}) {
    super(params);
  }
  protected preConstruct(params?: Partial<TProps>): void {
    this._letterSpacing = 9;
    this._lineSpacing = 0;
    this._scrollEnabled = true;
    this._attributedStringArray = [];
    super.preConstruct(params);
  }
  get htmlText(): ITextView['htmlText'] {
    return this._htmlText || '';
  }
  set htmlText(value: ITextView['htmlText']) {
    this._htmlText = value;
    const htmlTextNative = NativeHtml.fromHtml(`${value}`);

    this.scrollEnabled = this._scrollEnabled;
    this.dirty();
    this.nativeObject.setText(htmlTextNative);
  }
  get maxLines(): ITextView['maxLines'] {
    const mMaxLines = this.nativeObject.getMaxLines();
    return mMaxLines === MAX_INT_VALUE ? 0 : mMaxLines;
  }
  set maxLines(value: ITextView['maxLines']) {
    if(this.yogaNode) {
      this.dirty();
    }
    this.nativeObject.setMaxLines(value === 0 ? MAX_INT_VALUE : value);
    this.scrollEnabled = this._scrollEnabled;
  }
  get selectable(): boolean {
    return this.nativeObject.isTextSelectable();
  }
  set selectable(value: boolean) {
    this.nativeObject.setTextIsSelectable(value);
  }
  get attributedText(): ITextView['attributedText'] {
    return this._attributedStringArray;
  }
  set attributedText(value: ITextView['attributedText']) {
    this._attributedStringArray = value;

    if (this._attributedStringBuilder) {
      this._attributedStringBuilder.clear();
    } else {
      this._attributedStringBuilder = new NativeSpannableStringBuilder();
    }

    //Sets the spans according to given properties
    this._attributedStringArray.forEach((attributedString: any) => {
      attributedString.textView = this;
      attributedString.setSpan(this._attributedStringBuilder);
    });

    //Sets the given line space
    this.lineSpacing = this._lineSpacing;
    this.dirty();
    this.nativeObject.setText(this._attributedStringBuilder);
    this.scrollEnabled = this._scrollEnabled;
    this.nativeObject.setHighlightColor(0); //TRANSPARENT COLOR
  }
  getAttributeTextSize(maxWidth: number): Size | null {
    if (!this._attributedStringBuilder) {
      return null;
    }
    return TextViewSizeCalculator.calculateStringSize({
      text: this,
      maxWidth
    });
  }
  get onLinkClick(): ITextView['onLinkClick'] {
    return this._onLinkClick;
  }
  set onLinkClick(value: ITextView['onLinkClick']) {
    this._onLinkClick = value;
  }
  get letterSpacing(): ITextView['letterSpacing'] {
    return this._letterSpacing;
  }
  set letterSpacing(value: ITextView['letterSpacing']) {
    this._letterSpacing = value;
    if (NativeBuild.VERSION.SDK_INT >= 21) {
      this.dirty();
      // Convert dp to em to achieve the same result as on iOS
      this.nativeObject.setLetterSpacing(value / AndroidUnitConverter.pixelToDp(this.nativeObject.getTextSize()));
    }
  }
  get lineSpacing(): ITextView['lineSpacing'] {
    return this._lineSpacing;
  }
  set lineSpacing(value: ITextView['lineSpacing']) {
    this._lineSpacing = value;
    this.dirty();
    this.nativeObject.setLineSpacing(AndroidUnitConverter.dpToPixel(this._lineSpacing), 1);
  }
  get textAlignment(): ITextView['textAlignment'] {
    return this._textAlignment;
  }
  set textAlignment(value: ITextView['textAlignment']) {
    this._textAlignment = value in TextAlignmentDic ? value : (this._textAlignment = this.viewNativeDefaultTextAlignment);
    this.nativeObject.setGravity(TextAlignmentDic[this._textAlignment]);
  }
  get scrollEnabled(): ITextView['scrollEnabled'] {
    return this._scrollEnabled;
  }
  set scrollEnabled(value: ITextView['scrollEnabled']) {
    this._scrollEnabled = value;
    this.nativeObject.setGravity(TextAlignmentDic[this._textAlignment]);
    this.enableScrollable(value);
  }

  /*
ToDo: LinkMovementMethod makes the links clickable and scrollable but this case is restricted to mutually directed each other. 
To prevent, we need to customize BaseMovementMethod
*/
  private enableScrollable(scrollEnabled: boolean) {
    if (scrollEnabled) {
      if (this.htmlText?.length > 0 || this.attributedText?.length > 0) {
        if (this.linkMovementMethodCreated) {
          return;
        }
        this.nativeObject.setMovementMethod(NativeLinkMovementMethod.getInstance());
        this.linkMovementMethodCreated = true;
      } else {
        if (this.scrollableMovementMethodCreated) {
          return;
        }
        this.nativeObject.setMovementMethod(NativeScrollingMovementMethod.getInstance());
        this.scrollableMovementMethodCreated = true;
      }
    } else {
      this.linkMovementMethodCreated = false;
      this.scrollableMovementMethodCreated = false;
      this.nativeObject.setMovementMethod(null);
    }
  }

  protected override updateText(value: string) {
    super.updateText(value);
    this.scrollEnabled = this._scrollEnabled;
  }

  protected override updateFont(value: IFont | null) {
    if (this._attributedStringArray?.length) {
      return;
    }
    super.updateFont(value);
  }

  protected override getDefaultMaxLine() {
    return DEFAULT_MAX_LINES;
  }
}
