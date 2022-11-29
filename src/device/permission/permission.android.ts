import { ApplicationEvents } from '../../application/application-events';
import ApplicationAndroid from '../../application/application.android';
import NativeEventEmitterComponent from '../../core/native-event-emitter-component';
import AndroidConfig from '../../util/Android/androidconfig';
import { Permissions, IPermission, PermissionIOSAuthorizationStatus, PermissionResult, AndroidPermissions, CommonPermissions } from './permission';
import { PermissionEvents } from './permission-events';

const NativeBuild = requireClass('android.os.Build');
const NativePackageManager = requireClass('android.content.pm.PackageManager');

let lastRequestPermissionCode = 2000;

type AndroidAndCommonPermissions = AndroidPermissions | CommonPermissions;

function nativeShouldShowRequestPermissionRationale(permission: string): boolean {
  return AndroidConfig.activity.shouldShowRequestPermissionRationale(permission);
}

function nativeCheckPermission(permission: string): boolean {
  let _permission = permission;
  const packageManager = AndroidConfig.activity.getPackageManager();
  const packageName = AndroidConfig.activity.getPackageName();
  return packageManager.checkPermission(_permission, packageName) === 0; // PackageManager.PERMISSION_GRANTED
}

function nativeRequestPermissions(permissions: string[] | string, requestCode?: number): Promise<PermissionResult[]> {
  const currentRequestCode = requestCode || ++lastRequestPermissionCode;
  return new Promise((resolve, reject) => {
    const currentPermissions = Array.isArray(permissions) ? permissions : [permissions];
    ApplicationAndroid.once(ApplicationEvents.RequestPermissionResult, (e) => {
      const results = e.result.map((result) => (result ? PermissionResult.GRANTED : PermissionResult.DENIED));
      resolve(results);
    });
    AndroidConfig.activity.requestPermissions(array(currentPermissions, 'java.lang.String'), currentRequestCode);
  });
}

function getPackageInfo() {
  const context = AndroidConfig.activity;
  const packageManager = context.getPackageManager();
  if (NativeBuild.VERSION.SDK_INT >= NativeBuild.VERSION_CODES.TIRAMISU) {
    return packageManager.getPackageInfo(context.getPackageName(), NativePackageManager.PackageInfoFlags.of(NativePackageManager.GET_PERMISSIONS));
  } else {
    return packageManager.getPackageInfo(context.getPackageName(), NativePackageManager.GET_PERMISSIONS);
  }
}
const requestedPermissions = toJSArray(getPackageInfo().requestedPermissions);

const PermissionAndroidMapping = {
  [Permissions.CAMERA]: Permissions.ANDROID.CAMERA,
  [Permissions.LOCATION]: Permissions.ANDROID.ACCESS_COARSE_LOCATION
};

