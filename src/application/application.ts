import { IPage } from '../ui/page/page';
import NavigationController from '../ui/navigationcontroller';
import SliderDrawer from '../ui/sliderdrawer';
import { ApplicationEvents } from './application-events';
import BottomTabBar from '../ui/bottomtabbar';
import StatusBar from './statusbar';
import NavigationBar from './android/navigationbar';
import { NavigationBarStyle } from './android/navigationbar/navigationbar';
import NativeEventEmitterComponent from '../core/native-event-emitter-component';
import { MobileOSProps } from '../core/native-mobile-component';

interface ApplicationCallParams {
  uriScheme: string;
  data?: {};
  onSuccess?: (value?: any) => void;
  onFailure?: (value?: any) => void;
  isShowChooser?: boolean;
  chooserTitle?: string;
  action?: string;
}

interface ApplicationCallReceivedParams {
  eventType: string;
  url: string;
  data: Record<string, any>;
  result: number;
}

export interface ReceivedNotificationParams {
  remote?: Record<string, any>;
  local?: Record<string, any>;
}

export interface ApplicationIOSProps {
  /**
   * The event is called when a user taps a universal link
   *
   * @event onUserActivityWithBrowsingWeb
   * @param {String} url Universal link.
   * @return {Boolean} YES to indicate that your app handled the activity or NO to let iOS know that your app did not handle the activity
   * @ios
   * @since 3.1.2
   */
  onUserActivityWithBrowsingWeb: (url: string) => boolean;
  /**
   * Application bundle identifier.
   *
   * @property {String} bundleIdentifier
   * @readonly
   * @ios
   * @since 3.0.2
   */
  bundleIdentifier: string;
  /**
   * It indicates the directionality of the language in the user interface of the app.
   *
   * @property {Application.LayoutDirection} userInterfaceLayoutDirection
   * @readonly
   * @ios
   * @since 3.1.3
   */
  userInterfaceLayoutDirection: LayoutDirection;
}
export interface ApplicationAndroidProps {
  /**
   * Set/Get the layout direction from a Locale.
   *
   * @property {String} locale
   * @readonly
   * @android
   * @since 3.1.3
   */
  locale: string;
  /**
   * Get current layout direction.
   *
   * @property {Application.LayoutDirection} getLayoutDirection
   * @readonly
   * @android
   * @since 3.1.3
   */
  readonly getLayoutDirection: LayoutDirection;
  /**
   * Application package name.
   *
   * @property {String} packageName
   * @readonly
   * @android
   * @since 0.1
   */
  packageName: string;
  /**
   * This method checks for a permission is shown before to user and the program is about to request the same permission again
   *
   * @method shouldShowRequestPermissionRationale
   * @param {String} permission
   * @return {Boolean}
   * @android
   * @since 1.2
   */
  shouldShowRequestPermissionRationale: (permission: string) => boolean;
  /**
   * Triggered when user press back key. The default implementation finishes the application,
   * but you can override this to do whatever you want.
   *
   * @event onBackButtonPressed
   * @android
   * @deprecated
   * @since 3.2.0
   * @example
   * ```
   * import Application from '@smartface/native/application';
   *
   * Application.on(Application.Events.backButtonPressed, () => {
   * 	console.info('onBackButtonPressed');
   * });
   * ```
   */
  onBackButtonPressed: () => void;
  /**
   * Called to process touch screen events. You can assign callback to intercept all touch screen events before they are dispatched to the window (except independent windows like dialog and etc.).
   * Be sure to call this implementation for touch screen events that should be handled normally. Callback might be fired several times.
   *
   *     @example
   *     import Application from '@smartface/native/application';
   *     Application.android.dispatchTouchEvent = () => {
   *        return true; //Consume all touches & do not pass to window
   *     }
   *
   * @event dispatchTouchEvent
   * @android
   * @return {Boolean}
   * @since 4.0.3
   */
  dispatchTouchEvent: () => boolean;
  /**
   * This event is called after Application.requestPermissions function. This event is
   * fired asynchronous way, there is no way to make sure which request is answered.
   *
   * @since 1.2
   * @event onRequestPermissionsResult
   * @param {Object} e
   * @param {Number} e.requestCode
   * @param {Boolean} e.result Will return array if permission request is multiple.
   * @android
   * @deprecated Use Permissions.android.onRequestPermissionsResult instead
   * @since 1.2
   */
  onRequestPermissionsResult: (e: { requestCode: number; result: boolean[] | boolean }) => void;

