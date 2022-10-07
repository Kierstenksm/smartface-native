import NativeEventEmitterComponent from '../../core/native-event-emitter-component';
import Invocation from '../../util/iOS/invocation';
import { Permissions, IPermission, PermissionIOSAuthorizationStatus, PermissionResult } from './permission';
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
  async requestPermission(permission: Parameters<IPermission['requestPermission']>['0']): Promise<PermissionResult> {
    // const requestTexts = options?.requestTexts || {};
    const status = this.ios?.getAuthorizationStatus?.(Permissions.IOS[permission]);
    if (status === PermissionIOSAuthorizationStatus.AUTHORIZED_ALWAYS || status === PermissionIOSAuthorizationStatus.AUTHORIZED_WHEN_IN_USE) {
      return PermissionResult.GRANTED; // Already granted, no need to request again
    } else if (status === PermissionIOSAuthorizationStatus.RESTRICTED) {
      throw PermissionResult.NEVER_ASK_AGAIN; // Restricted, cannot request again
    } else {
      try {
        await this.ios?.requestAuthorization?.(Permissions.IOS[permission]);
        return PermissionResult.GRANTED;
      } catch (e) {
        throw PermissionResult.DENIED;
      }
    }
  }

  getIOSProps(): IPermission['ios'] {
    return {
      getAuthorizationStatus(permission: Permissions.IOS): PermissionIOSAuthorizationStatus {
        const permissionResult = Invocation.invokeClassMethod(permission, 'authorizationStatus', [], 'int');
        return permissionResult ?? PermissionIOSAuthorizationStatus.NOT_DETERMINED;
      },
      requestAuthorization(permission: Permissions.IOS): Promise<void> {
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
        }
        else {
          return new Promise((resolve, reject) => {
            const argCallback = new Invocation.Argument({
              type: 'NSIntegerBlock',
              value: (status: any) => {
                __SF_Dispatch.mainAsync(() => {
                  status ? resolve() : reject();
                });
              }
            });
            Invocation.invokeClassMethod(permission, 'requestAuthorization:', [argCallback]);
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
      onRequestPermissionsResult: () => {},
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
