const TypeUtil                  = require("../../util/type");
const AndroidConfig             = require("../../util/Android/androidconfig");
const Application               = require("../../application");
const Color                     = require("../../ui/color");
const NativeR                   = requireClass(AndroidConfig.packageName + '.R');
const NativeNotificationCompat  = requireClass("android.support.v4.app.NotificationCompat");
const NativeLocalNotificationReceiver = requireClass('io.smartface.android.notifications.LocalNotificationReceiver');
const NativeNotificationListener = requireClass('io.smartface.android.listeners.NotificationListener');

// android.content.Context.NOTIFICATION_SERVICE;
const NOTIFICATION_SERVICE      = "notification";
const NOTIFICATION_MANAGER      = 'android.app.NotificationManager';
// android.content.Context.ALARM_SERVICE;
const ALARM_SERVICE             = "alarm";
const ALARM_MANAGER             = "android.app.AlarmManager";

const LOCAL_NOTIFICATION_RECEIVED = "localNotificationReceived";

var selectedNotificationIds = [];
var senderID = null;
var notificationListener =  NativeNotificationListener.implement({
    onRemoteNotificationReceived: function(data){
        Application.onReceivedNotification && Application.onReceivedNotification({ 'remote': JSON.parse(data) });
    },
    onLocalNotificationReceived: function(data){
        Application.onReceivedNotification && Application.onReceivedNotification({ 'local': JSON.parse(data) });
    }
});

NativeLocalNotificationReceiver.registerRemoteNotificationListener(notificationListener);

function Notifications(){}