  /**
   * This lets you determine the navigation bar of the phone(the bar which usually has native back button and app switch)
   * Works for Android 8.0 and above. Some phones might not have this.
   */
  navigationBar?: NavigationBar;
  /**
   * This function checks if one of the dangerous permissions is granted at beginning or not.
   * For android versions earlier than 6.0, it will return value exists in manifest or not.
   * For permissions in same category with one of the permissions is approved earlier, checking
   * will return as it is not required to request for the same category permission.
   *
   * @method checkPermission
   * @param {String} permission
   * @return {Boolean}
   * @android
   * @since 1.2
   */
  checkPermission: (permission: string) => boolean;
  /**
   * With requestPermissions, the System Dialog will appear to ask for
   * permission grant by user for dangerous(privacy) permissions.
   * {@link Application.android#onRequestPermissionsResult onRequestPermissionsResult} will be fired after user interact with permission dialog.
   *
   *     @example
   *     import Application from '@smartface/native/application';
   *     const PERMISSION_CODE = 1002;
   *     Application.android.requestPermissions(PERMISSION_CODE, Application.Android.Permissions.WRITE_EXTERNAL_STORAGE)
   *     Application.android.onRequestPermissionsResult = (e) => {
   *         console.log(JSON.stringify(e));
   *     }
   *
   * @method requestPermissions
   * @param {Number} requestIdentifier This number  will be returned in {@link Application.android.onRequestPermissionsResult onRequestPermissionsResult} when the user give permission or not.
   * @param {String} permission
   * @android
   * @since 1.2
   */
  requestPermissions: (
    requestIdentifier: number,

    permission: string
  ) => void;
  keyboardMode: KeyboardMode;
  /**
   * Set the configure the native theme.
   *
   * @method setAppTheme
   * @param {String} currentTheme
   * @android
   * @since 4.0.2
   */
  setAppTheme: (theme: string) => void;
}

/**
 * @enum {Number} Application.LayoutDirection
 * @since 3.1.3
 * @ios
 * @android
 */
declare enum LayoutDirection {
  /**
   * Layout direction is left to right.
   *
   * @property {Number} LEFTTORIGHT
   * @ios
   * @android
   * @readonly
   * @since 3.1.3
   */
  LEFTTORIGHT = 0,
  /**
   * Layout direction is right to left.
   *
   * @property {Number} RIGHTTOLEFT
   * @ios
   * @android
   * @readonly
   * @since 3.1.3
   */
  RIGHTTOLEFT = 1
}
/**
 * @enum Application.Android.KeyboardMode
 * @since 3.1.0
 *
 * Enable to change keyboard mode.
 *
 *     @example
 *     import Application  from '@smartface/native/application';
 *     Application.android.keyboardMode = Application.Android.KeyboardMode.KeyboardAdjustResize;
 *
 */
export enum KeyboardMode {
  /**
   * Set to have a screen not adjust for a shown keyboard.
   *
   * @property KeyboardAdjustNothing
   * @readonly
   * @since 3.1.0
   */
  KeyboardAdjustNothing = 48,
  /**
   * Set to have a screen pan when an keyboard is shown,
   * so it doesn't need to deal with resizing but just panned by the framework to ensure the current input focus is visible.
   *
   * @property KeyboardAdjustPan
   * @readonly
   * @since 3.1.0
   */
  KeyboardAdjustPan = 32,
  /**
   * Set to allow the screen to be resized when an keyboard is shown,
   * so that its contents are not covered by the keyboard.
   *
   * @property KeyboardAdjustResize
   * @readonly
   * @since 3.1.0
   */
  KeyboardAdjustResize = 16,
  /**
   * Set as nothing specified. The system will try to pick one or the other depending on the contents of the screen.
   *
   * @property KeyboardAdjustUnspecified
   * @readonly
   * @since 3.1.0
   */
  KeyboardAdjustUnspecified = 0,
  /**
   * Always make the keyboard visible when this window receives input focus.
   *
   * @property AlwaysVisible
   * @readonly
   * @since 3.1.0
   */
  AlwaysVisible = 5,
  /**
   * Always hides any keyboard when this screen receives focus.
   *
   * @property AlwaysHidden
   * @readonly
   * @since 3.1.0
   */
  AlwaysHidden = 3
}

