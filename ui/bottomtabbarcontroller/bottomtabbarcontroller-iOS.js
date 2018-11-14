function BottomTabBarController(params) {
    var self = this;
    
    ////////////////////////////////////////////////////////////////////////////
    /////////////////////         INIT           ///////////////////////////////
    // // System Specific
    self.ios = {};
    self.android = {};
    
    self.parentController = undefined;

    // View
    self.view = new BottomTabBarView({viewModel : self});
    
    // NativeObjectDirectAccess
    self.nativeObject = self.view.nativeObject;
    ////////////////////////////////////////////////////////////////////////////
    
    // Model
    self.model = new BottomTabBarModel();
    
    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    
    
    // Properties
    Object.defineProperty(self, 'childControllers', {
        get: function() {
            return self.model.childControllers;
        },
        set: function(childControllers) {
            if (typeof childControllers === 'object') {
                self.model.childControllers = childControllers;
                
                var nativeChildPageArray = [];
                for (var i in self.model.childControllers) {
                    self.model.childControllers[i].parentController = self;
                    nativeChildPageArray.push(self.model.childControllers[i].nativeObject);
                }
                self.view.setNativeChildViewControllers(nativeChildPageArray);
            }
        },
        enumerable: true
    });
    
    var _tabBar = new TabBar({nativeObject:self.view.nativeObject.tabBar});
    Object.defineProperty(self, 'tabBar', {
        get: function() {
            return _tabBar;
        },
        set: function (value){
            if (typeof value === "object") {
                Object.assign(_tabBar, value);   
            }
        },
        enumerable: true
    });
    
    Object.defineProperty(self, 'selectedIndex', {
        get: function() {
            return self.model.currentIndex;
        },
        set: function(value) {
            if (typeof value === 'number') {
                self.model.currentIndex = value;
            }
        },
        enumerable: true
    });
    
    ////////////////////////////////////////////////////////////////////////////
    
    // Functions
    this.show = function (){
        self.view.setIndex(self.model.currentIndex);
    };
    
    this.present = function(controller, animation, onComplete) {
        if (typeof controller === "object") {
            var _animationNeed = animation ? animation : true;
            var _completionBlock = onComplete ? function(){onComplete();} : undefined;
                
            var controllerToPresent;
            if (controller && controller.nativeObject) {
                controllerToPresent = controller.nativeObject;
                
                if (typeof self.transitionViews !== "undefined"){
                    controllerToPresent.setValueForKey(true,"isHeroEnabled");
                }
                
                self.view.present(controllerToPresent, _animationNeed, _completionBlock);
            }
        }
    };
    
    this.dismiss = function(onComplete) {
        var _completionBlock = onComplete ? function(){onComplete();} : undefined;
        self.view.dismiss(_completionBlock);
    };
    
    ////////////////////////////////////////////////////////////////////////////
    
    
    // From View's Delegate
    this.shouldSelectByIndex = undefined;
    this.shouldSelectViewController = function(index) {
        var retval = true;
        if (typeof this.shouldSelectByIndex === "function"){
            retval = this.shouldSelectByIndex({index : index});
        }
        return retval;
    };
    
    this.didSelectByIndex = undefined;
    this.didSelectViewController = function(index){
        if (typeof this.didSelectByIndex === "function"){
            this.didSelectByIndex({index : index});
        }
    };
    //////////////////////////////////////////////////////////////////////////
    
    if (params) {
        for (var param in params) {
            this[param] = params[param];
        }
    }
};

