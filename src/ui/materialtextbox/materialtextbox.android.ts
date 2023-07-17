import { IMaterialTextBox } from './materialtextbox';
import { Point2D } from '../../primitive/point2d';

import AndroidConfig from '../../util/Android/androidconfig';
import AndroidUnitConverter from '../../util/Android/unitconverter';
import { IColor } from '../color/color';
import { IFont } from '../font/font';
import FlexLayoutAndroid from '../flexlayout/flexlayout.android';
import TextBoxAndroid from '../textbox/textbox.android';
import ViewAndroid from '../view/view.android';
import TextAlignment from '../shared/textalignment';
import AutoCapitalize from '../shared/autocapitalize';
import KeyboardType from '../shared/keyboardtype';
import { EventListenerCallback } from '../../core/eventemitter';
import { TextBoxEvents } from '../textbox/textbox-events';

interface nativeTextInputEditText {
  getHeight: () => number;
  setHeight: (value: number) => void;
  getMaxHeight: () => number;
  setMaxHeight: (value: number) => void;
  setSupportBackgroundTintList: (params: any) => void;
  getMaxLines(): number;
  setMaxLines(value: number): void;
  getMinLines(): number;
  setMinLines(value: number): void;
  isSingleLine(): boolean;
  setSingleLine(value: boolean): void;
}

const SFMaterialTextBoxWrapper = requireClass('io.smartface.android.sfcore.ui.materialtextbox.SFMaterialTextBoxWrapper');
const NativeColorStateList = requireClass('android.content.res.ColorStateList');

const hintTextColorFieldName = 'defaultHintTextColor';
const hintFocusedTextColorFieldName = 'focusedTextColor';

const state_focused = 16842908;
const state_unfocused = -16842908;
// const GRAVITY_END = 8388613;
// const MaterialTextbox = extend(View)( //Actually this class behavior is InputLayout.

