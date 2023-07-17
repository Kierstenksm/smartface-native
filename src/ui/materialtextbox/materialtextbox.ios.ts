import { IMaterialTextBox } from './materialtextbox';
import { TextBoxEvents } from '../textbox/textbox-events';
import { IColor } from '../color/color';
import { IView } from '../view/view';
import { IFlexLayout } from '../flexlayout/flexlayout';
import { IFont } from '../font/font';
import FlexLayoutIOS from '../flexlayout/flexlayout.ios';
import TextBoxIOS from '../textbox/textbox.ios';
import ColorIOS from '../color/color.ios';

export default class MaterialTextBoxIOS<TEvent extends string = TextBoxEvents> extends TextBoxIOS<TEvent | TextBoxEvents, any, IMaterialTextBox> implements IMaterialTextBox {
  private mdcTextInputControllerUnderline: __SF_MDCTextInputControllerUnderline;
  private _multiline: boolean;
  private _lineCount: number;
  private _rightLayout: { view: IView; width: number; height?: number };
  private _rightLayoutMain: IFlexLayout;
  private _labelsFont: IFont;
  private _errorMessage: string;
  private __hint: string;
  private __hintTextColor: IColor;
  private _onLeftViewRightPadding: number;
  private _onRightViewLeftPadding: number;
  private _leftLayout: { view: IView; width: number; height?: number };
  private _leftLayoutMain: IFlexLayout;
  private _onLeftViewRectForBounds: (bounds?: __SF_NSRect, defaultRect?: __SF_NSRect) => __SF_NSRect;
  private _onRightViewRectForBounds: (bounds?: __SF_NSRect, defaultRect?: __SF_NSRect) => __SF_NSRect;
  private _content: IFlexLayout;
  constructor(params: Partial<IMaterialTextBox> = {}) {
    super(params);
  }
  protected preConstruct(params: Partial<IMaterialTextBox> = {}) {
    this._multiline = !!params.multiline;
    this._lineCount = params.lineCount || 1;
    this._onLeftViewRightPadding = 0;
    this._onRightViewLeftPadding = 0;
    this.__hintTextColor = ColorIOS.create(199, 199, 205);

    super.preConstruct(params);
    this.addIOSProps(this.getIOSProps());
  }
  protected createNativeObject(params: Partial<IMaterialTextBox> = {}): any {
    const nativeObject = params.multiline ? new __SF_MDCMultilineTextField() : new __SF_MDCTextField();
    this.mdcTextInputControllerUnderline = new __SF_MDCTextInputControllerUnderline(nativeObject);

    if (params.multiline) {
      this.mdcTextInputControllerUnderline.expandsOnOverflow = false;
      this.mdcTextInputControllerUnderline.minimumLines = params.lineCount || 1;
    }
    nativeObject.layer.masksToBounds = false;
    return nativeObject;
  }