/**
 * @deprecated Use Permmission.AndroidPermissions instead
 */
export enum ApplicationAndroidPermissions {
  /**
   * Allows to read the calendar data.
   *
   * @property READ_CALENDAR
   * @readonly
   * @since 1.1.16
   */
  READ_CALENDAR = 'android.permission.READ_CALENDAR',
  /**
   * Allows an application to write the user's calendar data.
   *
   * @property WRITE_CALENDAR
   * @readonly
   * @since 1.1.16
   */
  WRITE_CALENDAR = 'android.permission.WRITE_CALENDAR',

  /**
   * Required to be able to access the camera device.
   *
   * @property CAMERA
   * @readonly
   * @since 1.1.16
   */
  CAMERA = 'android.permission.CAMERA',
  /**
   * Allows an application to read the user's contacts data.
   *
   * @property READ_CONTACTS
   * @readonly
   * @since 1.1.16
   */
  READ_CONTACTS = 'android.permission.READ_CONTACTS',
  /**
   * Allows an application to write the user's contacts data.
   *
   * @property WRITE_CONTACTS
   * @readonly
   * @since 1.1.16
   */
  WRITE_CONTACTS = 'android.permission.WRITE_CONTACTS',
  /**
   * Allows access to the list of accounts in the Accounts Service.
   *
   * @property GET_ACCOUNTS
   * @readonly
   * @since 1.1.16
   */
  GET_ACCOUNTS = 'android.permission.GET_ACCOUNTS',
  /**
   * Allows an app to access precise location.
   *
   * @property ACCESS_FINE_LOCATION
   * @readonly
   * @since 1.1.16
   */
  ACCESS_FINE_LOCATION = 'android.permission.ACCESS_FINE_LOCATION',
  /**
   * Allows an app to access approximate location.
   *
   * @property ACCESS_COARSE_LOCATION
   * @readonly
   * @since 1.1.16
   */
  ACCESS_COARSE_LOCATION = 'android.permission.ACCESS_COARSE_LOCATION',
  /**
   * Allows an application to record audio.
   *
   * @property RECORD_AUDIO
   * @readonly
   * @since 1.1.16
   */
  RECORD_AUDIO = 'android.permission.RECORD_AUDIO',
  /**
   * Allows read only access to phone state, including the phone number of the device,
   * current cellular network information, the status of any ongoing calls, and a list
   * of any PhoneAccounts registered on the device.
   *
   * @property READ_PHONE_STATE
   * @readonly
   * @since 1.1.16
   */
  READ_PHONE_STATE = 'android.permission.READ_PHONE_STATE',
  /**
   * Allows an application to initiate a phone call without going through the
   * Dialer user interface for the user to confirm the call.
   *
   * @property CALL_PHONE
   * @readonly
   * @since 1.1.16
   */
  CALL_PHONE = 'android.permission.CALL_PHONE',
  /**
   * Allows an application to read the user's call log.
   *
   * @property READ_CALL_LOG
   * @readonly
   * @since 1.1.16
   */
  READ_CALL_LOG = 'android.permission.READ_CALL_LOG',
  /**
   * Allows an application to write (but not read) the user's call log data.
   *
   * @property WRITE_CALL_LOG
   * @readonly
   * @since 1.1.16
   */
  WRITE_CALL_LOG = 'android.permission.WRITE_CALL_LOG',
  /**
   * Allows an application to add voicemails into the system.
   *
   * @property ADD_VOICEMAIL
   * @readonly
   * @since 1.1.16
   */
  ADD_VOICEMAIL = 'com.android.voicemail.permission.ADD_VOICEMAIL',
  /**
   * Allows an application to use SIP service.
   *
   * @property USE_SIP
   * @readonly
   * @since 1.1.16
   */
  USE_SIP = 'android.permission.USE_SIP',
  /**
   * Allows an application to see the number being dialed during an
   * outgoing call with the option to redirect the call to a different
   * number or abort the call altogether.
   *
   * @property PROCESS_OUTGOING_CALLS
   * @readonly
   * @since 1.1.16
   */
  PROCESS_OUTGOING_CALLS = 'android.permission.PROCESS_OUTGOING_CALLS',
  /**
   * Allows an application to access data from sensors
   * that the user uses to measure what is happening inside
   * his/her body, such as heart rate.
   *
   * @property BODY_SENSORS
   * @readonly
   * @since 1.1.16
   */
  BODY_SENSORS = 'android.permission.BODY_SENSORS',
  /**
   * Allows an application to send SMS messages.
   *
   * @property SEND_SMS
   * @readonly
   * @since 1.1.16
   */
  SEND_SMS = 'android.permission.SEND_SMS',
  /**
   * Allows an application to receive SMS messages.
   *
   * @property RECEIVE_SMS
   * @readonly
   * @since 1.1.16
   */
  RECEIVE_SMS = 'android.permission.RECEIVE_SMS',
  /**
   * Allows an application to read SMS messages.
   *
   * @property READ_SMS
   * @readonly
   * @since 1.1.16
   */
  READ_SMS = 'android.permission.READ_SMS',
  /**
   * Allows an application to receive WAP push messages.
   *
   * @property RECEIVE_WAP_PUSH
   * @readonly
   * @since 1.1.16
   */
  RECEIVE_WAP_PUSH = 'android.permission.RECEIVE_WAP_PUSH',
  /**
   * Allows an application to monitor incoming MMS messages.
   *
   * @property RECEIVE_MMS
   * @readonly
   * @since 1.1.16
   */
  RECEIVE_MMS = 'android.permission.RECEIVE_MMS',
  /**
   * Allows to read from external storage.
   * If you granted {@link Application.Android.Permissions#WRITE_EXTERNAL_STORAGE WRITE_EXTERNAL_STORAGE} permission,
   * you don't need this to granted this permission.
   *
   * @property READ_EXTERNAL_STORAGE
   * @readonly
   * @since 1.1.16
   */
  READ_EXTERNAL_STORAGE = 'android.permission.READ_EXTERNAL_STORAGE',
  /**
   * Allows to write to external storage.
   *
   * @property WRITE_EXTERNAL_STORAGE
   * @readonly
   * @since 1.1.16
   */
  WRITE_EXTERNAL_STORAGE = 'android.permission.WRITE_EXTERNAL_STORAGE',
  /**
   * Allows applications to write the apn settings and read sensitive fields of an existing apn settings like user and password.
   * You should include relevant permission setting to your AndroidManifest.xml file.
   *
   * @property WRITE_APN_SETTINGS
   * @readonly
   * @since 4.3.2
   */
  WRITE_APN_SETTINGS = 'android.permission.WRITE_APN_SETTINGS',
  /**
   * Allows an app to use fingerprint hardware. This permission have been deprecated on API 26 or higher. Use `USE_BIOMETRICS` instead.
   * @property USE_FINGERPINT
   * @readonly
   * @deprecated
   */
  USE_FINGERPRINT = 'android.permission.USE_FINGERPRINT',
  /**
   * Allows an app to use device supported biometric modalities.
   * @property USE_BIOMETRIC
   * @readonly
   */
  USE_BIOMETRIC = 'android.permission.USE_BIOMETRIC'
}