export default class MaterialTextBoxAndroid<TEvent extends string = TextBoxEvents> extends ViewAndroid<TEvent | TextBoxEvents, any, IMaterialTextBox> implements IMaterialTextBox {
  private sfTextBox: TextBoxAndroid;
  private textBoxNativeObject: nativeTextInputEditText;
  private __hintTextColor: IColor;
  private _hintFocusedTextColor: IColor | null;
  private _errorText: string;
  private _lineColorObj: { normal: IColor | null; selected: IColor | null };
  private _errorColor: IColor | null;
  private _characterRestrictionColor: IColor;
  private __font: IFont | null;
  private _rightLayout: FlexLayoutAndroid | null;
  private _rightLayoutWidth: number;
  private _enableCounterMaxLength: number;
  private _enableCounter: boolean;
  private _enableErrorMessage: boolean;
  private _enableCharacterRestriction: boolean;
  private _touchEnable: boolean;
  get font(): IFont | null {
    return this.sfTextBox.font;
  }
  set font(value) {
    this.sfTextBox.font = value;
  }
  get text(): string {
    return this.sfTextBox.text;
  }
  set text(value) {
    this.sfTextBox.text = value;
  }
  get autoCapitalize(): AutoCapitalize {
    return this.sfTextBox.autoCapitalize;
  }
  set autoCapitalize(value) {
    this.sfTextBox.autoCapitalize = value;
  }
  get textAlignment(): TextAlignment {
    return this.sfTextBox.textAlignment;
  }
  set textAlignment(value) {
    this.sfTextBox.textAlignment = value;
  }
  get textColor(): IColor {
    return this.sfTextBox.textColor;
  }
  set textColor(value) {
    this.sfTextBox.textColor = value;
  }
  get cursorColor(): IColor {
    return this.sfTextBox.cursorColor;
  }
  set cursorColor(value) {
    this.sfTextBox.cursorColor = value;
  }
  get cursorPosition(): IMaterialTextBox['cursorPosition'] {
    return this.sfTextBox.cursorPosition;
  }
  set cursorPosition(value) {
    this.sfTextBox.cursorPosition = value;
  }
  get isPassword(): IMaterialTextBox['isPassword'] {
    return this.sfTextBox.isPassword;
  }
  set isPassword(value) {
    this.sfTextBox.isPassword = value;
  }
  get keyboardType(): KeyboardType {
    return this.sfTextBox.keyboardType;
  }
  set keyboardType(value) {
    this.sfTextBox.keyboardType = value;
  }
  get actionKeyType(): IMaterialTextBox['actionKeyType'] {
    return this.sfTextBox.actionKeyType;
  }
  set actionKeyType(value) {
    this.sfTextBox.actionKeyType = value;
  }
  constructor(params: Partial<IMaterialTextBox> = {}) {
    super(params);
    if (!AndroidConfig.isEmulator) {
      const SFMaterialTextBoxHintAppearance_ID = AndroidConfig.getResourceId('SFMaterialTextBoxHintAppearance', 'style');
      this.nativeObject.getInstance().setHintTextAppearance(SFMaterialTextBoxHintAppearance_ID);
    }
    //Defaults
    this.onTouch = () => false; // Fixes touch not working with wrapped materialtextboxes
  }
  protected preConstruct(params?: any): void {
    this._lineColorObj = { normal: null, selected: null };
    this._errorColor = null;
    this._rightLayout = null;
    this._enableCounterMaxLength = 10;
    this._enableCounter = false;
    this._enableErrorMessage = false;
    this._enableCharacterRestriction = false;
    this._touchEnable = true;
    this.multiline = false;
    super.preConstruct(params);
    this.addAndroidProps(this.getAndroidProps());
  }
  protected createNativeObject(): any {
    const nativeObject = new SFMaterialTextBoxWrapper(AndroidConfig.activity);
    this.textBoxNativeObject = nativeObject.getTextInputEditTextInstance();
    this.sfTextBox = new TextBoxAndroid({ nativeObject: this.textBoxNativeObject });
    return nativeObject;
  }
  showKeyboard(): void {
    this.sfTextBox.showKeyboard();
  }
  hideKeyboard(): void {
    this.sfTextBox.hideKeyboard();
  }
  requestFocus(): void {
    this.sfTextBox.requestFocus();
  }
  removeFocus(): void {
    this.sfTextBox.removeFocus();
  }
  get onTextChanged() {
    return this.sfTextBox.onTextChanged;
  }
  set onTextChanged(value) {
    this.sfTextBox.onTextChanged = value;
  }
  get onClearButtonPress() {
    return this.sfTextBox.onClearButtonPress;
  }
  set onClearButtonPress(value) {
    this.sfTextBox.onClearButtonPress = value;
  }
  get onEditEnds() {
    return this.sfTextBox.onEditEnds;
  }
  set onEditEnds(value) {
    this.sfTextBox.onEditEnds = value;
  }
  get onActionButtonPress() {
    return this.sfTextBox.onActionButtonPress;
  }
  set onActionButtonPress(value) {
    this.sfTextBox.onActionButtonPress = value;
  }
  get onEditBegins() {
    return this.sfTextBox.onEditBegins;
  }
  set onEditBegins(value) {
    this.sfTextBox.onEditBegins = value;
  }

  private getAndroidProps(): IMaterialTextBox['android'] {
    const self = this;
    return {
      get textBoxHeight(): number {
        return self.textBoxNativeObject.getHeight();
      },
      set textBoxHeight(value: number) {
        self.textBoxNativeObject.setHeight(AndroidUnitConverter.dpToPixel(value));
      },
      get textBoxMaxHeight(): number {
        return self.textBoxNativeObject.getMaxHeight();
      },
      set textBoxMaxHeight(value: number) {
        self.textBoxNativeObject.setMaxHeight(AndroidUnitConverter.dpToPixel(value));
      },
      get enableErrorMessage(): boolean {
        return self._enableErrorMessage;
      },
      set enableErrorMessage(value: boolean) {
        self._enableErrorMessage = value;
        self.nativeObject.setErrorEnabled(self._enableErrorMessage);
        if (value && !AndroidConfig.isEmulator) {
          const SFMaterialTextBoxErrorTextAppearance_ID = AndroidConfig.getResourceId('SFMaterialTextBoxErrorTextAppearance', 'style');
          self.nativeObject.getInstance().setErrorTextAppearance(SFMaterialTextBoxErrorTextAppearance_ID);
        }
      },
      get maxLines(): number {
        return self.textBoxNativeObject.getMaxLines();
      },
      set maxLines(value: number) {
        self.textBoxNativeObject.setMaxLines(value);
      },
      get enableCharacterRestriction(): boolean {
        return self._enableCharacterRestriction;
      },
      set enableCharacterRestriction(value: boolean) {
        self._enableCharacterRestriction = value;
        self.nativeObject.setCounterEnabled(self._enableCharacterRestriction);
      }
    };
  }