  private getIOSProps() {
    const self = this;
    return {
      get clearButtonColor(): IColor {
        return self.mdcTextInputControllerUnderline.textInputClearButtonTintColor;
      },
      set clearButtonColor(value: IColor) {
        self.mdcTextInputControllerUnderline.textInputClearButtonTintColor = value.nativeObject;
      },
      get leftLayoutRightPadding(): number {
        return self._onLeftViewRightPadding;
      },
      set leftLayoutRightPadding(value: number) {
        self._onLeftViewRightPadding = value;
        self.mdcTextInputControllerUnderline.leadingViewTrailingPaddingConstantJS = value;
      },
      get rightLayoutLeftPadding(): number {
        return self._onRightViewLeftPadding;
      },
      set rightLayoutLeftPadding(value: number) {
        self._onRightViewLeftPadding = value;
        self.mdcTextInputControllerUnderline.trailingViewTrailingPaddingConstantJS = value;
      },
      get onLeftLayoutRectForBounds(): (bounds?: Object, defaultRect?: Object) => __SF_NSRect {
        return self._onLeftViewRectForBounds;
      },
      set onLeftLayoutRectForBounds(value: (bounds?: Object, defaultRect?: Object) => __SF_NSRect) {
        self._onLeftViewRectForBounds = value;
        self.mdcTextInputControllerUnderline.leadingViewRectForBounds = value;
      },
      get onRightLayoutRectForBounds(): (bounds?: __SF_NSRect, defaultRect?: __SF_NSRect) => __SF_NSRect {
        return self._onRightViewRectForBounds;
      },
      set onRightLayoutRectForBounds(value: (bounds?: __SF_NSRect, defaultRect?: __SF_NSRect) => __SF_NSRect) {
        self._onRightViewRectForBounds = value;
        self.mdcTextInputControllerUnderline.trailingViewRectForBounds = value;
      },
      get leftLayout(): { view: IView; width: number; height?: number } {
        return self._leftLayout;
      },
      set leftLayout(value: { view: IView; width: number; height?: number }) {
        if (self.multiline) {
          throw new Error('leftlayout cannot be used with multiline.');
        }

        self._leftLayout = value;
        if (value === undefined) {
          // if (isLTR_UserInterfaceLayoutDirection && (isUnspecified || isLTR_ViewAppearance) || !isLTR_UserInterfaceLayoutDirection && (isUnspecified || !isLTR_ViewAppearance)) {
          self.mdcTextInputControllerUnderline.textInput.setValueForKey(undefined, 'leadingView');
          self.mdcTextInputControllerUnderline.textInput.setValueForKey(0, 'leadingViewMode');
          // } else {
          //     self.nativeObject.setValueForKey(undefined, "leftView");
          //     self.nativeObject.setValueForKey(0, "leftViewMode");
          // }
          return;
        }

        if (!self._leftLayoutMain) {
          const flexMain = new FlexLayoutIOS();
          flexMain.nativeObject.yoga.isEnabled = false; // Bug : IOS-2714

          flexMain.nativeObject.translatesAutoresizingMaskIntoConstraints = false;
          flexMain.nativeObject.widthAnchor.constraintEqualToConstant(value.width ? value.width : 30).active = true;
          flexMain.nativeObject.heightAnchor.constraintEqualToConstant(value.height ? value.height : 30).active = true;

          const flexContent = new FlexLayoutIOS();
          flexContent.top = 0;
          flexContent.left = 0;
          flexContent.width = value.width ? value.width : 30;
          flexContent.height = value.height ? value.height : 30;
          flexMain.nativeObject.addFrameObserver();
          flexMain.nativeObject.frameObserveHandler = (e) => {
            flexContent.top = 0;
            flexContent.left = 0;
            flexContent.width = e.frame.width;
            flexContent.height = e.frame.height;
            flexContent.applyLayout();
          };
          flexMain.addChild(flexContent);
          self._content = flexContent;
          self._leftLayoutMain = flexMain;
        } else if (this._content) {
          const children = self._content.getChildList();
          for (const i in children) {
            self._content.removeChild(children[i]);
          }
        }

        self._content?.addChild(value.view);
        self._content?.applyLayout();
        // if (isLTR_UserInterfaceLayoutDirection && (isUnspecified || isLTR_ViewAppearance) || !isLTR_UserInterfaceLayoutDirection && (isUnspecified || !isLTR_ViewAppearance)) {
        self.mdcTextInputControllerUnderline.textInput.setValueForKey(3, 'leadingViewMode');
        self.mdcTextInputControllerUnderline.textInput.setValueForKey(self._leftLayoutMain.nativeObject, 'leadingView');
        // } else {
        //     self.nativeObject.setValueForKey(3, "leftViewMode");
        //     self.nativeObject.setValueForKey(_rightLayoutMain.nativeObject, "leftView");
        // }
      },
      // TODO Old version has not this encapsulation.
      get normallineColor(): IColor | null {
        if (self.mdcTextInputControllerUnderline.normalColor) {
          return new ColorIOS({
            color: self.mdcTextInputControllerUnderline.normalColor
          });
        } else {
          return null;
        }
      },
      set normallineColor(value: IColor | null) {
        if (value) self.mdcTextInputControllerUnderline.normalColor = value.nativeObject;
      },
      get selectedLineColor(): IColor | null {
        if (self.mdcTextInputControllerUnderline.activeColor) {
          return new ColorIOS({
            color: self.mdcTextInputControllerUnderline.activeColor
          });
        } else {
          return null;
        }
      },
      set selectedLineColor(value: IColor | null) {
        if (value) self.mdcTextInputControllerUnderline.activeColor = value.nativeObject;
      },
      get lineHeight(): number | undefined {
        return self.mdcTextInputControllerUnderline.underlineHeightNormal;
      },
      set lineHeight(value: number | undefined) {
        self.mdcTextInputControllerUnderline.underlineHeightNormal = value;
      },
      get selectedLineHeight(): number | undefined {
        return self.mdcTextInputControllerUnderline.underlineHeightActive;
      },
      set selectedLineHeight(value: number | undefined) {
        self.mdcTextInputControllerUnderline.underlineHeightActive = value;
      },
      get expandsOnOverflow(): boolean | undefined {
        return self.mdcTextInputControllerUnderline.expandsOnOverflow;
      },
      set expandsOnOverflow(value: boolean | undefined) {
        self.mdcTextInputControllerUnderline.expandsOnOverflow = value;
      }
    };
  }

