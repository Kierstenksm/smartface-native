/*globals requireClass*/
const View                  = require('../view');
const extend                = require('js-base/core/extend');
const Font                  = require('../font');
const Color                 = require('../color');
const KeyboardType          = require('../keyboardtype');
const TextAlignment         = require('../textalignment');
const AndroidConfig         = require('../../util/Android/androidconfig');
const Exception             = require("../../util/exception");

const NativeSearchView      = requireClass('android.support.v7.widget.SearchView'); 
const NativeSupportR        = requireClass('android.support.v7.appcompat.R');

// Context.INPUT_METHOD_SERVICE
const INPUT_METHOD_SERVICE = 'input_method';
const INPUT_METHOD_MANAGER = 'android.view.inputmethod.InputMethodManager';

// InputMethodManager.SHOW_FORCED
const SHOW_FORCED = 2;
// InputMethodManager.HIDE_IMPLICIT_ONLY
const HIDE_IMPLICIT_ONLY = 1;

const NativeKeyboardType = [1,  // InputType.TYPE_CLASS_TEXT
    2,              //InputType.TYPE_CLASS_NUMBER
    2 | 8192,       // InputType.TYPE_CLASS_NUMBER | InputType.TYPE_NUMBER_FLAG_DECIMAL
    3,              // InputType.TYPE_CLASS_PHONE
    1 | 16,         // InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_URI
    1,              // InputType.TYPE_CLASS_TEXT
    1,              // InputType.TYPE_CLASS_TEXT
    4,              // InputType.TYPE_CLASS_DATETIME
    2 | 4096,       // InputType.TYPE_CLASS_NUMBER | InputType.TYPE_NUMBER_FLAG_SIGNED
    2 | 8192 | 4096,// InputType.TYPE_CLASS_NUMBER | InputType.TYPE_NUMBER_FLAG_DECIMAL | InputType.TYPE_NUMBER_FLAG_SIGNED 
    1 | 65536,      // InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_FLAG_AUTO_COMPLETE
    1 | 32768,      // InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_FLAG_AUTO_CORRECT
    1 | 4096,       // InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_FLAG_CAP_CHARACTERS
    1 | 16384,      // InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_FLAG_CAP_SENTENCES
    1 | 8192,       // InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_FLAG_CAP_WORDS
    1 | 48,         // InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_EMAIL_SUBJECT
    1 | 80,         // InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_LONG_MESSAGE
    1 | 524288,     // InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS
    1 | 96,         // InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PERSON_NAME
    1 | 64,         // InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_SHORT_MESSAGE
    4 | 32,         // InputType.TYPE_CLASS_DATETIME | InputType.TYPE_DATETIME_VARIATION_TIME
    1 | 32          // InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS
];

// TextAlignment values to Android Gravity Values.
const NativeTextAlignment = [
    48 | 3, // Gravity.TOP | Gravity.LEFT == TextAlignment.TOPLEFT
    48 | 1, // Gravity.TOP | Gravity.CENTER_HORIZONTAL == TextAlignment.TOPCENTER
    48 | 5, // Gravity.TOP | Gravity.RIGHT == TextAlignment.TOPRIGHT
    16 | 3, // Gravity.CENTER_VERTICAL | Gravity.LEFT == TextAlignment.MIDLEFT
    17,     // Gravity.CENTER == TextAlignment.CENTER
    16 | 5, // Gravity.CENTER_VERTICAL | Gravity.RIGHT == TextAlignment.MIDLEFT
    80 | 3, // Gravity.BOTTOM | Gravity.LEFT == TextAlignment.MIDLEFT
    80 | 1, // Gravity.BOTTOM | Gravity.CENTER_HORIZONTAL == TextAlignment.MIDLEFT
    80 | 5  // Gravity.BOTTOM | Gravity.RIGHT == TextAlignment.MIDLEFT
];

