/*globals requireClass*/
const Color = require("sf-core/ui/color");
const TypeUtil = require('../../util/type');
const AndroidConfig = require("../../util/Android/androidconfig");

const parentPicker = function(subClass) {
    var self = subClass;

    var _title = "Picker";
    var _titleColor = Color.BLACK;
    var _titleFont;
    var _doneButtonText = "Ok";
    var _doneButtonFont, _doneButtonColor;
    var _cancelButtonText = "Cancel";
    var _cancelButtonFont, _cancelButtonColor;

    Object.defineProperties(self, {
        'title': {
            get: function() {
                return _title;
            },
            set: function(title) {
                if (TypeUtil.isString(title))
                    _title = title;
            },
            enumerable: true
        },
        'titleColor': {
            get: function() {
                return _titleColor;
            },
            set: function(color) {
                if (color instanceof Color)
                    _titleColor = color;
            },
            enumerable: true
        },
        'titleFont': {
            get: function() {
                return _titleFont;
            },
            set: function(font) {
                const Font = require('sf-core/ui/font');
                if (font instanceof Font)
                    _titleFont = font;
            },
            enumerable: true
        },
        'cancelButtonColor': {
            get: function() {
                return _cancelButtonColor;
            },
            set: function(color) {
                if (color instanceof Color)
                    _cancelButtonColor = color;
            },
            enumerable: true
        },
        'cancelButtonFont': {
            get: function() {
                return _cancelButtonFont;
            },
            set: function(font) {
                const Font = require('sf-core/ui/font');
                if (font instanceof Font)
                    _cancelButtonFont = font;
            },
            enumerable: true
        },
        'cancelButtonText': {
            get: function() {
                return _cancelButtonText;
            },
            set: function(text) {
                if (TypeUtil.isString(text))
                    _cancelButtonText = text;
            },
            enumerable: true
        },
        'doneButtonColor': {
            get: function() {
                return _doneButtonColor;
            },
            set: function(color) {
                if (color instanceof Color)
                    _doneButtonColor = color;
            },
            enumerable: true
        },
        'doneButtonText': {
            get: function() {
                return _doneButtonText;
            },
            set: function(text) {
                if (TypeUtil.isString(text))
                    _doneButtonText = text;
            },
            enumerable: true
        },
        'doneButtonFont': {
            get: function() {
                return _doneButtonFont;
            },
            set: function(font) {
                const Font = require('sf-core/ui/font');
                if (font instanceof Font)
                    _doneButtonFont = font;
            },
            enumerable: true
        }
    });

    self.createTitleView = function() {
        const NativeTextView = requireClass("android.widget.TextView");
        const Color = require('sf-core/ui/color');

        const CENTER = 17;

        var titleTextView = new NativeTextView(AndroidConfig.activity);
        titleTextView.setText(self.title);
        titleTextView.setBackgroundColor(Color.TRANSPARENT.nativeObject);
        titleTextView.setPaddingRelative(10, 20, 10, 10);
        titleTextView.setGravity(CENTER);
        
        self.titleColor && titleTextView.setTextColor(self.titleColor.nativeObject);
        self.titleFont && titleTextView.setTypeface(self.titleFont.nativeObject);
        self.titleFont && titleTextView.setTextSize(self.titleFont.size);

        return titleTextView;
    };

    self.makeCustomizeButton = function(negativeButton, positiveButton) {
        self.cancelButtonText && negativeButton.setText(self.cancelButtonText);
        self.doneButtonText && positiveButton.setText(self.doneButtonText);
        self.cancelButtonColor && negativeButton.setTextColor(self.cancelButtonColor.nativeObject);
        self.doneButtonColor && positiveButton.setTextColor(self.doneButtonColor.nativeObject);
        self.cancelButtonFont && negativeButton.setTypeface(self.cancelButtonFont.nativeObject);
        self.doneButtonFont && positiveButton.setTypeface(self.doneButtonFont.nativeObject);
    };
};

module.exports = parentPicker;