  get testId(): string {
    return this.nativeObject.valueForKey('accessibilityIdentifier');
  }
  set testId(value: string) {
    this.nativeObject.setValueForKey(value, 'accessibilityIdentifier');
    this.mdcTextInputControllerUnderline.textInput.setValueForKey(value + '_textBox', 'accessibilityIdentifier');
  }

  get cursorPosition(): { start: number; end: number } {
    const self = this._multiline ? this.nativeObject.textView : this.nativeObject;

    const selectedTextRange = self.valueForKey('selectedTextRange');

    let startPosition: any;
    const invocationStartPosition = __SF_NSInvocation.createInvocationWithSelectorInstance('start', selectedTextRange);
    if (invocationStartPosition) {
      invocationStartPosition.target = selectedTextRange;
      invocationStartPosition.setSelectorWithString('start');
      invocationStartPosition.retainArguments();

      invocationStartPosition.invoke();
      startPosition = invocationStartPosition.getReturnValue();
    }

    let endPosition: any;
    const invocationEndPosition = __SF_NSInvocation.createInvocationWithSelectorInstance('end', selectedTextRange);
    if (invocationEndPosition) {
      invocationEndPosition.target = selectedTextRange;
      invocationEndPosition.setSelectorWithString('end');
      invocationEndPosition.retainArguments();

      invocationEndPosition.invoke();
      endPosition = invocationEndPosition.getReturnValue();
    }

    const beginningOfDocument = self.valueForKey('beginningOfDocument');

    let offsetStart: number = 0;
    const invocationOffsetFromPosition = __SF_NSInvocation.createInvocationWithSelectorInstance('offsetFromPosition:toPosition:', this);
    if (invocationOffsetFromPosition) {
      invocationOffsetFromPosition.target = self;
      invocationOffsetFromPosition.setSelectorWithString('offsetFromPosition:toPosition:');
      invocationOffsetFromPosition.retainArguments();
      invocationOffsetFromPosition.setNSObjectArgumentAtIndex(beginningOfDocument, 2);
      invocationOffsetFromPosition.setNSObjectArgumentAtIndex(startPosition, 3);
      invocationOffsetFromPosition.invoke();
      offsetStart = invocationOffsetFromPosition.getNSIntegerReturnValue();
    }

    let offsetEnd: number = 0;
    const invocationEndOffsetFromPosition = __SF_NSInvocation.createInvocationWithSelectorInstance('offsetFromPosition:toPosition:', this);
    if (invocationEndOffsetFromPosition) {
      invocationEndOffsetFromPosition.target = self;
      invocationEndOffsetFromPosition.setSelectorWithString('offsetFromPosition:toPosition:');
      invocationEndOffsetFromPosition.retainArguments();
      invocationEndOffsetFromPosition.setNSObjectArgumentAtIndex(beginningOfDocument, 2);
      invocationEndOffsetFromPosition.setNSObjectArgumentAtIndex(endPosition, 3);
      invocationEndOffsetFromPosition.invoke();
      offsetEnd = invocationEndOffsetFromPosition.getNSIntegerReturnValue();
    }

    return {
      start: offsetStart,
      end: offsetEnd
    };
  }
  set cursorPosition(value: { start: number; end: number }) {
    const self = this._multiline ? this.nativeObject.textView : this.nativeObject;
    if (value && value.start === parseInt(String(value.start), 10) && value.end === parseInt(String(value.end), 10)) {
      const beginningOfDocument = self.valueForKey('beginningOfDocument');
      let startPosition: any;
      const invocationPositionFromPosition = __SF_NSInvocation.createInvocationWithSelectorInstance('positionFromPosition:offset:', this);
      if (invocationPositionFromPosition) {
        invocationPositionFromPosition.target = self;
        invocationPositionFromPosition.setSelectorWithString('positionFromPosition:offset:');
        invocationPositionFromPosition.retainArguments();
        invocationPositionFromPosition.setNSObjectArgumentAtIndex(beginningOfDocument, 2);
        invocationPositionFromPosition.setNSIntegerArgumentAtIndex(value.start, 3);
        invocationPositionFromPosition.invoke();
        startPosition = invocationPositionFromPosition.getReturnValue();
      }
      let endPosition: any;
      const invocationEndPositionFromPosition = __SF_NSInvocation.createInvocationWithSelectorInstance('positionFromPosition:offset:', this);
      if (invocationEndPositionFromPosition) {
        invocationEndPositionFromPosition.target = self;
        invocationEndPositionFromPosition.setSelectorWithString('positionFromPosition:offset:');
        invocationEndPositionFromPosition.retainArguments();
        invocationEndPositionFromPosition.setNSObjectArgumentAtIndex(beginningOfDocument, 2);
        invocationEndPositionFromPosition.setNSIntegerArgumentAtIndex(value.end, 3);
        invocationEndPositionFromPosition.invoke();
        endPosition = invocationEndPositionFromPosition.getReturnValue();
      }
      let characterRange: any;
      const invocationTextRangeFromPosition = __SF_NSInvocation.createInvocationWithSelectorInstance('textRangeFromPosition:toPosition:', this);
      if (invocationTextRangeFromPosition) {
        invocationTextRangeFromPosition.target = self;
        invocationTextRangeFromPosition.setSelectorWithString('textRangeFromPosition:toPosition:');
        invocationTextRangeFromPosition.retainArguments();
        invocationTextRangeFromPosition.setNSObjectArgumentAtIndex(startPosition, 2);
        invocationTextRangeFromPosition.setNSObjectArgumentAtIndex(endPosition, 3);
        invocationTextRangeFromPosition.invoke();
        characterRange = invocationTextRangeFromPosition.getReturnValue();
      }
      self.setValueForKey(characterRange, 'selectedTextRange');
    }
  }