/**
 * Determines whether the application appearance is light or dark theme.
 * 
 * @enum Application.Appearance
 * @since 5.0.7
 * @ios
 * @android
 */
export enum Appearance {
  LIGHT = "light",
  DARK = "dark"
}

/**
 * @class Application
 * @since 0.1
 *
 * A set of collection for application based properties and methods.
 */
export interface IApplication extends NativeEventEmitterComponent<ApplicationEvents, any, MobileOSProps<ApplicationIOSProps, ApplicationAndroidProps>> {
  /**
   * The received bytes from the application.
   *
   * @property {Number} byteReceived
   * @readonly
   * @android
   * @ios
   * @since 0.1
   */
  byteReceived: number;
  /**
   * The sent bytes from the application
   *
   * @property {Number} byteSent
   * @readonly
   * @android
   * @ios
   * @since 0.1
   */
  byteSent: number;
  /**
   * Gets/sets sliderDrawer of the Application.
   *
   * @property {UI.SliderDrawer}
   * @defaultValue null
   * @android
   * @ios
   * @since 3.2.0
   */
  sliderDrawer: SliderDrawer;

  /**
   * This property allows you to prevent the screen from going to sleep while your app is active.
   *
   * @property {Boolean}
   * @android
   * @defaultValue false
   * @ios
   * @since 4.3.1
   */
  keepScreenAwake: boolean;
  /**
   * Exists the application.
   *
   * @method exit
   * @android
   * @ios
   * @since 0.1
   */
  exit: () => void;
  /**
   * Restarts the application.
   *
   * @method restart
   * @android
   * @ios
   * @since 0.1
   */
  restart: () => void;

