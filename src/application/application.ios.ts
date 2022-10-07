import Location from '../device/location';
import Accelerometer from '../device/accelerometer';
import Network from '../device/network';
import Timer from '../global/timer';
import Invocation from '../util/iOS/invocation';
import { ApplicationEvents } from './application-events';
import StatusBar from './statusbar';
import { IApplication } from './application';
import Page from '../ui/page';
import NavigationController from '../ui/navigationcontroller';
import { IBottomTabBar } from '../ui/bottomtabbar/bottomtabbar';
import NativeEventEmitterComponent from '../core/native-event-emitter-component';
import SliderDrawer from '../ui/sliderdrawer';
import { EventListenerCallback } from '../core/eventemitter';

enum EmulatorResetState {
  scan,
  update,
  clear
}

//Application Direction Manager (RTL Support)
const userDefaults = new __SF_NSUserDefaults('SF_USER_DEFAULTS'); //From view-iOS.js viewAppearanceSemanticContentAttribute
const viewAppearanceSemanticContentAttribute = userDefaults.stringForKey('smartface.ios.viewAppearanceSemanticContentAttribute');
if (viewAppearanceSemanticContentAttribute !== undefined) {
  __SF_UIView.setViewAppearanceSemanticContentAttribute(parseInt(viewAppearanceSemanticContentAttribute));
}

class ApplicationIOSClass extends NativeEventEmitterComponent<ApplicationEvents> implements IApplication {
  protected preConstruct(params?: Partial<Record<string, any>>): void {
    this.statusBar = StatusBar;
    this.keyWindow = __SF_UIApplication.sharedApplication().keyWindow;
    super.preConstruct(params);
  }

  get onUnhandledError(): IApplication['onUnhandledError'] {
    return this._onUnhandledError;
  }
  get onExit(): IApplication['onExit'] {
    return this._onExit;
  }
  get onReceivedNotification(): IApplication['onReceivedNotification'] {
    return this._onReceivedNotification;
  }
  get onApplicationCallReceived(): IApplication['onApplicationCallReceived'] {
    return this._onApplicationCallReceived;
  }
  get onMaximize(): IApplication['onMaximize'] {
    return this._onMaximize;
  }
  get onMinimize(): IApplication['onMinimize'] {
    return this._onMinimize;
  }
  get onAppShortcutReceived(): IApplication['onAppShortcutReceived'] {
    return this._onAppShortcutReceived;
  }

  set onUnhandledError(value: IApplication['onUnhandledError']) {
    this._onUnhandledError = value;
    //@ts-ignore TODO: global Application variable from framework. NTVE-697
    Application.onUnhandledError = (e) => {
      this._onUnhandledError?.(e);
      this.emit('unhandledError', e);
    };
  }
  set onExit(value: IApplication['onExit']) {
    this._onExit = value;
    //@ts-ignore TODO: global Application variable from framework. NTVE-697
    Application.onExit = () => {
      this.emit('exit');
      this._onExit?.();
    };
  }
  set onReceivedNotification(value: IApplication['onReceivedNotification']) {
    this._onReceivedNotification = value;
    //@ts-ignore TODO: global Application variable from framework. NTVE-697
    Application.onReceivedNotification = (e) => {
      this._onReceivedNotification?.(e);
      this.emit('receivedNotification', e);
    };
  }
  set onApplicationCallReceived(value: IApplication['onApplicationCallReceived']) {
    this._onApplicationCallReceived = value;
    //@ts-ignore TODO: global Application variable from framework. NTVE-697
    Application.onUserActivityCallback = (e) => {
      const url = Invocation.invokeInstanceMethod(e.userActivity, 'webpageURL', [], 'NSObject');
      const type = Invocation.invokeInstanceMethod(e.userActivity, 'activityType', [], 'NSString');
      if (url && type === 'NSUserActivityTypeBrowsingWeb') {
        this.emit('applicationCallReceived', {
          data: e,
          url: url.absoluteString,
          eventType: 'callback',
          result: -1
        });
        return this.ios.onUserActivityWithBrowsingWeb?.(url.absoluteString) ?? true;
      }
      return false;
    };
    //@ts-ignore TODO: global Application variable from framework. NTVE-697
    Application.onApplicationCallReceived = (e) => {
      this._onApplicationCallReceived?.(e);
      this.emit('applicationCallReceived', e);
    };
  }
  set onMaximize(value: IApplication['onMaximize']) {
    this._onMaximize = value;
    //@ts-ignore TODO: global Application variable from framework. NTVE-697
    Application.onMaximize = () => {
      console.info('onmaximize event native');
      this._onMaximize?.();
      this.emit('maximize');
    };
  }
  set onMinimize(value: IApplication['onMinimize']) {
    this._onMinimize = value;
    //@ts-ignore TODO: global Application variable from framework. NTVE-697
    Application.onMinimize = () => {
      this._onMinimize?.();
      this.emit('minimize');
    };
  }
  set onAppShortcutReceived(value: IApplication['onAppShortcutReceived']) {
    this._onAppShortcutReceived = value;
    //@ts-ignore TODO: global Application variable from framework. NTVE-697
    Application.onAppShortcutReceive = (e) => {
      //TODO: Check isEmulator
      if (!SMFApplication.sharedInstance) {
        return;
      }
      this.emit('appShortcutReceived', e);
      this._onAppShortcutReceived?.(e);
    };
  }