  get multiline(): boolean {
    return this._multiline;
  }
  private set multiline(value) {
    this._multiline = value;
  }

  get lineCount(): number {
    return this._lineCount;
  }
  private set lineCount(value) {
    this._lineCount = value;
  }

  get isPassword(): boolean {    
    return this.nativeObject.getSecureTextEntry();
  }
  set isPassword(value: boolean) {
    this.nativeObject.secureTextEntry = value;
  }

  get maxLength(): number {
    return this.nativeObject.maxCharacterLength;
  }
  set maxLength(value: number) {
     this.nativeObject.maxCharacterLength = value;
  }

  get characterRestriction(): number | undefined {
    return this.mdcTextInputControllerUnderline.characterCountMax;
  }
  set characterRestriction(value: number | undefined) {
    this.mdcTextInputControllerUnderline.characterCountMax = value;
  }

  get characterRestrictionColor(): IColor | null {
    const trailColor = this.mdcTextInputControllerUnderline.trailingUnderlineLabelTextColor;
    return trailColor ? new ColorIOS({ color: trailColor }) : null;
  }
  set characterRestrictionColor(value: IColor | null) {
    if (value) this.mdcTextInputControllerUnderline.trailingUnderlineLabelTextColor = value.nativeObject;
  }

  get rightLayout() {
    return this._rightLayout;
  }
  set rightLayout(value) {
    this._rightLayout = value;
    if (value === undefined) {
      // if (isLTR_UserInterfaceLayoutDirection && (isUnspecified || isLTR_ViewAppearance) || !isLTR_UserInterfaceLayoutDirection && (isUnspecified || !isLTR_ViewAppearance)) {
      this.mdcTextInputControllerUnderline.textInput.setValueForKey(undefined, 'trailingView');
      this.mdcTextInputControllerUnderline.textInput.setValueForKey(0, 'trailingViewMode');
      // } else {
      //     self.nativeObject.setValueForKey(undefined, "leftView");
      //     self.nativeObject.setValueForKey(0, "leftViewMode");
      // }
      return;
    }
    if (!this._rightLayoutMain) {
      const flexMain = new FlexLayoutIOS();
      flexMain.nativeObject.yoga.isEnabled = false; // Bug : IOS-2714
      flexMain.nativeObject.translatesAutoresizingMaskIntoConstraints = false;
      flexMain.nativeObject.widthAnchor.constraintEqualToConstant(value.width ? value.width : 30).active = true;
      flexMain.nativeObject.heightAnchor.constraintEqualToConstant(value.height ? value.height : 30).active = true;
      const flexContent = new FlexLayoutIOS();
      flexContent.top = 0;
      flexContent.left = 0;
      flexContent.width = value.width ? value.width : 30;
      flexContent.height = value.height ? value.height : 30;
      flexMain.nativeObject.addFrameObserver();
      flexMain.nativeObject.frameObserveHandler = function (e) {
        flexContent.top = 0;
        flexContent.left = 0;
        flexContent.width = e.frame.width;
        flexContent.height = e.frame.height;
        flexContent.applyLayout();
      };
      flexMain.addChild(flexContent);
      this._content = flexContent;
      this._rightLayoutMain = flexMain;
    } else if (this._content) {
      const childs = this._content.getChildList();
      for (const i in childs) {
        this._content.removeChild(childs[i]);
      }
    }
    this._content?.addChild(value.view);
    this._content?.applyLayout();
    // if (isLTR_UserInterfaceLayoutDirection && (isUnspecified || isLTR_ViewAppearance) || !isLTR_UserInterfaceLayoutDirection && (isUnspecified || !isLTR_ViewAppearance)) {
    this.mdcTextInputControllerUnderline.textInput.setValueForKey(3, 'trailingViewMode');
    this.mdcTextInputControllerUnderline.textInput.setValueForKey(this._rightLayoutMain.nativeObject, 'trailingView');
    // } else {
    //     self.nativeObject.setValueForKey(3, "leftViewMode");
    //     self.nativeObject.setValueForKey(_rightLayoutMain.nativeObject, "leftView");
    // }
  }