const SearchView = extend(View)(
    function (_super, params) {

        if(!this.nativeObject){
            this.nativeObject = new NativeSearchView(AndroidConfig.activity);
            this.nativeObject.onActionViewExpanded();
            // Prevent gain focus when SearchView appear.
            this.nativeObject.clearFocus();
        }
        var mSearchSrcTextView = this.nativeObject.findViewById(NativeSupportR.id.search_src_text);
        var mCloseButton = this.nativeObject.findViewById(NativeSupportR.id.search_close_btn);
        var mSearchButton = this.nativeObject.findViewById(NativeSupportR.id.search_button);

        _super(this);

        var _iconImage = null;
        var _hint = "";
        var _textColor = Color.BLACK;
        var _onTextChangedCallback;
        var _onSearchBeginCallback;
        var _onSearchEndCallback;
        var _onSearchButtonClickedCallback;
        Object.defineProperties(this, 
        {
            'text' : {
                get: function() {
                    return mSearchSrcTextView.getText();
                },
                set: function(text) {
                    if(text){
                        mSearchSrcTextView.setText("" + text);
                    }
                },
                enumerable: true
            },
            'hint' : {
                get: function() {
                    return _hint;
                },
                set: function(hint) {
                    if(hint){
                        _hint = "" + hint;
                        updateQueryHint(this, mSearchSrcTextView, _iconImage, _hint);
                    }
                },
                enumerable: true
            },
            'textColor': {
                get: function() {
                    return _textColor;
                },
                set: function(textColor) {
                    if(!(textColor instanceof Color)){
                        throw new TypeError(Exception.TypeError.DEFAULT + "Color");
                    }
                    _textColor = textColor;
                    mSearchSrcTextView.setTextColor(textColor.nativeObject);
                },
                enumerable: true
            },
            "iconImage": {
                get: function() {
                    return _iconImage;
                },
                set: function(iconImage) {
                    // If setting null to icon, default search icon will be displayed.
                    if(iconImage == null || iconImage instanceof require("../image")){
                        _iconImage = iconImage;
                        updateQueryHint(this, mSearchSrcTextView, _iconImage, _hint);
                    }
                },
                enumerable: true
            },
            'android': {
                value: {},
                enumerable: true
            },
            
            // methods
            'addToHeaderBar': {
                value: function(page){
                    if(page){
                        page.headerBar.addViewToHeaderBar(this);
                    }
                },
                enumerable: true
            },
            'removeFromHeaderBar': {
                value: function(page){
                    if(page){
                        page.headerBar.removeViewFromHeaderBar(this);
                    }
                },
                enumerable: true
            },
            'showKeyboard': {
                value: function(){
                    this.requestFocus();
                },
                enumerable: true
            },
            'hideKeyboard': {
                value: function(){
                    this.removeFocus();
                },
                enumerable: true
            },
            'requestFocus': {
                value: function(){
                    mSearchSrcTextView.requestFocus();
                    // Due to the requirements we should show keyboard when focus requested.
                    var inputMethodManager = AndroidConfig.getSystemService(INPUT_METHOD_SERVICE, INPUT_METHOD_MANAGER);
                    inputMethodManager.toggleSoftInput(SHOW_FORCED, HIDE_IMPLICIT_ONLY);
                },
                enumerable: true
            },
            'removeFocus': {
                value: function(){
                    mSearchSrcTextView.clearFocus();
                    // Due to the requirements we should hide keyboard when focus cleared.
                    var inputMethodManager = AndroidConfig.getSystemService(INPUT_METHOD_SERVICE, INPUT_METHOD_MANAGER);
                    var windowToken = this.nativeObject.getWindowToken();
                    inputMethodManager.hideSoftInputFromWindow(windowToken, 0);
                },
                enumerable: true
            },
            
            'toString': {
                value: function(){
                    return 'SearchView';
                },
                enumerable: true, 
                configurable: true
            },
            
            // events
            'onSearchBegin': {
                get: function() {
                    return _onSearchBeginCallback;
                },
                set: function(onSearchBegin) {
                    _onSearchBeginCallback = onSearchBegin.bind(this);
                },
                enumerable: true
            },
            'onSearchEnd': {
                get: function() {
                    return _onSearchEndCallback;
                },
                set: function(onSearchEnd) {
                    _onSearchEndCallback = onSearchEnd.bind(this);
                },
                enumerable: true
            },
            'onTextChanged': {
                get: function() {
                    return _onTextChangedCallback;
                },
                set: function(onTextChanged) {
                    _onTextChangedCallback = onTextChanged.bind(this);
                },
                enumerable: true
            },
            'onSearchButtonClicked': {
                get: function() {
                    return _onSearchButtonClickedCallback;
                },
                set: function(onSearchButtonClicked) {
                    _onSearchButtonClickedCallback = onSearchButtonClicked.bind(this);
                },
                enumerable: true
            }
        });
        
        var _hintTextColor = Color.LIGHTGRAY;
        var _keyboardType = KeyboardType.DEFAULT;
        var _font = null;
        var _textalignment = TextAlignment.MIDLEFT;
        var _closeImage = null;
        Object.defineProperties(this.android, 
        {
            'hintTextColor': {
                get: function() {
                    return _hintTextColor;
                },
                set: function(hintTextColor) {
                    if(!(hintTextColor instanceof Color)){
                        throw new TypeError(Exception.TypeError.DEFAULT + "Color");
                    }
                    _hintTextColor = hintTextColor;
                    mSearchSrcTextView.setHintTextColor(hintTextColor.nativeObject);
                },
                enumerable: true
            },
            'keyboardType': {
                get: function() {
                    return _keyboardType;
                },
                set: function(keyboardType) {
                    _keyboardType = keyboardType; 
                    this.nativeObject.setInputType(NativeKeyboardType[_keyboardType]);
                }.bind(this),
                enumerable: true
            },
            'font' : {
                get: function() {
                    return _font;
                },
                set: function(font) {
                    if(font instanceof Font){
                        _font = font;
                        mSearchSrcTextView.setTypeface(font.nativeObject);
                        mSearchSrcTextView.setTextSize(font.size);
                    }
                },
                enumerable: true
            },
            'textalignment': {
                get: function() {
                    return _textalignment;
                },
                set: function(textalignment) {
                    _textalignment = textalignment;
                    mSearchSrcTextView.setGravity(NativeTextAlignment[textalignment]);
                },
                enumerable: true
            },
            "closeImage": {
                get: function() {
                    return _closeImage;
                },
                set: function(closeImage) {
                    // If setting null to icon, default search icon will be displayed.
                    if(closeImage == null || closeImage instanceof require("../image")){
                        _closeImage = closeImage;
                        mCloseButton.setImageDrawable(closeImage.nativeObject);
                    }
                },
                enumerable: true
            },
        });
        
        // Handling ios specific properties
        this.ios = {};
        
        if(!this.isNotSetDefaults){
            const NativePorterDuff  = requireClass('android.graphics.PorterDuff');
            const NativeView = requireClass("android.view.View");
            mSearchButton.getDrawable().setColorFilter((Color.WHITE).nativeObject,NativePorterDuff.Mode.SRC_IN);
            mCloseButton.getDrawable().setColorFilter((Color.WHITE).nativeObject,NativePorterDuff.Mode.SRC_IN);
            mSearchSrcTextView.setOnFocusChangeListener(NativeView.OnFocusChangeListener.implement({
                onFocusChange: function(view, hasFocus){
                    if (hasFocus)  {
                        _onSearchBeginCallback && _onSearchBeginCallback();
                    }
                    else {
                        _onSearchEndCallback && _onSearchEndCallback();
                        this.removeFocus();
                    }
                }.bind(this)
            }));
            this.nativeObject.setOnQueryTextListener(NativeSearchView.OnQueryTextListener.implement({
                onQueryTextSubmit: function(query){
                    _onSearchButtonClickedCallback && _onSearchButtonClickedCallback();
                    return false;
                },
                onQueryTextChange: function(newText){
                    _onTextChangedCallback && _onTextChangedCallback(newText);
                    return false;
                }
            }));
        }
        
        // Assign parameters given in constructor
        if (params) {
            for (var param in params) {
                this[param] = params[param];
            }
        }
    }
);

SearchView.iOS = {};
SearchView.iOS.Style = {};

function updateQueryHint(self, mSearchSrcTextView, icon, hint){
    if(icon && icon.nativeObject){
        const NativeSpannableStringBuilder = requireClass("android.text.SpannableStringBuilder");
        const NativeImageSpan = requireClass("android.text.style.ImageSpan");
        var textSize = parseInt(mSearchSrcTextView.getTextSize() * 1.25);
        icon.nativeObject.setBounds(0, 0, textSize, textSize);
        var ssb = new NativeSpannableStringBuilder("   ");
        var imageSpan = new NativeImageSpan(icon.nativeObject);
        // Spannable.SPAN_EXCLUSIVE_EXCLUSIVE = 33
        ssb.setSpan(imageSpan, 1, 2, 33);
        ssb.append(hint);
        mSearchSrcTextView.setHint(ssb);
    }
    else{
        self.nativeObject.setQueryHint(hint);
    }
    
}

module.exports = SearchView;