  /**
   * Set root controller of the application.
   *
   * @method setRootController
   * @param {Object} params
   * @param {UI.Page|UI.NavigationController} controller
   * @param {Boolean} [animated=false]
   * @android
   * @ios
   * @since 3.2.0
   */
  setRootController: (controller: NavigationController) => void;
  /**
   * Launches another application and passes data. For Android, you can open application chooser with
   * isShowChooser parameter and set chooser dialog title with chooserTitle.
   * If an app can open a given URL resource onSuccess callback will be triggered otherwise onFailure will be triggered.
   *
   *     @example
   *     // Calling application's Google Play Store page. Will work only for iOS
   *     Application.call({
   *         uriScheme: "market://details",
   *         data: {
   *             'id': Application.android.packageName
   *         }
   *     });
   *     // Open caller app with phone number.
   *     Application.call({ uriScheme: "tel:+901234567890", data: {} });
   *     // Call another application with its own url schema.
   *     Application.call({
   *         uriScheme: "mySchema://",
   *         data: {
   *             key: encodeURIComponent("Smartace Encoded Data")
   *         },
   *         onSuccess: function() {
   *             alert("Application call completed")
   *         },
   *         onFailure: function() {
   *             alert("Application call failed")
   *         }
   *     });
   *     // Call another application with package name and activity name. Works only for Android.
   *     Application.call({ uriScheme: "io.smartface.SmartfaceDev|io.smartface.SmartfaceDev.A", data: {} });
   *     // Call Smartface Emulator with url schema.
   *     Application.call({ uriScheme: "smartface-emulator://", data : {} });
   *     // Open Youtube with Chooser for Android
   *     Application.call({
   *         uriScheme: "https://www.youtube.com/watch?v=VMLU9mfzHYI",
   *         data: {},
   *         onSuccess: function() {
   *             alert("Application call completed")
   *         },
   *         onFailure: function() {
   *             alert("Application call failed")
   *         },
   *         isShowChooser: true,
   *         chooserTitle: "Select an Application"
   *     });
   *
   *
   * @method call
   * @param {Object} params
   * @param {String} params.uriScheme
   * @param {Object} params.data parameter should be url encoded if necessary.
   * @param {Function} params.onSuccess Added in 1.1.13.
   * @param {Function} params.onFailure Added in 1.1.13.
   * @param {Boolean} params.isShowChooser Added in 1.1.13.
   * @param {String} params.chooserTitle Added in 1.1.13.
   * @param {String} params.action  Such as <a href="https://developer.android.com/reference/android/content/Intent.html#ACTION_VIEW">android.intent.action.VIEW</a>
   * @readonly
   * @deprecated Use Linking.openURL instead
   * @android
   * @ios
   * @since 0.1
   */
  call: (params: ApplicationCallParams) => void;
  /**
   * Checks URL's scheme can be handled or not by some app that installed on the device.
   *
   * To pass this method, URL schemes must be declared into "Info.plist" file for iOS
   * and AndroidManifest.xml file for Android.
   *
   * @example for Google Maps
   *
   *		// (Info.plist entry)
   *      <key>LSApplicationQueriesSchemes</key>
   *      <array>
   *          <string>comgooglemaps</string>
   *      </array>
   *
   *    // After entry add on, urlScheme can be check;
   * 	 	import Application from '@smartface/native/application';
   *    const isAppAvaible = Application.canOpenUrl("comgooglemaps://");
   *
   * 		// (AndroidManifest.xml entry)
   * 		<manifest ...>
   * 			...
   * 			<queries>
   *  			<intent>
   *					<action android:name="android.intent.action.VIEW" />
   *  				<data android:scheme="geo"/>
   *				</intent>
   * 			</queries>
   * 		</manifest>
   *
   * 	 	import Application from '@smartface/native/application';
   *    const isAppAvaible = Application.canOpenUrl("geo://");
   *
   * @method canOpenUrl
   * @param {String} url
   * @return {Boolean}
   * @deprecated Use Linking.canOpenURL instead
   * @ios
   * @android
   * @since 4.3.6
   * @see https://developer.android.com/training/package-visibility
   */
  canOpenUrl: (url: string) => boolean;
  /**
   * Gets status bar object. This property is readonly, you can not set
   * status bar but you can change properties of status bar of application.
   *
   * @property {UI.StatusBar} statusBar
   * @android
   * @ios
   * @readonly
   * @since 3.2.0
   */
  statusBar: typeof StatusBar;
  /**
   * Static variable that determines direction of the layouts. It can be LTR or RTL
   */
  LayoutDirection: typeof LayoutDirection;
  Android: {
    /**
     * Static Variable to change keyboard type for input fields.
     */
    KeyboardMode: typeof KeyboardMode;
    /**
     * This lets you determine the navigation bar of the phone(the bar which usually has native back button and app switch)
     * Works for Android 8.0 and above. Some phones might not have this.
     */
    NavigationBar: {
      /**
       * Determines whether the navigation bar should be light theme or dark theme based.
       */
      style: NavigationBarStyle;
    };
    /**
     * @enum Application.Android.Permissions
     * @since 1.1.16
     *
     * Permission enum for Application.
     * Permission managements should be developed OS specific in the applications.
     * Application.android.Permissions deprecated since 1.1.16. Use Application.Android.Permissions instead.
     */
    Permissions: typeof ApplicationAndroidPermissions;
  };
  /**
   * Triggered when unhandelled error occurs.
   *
   * @since 1.2
   * @event onUnhandledError
   * @android
   * @ios
   * @since 1.2
   * @example
   * ```
   * import Application from '@smartface/native/application';
   *
   * Application.on(Application.Events.UnhandledError, (error) => {
   * 	console.info('onUnhandledError', error);
   * });
   * ```
   */
  onUnhandledError: (error: UnhandledError) => void;
  /**
   * Triggered before exiting application.
   *
   * @since 0.1
   * @event onExit
   * @android
   * @ios
   * @deprecated
   * @since 0.1
   * @example
   * ```
   * import Application from '@smartface/native/application';
   *
   * Application.on(Application.Events.Exit, () => {
   * 	console.info('onExit');
   * });
   * ```
   */
  onExit(): void;
  /**
   * Triggered after a push (remote) notification recieved. This event will be
   * fired only if application is active and running.
   *
   * @event onReceivedNotification
   * @param {Object} data
   * @param {Object} data.remote
   * @param {Object} data.local
   * @android
   * @ios
   * @deprecated
   * @since 0.1
   * @example
   * ```
   * import Application from '@smartface/native/application';
   *
   * Application.on(Application.Events.ReceivedNotification, (params) => {
   * 	console.info('onReceivedNotification', params);
   * });
   * ```
   */
  onReceivedNotification: (data: ReceivedNotificationParams) => void;
  /**
   * Triggered when application is called by another application.
   * For Android, onApplicationCallReceived will be triggered when
   * the application started from System Launcher. For this reason,
   * if data does not contain key that you can handle, you should ignore this call.
   *
   * @event onApplicationCallReceived
   * @param {Object} e
   * @param {Object} e.data Data sent by application.
   * @param {String} e.eventType Can be "call" or "callback".
   * This parameter is available only for Android. For iOS this always returns "call".
   * For example; Application A calls application B, eventType becomes "call" for application B.
   * When application B is done its job and application A comes foreground and eventType becomes
   * "callback" for Android.
   * @param {Number} e.result This parameter is available only for Android and when eventType is
   * "callback". Returns Android Activity result code.
   * @see https://developer.android.com/training/basics/intents/result.html
   * @android
   * @ios
   * @deprecated
   * @since 1.1.13
   * @see https://developer.android.com/training/sharing/receive.html
   * @example
   * ```
   * import Application from '@smartface/native/application';
   *
   * Application.on(Application.Events.ApplicationCallReceived, (params) => {
   * 	console.info('onApplicationCallReceived', params);
   * });
   * ```
   */
  onApplicationCallReceived: (e: ApplicationCallReceivedParams) => void;
  /**
   * Triggered when application is opened by an app shortcut.
   * App shortcuts is also named Home Screen Quick Actions in iOS.
   *
   * @event onAppShortcutReceived
   * @param {Object} e
   * @param {Object} e.data Data comes from extras of app shortcut intent in Android
   * or UserInfo of app shortcut in iOS.
   *
   * @android
   * @ios
   * @deprecated
   * @since 4.3.6
   * @see https://developer.android.com/guide/topics/ui/shortcuts
   * @see https://developer.apple.com/documentation/uikit/menus_and_shortcuts/add_home_screen_quick_actions
   * @example
   * ```
   * import Application from '@smartface/native/application';
   *
   * Application.on(Application.Events.appShortcutReceived, (params) => {
   * 	console.info('onAppShortcutReceived', params);
   * });
   * ```
   */
  onAppShortcutReceived: (e: { data: { [key: string]: any } }) => void;
  /**
   * Triggered after application bring to foreground state. In Android, it triggered even the user is leaving another activity(even the activities launched by your app).
   * That means Permissions & derived from Dialog components are makes this callback to triggered.
   *
   * @since 0.1
   * @event onMaximize
   * @android
   * @ios
   * @deprecated
   * @since 0.1
   * @example
   * ```
   * import Application from '@smartface/native/application';
   *
   * Application.on(Application.Events.Maximize, () => {
   * 	console.info('onMaximize');
   * });
   * ```
   */
  onMaximize: () => void;
  /**
   * Triggered after application bring to background state. Background state means that user is in another app or on the home screen. In Android, it triggered even the user is launching another activity(even the activities launched by your app).
   * That means Permissions & derived from Dialog components are make this callback to triggered.
   *
   * @since 0.1
   * @event onMinimize
   * @android
   * @ios
   * @deprecated
   * @since 0.1
   * @example
   * ```
   * import Application from '@smartface/native/application';
   *
   * Application.on(Application.Events.Minimize, () => {
   * 	console.info('onMinimize');
   * });
   * ```
   */
  onMinimize: () => void;
  /**
   * This function hides keyboard.
   *
   * @method hideKeyboard
   * @android
   * @ios
   * @since 3.0.1
   */
  hideKeyboard: () => void;
  /**
   * The specified release channel within project.json.
   *
   * @property {String} currentReleaseChannel
   * @readonly
   * @android
   * @ios
   * @since 0.1
   */
  currentReleaseChannel: string;
  /**
   * The application name within project.json
   *
   * @property {String} smartfaceAppName
   * @readonly
   * @android
   * @ios
   * @deprecated
   * @since 0.1
   */
  smartfaceAppName: string;
  /**
   * The application name within project.json
   *
   * @property {String} appName
   * @readonly
   * @android
   * @ios
   * @since 4.0.7
   */
  appName: string;
  /**
   * The application version within project.json
   *
   * @property {Number} version
   * @readonly
   * @android
   * @ios
   * @since 0.1
   */
  version: string;
  /**
   * Indicates whether the voiceover is enabled. Voiceover is also called a screen reader on Android.
   *
   * @property {Boolean} isVoiceOverEnabled
   * @readonly
   * @android
   * @ios
   * @since 4.3.6
   */
  isVoiceOverEnabled: Boolean;
  /**
   * Indicates whether the appearance of the native components such as alert, DatePicker, TimePicker, etc.
   * Android handle the components internally Alert, Picker, SelectablePicker, TimePicker, DatePicker. But for iOS
   * apart from Keyboard and Alert components, must be handled by assigning the proper colors on the component properties.
   * 
   * @property { Application.Appearance } appearance
   * @android
   * @ios
   * @since 5.0.7
   */
  appearance: Appearance;
  /**
   * Provides current page instance of the application. Please do not use this property for page actions.
   * Works for Android only. Will always be undefined on iOS
   * @android
   * @private
   */
  currentPage: IPage;
  /**
   * For internal usage only.
   * @private
   */
  registOnItemSelectedListener(): void;
  /**
   * For internal usage only.
   * @private
   */
  tabBar?: BottomTabBar;

