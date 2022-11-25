import NativeEventEmitterComponent from '../../core/native-event-emitter-component';
import { Permissions, IPermission, PermissionIOSAuthorizationStatus, PermissionResult, CommonPermissions } from './permission';

import { PermissionEvents } from './permission-events';
import SystemIOS from '../../device/system/system.ios';
import LocationIOS from '../../device/location/location.ios';

enum PhotoLibraryAccess {
  addOnly = 1,
  readWrite = 2
}

class PermissionIOSClass extends NativeEventEmitterComponent<PermissionEvents, any, IPermission> implements IPermission {
  protected createNativeObject() {
    return null;
  }
  constructor() {
    super();
    this.addAndroidProps(this.getAndroidProps());
    this.addIOSProps(this.getIOSProps());
  }

  mapCommonPermissionArgumansToIosTypes(permission: Permissions.IOS | CommonPermissions | Parameters<IPermission['requestPermission']>['0']): Permissions.IOS {
    let _permission = permission as Exclude<Extract<keyof typeof Permissions, string>, 'IOS' | 'ANDROID'> | 'GALLERY';
    if (permission === Permissions.camera || permission === Permissions.IOS.CAMERA) {
      _permission = 'CAMERA';
    } else if (permission === Permissions.location || permission === Permissions.location.approximate || permission === Permissions.location.precise || permission === Permissions.IOS.LOCATION) {
      _permission = 'LOCATION';
    } else if (permission === Permissions.storage || permission === Permissions.storage.readImageAndVideo || permission === Permissions.storage.readAudio || Permissions.IOS.GALLERY) {
      _permission = 'GALLERY';
    }
    return Permissions.IOS[_permission]
  }

  async requestPermission(permission: Parameters<IPermission['requestPermission']>['0']): Promise<PermissionResult> {
    // const requestTexts = options?.requestTexts || {};
    const mappedPermission = this.mapCommonPermissionArgumansToIosTypes(permission);
    const status = this.ios?.getAuthorizationStatus?.(mappedPermission);
    if (status === PermissionIOSAuthorizationStatus.DENIED) {
      throw PermissionResult.DENIED
    } else if (status === PermissionIOSAuthorizationStatus.AUTHORIZED_ALWAYS || status === PermissionIOSAuthorizationStatus.AUTHORIZED_WHEN_IN_USE) {
      return PermissionResult.GRANTED
    } else if (status === PermissionIOSAuthorizationStatus.RESTRICTED) {
      throw PermissionResult.NEVER_ASK_AGAIN; // Restricted, cannot request again
    } else {
      try {
        await this.ios?.requestAuthorization?.(mappedPermission);
        return PermissionResult.GRANTED;
      } catch (e) {
        throw PermissionResult.DENIED;
      }
    }
  }

  private requestCameraPermission(): Promise<void> {
    return new Promise((resolve, reject) => {
      __SF_Permission.requestAuthorizationForCamera((status) => {
        status ? resolve() : reject();
      })
    });
  }

  /*
    Location permission management handled originally under Location.ios
    This is only wrapper API due to common API with android
    Because android offers to pop-up the dialog to ask users to get their location
  */
  private requestLocationPermission(): Promise<void> {
    return new Promise((resolve, reject) => {
      LocationIOS.getCurrentLocation().then(() => resolve()).catch(() => reject())
    })
  }


  private requestPhotoLibrary(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (parseInt(SystemIOS.OSVersion) >= 14) {
        __SF_Permission.requestAuthorizationPhotoLibraryFor(PhotoLibraryAccess.readWrite, (status) => {
          status === PermissionIOSAuthorizationStatus.DENIED ? reject() : resolve();
        })
      } else {
        __SF_Permission.requestAuthorizationPhotoLibrary((status) => {
          status === PermissionIOSAuthorizationStatus.DENIED ? reject() : resolve();
        })
      }
    });
  }

  getIOSProps(): IPermission['ios'] {
    const self = this;
    return {
      getAuthorizationStatus(permission: Permissions.IOS | CommonPermissions): PermissionIOSAuthorizationStatus {
        let _permission: Permissions.IOS | CommonPermissions;
        const mappedPermission = self.mapCommonPermissionArgumansToIosTypes(permission);
        if (mappedPermission) {
          _permission = mappedPermission;
        } else {
          throw new Error("Requesting parameter type could not found or not supported")
        }

        if (_permission === Permissions.IOS.CAMERA) {
          return __SF_Permission.authorizationStatusForVideo();
        } else if (_permission === Permissions.IOS.GALLERY) {
          let status;
          if (parseInt(SystemIOS.OSVersion) >= 14) {
            status = __SF_Permission.authorizationStatusPhotoLibraryFor(PhotoLibraryAccess.readWrite);
          } else {
            status = __SF_Permission.authorizationStatusPhotoLibrary();
          }
          return status;
        } else if (_permission === Permissions.IOS.LOCATION) {
          return __SF_Permission.authorizationStatusForLocation();
        } else {
          throw new Error("Requesting parameter type could not found or not supported")
        }
      },
      requestAuthorization(permission: Permissions.IOS | CommonPermissions): Promise<void> {
        if (permission === Permissions.IOS.CAMERA || permission === 'camera') {
          return self.requestCameraPermission();
        } else if (permission === Permissions.IOS.LOCATION || permission === Permissions.location) {
          return self.requestLocationPermission();
        } else if (permission === Permissions.IOS.GALLERY || permission === Permissions.storage) {
          return self.requestPhotoLibrary()
        }
        else {
          throw new Error(permission + " is not supported")
        }
      }
    };
  }
  getAndroidProps(): IPermission['android'] {
    return {
      checkPermission() {
        return true;
      },
      onRequestPermissionsResult: () => { },
      requestPermissions() {
        return Promise.resolve([]);
      },
      shouldShowRequestPermissionRationale() {
        return true;
      }
    };
  }
}

const PermissionIOS = new PermissionIOSClass();
export default PermissionIOS;
