/**
 * @enum {Number} UI.KeyboardAppearance
 * @static
 * @since 0.1
 *
 * KeyboardAppearance is an enum. It defines keyboard appearance theme.
 * KeyboardAppearance works only for iOS
 *
 *     @example
 *     const TextBox = require('nf-core/ui/textbox');
 *     const KeyboardAppearance = require('nf-core/ui/keyboardappearance');
 *     var myTextBox = new TextBox({
 *         hint: "Smartface TextBox",
 *         ios: {
 *             KeyboardAppearance: KeyboardAppearance.DARK
 *         }
 *     });
 *
 */
var KeyboardAppearance = { };

/**
 * @property {Number} DEFAULT
 * Default colored keyboard appearance. This constant corresponds to the light value.
 * @static
 * @readonly
 * @since 0.1
 */
Object.defineProperty(KeyboardAppearance, 'DEFAULT', {
  value: 0,
  writable: false
});

/**
 * @property {Number} DARK
 * Dark colored keyboard appearance.
 * @static
 * @since 0.1
 * @readonly
 */
Object.defineProperty(KeyboardAppearance, 'DARK', {
  value: 1,
  writable: false
});

/**
 * @property {Number} LIGHT
 * Light colored keyboard appearance.
 * @static
 * @readonly
 * @since 0.1
 */
Object.defineProperty(KeyboardAppearance, 'LIGHT', {
  value: 2,
  writable: false
});

module.exports = KeyboardAppearance;