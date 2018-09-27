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
function MaterialTextBox(params){}

/**
 * Gets/sets the titleFont of the MaterialTextBox. Error label and animated hint label are the same on iOS so this property make changes on both.
 * @property {UI.Font} titleFont
 * @ios
 * @since 3.1.2
 */
MaterialTextBox.prototype.titleFont;

/**
 * Gets/sets the selectedHintTextColor of the MaterialTextBox.
 * @property {UI.Color} selectedHintTextColor
 * @ios
 * @since 3.1.2
 */
MaterialTextBox.prototype.selectedHintTextColor;

/**
 * Gets/sets the lineColor of the MaterialTextBox. In Android, if error message appears then line color cannot be changed. 
 * @property {Object} [lineColor = {}]
 * @property {UI.Color} lineColor.normal
 * @property {UI.Color} lineColor.selected
 * @android
 * @ios
 * @since 3.1.2
 */
MaterialTextBox.prototype.lineColor;

/**
 * Gets/sets the errorColor of the MaterialTextBox. In Android, hint text color does not changed as iOS. 
 * @property {UI.Color} errorColor
 * @android
 * @ios
 * @since 3.1.2
 */
MaterialTextBox.prototype.errorColor;

/**
 * Gets/sets the errorMessage of the MaterialTextBox.
 * @property {String} errorMessage
 * @android
 * @ios
 * @since 3.1.2
 */
MaterialTextBox.prototype.errorMessage;

/**
 * Gets/sets the lineHeight of the MaterialTextBox.
 * @property {Number} lineHeight
 * @ios
 * @since 3.1.2
 */
MaterialTextBox.prototype.lineHeight;

/**
 * Gets/sets the selectedLineHeight of the MaterialTextBox.
 * @property {Number} selectedLineHeight
 * @ios
 * @since 3.1.2
 */
MaterialTextBox.prototype.selectedLineHeight;


/**
 * Gets/sets the characterRestriction of the MaterialTextBox.
 * @property {Number} characterRestriction
 * @android
 * @since 3.1.2
 */
MaterialTextBox.prototype.characterRestriction;

/**
 * Gets/sets the characterRestrictionColor of the MaterialTextBox.
 * @property {Number} characterRestriction
 * @android
 * @since 3.1.2
 */
MaterialTextBox.prototype.characterRestrictionColor;


/**
 * Gets/sets the labelsFont of the MaterialTextBox. In Android, sets the font to hint and any other labels (such as error and counter labels) but size of font does not take into account.
 * In iOS, title and error message appear on same view as native behavior. So given font and size of font  will be applied to both of it. 
 * 
 * @property {UI.Font} labelsFont
 * @android
 * @ios
 * @since 3.1.2
 */
MaterialTextBox.prototype.labelsFont;



/**
 * Gets/sets the enableErrorMessage of the MaterialTextBox. To change error dynamically, you should set this property at the creation moment.
 * 
 * @property {Boolean} enableErrorMessage
 * @android
 * @since 3.1.2
 */
MaterialTextBox.prototype.enableErrorMessage;


/**
 * Gets/sets the enableCharacterRestriction of the MaterialTextBox. To change counter dynamically at runtime, you should set this property at the creation moment.
 * 
 * @property {Boolean} enableCharacterRestriction
 * @android
 * @since 3.1.2
 */
MaterialTextBox.prototype.enableCharacterRestriction;


/**
 * Gets/sets the textBoxHeight of the MaterialTextBox. This property is necessary because of the textbox does not grow its height with wrapper container(MaterialTextBox actually is a wrapper of views in Android). 
 * 
 * @property {Number} textBoxHeight
 * @android
 * @since 3.1.2
 */
MaterialTextBox.prototype.textBoxHeight;



/**
 * Gets/sets the textBoxMaxHeight of the MaterialTextBox.This property is necessary because it has same reason with textBoxHeight property.
 * 
 * @property {Number} textBoxMaxHeight
 * @android
 * @since 3.1.2
 */
MaterialTextBox.prototype.textBoxMaxHeight;

module.exports = MaterialTextBox;