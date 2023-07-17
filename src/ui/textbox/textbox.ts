import { IView, ViewIOSProps } from '../view/view';
import { IColor } from '../color/color';
import { IFlexLayout } from '../flexlayout/flexlayout';
import { IFont } from '../font/font';
import TextAlignment from '../shared/textalignment';
import KeyboardAppearance from '../shared/keyboardappearance';
import TextContentType from '../shared/textcontenttype';
import KeyboardType from '../shared/keyboardtype';
import ActionKeyType from '../shared/android/actionkeytype';
import { TextBoxEvents } from './textbox-events';
import AutoCapitalize from '../shared/autocapitalize';
import { MobileOSProps } from '../../core/native-mobile-component';
import { TextViewAndroidPRoperties } from '../textview/textview';

export interface TextBoxAndroidProps extends TextViewAndroidPRoperties {
  /**
   * Gets/sets the cursor position of TextBox.
   *
   * @property {Object} cursorPosition
   * @property {Number} cursorPosition.start
   * @property {Number} cursorPosition.end
   * @android
   * @deprecated
   * @since 2.0.8
   * @example
   * ```
   * import TextBox from '@smartface/native/ui/textbox';
   *
   * const textBox = new TextBox();
   * 	console.info(textBox.cursorPosition);
   *
   * ```
   */
  cursorPosition: {
    start: number;
    end: number;
  };
  /**
   * Set an input filter to constrain the text length to the specified number. This property works only for Android.
   *
   * @method maxLength
   * @param {Number} value
   * @android
   * @since 2.0.10
   * @deprecated since 5.0.5 Use the {@link UI.TextBox#maxLength} instead.
   */
  maxLength: number;
}

export interface TextBoxiOSProps extends ViewIOSProps {
  /**
   * This property adjusts font size according to view's fixed width. If you set it true,
   * you should set minimum font size by changing the minimumFontSize property.
   * This property works only for iOS.
   *
   * @property {Boolean} [adjustFontSizeToFit = false]
   * @ios
   * @since 0.1
   */
  adjustFontSizeToFit: boolean;
  /**
   * Gets/sets minimum font size of TextBox.
   * This property works only for iOS.
   *
   * @property {Number} [minimumFontSize = 7]
   * @ios
   * @since 0.1
   */
  minimumFontSize: number;
  /**
   * Gets/sets the visibility of clear button. If enabled, clear button will be shown
   * at right of the TextBox. This property works only for iOS only.
   *
   * @property {Boolean} [clearButtonEnabled = false]
   * @ios
   * @since 0.1
   */
  clearButtonEnabled?: boolean;
  /**
   * Gets/sets a layout to be displayed above the standard system keyboard
   * when the textbox object became focus. This property works only for iOS only.
   * Default is undefined.
   *
   * @property {UI.FlexLayout} [keyboardLayout = undefined]
   * @ios
   */
  keyboardLayout?: IFlexLayout | undefined;
  /**
   * The custom input view to display instead of system keyboard
   * when the textbox object became focus. This property works only for iOS only.
   * Default is undefined.
   *
   * @property {Object} inputView
   * @property {Number} inputView.height
   * @property {UI.View} inputView.view
   * @ios
   */
  inputView?: {
    height: number;
    view: IView;
  };

  /**
   * Gets/sets the appearance style of the keyboard that is associated with the TextBox.
   * This property works only for iOS.
   *
   * @property {UI.KeyboardAppearance} [keyboardAppearance = UI.KeyboardAppearance.DEFAULT]
   * @ios
   * @since 0.1
   */
  keyboardAppearance?: KeyboardAppearance;
  /**
   * Use this property to give the keyboard and the system information about the expected semantic meaning for the content that users enter.
   * This property works only for iOS.
   *
   * @property {UI.iOS.TextContentType} textContentType
   * @ios
   * Creates a textContentType for ios.
   *
   *     @example
   *     import TextContentType from '@smartface/native/ui/ios/textcontenttype';
   *     import System from '@smartface/native/device/system';
   *
   *     if (System.OS == "iOS" && System.OSVersion >= 12){
   *         textbox.ios.textContentType = TextContentType.ONETIMECODE;
   *     }
   *
   * @since 4.1.3
   *
   */
  textContentType?: TextContentType;
}