  get labelsFont(): IFont {
    return this._labelsFont;
  }
  set labelsFont(value: IFont) {
    this._labelsFont = value;
    this.mdcTextInputControllerUnderline.leadingUnderlineLabelFont = value;
    this.mdcTextInputControllerUnderline.trailingUnderlineLabelFont = value;
    this.mdcTextInputControllerUnderline.inlinePlaceholderFont = value;
  }

  get font(): IFont {
    return this.mdcTextInputControllerUnderline.textInputFont;
  }
  set font(value: IFont) {
    this.mdcTextInputControllerUnderline.textInputFont = value;
  }

  get selectedHintTextColor(): IColor | null {
    const activeColor = this.mdcTextInputControllerUnderline.floatingPlaceholderActiveColor;
    return activeColor ? new ColorIOS({ color: activeColor }) : null;
  }
  set selectedHintTextColor(value: IColor | null) {
    if (value) this.mdcTextInputControllerUnderline.floatingPlaceholderActiveColor = value.nativeObject;
  }

  get lineColor() {
    return {
      normal: this.ios.normallineColor,
      selected: this.ios.selectedLineColor
    };
  }
  set lineColor(value) {
    if (value.normal) {
      this.ios.normallineColor = value.normal;
    }
    if (value.selected) {
      this.ios.selectedLineColor = value.selected;
    }
  }

  get errorColor(): IColor | null {
    const errorColor = this.mdcTextInputControllerUnderline.errorColor;
    return errorColor ? new ColorIOS({ color: errorColor }) : null;
  }
  set errorColor(value: IColor | null) {
    if (value) {
      this.mdcTextInputControllerUnderline.errorColor = value.nativeObject;
    }
  }

  get errorMessage(): string {
    return this._errorMessage;
  }
  set errorMessage(value: string) {
    this._errorMessage = value;
    if (value) {
      this.mdcTextInputControllerUnderline.setErrorTextErrorAccessibilityValue(this._errorMessage, this._errorMessage);
    } else {
      this.mdcTextInputControllerUnderline.setErrorTextNil();
    }
  }

  get hintTextColor(): IColor {
    return this.__hintTextColor;
  }
  set hintTextColor(value: IColor) {
    this.__hintTextColor = value;
    this.mdcTextInputControllerUnderline.inlinePlaceholderColor = this.__hintTextColor.nativeObject;
    this.mdcTextInputControllerUnderline.floatingPlaceholderNormalColor = this.__hintTextColor.nativeObject;
  }

  get hint(): string {
    return this.__hint;
  }
  set hint(value: string) {
    this.__hint = value;
    this.mdcTextInputControllerUnderline.placeholderText = value;
  }
}
