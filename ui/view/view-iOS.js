function View(params) {
    var self = this;
    
    var _style;
    Object.defineProperty(self, 'style', {
        get: function() {
           return _style;
        },
        set: function(value) {
           _style = value;
           
           self.nativeObject.layer.borderUIColor = UIColor.hexColor(value.borderColor);
           self.nativeObject.layer.borderWidth = value.borderWidth;
           
           _style.addChangeHandler(function(propertyName,value){
               if(propertyName == 'borderColor'){
                   self.nativeObject.layer.borderUIColor = UIColor.hexColor(value);
               }else if(propertyName == 'borderWidth'){
                   self.nativeObject.layer.borderWidth = value;
               }
           });
        },
        enumerable: true
    });
    
    Object.defineProperty(self, 'alpha', {
        get: function() {
            return self.nativeObject.alpha;
        },
        set: function(value) {
            self.nativeObject.alpha = value;
        },
        enumerable: true
    });
    
    var _backgroundColor;
    Object.defineProperty(self, 'backgroundColor', {
        get: function() {
            return _backgroundColor;
        },
        set: function(value) {
            _backgroundColor = value;
            self.nativeObject.backgroundColor = UIColor.hexColor(value);
        },
        enumerable: true
    });
        
    /**
     * Gets/sets id of view. Should be unique number for all objects
     * inside project.
     * 
     * @property {Number} id View identifier
     */
    this.id = 5421;

    Object.defineProperty(self, 'visible', {
        get: function() {
            return self.nativeObject.visible;
        },
        set: function(value) {
            self.nativeObject.visible = value;
        },
        enumerable: true
    });

    Object.defineProperty(self, 'touchEnabled', {
        get: function() {
            return self.nativeObject.touchEnabled;
        },
        set: function(value) {
            self.nativeObject.touchEnabled = value;
        },
        enumerable: true
    });
    

    this.getPosition = function(){
        
       return  {left : self.nativeObject.frame.x , top : self.nativeObject.frame.y , width : self.nativeObject.frame.width, height : self.nativeObject.frame.height};
    }


    this.setPosition = function(position){
        self.left = position.left;
        self.top = position.top;
        self.width = position.width;
        self.height = position.height;
    }


    Object.defineProperty(self, 'left', {
        get: function() {
            return self.nativeObject.frame.y;
        },
        set: function(value) {
            if (typeof value === "string") {
                value = convertPercentage(value, Device.screenWidth);
                if (value < 0) return;
            }
            var frame = this.getPosition();
            self.nativeObject.frame = { x : value, y : frame.top, width : frame.width, height : frame.height};
        },
        enumerable: true
    });
    
    Object.defineProperty(self, 'top', {
        get: function() {
            return self.nativeObject.frame.y;
        },
        set: function(value) {
            if (typeof value === "string") {
                value = convertPercentage(value, Device.screenHeight);
                if (value < 0) return;
            }
            var frame = this.getPosition();
            self.nativeObject.frame = { x : frame.left, y : value, width : frame.width, height : frame.height};
        },
        enumerable: true
    });
    
    Object.defineProperty(self, 'width', {
        get: function() {
            return self.nativeObject.frame.y;
        },
        set: function(value) {
            if (typeof value === "string") {
                value = convertPercentage(value, Device.screenWidth);
                if (value < 0) return;
            }
            var frame = this.getPosition();
            self.nativeObject.frame = { x : frame.left, y : frame.top, width : value, height : frame.height};
        },
        enumerable: true
    });
    
    Object.defineProperty(self, 'height', {
        get: function() {
            return self.nativeObject.frame.y;
        },
        set: function(value) {
            if (typeof value === "string") {
                value = convertPercentage(value, Device.screenHeight);
                if (value < 0) return;
            }
            var frame = this.getPosition();
            self.nativeObject.frame = { x : frame.left, y : frame.top, width : frame.width, height : value};
        },
        enumerable: true
    });

    Object.defineProperty(self, 'onTouch', {
        get: function() {
            return self.nativeObject.onTouch;
        },
        set: function(value) {
            self.nativeObject.onTouch = value;
        },
        enumerable: true
    });

    Object.defineProperty(self, 'onTouchEnded', {
        get: function() {
            return self.nativeObject.onTouchEnded;
        },
        set: function(value) {
            self.nativeObject.onTouchEnded = value;
        },
        enumerable: true
    });
    
    function convertPercentage(stringValue, baseValue) {
        if (/^[0-9]+\%$/.test(stringValue)) {
            var value = parseInt(stringValue, 10)
            if (isNaN(value)) {
                return -1;
            }
            return Math.round(baseValue * value / 100);
        }
        return -1;
    }
}

module.exports = View;