Notifications.LocalNotification = function(params) {
    var self = this;
    this.android = {};
    // When notification builded, notification must canceled 
    // via its pending intent and its notification object.
    this.mPendingIntent = null;
    this.mNotification = null;

    this.nativeObject = new NativeNotificationCompat.Builder(AndroidConfig.activity);
    this.nativeObject = self.nativeObject.setSmallIcon(NativeR.drawable.icon);
    
    var _id = getNewNotificationId();
    var _alertBody = "";
    var _alertAction = "";
    var _sound = "";
    var _launchImage = null;
    var _fireDate = Date.now();
    var _repeatInterval = 0;
    Object.defineProperties(this, {
        'alertBody': {
            get: function() {
                return _alertBody;
            },
            set: function(value) {
                if (TypeUtil.isString(value)) {
                    _alertBody = value;
                    self.nativeObject.setContentText(value);
                }
            },
            enumerable: true
        },
        'alertAction': {
            get: function() {
                return _alertAction;
            },
            set: function(value) {
                if (TypeUtil.isString(value)) {
                    _alertAction = value;
                    self.nativeObject.setContentTitle(value);
                }
            },
            enumerable: true
        },
        'sound': {
            get: function() {
                return _sound;
            },
            set: function(value) {
                if (TypeUtil.isString(value)) {
                    _sound = value;
                    // todo sound setting doesn't work causing by issue CLI-175.
                    // self.nativeObject = self.nativeObject.setSound(uri);
                }
            },
            enumerable: true
        },
        'launchImage': {
            get: function() {
                return _launchImage;
            },
            set: function(value) {
                if (TypeUtil.isString(value)) {
                    const Image = require("../../ui/image");
                    var largeImage = Image.createFromFile(value);
                    if(largeImage && largeImage.nativeObject){
                        var largeImageBitmap = largeImage.nativeObject.getBitmap();
                        if(largeImageBitmap){
                            self.nativeObject.setLargeIcon(largeImageBitmap);
                            _launchImage = value;
                        }
                    }
                }
            },
            enumerable: true
        },
        'fireDate': {
            get: function() {
                return _fireDate;
            },
            set: function(value) {
                if(TypeUtil.isNumeric(value)){
                    _fireDate = value;
                }
            },
            enumerable: true
        },
        'repeatInterval': {
            get: function() {
                return _repeatInterval;
            },
            set: function(value) {
                if (TypeUtil.isNumeric(value)) {
                    _repeatInterval = value;
                }
            },
            enumerable: true
        },
        'schedule' : {
            value: function(){
                self.mNotification = self.nativeObject.build();
                startNotificationIntent(self, {
                    // LocalNotificationReceiver.NOTIFICATION_ID
                    // Passing id as string due to AND-2702
                    'id': _id.toString(),
                    // LocalNotificationReceiver.NOTIFICATION_OBJECT
                    'notification': self.mNotification,
                    'fireDate': _fireDate,
                    'repeatInterval': _repeatInterval
                });
            },
            enumerable: true
        },
        'present' : {
            value: function(){
                self.mNotification = self.nativeObject.build();
                startNotificationIntent(self, {
                    // LocalNotificationReceiver.NOTIFICATION_ID
                    // Passing id as string due to AND-2702
                    'id': _id.toString(),
                    // LocalNotificationReceiver.NOTIFICATION_OBJECT
                    'notification': self.mNotification
                });
            },
            enumerable: true
        },
        'cancel' : {
            value: function(){
                if(self.mPendingIntent && self.mNotification){
                    cancelNotificationIntent(self);
                }
            },
            enumerable: true
        },
        //Internal call only.
        'getId' : {
            value: function(){
                return _id;
            }
        },
    });
    
    var _color = 0;
    var _indeterminate = false;
    var _ticker = '';
    var _vibrate = false;
    var _priority = Notifications.Priority.DEFAULT;
    var _subText = '';
    var _ongoing = false;
    Object.defineProperties(this.android,{
        'color' : {
            get: function() {
                return _color;
            },
            set: function(value) {
                if ((value instanceof Color) && (AndroidConfig.sdkVersion >= AndroidConfig.SDK.SDK_LOLLIPOP)) {
                    _color = value;
                    self.nativeObject.setColor(value.nativeObject);
                }
            },
            enumerable: true
        },
        'indeterminate' : {
            get: function() {
                return _indeterminate;
            },
            set: function(value) {
                if(TypeUtil.isBoolean(value)){
                    _indeterminate = value;
                    self.nativeObject.setProgress(0, 100, value);
                }
            },
            enumerable: true
        },
        'ticker' : {
            get: function() {
                return _ticker;
            },
            set: function(value) {
                if (TypeUtil.isString(value)) {
                    _ticker = value;
                    self.nativeObject.setTicker(value);
                }
            },
            enumerable: true
        },
        /** @todo it looks like we got problems with primitive arrays
         * method android.support.v4.app.NotificationCompat$Builder.setVibrate argument 1 has type long[], got java.lang.Long[]"
        * */
        'vibrate' : {
            get: function() {
                return _vibrate;
            },
            set: function(value) {
                if (TypeUtil.isBoolean(value)) {
                    _vibrate = true;
                    self.nativeObject.setVibrate(array([long(1000)], "long"));
                }
            },
            enumerable: true
        },
        'priority' : {
            get: function() {
                return _priority;
            },
            set: function(value) {
                if (TypeUtil.isNumeric(value)) {
                    _priority = value;
                    self.nativeObject.setPriority(value);
                }
            },
            enumerable: true
        },
        'subText' : {
            get: function() {
                return _subText;
            },
            set: function(value) {
                if (TypeUtil.isString(value)) {
                    _subText = value;
                    self.nativeObject.setSubText(value);
                }
            },
            enumerable: true
        },
        'ongoing' : {
            get: function() {
                return _ongoing;
            },
            set: function(value) {
                if (TypeUtil.isBoolean(value)) {
                    _ongoing = value;
                    self.nativeObject.setOngoing(value);
                }
            },
            enumerable: true
        }
    });
    
    // Handling iOS specific properties
     self.ios = {};
    
    // Assign parameters given in constructor
    if (params) {
        for (var param in params) {
            this[param] = params[param];
        }
    }
}

Object.defineProperties(Notifications,{
    'cancelAllLocalNotifications': {
        value: function(){
            var notificationManager = AndroidConfig.getSystemService(NOTIFICATION_SERVICE, NOTIFICATION_MANAGER);
            notificationManager.cancelAll();
        },
        enumerable: true
    },
    'registerForPushNotifications': {
        value: function(onSuccess, onFailure){
            if(!AndroidConfig.isEmulator){
                registerPushNotification(onSuccess, onFailure);
            }
            else{
                onFailure && onFailure();
            }
        },
        enumerable: true
    },
    'unregisterForPushNotifications': {
        value: function(){
            if(!AndroidConfig.isEmulator){
                unregisterPushNotification();
            }
        },
        enumerable: true
    },
});

Object.defineProperty(Notifications, "Priority",{
    value: require("./priority"),
    enumerable: true
});