class PermissionAndroidClass extends NativeEventEmitterComponent<PermissionEvents, any, IPermission> implements IPermission {
  protected createNativeObject() {
    return null;
  }
  constructor() {
    super();
    this.addAndroidProps(this.getAndroidProps());
    this.addIOSProps(this.getIOSProps());
  }
  async requestPermission(permission: Parameters<IPermission['requestPermission']>['0']): Promise<PermissionResult> {
    for (const permissonHandler of permissionHandlers) {
      const result = await permissonHandler.requestPermission(permission as AndroidAndCommonPermissions);
      if (result !== undefined) {
        if (result === PermissionResult.GRANTED) {
          return result;
        } else {
          return Promise.reject(PermissionResult.DENIED);
        }
      }
    }
    return new Promise(async (resolve, reject) => {
      const requestPermissionCode = lastRequestPermissionCode++;
      //@ts-ignore
      const currentPermission = PermissionAndroidMapping[permission];
      // const requestTexts = options?.requestTexts || {};
      const prevPermissionRationale = this.android.shouldShowRequestPermissionRationale?.(currentPermission);
      if (this.android.checkPermission?.(currentPermission)) {
        resolve(PermissionResult.GRANTED); // Already granted, no need to request again
      } else {
        this.once('requestPermissionsResult', (e) => {
          const currentPermissionRationale = this.android.shouldShowRequestPermissionRationale?.(currentPermission);
          // This is just one permission, therefore always use the first result.
          const currentPermissionResult = e.result[0];
          if (e.requestCode === requestPermissionCode && currentPermissionResult) {
            resolve(PermissionResult.GRANTED);
          } else if (!currentPermissionResult && !currentPermissionRationale && !prevPermissionRationale) {
            reject(PermissionResult.DENIED);
          } else {
            reject(PermissionResult.NEVER_ASK_AGAIN);
          }
        });
        this.android.requestPermissions?.(currentPermission, requestPermissionCode);
      }
    });
  }
  private getAndroidProps(): IPermission['android'] {
    const self = this;
    return {
      shouldShowRequestPermissionRationale(permission: Permissions.ANDROID | AndroidAndCommonPermissions) {
        for (const permissonHandler of permissionHandlers) {
          const result = permissonHandler.shouldShowRequestPermissionRationale(permission as AndroidAndCommonPermissions);
          if (result !== undefined) {
            return result;
          }
        }
        if (typeof permission !== 'string') {
          throw new Error('Permission must be string type');
        }
        return AndroidConfig.activity.shouldShowRequestPermissionRationale(permission);
      },
      checkPermission(permission: Permissions.ANDROID | AndroidAndCommonPermissions): boolean {
        for (const permissonHandler of permissionHandlers) {
          const result = permissonHandler.checkPermission(permission as AndroidAndCommonPermissions);
          if (result !== undefined) {
            return result;
          }
        }
        let _permission = permission;
        const packageManager = AndroidConfig.activity.getPackageManager();
        const packageName = AndroidConfig.activity.getPackageName(); //Did it this way to prevent potential circular dependency issue.
        // After Android 12, we have to use Permissions.ANDROID.BLUETOOTH_CONNECT instead of Permissions.ANDROID.BLUETOOTH
        // for network.bluetoothMacAddress.
        if (_permission === Permissions.ANDROID.BLUETOOTH_CONNECT) {
          _permission = self.getBluetoothPermissionName();
        }
        return packageManager.checkPermission(_permission, packageName) === 0; // PackageManager.PERMISSION_GRANTED
      },
      async requestPermissions(permissions: Permissions.ANDROID[] | Permissions.ANDROID | AndroidAndCommonPermissions, requestCode?: number): Promise<PermissionResult[]> {
        for (const permissonHandler of permissionHandlers) {
          const result = await permissonHandler.requestPermission(permissions as AndroidAndCommonPermissions);
          if (result !== undefined) {
            return [result];
          }
        }
        const currentRequestCode = requestCode || ++lastRequestPermissionCode;
        return new Promise((resolve, reject) => {
          if (typeof currentRequestCode !== 'number') {
            reject('requestCode must be number');
          } else if (typeof permissions !== 'string' && !Array.isArray(permissions)) {
            reject('permissions must be AndroidPermissions or array of AndroidPermissions');
          }
          const currentPermissions = Array.isArray(permissions) ? permissions : [permissions];
          self.once('requestPermissionsResult', (e) => {
            const results = e.result.map((result) => (result ? PermissionResult.GRANTED : PermissionResult.DENIED));
            resolve(results);
          });
          AndroidConfig.activity.requestPermissions(array(currentPermissions, 'java.lang.String'), currentRequestCode);
        });
      }
    };
  }
  private getIOSProps(): IPermission['ios'] {
    return {
      getAuthorizationStatus() {
        return PermissionIOSAuthorizationStatus.NOT_DETERMINED;
      },
      requestAuthorization() {
        return Promise.resolve();
      }
    };
  }
  private getBluetoothPermissionName(): Permissions.ANDROID {
    if (NativeBuild.VERSION.SDK_INT >= NativeBuild.VERSION_CODES.S) {
      return Permissions.ANDROID.BLUETOOTH_CONNECT;
    } else {
      return Permissions.ANDROID.BLUETOOTH;
    }
  }
}

interface IPermissionHandler {
  checkPermission(permission: AndroidAndCommonPermissions): boolean | undefined;
  requestPermission(permission: AndroidAndCommonPermissions): Promise<PermissionResult | undefined>;
  shouldShowRequestPermissionRationale(permission: AndroidAndCommonPermissions): boolean | undefined;
}

