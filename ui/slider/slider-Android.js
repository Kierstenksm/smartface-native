const extend = require('js-base/core/extend');
const View   = require('sf-core/ui/view');
const Color  = require('sf-core/ui/color');

const SDK_VERSION    = android.os.Build.VERSION.SDK_INT;
const PorterDuffMode = android.graphics.PorterDuff.Mode.SRC_IN;
const BitmapFactory  = android.graphics.BitmapFactory;
const BitmapDrawable = android.graphics.drawable.BitmapDrawable;

const Slider = extend(View)(
    function (_super, params) {
        var self = this;
        if(!self.nativeObject) {
            self.nativeObject = new android.widget.SeekBar(Android.getActivity());
        };
        _super(self);
        
        var _layerDrawable = self.nativeObject.getProgressDrawable().getCurrent();
        var _defaultThumb  = self.nativeObject.getThumb();

        self.nativeObject.setOnSeekBarChangeListener(android.widget.SeekBar.OnSeekBarChangeListener.implement({
            onProgressChanged: function(seekBar, actualValue, fromUser) {
                _onValueChange && _onValueChange(actualValue + _minValue);
            },
            onStartTrackingTouch: function(seekBar) {}, 
            onStopTrackingTouch: function(seekBar) {}
        }));
        
        var _currentValue;
        Object.defineProperty(this, 'value', {
            get: function() {
                return _currentValue;
            }, 
            set: function(value) {
                _currentValue = value;
                
                if (_currentValue < _minValue) {
                    _currentValue = _minValue;
                } else if (_currentValue > _maxValue) {
                    _currentValue = _maxValue;
                }
                
                self.nativeObject.setProgress(_currentValue - _minValue);
            }
        });

        var _minValue;
        Object.defineProperty(this, 'minValue', {
            get: function() {
                return _minValue;
            }, 
            set: function(value) {
                _minValue = value;
                self.nativeObject.setMax(_maxValue - _minValue);
            }
        });

        var _maxValue;
        Object.defineProperty(this, 'maxValue', {
            get: function() {
                return _maxValue;
            }, 
            set: function(value) {
                _maxValue = value
                self.nativeObject.setMax(_maxValue - _minValue);
            }
        });

        var _minTrackColor;
        Object.defineProperty(this, 'minTrackColor', {
            get: function() {
                return _minTrackColor;
            }, 
            set: function(color) {
                if (color) {
                    _minTrackColor = color;

                    _layerDrawable.findDrawableByLayerId(android.R.id.progress).setColorFilter(_minTrackColor, PorterDuffMode);
                }
            }
        });

        var _maxTrackColor;
        Object.defineProperty(this, 'maxTrackColor', {
            get: function() {
                return _maxTrackColor;
            }, 
            set: function(color) {
                if (color) {
                    _maxTrackColor = color;
                    
                    _layerDrawable.findDrawableByLayerId(android.R.id.background).setColorFilter(_maxTrackColor, PorterDuffMode);
                }
            }
        });

        var _thumbImage;
        Object.defineProperty(this, 'thumbImage', {
            get: function() {
                return _thumbImage;
            },
            set: function(imagePath) {
                _thumbImage = imagePath;
                
                var imageBitmap = BitmapFactory.decodeFile(imagePath);
                if (imageBitmap) {
                    var bitmapDrawable = new BitmapDrawable(imageBitmap);
                    self.nativeObject.setThumb(bitmapDrawable);
                }
            }
        });

        var _thumbColor;
        Object.defineProperty(this, 'thumbColor', {
            get: function() {
                return _thumbColor;
            }, 
            set: function(color) {
                if (color) {
                    _thumbColor = color;
                    _defaultThumb.setColorFilter(color, PorterDuffMode);
                    self.nativeObject.setThumb(_defaultThumb);
                }
            }
        });
        
        var _onValueChange;
        Object.defineProperty(this, 'onValueChange', {
            get: function() {
                return _onValueChange;
            }, 
            set: function(callback) {
                _onValueChange = callback;
            }
        });
        
        // SET DEFAULTS
        self.thumbColor = Color.GRAY;
        self.minTrackColor = Color.DARKGRAY;
        self.maxTrackColor = Color.GREEN;
        self.value = 0;
        self.minValue = 0;
        self.maxValue = 100;
        
        // Assign parameters given in constructor
        if (params) {
            for (var param in params) {
                this[param] = params[param];
            }
        }
    }
);
module.exports = Slider;