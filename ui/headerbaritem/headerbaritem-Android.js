const UI = require("../");

function HeaderBarItem(params) {
    var _title = "";
    var _image = null;
    var _enabled = true;
    var _onPress = null;
    var _color = null;
    
    Object.defineProperties(this, {
        'color': {
            get: function() {
                return _color;
            },
            set: function(value) {
                _color = value;
            },
            enumerable: true
        },
        'title': {
            get: function() {
                return _title;
            },
            set: function(value) {
                if (typeof(value) !== "string") {
                    return;
                }
                _title = value;
                if (this.nativeObject) {
                    this.nativeObject.setTitle(_title);
                }
            },
            enumerable: true
        },
        'image': {
            get: function() {
                return _image;
            },
            set: function(value) {
                if (value) {
                    _image = value;
                    if (this.nativeObject) {
                        this.nativeObject.setIcon(_image.nativeObject);
                    }
                }
            },
            enumerable: true
        },
        'enabled': {
            get: function() {
                return _enabled;
            },
            set: function(value) {
                _enabled = !!value;
                if (this.nativeObject) {
                    this.nativeObject.setEnabled(_enabled);
                }
            },
            enumerable: true
        },
        'onPress': {
            get: function() {
                return _onPress;
            },
            set: function(value) {
                if (value instanceof Function) {
                    _onPress = value.bind(this);
                }
            },
            enumerable: true
        }
    });

    // Assign parameters given in constructor
    if (params) {
        for (var param in params) {
            this[param] = params[param];
        }
    }
}

module.exports = HeaderBarItem;