  on(eventName: 'exit', callback: () => void): () => void;
  on(eventName: 'maximize', callback: () => void): () => void;
  on(eventName: 'minimize', callback: () => void): () => void;
  on(eventName: 'receivedNotification', callback: (e: ReceivedNotificationParams) => void): () => void;
  on(eventName: 'unhandledError', callback: (e: UnhandledError) => void): () => void;
  on(eventName: 'applicationCallReceived', callback: (e: ApplicationCallReceivedParams) => void): () => void;
  on(eventName: 'appShortcutReceived', callback: (e: Record<string, any>) => void): () => void;
  on(eventName: 'backButtonPressed', callback: () => void): () => void;
  on(eventName: ApplicationEvents, callback: (...args: any[]) => void): () => void;

  off(eventName: 'exit', callback: () => void): void;
  off(eventName: 'maximize', callback: () => void): void;
  off(eventName: 'minimize', callback: () => void): void;
  off(eventName: 'receivedNotification', callback: (e: ReceivedNotificationParams) => void): void;
  off(eventName: 'unhandledError', callback: (e: UnhandledError) => void): void;
  off(eventName: 'applicationCallReceived', callback: (e: ApplicationCallReceivedParams) => void): void;
  off(eventName: 'appShortcutReceived', callback: (e: Record<string, any>) => void): void;
  off(eventName: 'backButtonPressed', callback: () => void): void;
  off(eventName: ApplicationEvents, callback: (...args: any[]) => void): void;

