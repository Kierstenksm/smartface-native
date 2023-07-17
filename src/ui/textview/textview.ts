import { ILabel } from '../label/label';
import { TextViewEvents } from './textview-events';
import { Size } from '../../primitive/size';
import { MobileOSProps } from '../../core/native-mobile-component';
import AttributedString from '../attributedstring';
import { Point2D } from '../../primitive/point2d';

export type TextViewiOSProps = ILabel['ios'] & {
  /**
   * Sets/gets visibiliy of scroll bar when text is too long.
   *
   * @property {Boolean} [showScrollBar = false]
   * @ios
   * @since 3.0.0
   */
  showScrollBar: boolean;
  contentOffset: Point2D;
  paginationEnabled: boolean;
};

export type TextViewAndroidPRoperties = ILabel['android'];

/**
 * @since 3.0.0
 * TextView is a view that displays read-only text on the screen.
 *
 *     @example
 *     import TextView from '@smartface/native/ui/textview';
 *     import Color from '@smartface/native/ui/color';
 *     const myTextview = new TextView({
 *         text: "This is my textview",
 *         visible: true
 *     });
 *     myTextview.width = 200,
 *     myTextview.height = 50,
 *     myTextview.top = 10,
 *     myTextview.left = 20,
 *     myTextview.backgroundColor = Color.GRAY;
 */
export declare interface ITextView<
  TEvent extends string = TextViewEvents,
  TMobile extends MobileOSProps<TextViewiOSProps, TextViewAndroidPRoperties> = MobileOSProps<TextViewiOSProps, TextViewAndroidPRoperties>
> extends ILabel<TEvent | TextViewEvents, TMobile> {
  /**
   * Gets/sets HTML text value of TextView. This property helps user showing HTML
   * texts on the screen. In Android, you must avoid to using selectable property to make the links clickable.
   *
   *     @example
   *     // In this example 'This link' text inside TextView will shown underlined.
   *     import TextView from '@smartface/native/ui/textview';
   *     var myTextView = new TextView();
   *     myTextView.htmlText = "<a href='http://www.smartface.io'>This link</a> will redirect you to Smartface website.";
   *
   * @android
   * @ios
   * @since 3.0.0
   */
  htmlText: string;
  /**
   * Enables/disables selectable status of the TextView. If set to true
   * the text inside the TextView will be selectable.
   *
   * @android
   * @ios
   * @since 3.0.0
   */
  selectable: boolean;
  /**
   * Enable/Disable scroll bar when text is too long. If this property is "false", text alignment mid & bottom doesn't work and in Android, it will lose ability of click in attributed string.
   *
   * @ios
   * @android
   * @since 4.0.2
   */
  scrollEnabled: boolean;
  /**
   * Gets/sets attributedText on TextView.
   *
   *     @example
   *     import System from '@smartface/native/device/system';
   *     import TextView from '@smartface/native/ui/textview';
   *     import Color from '@smartface/native/ui/color';
   *     import Font from '@smartface/native/ui/font';
   *     import AttributedString from '@smartface/native/ui/attributedstring';
   *
   *     const textView = new TextView({
   *         flexGrow: 1,
   *         lineSpacing: 20,
   *         letterSpacing: 10,
   *     });
   *
   *     textView.onClick = function(string){
   *         console.log("String " + string);
   *     };
   *
   *     const attributeString = new AttributedString();
   *     attributeString.string = "First\n";
   *     attributeString.foregroundColor = Color.GREEN;
   *
   *     const attributeString2 = new AttributedString();
   *     attributeString2.string = "Second";
   *     attributeString2.link = "Second Link ";
   *
   *     const attributeString3 = new AttributedString();
   *     attributeString3.string = " Third";
   *     attributeString3.link = "Third Link";
   *     attributeString3.backgroundColor = Color.RED;
   *     attributeString3.underline = true;
   *     attributeString3.font = Font.create("Times New Roman",30,Font.NORMAL);
   *     attributeString3.ios.underlineColor = Color.YELLOW;
   *
   *     textView.attributedText = [attributeString,attributeString2,attributeString3];
   *
   * @property {Array} [attributedText = []]
   * @android
   * @ios
   * @since 3.0.0
   */
  attributedText: AttributedString[];
  /**
   * This method returns height & width of given attributed text. This method should be
   * used after assigning all needed properties. If attributedText is not set, this method returns null.
   *
   * @android
   * @ios
   * @since 3.2.1
   */
  getAttributeTextSize(maxWidth: number): Size | null;
  /**
   * This event is called when user click link string. onLinkClick only works with attributedText.
   * Use this with EventEmitter
   * @param {String} string
   * @event onLinkClick
   * @android
   * @deprecated
   * @ios
   * @since 3.0.0
   * @example
   * ```
   * import TextView from '@smartface/native/ui/textview';
   *
   * const textView = new TextView();
   * textView.on(TextView.Events.LinkClick, (params) => {
   *  console.info('onLinkClick', params);
   * });
   * ```
   */
  onLinkClick: (e: string | undefined) => void;

  on(eventName: 'linkClick', callback: (link: string) => void): () => void;
  on(eventName: TextViewEvents, callback: (...args: any[]) => void): () => void;

  off(eventName: 'linkClick', callback: (link: string) => void): void;
  off(eventName: TextViewEvents, callback: (...args: any[]) => void): void;

  emit(eventName: 'linkClick', link: string): void;
  emit(eventName: TextViewEvents, ...args: any[]): void;

  once(eventName: 'linkClick', callback: (link: string) => void): () => void;
  once(eventName: TextViewEvents, callback: (...args: any[]) => void): () => void;

  prependListener(eventName: 'linkClick', callback: (link: string) => void): void;
  prependListener(eventName: TextViewEvents, callback: (...args: any[]) => void): void;

  prependOnceListener(eventName: 'linkClick', callback: (link: string) => void): void;
  prependOnceListener(eventName: TextViewEvents, callback: (...args: any[]) => void): void;
  /**
   * Gets/sets letterSpacing on TextView. letterSpacing just work with attributedText and depends on font.
   *
   * @property {Number} [letterSpacing = 0]
   * @android
   * @ios
   * @since 3.0.0
   */
  letterSpacing: number;
  /**
   * Gets/sets lineSpacing on TextView. lineSpacing just work with attributedText.
   *
   * @property {Number} [lineSpacing = 0]
   * @android
   * @ios
   * @since 3.0.0
   */
  lineSpacing: number;
  /**
   * Sets the height of the TextView to be at most maxLines tall. Setting 0 indicates that maxLines will be as much as given content.
   * @property {Number} [maxLines = 0]
   * @android
   * @ios
   * @since 4.0.2
   */
  maxLines: number;
}