  currentPage: Page;
  statusBar: typeof StatusBar;
  tabBar?: IBottomTabBar;

  private _onUnhandledError: IApplication['onUnhandledError'];
  private _onExit: IApplication['onExit'];
  private _onReceivedNotification: IApplication['onReceivedNotification'];
  private _onApplicationCallReceived: IApplication['onApplicationCallReceived'];
  private _onMaximize: IApplication['onMaximize'];
  private _onMinimize: IApplication['onMinimize'];
  private _onAppShortcutReceived: IApplication['onAppShortcutReceived'];
  private _sliderDrawer: SliderDrawer;
  private _rootPage: NavigationController['controller'];
  private keyWindow: any;
  readonly LayoutDirection = {
    LEFTTORIGHT: 0,
    RIGHTTOLEFT: 1
  } as const;
  readonly emulator = {
    globalObjectWillReset(state: EmulatorResetState) {
      this.cancelAllBackgroundJobs();
      switch (state) {
        case EmulatorResetState.scan:
          break;
        case EmulatorResetState.update:
          break;
        case EmulatorResetState.clear:
          break;
        default:
          break;
      }
    }
  } as const;
  constructor() {
    super();
    if (SMFApplication.sharedInstance) {
      SMFApplication.sharedInstance().performActionForShortcutItemShortcutItem = (shortcutItem: any) => {
        const params = { data: shortcutItem.userInfo };
        this.emit('appShortcutReceived', params);
        const innerReturnValue = this._onAppShortcutReceived?.(params);
        return typeof innerReturnValue === 'boolean' ? innerReturnValue : true;
      };
    }
  }
  setAppTheme: (theme: string) => void;
  registOnItemSelectedListener(): void {
    throw new Error('Method not implemented.');
  }

  canOpenUrl(url: string) {
    return SMFApplication.canOpenUrl(url);
  }
  exit() {
    //@ts-ignore TODO: global Application variable from framework. NTVE-697
    Application.onExit();
    SMFApplication.exit();
  }
  restart() {
    this.cancelAllBackgroundJobs();
    SMFApplication.restart();
  }
  setRootController(params: NavigationController) {
    if (params?.controller) {
      this.rootPage = params.controller;
      this.keyWindow.rootViewController = params.controller.nativeObject;
      this.keyWindow.makeKeyAndVisible();
    }
  }
  configureSliderDrawer(rootPage, sliderDrawer) {
    rootPage.sliderDrawer = sliderDrawer;
    sliderDrawer.nativeObject.Pages = rootPage;
    sliderDrawer.nativeObject.checkSwipeGesture(rootPage.nativeObject, rootPage, this._sliderDrawer.nativeObject);
  }
  call(params: Parameters<IApplication['call']>['0']) {
    SMFApplication.call(params.uriScheme, params.data || {}, params.onSuccess, params.onFailure);
  }
  hideKeyboard() {
    const argForce = new Invocation.Argument({
      type: 'BOOL',
      value: true
    });
    Invocation.invokeInstanceMethod(this.keyWindow, 'endEditing:', [argForce], 'BOOL');
  }