abstract class PermissionHandler implements IPermissionHandler {
  abstract checkPermission(permission: AndroidAndCommonPermissions): boolean | undefined;
  abstract requestPermission(permission: AndroidAndCommonPermissions): Promise<PermissionResult | undefined>;
  abstract shouldShowRequestPermissionRationale(permission: AndroidAndCommonPermissions): boolean | undefined;
  hasPermissionInManifest(permission: Permissions.ANDROID): boolean {
    return requestedPermissions.find((manifestPermission) => manifestPermission === permission) ? true : false;
  }

  filterPermissionsByManifest(permissions: Permissions.ANDROID[]): Permissions.ANDROID[] {
    const filteredArray = permissions.filter((permission) => this.hasPermissionInManifest(permission));
    return filteredArray;
  }

  checkPermissions(permissions: Permissions.ANDROID[]): boolean {
    const filteredPermissions = this.filterPermissionsByManifest(permissions);
    if (filteredPermissions.length === 0) {
      return false;
    }
    for (const permission of filteredPermissions) {
      if (!nativeCheckPermission(permission)) {
        return false;
      }
    }
    return true;
  }

  async requestPermissions(permissions: Permissions.ANDROID[]): Promise<PermissionResult> {
    const filteredPermissions = this.filterPermissionsByManifest(permissions);
    if (filteredPermissions.length === 0) {
      return Promise.resolve(PermissionResult.DENIED);
    }
    const results = await nativeRequestPermissions(filteredPermissions);
    for (const result of results) {
      if (result === PermissionResult.DENIED) {
        return PermissionResult.DENIED;
      }
    }
    return PermissionResult.GRANTED;
  }

  shouldShowRationaleForPermissions(permissions: Permissions.ANDROID[]): boolean {
    const filteredPermissions = this.filterPermissionsByManifest(permissions);
    if (filteredPermissions.length === 0) {
      return false;
    }
    for (const permission of filteredPermissions) {
      if (nativeShouldShowRequestPermissionRationale(permission)) {
        return true;
      }
    }
    return false;
  }
}

class BluetoothConnectPermissionHandler extends PermissionHandler {
  override checkPermission(permission: AndroidAndCommonPermissions): boolean | undefined {
    if (permission === Permissions.android.bluetoothConnect) {
      if (this.isAndroid12AndAbove()) {
        return nativeCheckPermission(Permissions.ANDROID.BLUETOOTH_CONNECT);
      } else {
        return this.hasPermissionInManifest(Permissions.ANDROID.BLUETOOTH);
      }
    }
    return undefined;
  }

  override async requestPermission(permission: AndroidAndCommonPermissions): Promise<PermissionResult | undefined> {
    if (permission === Permissions.android.bluetoothConnect) {
      if (this.isAndroid12AndAbove()) {
        return (await nativeRequestPermissions(Permissions.ANDROID.BLUETOOTH_CONNECT))[0];
      } else {
        const hasPermissionInManifest = this.hasPermissionInManifest(Permissions.ANDROID.BLUETOOTH);
        return Promise.resolve(hasPermissionInManifest ? PermissionResult.GRANTED : PermissionResult.DENIED);
      }
    }
    return Promise.resolve(undefined);
  }

  override shouldShowRequestPermissionRationale(permission: AndroidAndCommonPermissions): boolean | undefined {
    if (permission === Permissions.android.bluetoothConnect) {
      if (this.isAndroid12AndAbove()) {
        return nativeShouldShowRequestPermissionRationale(Permissions.ANDROID.BLUETOOTH_CONNECT);
      } else {
        return false;
      }
    }
    return undefined;
  }

  isAndroid12AndAbove() {
    return NativeBuild.VERSION.SDK_INT >= NativeBuild.VERSION_CODES.S;
  }
}

class CameraPermissionHandler extends PermissionHandler {
  override checkPermission(permission: AndroidAndCommonPermissions): boolean | undefined {
    if (permission === Permissions.camera) {
      return nativeCheckPermission(Permissions.ANDROID.CAMERA);
    }
    return undefined;
  }