Object.defineProperty(Notifications, "Android",{
    value: {},
    enumerable: true
});

Object.defineProperty(Notifications.Android, "Priority",{
    value: require("./priority"),
    enumerable: true
});


// Generate unique random number
function getNewNotificationId(){
    var randomnumber = Math.ceil(Math.random()*1000 + 1000);
    while(selectedNotificationIds.indexOf(randomnumber) !== -1){
        randomnumber = Math.ceil(Math.random()*1000 + 1000);
    }
    selectedNotificationIds.push(randomnumber);
    return randomnumber;
}

function unregisterPushNotification(){
    // Implemented due to COR-1281
    if(TypeUtil.isString(senderID) && senderID !== ""){
        const NativeGCMListenerService = requireClass('io.smartface.android.notifications.GCMListenerService');
        const NativeGCMRegisterUtil = requireClass('io.smartface.android.utils.GCMRegisterUtil');
        NativeGCMRegisterUtil.unregisterPushNotification(AndroidConfig.activity);
        if(notificationListener){
            NativeGCMListenerService.unregisterRemoteNotificationListener(notificationListener);
        }
    }
    else{
        throw Error("Not registered to push notification.");
    }
}

function registerPushNotification(onSuccessCallback, onFailureCallback){
    // Checking sender id loaded
    if(!senderID){
        readSenderIDFromProjectJson();
    }
    if(TypeUtil.isString(senderID) && senderID !== '' ){
        const NativeGCMRegisterUtil = requireClass('io.smartface.android.utils.GCMRegisterUtil');
        NativeGCMRegisterUtil.registerPushNotification(senderID, AndroidConfig.activity, {
            onSuccess: function(token){
                const NativeGCMListenerService = requireClass('io.smartface.android.notifications.GCMListenerService');
                NativeGCMListenerService.registerRemoteNotificationListener(notificationListener);
                onSuccessCallback && onSuccessCallback({ 'token' : string(token) });
            },
            onFailure: function(){
                onFailureCallback && onFailureCallback();
            }
        });
    }
    else{
        onFailureCallback && onFailureCallback();
    }
}

function readSenderIDFromProjectJson(){
    // get from GCMRegisterUtil due to the project.json encryption
    const NativeGCMRegisterUtil = requireClass('io.smartface.android.utils.GCMRegisterUtil');
    senderID = NativeGCMRegisterUtil.getSenderID();
}

function startNotificationIntent(self, params){
    const NativeIntent = requireClass('android.content.Intent');
    const NativePendingIntent = requireClass('android.app.PendingIntent')
    /** @todo throw exception here 
     * Error: An exception occured
    */
    var nativeNotificationReceiverClass = requireClass("io.smartface.android.notifications.LocalNotificationReceiver");
    var notificationIntent = new NativeIntent(AndroidConfig.activity, nativeNotificationReceiverClass);
    notificationIntent.putExtra("LOCAL_NOTIFICATION_RECEIVED","");
    Object.keys(params).forEach(function(key){
        notificationIntent.putExtra(key.toString(), params[key]);
    });

    // PendingIntent.FLAG_ONE_SHOT
    self.mPendingIntent = NativePendingIntent.getBroadcast(AndroidConfig.activity, 0, notificationIntent, 1073741824);
    var alarmManager = AndroidConfig.getSystemService(ALARM_SERVICE, ALARM_MANAGER);
    var fireDate = params.fireDate ? params.fireDate : 0;
    if(params.repeatInterval){
        // AlarmManager.RTC_WAKEUP
        alarmManager.setRepeating(0, fireDate, params.repeatInterval, self.mPendingIntent);
    }
    else{
        // AlarmManager.ELAPSED_REALTIME_WAKEUP
         alarmManager.set(2, fireDate, self.mPendingIntent);
    }
}

function cancelNotificationIntent(self){
    // Cancel alarm.
    var alarmManager = AndroidConfig.getSystemService(ALARM_SERVICE, ALARM_MANAGER);
    alarmManager.cancel(self.mPendingIntent);
    // Cancel notification
    var notificationManager = AndroidConfig.getSystemService(NOTIFICATION_SERVICE, NOTIFICATION_MANAGER);
    notificationManager.cancel(self.getId());
}

// Handling iOS specific properties
Notifications.ios = {};

module.exports = Notifications;