export interface ITextBox<TEvent extends string = TextBoxEvents, TMobile extends MobileOSProps<TextBoxiOSProps, TextBoxAndroidProps> = MobileOSProps<TextBoxiOSProps, TextBoxAndroidProps>>
  extends IView<TEvent | TextBoxEvents, any, TMobile> {
  /**
   * Gets/sets the font of the TextBox.
   * @property {UI.Font} [font = null]
   * @android
   * @ios
   * @since 0.1
   */
  font: IFont | null;
  /**
   * Gets/sets the text of the TextBox.
   * @property {String} [text = ""]
   * @android
   * @ios
   * @since 0.1
   */
  text: string;
  /**
   * Gets/Sets maximum character lenght restrict of TextBox. 
   * @property {number} [maxLength]
   * @android
   * @ios
   * @since 5.0.5
   */
  maxLength?: number;
  /**
   * Gets/sets automatically capitalization of the TextBox. {@link UI.TextBox#cursorPosition Cursor Position} might be necessary to re-set.
   * @property {UI.TextBox.AutoCapitalize} [autoCapitalize = UI.TextBox.AutoCapitalize.NONE]
   * @android
   * @ios
   * @since 2.8
   */
  autoCapitalize: AutoCapitalize;
  /**
   * Gets/sets the text alignment of the TextBox.
   * @property {UI.TextAlignment} [textAlignment = UI.TextAlignment.MIDLEFT]
   * @android
   * @ios
   * @since 0.1
   */
  textAlignment: TextAlignment;
  /**
   * Gets/sets the text color of TextBox.
   *
   * @property {UI.Color} [textColor = UI.Color.BLACK]
   * @android
   * @ios
   * @since 0.1
   */
  textColor: IColor;
  /**
   * Gets/sets the cursor position of TextBox.
   *
   * @property {Object} cursorPosition
   * @property {Number} cursorPosition.start
   * @property {Number} cursorPosition.end
   * @android
   * @ios
   * @since 2.0.8
   * @example
   * ```
   * import TextBox from '@smartface/native/ui/textbox';
   *
   * const textBox = new TextBox();
   * 	console.info(textBox.cursorPosition);
   *
   * ```
   */
  cursorPosition: {
    start: number;
    end: number;
  };
  /**
   * Gets/sets the event which will be triggered when the textbox object gains focus.
   * On iOS, you can return boolean variable to open keyboard or not.
   * On Android, return value is ignored
   * true -> works normally
   * false -> doesn't open keyboard but still triggers the event
   * @since 7.1.1 -> return value will only work on Smartface version 7.1.1 or above.
   * @example
   * @returns true
   * ```
   * import TextBox from '@smartface/native/ui/textbox';
   *
   * const textBox = new TextBox();
   * textBox.on('editBegins, () => {
   * 	console.info('onEditBegins');
   * });
   * ```
   */
  onEditBegins: () => boolean | void;
  /**
   * Gets/sets the cursor color of TextBox.
   *
   * @property {UI.Color} cursorColor
   * @android
   * @ios
   * @since 3.2.1
   */
  cursorColor: IColor;
  /**
   * Gets/sets hint text that will be displayed when TextBox is empty.
   *
   * @property {String} [hint = ""]
   * @android
   * @ios
   * @since 0.1
   */
  hint: string;

  /**
   * Gets/sets the color of the hint text.
   *
   * @property {UI.Color} [hintTextColor = UI.Color.LIGHTGRAY]
   * @android
   * @ios
   * @since 0.1
   */
  hintTextColor: IColor;

  /**
   * Gets/sets the content of the TextBox is password or not. {@link UI.TextBox#cursorPosition Cursor Position} might be necessary to re-set.
   *
   * @property {Boolean} [isPassword = false]
   * @android
   * @ios
   * @since 0.1
   */
  isPassword: boolean;
  /**
   * Gets/sets keyboard type for TextBox. {@link UI.TextBox#cursorPosition Cursor Position} might be necessary to re-set.
   *
   * @property {UI.KeyboardType} [keyboardType = UI.KeyboardType.DEFAULT]
   * @android
   * @ios
   * @since 0.1
   */
  keyboardType: KeyboardType | null;
  /**
   * Gets/sets action key type for TextBox.
   *
   * @property {UI.ActionKeyType} [actionKeyType = UI.ActionKeyType.DEFAULT]
   * @android
   * @ios
   * @since 0.1
   */
  actionKeyType: ActionKeyType;
  /**
   * This function shows keyboard.
   *
   * @method showKeyboard
   * @android
   * @ios
   * @since 0.1
   * @deprecated 1.1.8 Use {@link UI.TextBox#requestFocus} instead.
   */
  showKeyboard(): void;
  /**
   * This function hides keyboard.
   *
   * @method hideKeyboard
   * @android
   * @ios
   * @since 0.1
   * @deprecated 1.1.8 Use {@link UI.TextBox#removeFocus} instead.
   */
  hideKeyboard(): void;
  /**
   * This function gives focus to the TextBox. When the TextBox gained focus, keyboard will appear.
   *
   * @method requestFocus
   * @android
   * @ios
   * @since 1.1.8
   */
  requestFocus(): void;
  /**
   * This function removes focus from the TextBox. When the TextBox lost its focus, keyboard will disappear.
   *
   * @method removeFocus
   * @android
   * @ios
   * @since 1.1.8
   */
  removeFocus(): void;
  /**
   * This event is called when user inserts or removes a character from TextBox.
   * @param {Object} e Event arguments.
   * @param {String} e.insertedText The text that inserted into TextBox.
   * @param {Number} e.location Index of inserted text.
   * @event onTextChanged
   * @android
   * @ios
   * @since 0.1
   * @deprecated
   * @example
   * ```
   * import TextBox from '@smartface/native/ui/textbox';
   *
   * const textBox = new TextBox();
   * textBox.on(TextBox.Events.TextChanged, (params) => {
   * 	console.info('onTextChanged', params);
   * });
   * ```
   */
  onTextChanged: (e?: { insertedText: string; location: number }) => void;
  /**
   * The text box calls this method in response to the user pressing the built-in clear button. Return value is YES if the text box contents should be cleared; otherwise, NO.
   * If you do not implement this method, the text box clears the text as if the method had returned YES.
   *
   * @event onClearButtonPress
   * @ios
   * @since 4.0.2
   * @deprecated
   * @example
   * ```
   * import TextBox from '@smartface/native/ui/textbox';
   *
   * const textBox = new TextBox();
   * textBox.on(TextBox.Events.ClearButtonPress, () => {
   * 	console.info('onClearButtonPress');
   * });
   * ```
   */
  onClearButtonPress: () => void;
  /**
   * This event is called when user finishes editing by clicking return key
   * or clicking outside of the TextBox.
   * On iOS, you can return boolean variable to close keyboard or not.
   * On Android, return value is ignored
   * true -> works normally
   * false -> doesn't close the keyboard but still triggers the event
   *
   * @example
   * @returns true
   *
   * @event onEditEnds
   * @android
   * @ios
   * @since 7.1.1 -> return value will only work on Smartface version 7.1.1 or above.
   * @example
   * ```
   * import TextBox from '@smartface/native/ui/textbox';
   *
   * const textBox = new TextBox();
   * textBox.on(TextBox.Events.EditEnds, () => {
   * 	console.info('onEditEnds');
   * });
   * ```
   */
  onEditEnds: () => boolean | void;
  /**
   * This event is called when user clicks action key on the keyboard.
   *
   * @param {Object} e Event arguments.
   * @param {UI.ActionKeyType} e.actionKeyType Pressed action key type.
   * @event onActionButtonPress
   * @android
   * @ios
   * @since 0.1
   * @deprecated
   * @example
   * ```
   * import TextBox from '@smartface/native/ui/textbox';
   *
   * const textBox = new TextBox();
   * textBox.on(TextBox.Events.ActionButtonPress, (params) => {
   * 	console.info('onActionButtonPress', params);
   * });
   * ```
   */
  onActionButtonPress: (e?: { actionKeyType: ActionKeyType }) => void;
  /**
   * Gets/sets if the textbox should be touchable and enabled. When set to false, textBox may dim itself depending on the OS.
   */
  enabled?: boolean;

  on(eventName: 'actionButtonPress', callback: (e?: { actionKeyType: ActionKeyType }) => void): () => void;
  on(eventName: 'clearButtonPress', callback: () => void): () => void;
  on(eventName: 'editBegins', callback: () => void): () => void;
  on(eventName: 'editEnds', callback: () => void): () => void;
  on(eventName: 'textChanged', callback: (e?: { insertedText: string; location: number }) => void): () => void;
  on(eventName: TextBoxEvents, callback: (...args: any[]) => void): () => void;

  off(eventName: 'actionButtonPress', callback: (e?: { actionKeyType: ActionKeyType }) => void): void;
  off(eventName: 'clearButtonPress', callback: () => void): void;
  off(eventName: 'editBegins', callback: () => void): void;
  off(eventName: 'editEnds', callback: () => void): void;
  off(eventName: 'textChanged', callback: (e?: { insertedText: string; location: number }) => void): void;
  off(eventName: TextBoxEvents, callback: (...args: any[]) => void): void;

  emit(eventName: 'actionButtonPress', e?: { actionKeyType: ActionKeyType }): void;
  emit(eventName: 'clearButtonPress'): void;
  emit(eventName: 'editBegins'): void;
  emit(eventName: 'editEnds'): void;
  emit(eventName: 'textChanged', e?: { insertedText: string; location: number }): void;
  emit(eventName: TextBoxEvents, ...args: any[]): void;

  once(eventName: 'actionButtonPress', callback: (e?: { actionKeyType: ActionKeyType }) => void): () => void;
  once(eventName: 'clearButtonPress', callback: () => void): () => void;
  once(eventName: 'editBegins', callback: () => void): () => void;
  once(eventName: 'editEnds', callback: () => void): () => void;
  once(eventName: 'textChanged', callback: (e?: { insertedText: string; location: number }) => void): () => void;
  once(eventName: TextBoxEvents, callback: (...args: any[]) => void): () => void;

  prependListener(eventName: 'actionButtonPress', callback: (e?: { actionKeyType: ActionKeyType }) => void): void;
  prependListener(eventName: 'clearButtonPress', callback: () => void): void;
  prependListener(eventName: 'editBegins', callback: () => void): void;
  prependListener(eventName: 'editEnds', callback: () => void): void;
  prependListener(eventName: 'textChanged', callback: (e?: { insertedText: string; location: number }) => void): void;
  prependListener(eventName: TextBoxEvents, callback: (...args: any[]) => void): void;

  prependOnceListener(eventName: 'actionButtonPress', callback: (e?: { actionKeyType: ActionKeyType }) => void): void;
  prependOnceListener(eventName: 'clearButtonPress', callback: () => void): void;
  prependOnceListener(eventName: 'editBegins', callback: () => void): void;
  prependOnceListener(eventName: 'editEnds', callback: () => void): void;
  prependOnceListener(eventName: 'textChanged', callback: (e?: { insertedText: string; location: number }) => void): void;
  prependOnceListener(eventName: TextBoxEvents, callback: (...args: any[]) => void): void;
}