  override async requestPermission(permission: AndroidAndCommonPermissions): Promise<PermissionResult | undefined> {
    if (permission === Permissions.camera) {
      return (await nativeRequestPermissions(Permissions.ANDROID.CAMERA))[0];
    }
    return Promise.resolve(undefined);
  }

  override shouldShowRequestPermissionRationale(permission: AndroidAndCommonPermissions): boolean | undefined {
    if (permission === Permissions.camera) {
      return nativeShouldShowRequestPermissionRationale(Permissions.ANDROID.CAMERA);
    }
    return undefined;
  }
}

class LocationPermissionHandler extends PermissionHandler {
  locationPermissions = [
    Permissions.ANDROID.ACCESS_COARSE_LOCATION,
    Permissions.ANDROID.ACCESS_FINE_LOCATION,
  ];

  override checkPermission(permission: AndroidAndCommonPermissions): boolean | undefined {
    if (permission === Permissions.location) {
      return nativeCheckPermission(this.locationPermissions[0]) || nativeCheckPermission(this.locationPermissions[1]);
    } else if (permission === Permissions.location.approximate) {
      return nativeCheckPermission(Permissions.ANDROID.ACCESS_COARSE_LOCATION);
    } else if (permission === Permissions.location.precise) {
      return nativeCheckPermission(Permissions.ANDROID.ACCESS_FINE_LOCATION);
    }
    return undefined;
  }

  override async requestPermission(permission: AndroidAndCommonPermissions): Promise<PermissionResult | undefined> {
    if (permission === Permissions.location) {
      const results = await nativeRequestPermissions(this.locationPermissions);
      const result = results[0] === PermissionResult.GRANTED || results[1] === PermissionResult.GRANTED;
      return result ? PermissionResult.GRANTED : PermissionResult.DENIED;
    } else if (permission === Permissions.location.approximate) {
      return (await nativeRequestPermissions(Permissions.ANDROID.ACCESS_COARSE_LOCATION))[0];
    } else if (permission === Permissions.location.precise) {
      if (this.isAndroid12AndAbove()) {
        const results = await nativeRequestPermissions(this.locationPermissions);
        const result = results[0] === PermissionResult.GRANTED && results[1] === PermissionResult.GRANTED;
        return result ? PermissionResult.GRANTED : PermissionResult.DENIED;
      } else {
        return (await nativeRequestPermissions([Permissions.ANDROID.ACCESS_FINE_LOCATION]))[0];
      }
    }
    return Promise.resolve(undefined);
  }

  override shouldShowRequestPermissionRationale(permission: AndroidAndCommonPermissions): boolean | undefined {
    if (permission === Permissions.location) {
      return this.shouldShowRationaleForPermissions(this.locationPermissions);
    } else if (permission === Permissions.location.approximate) {
      return nativeShouldShowRequestPermissionRationale(Permissions.ANDROID.ACCESS_COARSE_LOCATION);
    } else if (permission === Permissions.location.precise) {
      return nativeShouldShowRequestPermissionRationale(Permissions.ANDROID.ACCESS_FINE_LOCATION);
    }
    return undefined;
  }

  isAndroid12AndAbove() {
    return NativeBuild.VERSION.SDK_INT >= NativeBuild.VERSION_CODES.S;
  }
}

class MicrophonePermissionHandler extends PermissionHandler {
  override checkPermission(permission: AndroidAndCommonPermissions): boolean | undefined {
    if (permission === Permissions.microphone) {
      return nativeCheckPermission(Permissions.ANDROID.RECORD_AUDIO);
    }
    return undefined;
  }

  override async requestPermission(permission: AndroidAndCommonPermissions): Promise<PermissionResult | undefined> {
    if (permission === Permissions.microphone) {
      return (await nativeRequestPermissions(Permissions.ANDROID.RECORD_AUDIO))[0];
    }
    return Promise.resolve(undefined);
  }

