import TextBox = require("../textbox");
import Font = require("../font");
import Color = require("../color");
import View = require("../view");
/**
 * @class UI.MaterialTextBox
 * @since 3.1.2
 * @extends UI.TextBox
 * MaterialTextBox is a UI which users can edit the text.
 * 
 *     @example
 *     const MaterialTextBox = require('sf-core/ui/materialtextbox');
 *     var materialtextbox = new MaterialTextBox({
 *         height : 50,
 *         hint : "Hint"
 *     });
 *     myPage.layout.addChild(materialtextbox);
 *
 */
declare class MaterialTextBox extends TextBox {
/**
 * Gets/sets the titleFont of the MaterialTextBox. Error label and animated hint label are the same on iOS so this property make changes on both.
 * @property {UI.Font} titleFont
 * @ios
 * @since 3.1.2
 * @deprecated 4.0.7 Use {@link UI.MaterialTextBox#labelsFont labelsFont} instead  
 */
  titleFont: Font;
/**
 * Gets/sets the selectedHintTextColor of the MaterialTextBox.
 * @property {UI.Color} selectedHintTextColor
 * @ios
 * @android
 * @since 3.1.2
 */
  selectedHintTextColor: Color;
/**
 * This property used to assign a view right of MaterialTextBox. The given view's width must be specified.
 * 
 * @property {Object} rightLayout
 * @property {UI.View} rightLayout.view
 * @property {Number} rightLayout.width
 * @android
 * @ios
 * @since 3.2.1
 */
  rightLayout: {
    view: View,
    width: number;
  };
/**
 * Gets/sets the lineColor of the MaterialTextBox. In Android, if error message appears then line color cannot be changed. 
 * @property {Object} [lineColor = {}]
 * @property {UI.Color} lineColor.normal
 * @property {UI.Color} lineColor.selected
 * @android
 * @ios
 * @since 3.1.2
 */
  lineColor: {
    normal: Color;
    selected: Color;
  };
/**
 * Gets/sets the errorColor of the MaterialTextBox. In Android, hint text color does not changed as iOS. 
 * @property {UI.Color} errorColor
 * @android
 * @ios
 * @since 3.1.2
 */
  errorColor: Color;
/**
 * Gets/sets the errorMessage of the MaterialTextBox.
 * @property {String} errorMessage
 * @android
 * @ios
 * @since 3.1.2
 */
  errorMessage: string;
/**
 * Gets/sets the lineHeight of the MaterialTextBox.
 * @property {Number} lineHeight
 * @ios
 * @since 3.1.2
 */
  lineHeight: number;
/**
 * Gets/sets the selectedLineHeight of the MaterialTextBox.
 * @property {Number} selectedLineHeight
 * @ios
 * @since 3.1.2
 */
  selectedLineHeight: number;
/**
 * Gets/sets the characterRestriction of the MaterialTextBox.
 * @property {Number} characterRestriction
 * @android
 * @since 3.1.2
 */
  characterRestriction: number;
/**
 * Gets/sets the characterRestrictionColor of the MaterialTextBox.
 * @property {Number} characterRestriction
 * @android
 * @since 3.1.2
 */
  characterRestrictionColor: number;
/**
 * Gets/sets the labelsFont of the MaterialTextBox. In Android, sets the font to hint and any other labels (such as error and counter labels) but size of font does not take into account except for hint text size.
 * Before using this property you should enable conter , error and give hint text. 
 * In iOS, title and error message appear on same view as native behavior. So given font and size of font  will be applied to both of it. 
 * 
 * @property {UI.Font} labelsFont
 * @android
 * @ios
 * @since 3.1.3
 */
  labelsFont: Font;
/**
 * Gets/sets the enableErrorMessage of the MaterialTextBox. To change error dynamically, you should set this property at the creation moment.
 * 
 * @property {Boolean} enableErrorMessage
 * @android
 * @since 3.1.2
 */
  enableErrorMessage: boolean;
/**
 * Gets/sets the enableCharacterRestriction of the MaterialTextBox. To change counter dynamically at runtime, you should set this property at the creation moment.
 * 
 * @property {Boolean} enableCharacterRestriction
 * @android
 * @since 3.1.2
 */
  enableCharacterRestriction: boolean;
/**
 * Gets/sets the textBoxHeight of the MaterialTextBox. This property is necessary because of the textbox does not grow its height with wrapper container(MaterialTextBox actually is a wrapper of views in Android). 
 * 
 * @property {Number} textBoxHeight
 * @android
 * @since 3.1.2
 * @deprecated 3.2.1 TextBox grows as its wrapper
 */
  textBoxHeight: number;
/**
 * Gets/sets font of a Label. When set to null label uses system font.
 * It is set to null by default. In Android, to make hint text size as your given text size assign the font property in constructor.
 *
 *     @example
 *     const Label = require('sf-core/ui/label');
 *     const Font = require('sf-core/ui/font')
 *     var myLabel = new Label({
 *         text: "This is my label",
 *         visible: true
 *     });
 *     myLabel.font = Font.create("Arial", 16, Font.BOLD);
 *
 * @property {UI.Font} [font = null]
 * @android
 * @ios
 * @since 0.1
 */
  font: Font;
/**
 * Gets/sets the textBoxMaxHeight of the MaterialTextBox.This property is necessary because it has same reason with textBoxHeight property.
 * 
 * @property {Number} textBoxMaxHeight
 * @android
 * @since 3.1.2
 * @deprecated 3.2.1 TextBox grows as its wrapper
 */
  textBoxMaxHeight: number;
}
export = MaterialTextBox;
