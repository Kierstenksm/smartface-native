import NativeEventEmitterComponent from '../../core/native-event-emitter-component';
import Invocation from '../../util/iOS/invocation';
import { Permissions, IPermission, PermissionIOSAuthorizationStatus, PermissionResult, CommonPermissions } from './permission';

import { PermissionEvents } from './permission-events';

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
    if (permission === Permissions.camera) {
      _permission = 'CAMERA';
    } else if (permission === Permissions.location || permission === Permissions.location.approximate || permission === Permissions.location.precise) {
      _permission = 'LOCATION';
    } else if (permission === Permissions.storage || permission === Permissions.storage.readImageAndVideo || permission === Permissions.storage.readAudio) {
      _permission = 'GALLERY';
    }

    return Permissions.IOS[_permission]
  }

  async requestPermission(permission: Parameters<IPermission['requestPermission']>['0']): Promise<PermissionResult> {
    // const requestTexts = options?.requestTexts || {};
    const mappedPermission = this.mapCommonPermissionArgumansToIosTypes(permission);
    const status = this.ios?.getAuthorizationStatus?.(mappedPermission);
    if (status === PermissionIOSAuthorizationStatus.AUTHORIZED_ALWAYS || status === PermissionIOSAuthorizationStatus.AUTHORIZED_WHEN_IN_USE) {
      return PermissionResult.GRANTED; // Already granted, no need to request again
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

  getIOSProps(): IPermission['ios'] {
    const self = this;
    return {
      getAuthorizationStatus(permission: Permissions.IOS | CommonPermissions): PermissionIOSAuthorizationStatus {
        let _permission;
        const mappedPermission = self.mapCommonPermissionArgumansToIosTypes(permission);
        if (mappedPermission) {
          _permission = mappedPermission;
        } else {
          _permission = permission;
        }

        const permissionResult = Invocation.invokeClassMethod(_permission, 'authorizationStatus', [], 'int');
        return permissionResult ?? PermissionIOSAuthorizationStatus.NOT_DETERMINED;
      },
      requestAuthorization(permission: Permissions.IOS | CommonPermissions): Promise<void> {
        console.info('permission:', permission)
        if (permission === Permissions.IOS.CAMERA) {
          return new Promise((resolve, reject) => {

            const argType = new Invocation.Argument({
              type: 'NSString',
              value: 'vide'
            });
            const argCallback = new Invocation.Argument({
              type: 'BoolBlock',
              value: (status: number) => {
                __SF_Dispatch.mainAsync(() => {
                  status ? resolve() : reject();
                });
              }
            });
            Invocation.invokeClassMethod(permission, 'requestAccessForMediaType:completionHandler:', [argType, argCallback]);

          });
        } else if (permission === Permissions.IOS.LOCATION || permission === Permissions.location) {
          return new Promise((resolve, reject) => {
            const status = Invocation.invokeClassMethod(Permissions.IOS.LOCATION, 'authorizationStatus', [], 'int');
            if (status === PermissionIOSAuthorizationStatus.AUTHORIZED_ALWAYS ||
              status === PermissionIOSAuthorizationStatus.AUTHORIZED_WHEN_IN_USE) {
              resolve()
            } else {
              reject(PermissionResult.DENIED)
            }
          })
        }
        else {
          const mappedPermission = self.mapCommonPermissionArgumansToIosTypes(permission);
          return new Promise((resolve, reject) => {
            const argCallback = new Invocation.Argument({
              type: 'NSIntegerBlock',
              value: (status: any) => {
                __SF_Dispatch.mainAsync(() => {
                  status ? resolve() : reject();
                });
              }
            });
            Invocation.invokeClassMethod(mappedPermission, 'requestAuthorization:', [argCallback]);
          });
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