  emit(eventName: 'exit'): void;
  emit(eventName: 'maximize'): void;
  emit(eventName: 'minimize'): void;
  emit(eventName: 'receivedNotification', e: ReceivedNotificationParams): void;
  emit(eventName: 'unhandledError', e: UnhandledError): void;
  emit(eventName: 'applicationCallReceived', e: ApplicationCallReceivedParams): void;
  emit(eventName: 'appShortcutReceived', e: Record<string, any>): void;
  emit(eventName: 'backButtonPressed'): void;
  emit(eventName: ApplicationEvents, ...args: any[]): void;

  once(eventName: 'exit', callback: () => void): () => void;
  once(eventName: 'maximize', callback: () => void): () => void;
  once(eventName: 'minimize', callback: () => void): () => void;
  once(eventName: 'receivedNotification', callback: (e: ReceivedNotificationParams) => void): () => void;
  once(eventName: 'unhandledError', callback: (e: UnhandledError) => void): () => void;
  once(eventName: 'applicationCallReceived', callback: (e: ApplicationCallReceivedParams) => void): () => void;
  once(eventName: 'appShortcutReceived', callback: (e: Record<string, any>) => void): () => void;
  once(eventName: 'backButtonPressed', callback: () => void): () => void;
  once(eventName: ApplicationEvents, callback: (...args: any[]) => void): () => void;