const Color = require('sf-core/ui/color');
const Image = require('sf-core/ui/image');
function TabBar(params) {
    const UITabBar = SF.requireClass("UITabBar");
    const TabBarItem = require('sf-core/ui/tabbaritem');
    
    var self = this;
    
    self.android = {};
    
    self.nativeObject = undefined;
    if (params.nativeObject) {
        self.nativeObject = params.nativeObject;
    }
    
    //////////////////////////////////////////////////////////////////////////
    // ITEMS
    
    var _ios = {};
    Object.defineProperty(self, 'ios', {
        get: function() {
            return _ios;
        },
        set: function(value) {
            if (typeof value === 'object') {
                Object.assign(_ios, value);
            }
        },
        enumerable: true
    });
    
    var _items = [];
    Object.defineProperty(self, 'items', {
        get: function() {
            return _items;
        },
        set: function(value) {
            if (typeof value === 'object') {
                _items = value;
                
                for (var i in _items) {
                    if (typeof _items[i].nativeObject === "undefined"){
                        _items[i].nativeObject = self.nativeObject.items[i];   
                    }
                    _items[i].invalidate();
                }
            }
        },
        enumerable: true
    });
    
    // ITEMS DELEGATE
    self.tabBarControllerItemsDidChange = function() {        
        if (self.items.length === self.nativeObject.items.length) {
            for (var i in self.nativeObject.items) {
                self.items[i].nativeObject = self.nativeObject.items[i];
            }
        } else {
            var itemsArray = [];
            for (var i in self.nativeObject.items) {
                var sfTabBarItem = new TabBarItem({nativeObject : self.nativeObject.items[i]});
                itemsArray.push(sfTabBarItem);
            }
            self.items = itemsArray;
        }
    }
    //////////////////////////////////////////////////////////////////////////
    
    Object.defineProperty(self.ios, 'translucent', {
        get: function() {
            return self.nativeObject.translucent;
        },
        set: function(value) {
            if (typeof value === 'boolean') {
                self.nativeObject.translucent = value;
            }
        },
        enumerable: true
    });

    var _itemColor = {
        normal : undefined,
        selected : undefined
    };
    Object.defineProperty(self, 'itemColor', {
        get: function() {
            return _itemColor;
        },
        set: function(itemColorObject) {
            if (typeof itemColorObject === 'object') {
                _itemColor = itemColorObject;
                self.tintColor = _itemColor;
            }
        },
        enumerable: true
    });
    
    Object.defineProperty(self, 'tintColor', {
        get: function() {
            return new Color({color : self.nativeObject.tintColor});
        },
        set: function(value) {
            if (self.nativeObject) {
                if (typeof value.normal === 'object') {
                    var systemVersion = parseInt(SF.requireClass("UIDevice").currentDevice().systemVersion);
                    if (systemVersion >= 10) {
                        self.unselectedItemColor = value.normal;
                    }
                }
                if (typeof value.selected === 'object') {
                    self.nativeObject.tintColor = value.selected.nativeObject;
                }
            }
        },
        enumerable: true,configurable : true
    });
    
    Object.defineProperty(self, 'unselectedItemColor', {
        get: function() {
            return new Color({color : self.nativeObject.unselectedItemTintColor});
        },
        set: function(value) {
            self.nativeObject.unselectedItemTintColor = value.nativeObject;
        },
        enumerable: true,configurable : true
    });
    
    Object.defineProperty(self, 'backgroundColor', {
        get: function() {
            return new Color({color : self.nativeObject.barTintColor});
        },
        set: function(value) {
            self.nativeObject.barTintColor = value.nativeObject;
        },
        enumerable: true,configurable : true
    });
    
    Object.defineProperty(self, 'backgroundImage', {
        get: function() {
            return Image.createFromImage(self.nativeObject.backgroundImage);
        },
        set: function(value) {
            self.nativeObject.backgroundImage = value.nativeObject;
        },
        enumerable: true,configurable : true
    });
    
    Object.defineProperty(self, 'height', {
        get: function() {
            return self.nativeObject.frame.height;
        },
        enumerable: true,configurable : true
    });
    
    var _borderVisibility = true;
    Object.defineProperty(self, 'borderVisibility', {
        get: function() {
            return _borderVisibility;
        },
        set: function(value) {
            if (typeof value === "boolean") {
                if (value) {
                    self.nativeObject.shadowImage = undefined;
                    self.nativeObject.backgroundImage = undefined;
                } else {
                    var emptyImage = __SF_UIImage.getInstance();
                    self.nativeObject.shadowImage = emptyImage;
                    self.nativeObject.backgroundImage = emptyImage;
                }
                _borderVisibility = value;
            }
        },
        enumerable: true,configurable : true
    });
    
    var _selectionIndicatorImage;
    Object.defineProperty(self.ios, 'selectionIndicatorImage', {
        get: function() {
            return _selectionIndicatorImage;
        },
        set: function(value) {
            if (typeof value === "object") {
                _selectionIndicatorImage = value;
                self.nativeObject.selectionIndicatorImage = _selectionIndicatorImage.nativeObject;
            }
        },
        enumerable: true,configurable : true
    });
    
    if (params) {
        for (var param in params) {
            this[param] = params[param];
        }
    }
};

function BottomTabBarView(params) {    
    const UITabBarController = SF.requireClass("UITabBarController");
    
    var self = this;
    self.viewModel = undefined;
    
    if (params.viewModel) {
        self.viewModel = params.viewModel;
    }
    
    self.nativeObject = UITabBarController.new();
    self.nativeObjectDelegate = SF.defineClass('TabBarControllerDelegate : NSObject <UITabBarControllerDelegate>',{
        tabBarControllerShouldSelectViewController : function (tabBarController, viewController) {
            var index = self.nativeObject.viewControllers.indexOf(viewController);
            return self.viewModel.shouldSelectViewController(index);
        },
        tabBarControllerDidSelectViewController : function (tabBarController, viewController) {
            var index = self.nativeObject.viewControllers.indexOf(viewController);
            self.viewModel.didSelectViewController(index);
        }
    }).new();
    self.nativeObject.delegate = self.nativeObjectDelegate;
    
    this.setIndex = function (index) {
        self.nativeObject.selectedIndex = index;
    };
    
    this.present = function (controllerToPresent, animationNeed, completionBlock) {
        self.nativeObject.presentViewController(controllerToPresent, animationNeed, completionBlock);
    };
    
    this.dismiss = function (onComplete) {
        self.nativeObject.dismissViewController(onComplete);
    };
    
    this.setNativeChildViewControllers = function (nativeChildPageArray) {
        self.nativeObject.viewControllers = nativeChildPageArray;
        
        if (nativeChildPageArray.length > 0) {
            self.viewModel.tabBar.tabBarControllerItemsDidChange();  
        }
    };
    
    ////////////////////////////////////////////////////////////////////////////
};

function BottomTabBarModel() {
    var self = this;
    
    self.childControllers = [];
    self.currentIndex = 0;
};

module.exports = BottomTabBarController;