  get hint(): string {
    return this.nativeObject.getHint().toString();
  }
  set hint(value: string) {
    this.nativeObject.setHint(value);
  }

  get hintTextColor(): IColor {
    return this.__hintTextColor;
  }
  set hintTextColor(value: IColor) {
    this.__hintTextColor = value;
    this.nativeObject.changedErrorTextColor(hintTextColorFieldName, value.nativeObject);
  }

  get selectedHintTextColor(): IColor | null {
    return this._hintFocusedTextColor;
  }
  set selectedHintTextColor(value: IColor | null) {
    if (value) {
      this._hintFocusedTextColor = value;
      this.nativeObject.changedErrorTextColor(hintFocusedTextColorFieldName, value.nativeObject);
    }
  }

  get lineColor(): { normal: IColor | null; selected: IColor | null } {
    return this._lineColorObj;
  }
  set lineColor(value: { normal: IColor | null; selected: IColor | null }) {
    this._lineColorObj = value;

    const jsColorArray: any[] = [];
    const jsStateArray: any[] = [];
    if (this.lineColor.normal) {
      jsColorArray.push(this.lineColor.normal.nativeObject);
      jsStateArray.push(array([state_unfocused], 'int'));
    }

    if (this.lineColor.selected) {
      jsColorArray.push(this.lineColor.selected.nativeObject);
      jsStateArray.push(array([state_focused], 'int'));
    }
    const javaTwoDimensionArray = array(jsStateArray);
    const javaColorArray = array(jsColorArray, 'int');

    const lineColorListState = new NativeColorStateList(javaTwoDimensionArray, javaColorArray);

    this.textBoxNativeObject.setSupportBackgroundTintList(lineColorListState);
  }

  get lineCount(): number {
    return this.textBoxNativeObject.getMinLines();
  }
  set lineCount(value: number) {
    this.textBoxNativeObject.setMinLines(value);
  }

  get multiline(): boolean {
    return !this.textBoxNativeObject.isSingleLine();
  }
  set multiline(value: boolean) {
    this.textBoxNativeObject.setSingleLine(!value);
  }

  get errorColor(): IColor | null {
    return this._errorColor;
  }
  set errorColor(value: IColor | null) {
    this._errorColor = value;
    if (value) {
      if (this._enableErrorMessage !== true) {
        this.android.enableErrorMessage = true;
      }
      const errorView = this.nativeObject.getReCreatedErrorView();
      errorView.setTextColor(value.nativeObject);
    } else {
      const errorView = this.nativeObject.getReCreatedErrorView();
      errorView.setTextColor(undefined);
    }
  }

  get labelsFont(): IFont | null {
    return this.__font;
  }
  set labelsFont(value: IFont | null) {
    this.__font = value;
    this.nativeObject.setTypeface(value?.nativeObject);
    this.nativeObject.setExpandedHintTextSize(AndroidUnitConverter.dpToPixel(value?.size || 0));
  }

  get testId(): any {
    return !AndroidConfig.isEmulator ? AndroidConfig.activity.getResources().getResourceEntryName(this.nativeObject.getId()) : '';
  }
  set testId(value: any) {
    const id = AndroidConfig.activity.getResourceId(value);
    const editTextId = AndroidConfig.activity.getResourceId(value + '_textBox');
    id > 0 && this.nativeObject.setId(id);
    editTextId > 0 && this.sfTextBox.nativeObject.setId(editTextId);
  }

  get touchEnabled(): boolean {
    return this._touchEnable;
  }
  set touchEnabled(value: boolean) {
    this._touchEnable = value;
    // TODO
    this.sfTextBox.enabled = value;
  }