  prependListener(eventName: 'exit', callback: () => void): void;
  prependListener(eventName: 'maximize', callback: () => void): void;
  prependListener(eventName: 'minimize', callback: () => void): void;
  prependListener(eventName: 'receivedNotification', callback: (e: ReceivedNotificationParams) => void): void;
  prependListener(eventName: 'unhandledError', callback: (e: UnhandledError) => void): void;
  prependListener(eventName: 'applicationCallReceived', callback: (e: ApplicationCallReceivedParams) => void): void;
  prependListener(eventName: 'appShortcutReceived', callback: (e: Record<string, any>) => void): void;
  prependListener(eventName: 'backButtonPressed', callback: () => void): void;
  prependListener(eventName: ApplicationEvents, callback: (...args: any[]) => void): void;

  prependOnceListener(eventName: 'exit', callback: () => void): void;
  prependOnceListener(eventName: 'maximize', callback: () => void): void;
  prependOnceListener(eventName: 'minimize', callback: () => void): void;
  prependOnceListener(eventName: 'receivedNotification', callback: (e: ReceivedNotificationParams) => void): void;
  prependOnceListener(eventName: 'unhandledError', callback: (e: UnhandledError) => void): void;
  prependOnceListener(eventName: 'applicationCallReceived', callback: (e: ApplicationCallReceivedParams) => void): void;
  prependOnceListener(eventName: 'appShortcutReceived', callback: (e: Record<string, any>) => void): void;
  prependOnceListener(eventName: 'backButtonPressed', callback: () => void): void;
  prependOnceListener(eventName: ApplicationEvents, callback: (...args: any[]) => void): void;
}