  get byteReceived() {
    const counterInfo = SMFApplication.dataCounters();
    return counterInfo.WiFiReceived + counterInfo.WWANReceived;
  }
  get byteSent() {
    const counterInfo = SMFApplication.dataCounters();
    return counterInfo.WiFiSent + counterInfo.WWANSent;
  }
  get keepScreenAwake() {
    const sharedApp = __SF_UIApplication.sharedApplication();
    return Invocation.invokeInstanceMethod(sharedApp, 'isIdleTimerDisabled', [], 'BOOL');
  }
  set keepScreenAwake(value) {
    const idletimerdisabled = new Invocation.Argument({
      type: 'BOOL',
      value: value
    });
    const sharedApp = __SF_UIApplication.sharedApplication();
    Invocation.invokeInstanceMethod(sharedApp, 'setIdleTimerDisabled:', [idletimerdisabled]);
  }
  get sliderDrawer() {
    return this._sliderDrawer;
  }
  set sliderDrawer(value) {
    if (value instanceof SliderDrawer) {
      this._sliderDrawer = value;
      if (this._rootPage) {
        this.configureSliderDrawer(this._rootPage, this._sliderDrawer);
      }
    }
  }
  get rootPage() {
    return this._rootPage;
  }
  set rootPage(value) {
    if (typeof value === 'object') {
      this._rootPage = value;
      if (this._sliderDrawer instanceof SliderDrawer) {
        this.configureSliderDrawer(this._rootPage, this._sliderDrawer);
      }
    }
  }
  get currentReleaseChannel() {
    //@ts-ignore TODO: global Application variable from framework. NTVE-697
    return Application.currentReleaseChannel;
  }
  get smartfaceAppName() {
    //@ts-ignore TODO: global Application variable from framework. NTVE-697
    return Application.smartfaceAppName;
  }
  get appName() {
    //@ts-ignore TODO: global Application variable from framework. NTVE-697
    return Application.smartfaceAppName;
  }
  get version() {
    //@ts-ignore TODO: global Application variable from framework. NTVE-697
    return Application.version;
  }
  get isVoiceOverEnabled() {
    return __SF_UIAccessibility.isVoiceOverRunning();
  }
  get ios(): IApplication['ios'] {
    return {
      get bundleIdentifier() {
        const mainBundle = Invocation.invokeClassMethod('NSBundle', 'mainBundle', [], 'NSObject');
        const bundleIdentifier = Invocation.invokeInstanceMethod(mainBundle!, 'bundleIdentifier', [], 'NSString');
        return bundleIdentifier;
      },
      get userInterfaceLayoutDirection() {
        return __SF_UIApplication.sharedApplication().userInterfaceLayoutDirection;
      }
    };
  }
  get android() {
    return {
      checkPermission: () => false,
      requestPermission: () => {},
      shouldShowRequestPermissionRationale: () => false,
      onRequestPermissionsResult: () => {},
      Permissions: {},
      navigationBar: {} as any,
      setAppTheme: () => {}
    };
  }
  get Android() {
    return {
      KeyboardMode: {} as any,
      Permissions: {} as any,
      NavigationBar: {} as any
    };
  }
  protected createNativeObject() {
    return null;
  }

  private cancelAllBackgroundJobs() {
    Timer.clearAllTimer();
    if (Location.nativeObject) {
      Location.stop();
    }
    Accelerometer.stop();
    Network?.cancelAll();
  }

  on(eventName: ApplicationEvents, callback: EventListenerCallback) {
    if (eventName === 'applicationCallReceived') {
      //@ts-ignore TODO: global Application variable from framework. NTVE-697
      Application.onUserActivityCallback = (e) => {
        const url = Invocation.invokeInstanceMethod(e.userActivity, 'webpageURL', [], 'NSObject');
        const type = Invocation.invokeInstanceMethod(e.userActivity, 'activityType', [], 'NSString');
        if (url && type === 'NSUserActivityTypeBrowsingWeb') {
          this.emit('applicationCallReceived', {
            data: e,
            url: url.absoluteString,
            eventType: 'callback',
            result: -1
          });
          return this.ios.onUserActivityWithBrowsingWeb?.(url.absoluteString) ?? true;
        }
        return false;
      };
      //@ts-ignore TODO: global Application variable from framework. NTVE-697
      Application.onApplicationCallReceived = (e) => {
        this._onApplicationCallReceived?.(e);
        this.emit('applicationCallReceived', e);
      };
    } else if (eventName === 'appShortcutReceived') {
      //@ts-ignore TODO: global Application variable from framework. NTVE-697
      Application.onAppShortcutReceive = (e) => {
        //TODO: Check isEmulator
        if (!SMFApplication.sharedInstance) {
          return;
        }
        this.emit('appShortcutReceived', e);
        this._onAppShortcutReceived?.(e);
      };
    } else if (eventName === 'unhandledError') {
      //@ts-ignore TODO: global Application variable from framework. NTVE-697
      Application.onUnhandledError = (e) => {
        this._onUnhandledError?.(e);
        this.emit('unhandledError', e);
      };
    } else if (eventName === 'exit') {
      //@ts-ignore TODO: global Application variable from framework. NTVE-697
      Application.onExit = () => {
        this.emit('exit');
        this._onExit?.();
      };
    } else if (eventName === 'receivedNotification') {
      //@ts-ignore TODO: global Application variable from framework. NTVE-697
      Application.onReceivedNotification = (e) => {
        this._onReceivedNotification?.(e);
        this.emit('receivedNotification', e);
      };
    } else if (eventName === 'maximize') {
      //@ts-ignore TODO: global Application variable from framework. NTVE-697
      Application.onMaximize = () => {
        this._onMaximize?.();
        this.emit('maximize');
      };
    } else if (eventName === 'minimize') {
      //@ts-ignore TODO: global Application variable from framework. NTVE-697
      Application.onMinimize = () => {
        this._onMinimize?.();
        this.emit('minimize');
      };
    }

    return super.on(eventName, callback);
  }
}

const ApplicationIOS = new ApplicationIOSClass();

export default ApplicationIOS;
