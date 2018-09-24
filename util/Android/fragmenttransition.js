const AndroidConfig = require("./androidconfig");
const NativeR = requireClass(AndroidConfig.packageName + '.R');

const activity = AndroidConfig.activity;
const rootViewId = NativeR.id.page_container;

var pageAnimationsCache = {};

function FragmentTransaction(){}

FragmentTransaction.pageCount = 0;
FragmentTransaction.generatePageID = function() {
     return "" + (FragmentTransaction.pageCount++);
};

FragmentTransaction.push = function(params) {
    console.log("FragmentTransaction.push animated param: " + params.animated);
    FragmentTransaction.replace(params);
};

FragmentTransaction.pop = function(params) {
    console.log("FragmentTransaction.pop animated param: " + params.animated);
    params && (params.animationType = FragmentTransaction.AnimationType.LEFTTORIGHT);
    FragmentTransaction.replace(params);
};

FragmentTransaction.replace = function(params) {
    // TODO: Beautify visibility setting of bottom tabbar
    const Application = require("sf-core/application");
    if(params.page.isInsideBottomTabBar) {
        console.log("=======================");
        console.log("=======================");
        console.log("Show BottomTabBar");
        Application.tabBar && Application.tabBar.nativeObject.setVisibility(0); // VISIBLE
        console.log("=======================");
        console.log("=======================");
    } else {
        console.log("=======================");
        console.log("=======================");
        console.log("Hide BottomTabBar");
        Application.tabBar && Application.tabBar.nativeObject.setVisibility(8); // GONE
        console.log("=======================");
        console.log("=======================");
    }
    // don't remove these variables. If they are global values, an exception occurs.
    var fragmentManager = activity.getSupportFragmentManager();
    var fragmentTransaction = fragmentManager.beginTransaction();
    if(params.animated) {
        console.log("params.animationType: " + params.animationType + " === " + FragmentTransaction.AnimationType.RIGHTTOLEFT);
        // check animation type
        switch (params.animationType) {
            case '0':
                console.log("FragmentTransaction.replace RIGHTTOLEFT");
                rightToLeftTransitionAnimation(fragmentTransaction);
                break;
            case '1':
                console.log("FragmentTransaction.replace LEFTTORIGHT");
                leftToRightTransitionAnimation(fragmentTransaction);
                break;
            default:
                break;
        }
    }
    
    var tag = params.page.pageID;
    console.log("tag " + params.page.pageID);
    if(!tag) {
        throw new Error("This page doesn't have an unique ID!");
    }
    
    fragmentTransaction.replace(rootViewId, params.page.nativeObject, tag);
    // fragmentTransaction.addToBackStack(tag);
    fragmentTransaction.commitAllowingStateLoss();
    fragmentManager.executePendingTransactions();
};

function leftToRightTransitionAnimation(fragmentTransaction) {
    console.log("leftToRightTransitionAnimation");
    if (!pageAnimationsCache["LEFTTORIGHT"]) {
        pageAnimationsCache["LEFTTORIGHT"] = {};
        var packageName = activity.getPackageName();
        var resources = AndroidConfig.activityResources;
        pageAnimationsCache["LEFTTORIGHT"].rightEnter = resources.getIdentifier("slide_right_enter", "anim", packageName);
        pageAnimationsCache["LEFTTORIGHT"].rightExit = resources.getIdentifier("slide_right_exit", "anim", packageName);
    }
    
    var rightExit = pageAnimationsCache["LEFTTORIGHT"].rightExit;
    var rightEnter = pageAnimationsCache["LEFTTORIGHT"].rightEnter;
    
    if (rightEnter !== 0 && rightExit !== 0) {
        fragmentTransaction.setCustomAnimations(rightEnter, rightExit);
    }
}

function rightToLeftTransitionAnimation(fragmentTransaction) {
    if (!pageAnimationsCache["RIGHTTOLEFT"]) {
        pageAnimationsCache["RIGHTTOLEFT"] = {};
        var packageName = activity.getPackageName();
        var resources = AndroidConfig.activityResources;
        pageAnimationsCache["RIGHTTOLEFT"].leftEnter = resources.getIdentifier("slide_left_enter", "anim", packageName);
        pageAnimationsCache["RIGHTTOLEFT"].leftExit = resources.getIdentifier("slide_left_exit", "anim", packageName);
        pageAnimationsCache["RIGHTTOLEFT"].rightEnter = resources.getIdentifier("slide_right_enter", "anim", packageName);
        pageAnimationsCache["RIGHTTOLEFT"].rightExit = resources.getIdentifier("slide_right_exit", "anim", packageName);
    }
    
    var leftEnter = pageAnimationsCache["RIGHTTOLEFT"].leftEnter;
    var leftExit = pageAnimationsCache["RIGHTTOLEFT"].leftExit;
    var rightExit = pageAnimationsCache["RIGHTTOLEFT"].rightExit;
    var rightEnter = pageAnimationsCache["RIGHTTOLEFT"].rightEnter;
    
    if (leftEnter !== 0 && leftExit !== 0) {
        fragmentTransaction.setCustomAnimations(leftEnter, leftExit, rightEnter, rightExit);
    }
}

FragmentTransaction.AnimationType = {};
FragmentTransaction.AnimationType.RIGHTTOLEFT = "0";
FragmentTransaction.AnimationType.LEFTTORIGHT = "1";

module.exports = FragmentTransaction;