  override shouldShowRequestPermissionRationale(permission: AndroidAndCommonPermissions): boolean | undefined {
    if (permission === Permissions.microphone) {
      return nativeShouldShowRequestPermissionRationale(Permissions.ANDROID.RECORD_AUDIO);
    }
    return undefined;
  }
}

class NotificationPermissionHandler extends PermissionHandler {
  override checkPermission(permission: AndroidAndCommonPermissions): boolean | undefined {
    if (permission === Permissions.android.notification) {
      if (this.isAndroid13AndAbove()) {
        return nativeCheckPermission(Permissions.ANDROID.POST_NOTIFICATIONS);;
      }
      return true;
    }
    return undefined;
  }

  override async requestPermission(permission: AndroidAndCommonPermissions): Promise<PermissionResult | undefined> {
    if (permission === Permissions.android.notification) {
      if (this.isAndroid13AndAbove()) {
        return (await nativeRequestPermissions(Permissions.ANDROID.POST_NOTIFICATIONS))[0];
      }
      return Promise.resolve(PermissionResult.GRANTED);
    }
    return Promise.resolve(undefined);
  }

  override shouldShowRequestPermissionRationale(permission: AndroidAndCommonPermissions): boolean | undefined {
    if (permission === Permissions.android.notification) {
      if (this.isAndroid13AndAbove()) {
        return nativeShouldShowRequestPermissionRationale(Permissions.ANDROID.POST_NOTIFICATIONS);
      }
      return false;
    }
    return undefined;
  }

  isAndroid13AndAbove() {
    return NativeBuild.VERSION.SDK_INT >= NativeBuild.VERSION_CODES.TIRAMISU;
  }
}

class PhonePermissionHandler extends PermissionHandler {
  phonePermissions = [
    Permissions.ANDROID.READ_PHONE_STATE,
    Permissions.ANDROID.CALL_PHONE,
    Permissions.ANDROID.USE_SIP
  ];

  override checkPermission(permission: AndroidAndCommonPermissions): boolean | undefined {
    if (permission === Permissions.android.phone) {
      return this.checkPermissions(this.phonePermissions);
    }
    return undefined;
  }

  override async requestPermission(permission: AndroidAndCommonPermissions): Promise<PermissionResult | undefined> {
    if (permission === Permissions.android.phone) {
      return await this.requestPermissions(this.phonePermissions);
    }
    return Promise.resolve(undefined);
  }

  override shouldShowRequestPermissionRationale(permission: AndroidAndCommonPermissions): boolean | undefined {
    if (permission === Permissions.android.phone) {
      return this.shouldShowRationaleForPermissions(this.phonePermissions);
    }
    return undefined;
  }
}

class ContactPermissionHandler extends PermissionHandler {
  contactPermissions = [
    Permissions.ANDROID.READ_CONTACTS,
    Permissions.ANDROID.WRITE_CONTACTS,
    Permissions.ANDROID.GET_ACCOUNTS,
  ];

  override checkPermission(permission: AndroidAndCommonPermissions): boolean | undefined {
    if (permission === Permissions.android.contact) {
      return this.checkPermissions(this.contactPermissions);
    }
    return undefined;
  }

  override requestPermission(permission: AndroidAndCommonPermissions): Promise<PermissionResult | undefined> {
    if (permission === Permissions.android.contact) {
      return this.requestPermissions(this.contactPermissions);
    }
    return Promise.resolve(undefined);
  }

  override shouldShowRequestPermissionRationale(permission: AndroidAndCommonPermissions): boolean | undefined {
    if (permission === Permissions.android.contact) {
      return this.shouldShowRationaleForPermissions(this.contactPermissions);
    }
    return undefined;
  }
}

class SMSPermissionHandler extends PermissionHandler {
  smsPermissions = [
    Permissions.ANDROID.SEND_SMS,
    Permissions.ANDROID.READ_SMS,
    Permissions.ANDROID.RECEIVE_SMS,
    Permissions.ANDROID.RECEIVE_WAP_PUSH,
    Permissions.ANDROID.RECEIVE_MMS,
  ];

  override checkPermission(permission: AndroidAndCommonPermissions): boolean | undefined {
    if (permission === Permissions.android.sms) {
      return this.checkPermissions(this.smsPermissions);
    }
    return undefined;
  }

