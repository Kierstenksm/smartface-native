/**
 * @class Font
 * 
 * This class is useful when custom or styled font is needed. Created
 * font objects can be assigned to objects which shows text (Label, Button etc.).
 * 
 *     @example
 *     const Font = require('sf-core/ui/font');
 * 
 *     var label = new Label();
 *     label.style = new Style();
 *     label.style.font = Font.create("Arial", 16, Font.BOLD);
 *
 *     var anotherLabel = new Label();
 *     anotherLabel.style = new Style({
 *         font: Font.createFromFile("assets://MyFont.ttf", 16);
 *     });
 */
function Font() {}

/**
 * @method
 * Creates a font object with given family name.
 * 
 *      @example
 *      var label = new Label();
 *      label.style = new Style();
 *      label.style.font = Font.create("Arial", 16, Font.NORMAL);
 * 
 * @param fontFamily Font family name
 * @param size Font size
 * @param style Font style (NORMAL, BOLD etc.)
 * 
 * @static
 */
Font.create = function(fontFamily, size, style) { }

/**
 * @method
 * Creates a font object from given file path. Path should be a
 * correct font path.
 * 
 *      @example
 *      label.style.font = Font.createFromFile("assets://Arial.ttf", 16);
 * 
 * @param path Font file path
 * @param size Font size
 * 
 * @static
 */
Font.createFromFile = function(path, size) { }

/**
 * Represents normal font style
 * 
 * @property {Number} NORMAL Normal font style
 * @static
 */
Font.NORMAL = 1;

/**
 * Represents bold font style
 * 
 * @property {Number} BOLD Bold font style
 * @static
 */
Font.BOLD = 2;

/**
 * Represents italic font style
 * 
 * @property {Number} ITALIC Italic font style
 * @static
 */
Font.ITALIC = 4;

/**
 * Represents bolditalic font style
 * 
 * @property {Number} BOLD_ITALIC Bold italic font style
 * @static
 */
Font.BOLD_ITALIC = 6;

module.exports = Font;