  get rightLayout(): { view: FlexLayoutAndroid | null; width: number; height?: number } {
    return {
      view: this._rightLayout,
      width: this._rightLayoutWidth
    };
  }
  set rightLayout(value: { view: FlexLayoutAndroid | null; width: number; height?: number }) {
    this._rightLayout = value.view;
    this._rightLayoutWidth = value.width || 30;
    const parentFL = new FlexLayoutAndroid();
    this.nativeObject.setRightLayout(this._rightLayout?.nativeObject, this._rightLayout?.android?.yogaNode, parentFL.nativeObject, this._rightLayoutWidth);
  }

  get onTouch(): (e?: Point2D) => boolean {
    return this._onTouch;
  }
  set onTouch(value: (e?: Point2D) => boolean) {
    this._onTouch = value;
    this.setTouchHandlers();

    this.sfTextBox.onTouch = value;
    this.sfTextBox.setTouchHandlers();
  }

  get onTouchEnded(): (isInside: boolean, point: Point2D) => boolean {
    return this._onTouchEnded;
  }
  set onTouchEnded(value: (isInside: boolean, point: Point2D) => boolean) {
    this._onTouchEnded = value;
    this.setTouchHandlers();
    this.sfTextBox.onTouchEnded = value;
    this.sfTextBox.setTouchHandlers();
  }

  get onTouchMoved(): (e: boolean | { isInside: boolean }, point?: Point2D) => boolean {
    return this._onTouchMoved;
  }
  set onTouchMoved(value: (e: boolean | { isInside: boolean }, point?: Point2D) => boolean) {
    this._onTouchMoved = value;
    this.setTouchHandlers();
    this.sfTextBox.onTouchMoved = value;
    this.sfTextBox.setTouchHandlers();
  }

  get onTouchCancelled(): (point: Point2D) => boolean {
    return this._onTouchCancelled;
  }
  set onTouchCancelled(value: (point: Point2D) => boolean) {
    this.onTouchCancelled = value;
    this.setTouchHandlers();
    this.sfTextBox.onTouchCancelled = value;
    this.sfTextBox.setTouchHandlers();
  }

  get errorMessage(): string {
    return this.nativeObject.getError()?.toString() || '';
  }
  set errorMessage(value: string) {
    this._errorText = value;

    //Must re-set all settings. TextInputLayout  re-creates everytime enabling.
    if (!this._enableErrorMessage && this._errorText.length !== 0) {
      this.android.enableErrorMessage = true;
    }
    if (this._errorColor) {
      this.errorColor = this._errorColor;
    }

    this.nativeObject.setError(this._errorText);
  }

  get characterRestriction(): number {
    return this.nativeObject.getCounterMaxLength();
  }
  set characterRestriction(value: number) {
    this._enableCounterMaxLength = value;
    this._enableCounter = this._enableCounterMaxLength !== 0 ? true : false;

    //Must re-set all settings. TextInputLayout  re-creates everytime enabling.
    if (this._enableCharacterRestriction !== true) {
      this.android.enableCharacterRestriction = true;
    }

    if (this._characterRestrictionColor) this.characterRestrictionColor = this._characterRestrictionColor;

    this.nativeObject.setCounterMaxLength(this._enableCounterMaxLength);
  }

  get characterRestrictionColor(): IColor {
    return this._characterRestrictionColor;
  }
  set characterRestrictionColor(value: IColor) {
    this._characterRestrictionColor = value;

    if (this._enableCounter !== true) {
      this.android.enableCharacterRestriction = true;
    }

    const counterView = this.nativeObject.getReCreatedCounterView();
    counterView.setTextColor(this._characterRestrictionColor.nativeObject);
  }

  get maxLength(): number {
    return this.sfTextBox.maxLength;
  }
  set maxLength(value: number) {
    this.sfTextBox.maxLength = value;
  }

  on(eventName: TextBoxEvents, callback: EventListenerCallback) {
    if (Object.values(TextBoxEvents).includes(eventName)) {
      return this.sfTextBox.on(eventName as any, callback);
    } else {
      return super.on(eventName as any, callback);
    }
  }
}
