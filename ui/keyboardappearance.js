/**
 * @enum {Number} UI.KeyboardAppearance
 * @static
 * @since 0.1
 *
 * KeyboardAppearance is an enum. It defines keyboard appearance theme on iOS devices only.
 *
 *     @example
 *     const Color = require('nf-core/ui/color');
 *     const TextBox = require('nf-core/ui/textbox');
 *     const KeyboardAppearance = require('nf-core/ui/keyboardappearance');
 * 
 *     var myTextBox = new TextBox({
 *         top: 50, left:50, width: 100, height: 80,
 *         hint: "hint",
 *         backgroundColor: Color.create("#67fcaa"),
 *         ios: {
 *             KeyboardAppearance: KeyboardAppearance.DARK
 *         }
 *     });
 * 
 *     myPage.layout.addChild(myTextBox);
 *
 */
var KeyboardAppearance = { };

/**
 * @property {Number} DEFAULT
 * Default colored keyboard appearance. This constant corresponds to UI.KeyboardAppearance.LIGHT.
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