  override requestPermission(permission: AndroidAndCommonPermissions): Promise<PermissionResult | undefined> {
    if (permission === Permissions.android.sms) {
      return this.requestPermissions(this.smsPermissions);
    }
    return Promise.resolve(undefined);
  }

  override shouldShowRequestPermissionRationale(permission: AndroidAndCommonPermissions): boolean | undefined {
    if (permission === Permissions.android.sms) {
      return this.shouldShowRationaleForPermissions(this.smsPermissions);
    }
    return undefined;
  }
}

class StoragePermissionHandler extends PermissionHandler {
  storagePermissionsForAnd13AndAbove = [
    Permissions.ANDROID.READ_MEDIA_IMAGES,
    Permissions.ANDROID.READ_MEDIA_AUDIO,
    Permissions.ANDROID.READ_MEDIA_VIDEO,
  ];

  storagePermissionsForAnd12AndBelow = [
    Permissions.ANDROID.READ_EXTERNAL_STORAGE,
    Permissions.ANDROID.WRITE_EXTERNAL_STORAGE,
  ];

  override checkPermission(permission: AndroidAndCommonPermissions): boolean | undefined {
    if (permission === Permissions.storage) {
      return this.checkPermissions(this.getPermissionsForApiLevel());
    } else if (permission === Permissions.storage.readImageAndVideo) {
      return this.checkPermissions(this.getImageAndVideoPermissionsForAPILevel());
    } else if (permission === Permissions.storage.readAudio) {
      return this.checkPermissions(this.getAudioPermissionsForAPILevel());
    }
    return undefined;
  }

  override async requestPermission(permission: AndroidAndCommonPermissions): Promise<PermissionResult | undefined> {
    if (permission === Permissions.storage) {
      return this.requestPermissions(this.getPermissionsForApiLevel());
    } else if (permission === Permissions.storage.readImageAndVideo) {
      return (await this.requestPermissions(this.getImageAndVideoPermissionsForAPILevel()));
    } else if (permission === Permissions.storage.readAudio) {
      return (await this.requestPermissions(this.getAudioPermissionsForAPILevel()));
    }
    return Promise.resolve(undefined);
  }

  override shouldShowRequestPermissionRationale(permission: AndroidAndCommonPermissions): boolean | undefined {
    if (permission === Permissions.storage) {
      return this.shouldShowRationaleForPermissions(this.getPermissionsForApiLevel());
    } else if (permission === Permissions.storage.readImageAndVideo) {
      return this.shouldShowRationaleForPermissions(this.getImageAndVideoPermissionsForAPILevel());
    } else if (permission === Permissions.storage.readAudio) {
      return this.shouldShowRationaleForPermissions(this.getAudioPermissionsForAPILevel());
    }
    return undefined;
  }

  isAndroid13AndAbove() {
    return NativeBuild.VERSION.SDK_INT >= NativeBuild.VERSION_CODES.TIRAMISU;
  }

  getPermissionsForApiLevel() {
    return this.isAndroid13AndAbove() ? this.storagePermissionsForAnd13AndAbove : this.storagePermissionsForAnd12AndBelow;
  }

  getImageAndVideoPermissionsForAPILevel() {
    return this.isAndroid13AndAbove() ? [Permissions.ANDROID.READ_MEDIA_IMAGES, Permissions.ANDROID.READ_MEDIA_VIDEO] : this.storagePermissionsForAnd12AndBelow;
  }

  getAudioPermissionsForAPILevel() {
    return this.isAndroid13AndAbove() ? [Permissions.ANDROID.READ_MEDIA_AUDIO] : this.storagePermissionsForAnd12AndBelow;;
  }
}

const permissionHandlers = [new BluetoothConnectPermissionHandler(), new CameraPermissionHandler(),
new LocationPermissionHandler(), new MicrophonePermissionHandler(), new NotificationPermissionHandler(),
new PhonePermissionHandler(), new ContactPermissionHandler(), new SMSPermissionHandler(), new StoragePermissionHandler()];

const PermissionAndroid = new PermissionAndroidClass();
export default PermissionAndroid;
