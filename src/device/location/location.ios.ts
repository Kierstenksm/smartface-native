import NativeEventEmitterComponent from '../../core/native-event-emitter-component';
import Invocation from '../../util/iOS/invocation';
import { PermissionIOSAuthorizationStatus, PermissionResult, Permissions } from '../permission/permission';
import PermissionIOS from '../permission/permission.ios';
import { ILocation, LocationAndroidPriority, LocationAndroidSettingsStatusCodes } from './location';
import { LocationEvents } from './location-events';

const IOS_NATIVE_AUTHORIZATION_STATUS = { NotDetermined: 0, Restricted: 1, Denied: 2, AuthorizedAlways: 3, AuthorizedWhenInUse: 4 };

class LocationIOS extends NativeEventEmitterComponent<LocationEvents, any, ILocation> implements ILocation {
  delegate?: __SF_CLLocationManagerDelegate;
  Android = { Priority: LocationAndroidPriority, SettingsStatusCodes: LocationAndroidSettingsStatusCodes };
  iOS = { AuthorizationStatus: PermissionIOSAuthorizationStatus };
  private _authorizationStatus: PermissionIOSAuthorizationStatus;
  __onActivityResult: (resultCode: number) => void;
  onLocationChanged: (...args: any[]) => {};
  constructor() {
    super();
  }
  getCurrentLocation(): ReturnType<ILocation['getCurrentLocation']> {
    return new Promise((resolve, reject) => {
      const locationStatus = PermissionIOS.ios?.getAuthorizationStatus?.(Permissions.location);
      if (locationStatus === PermissionIOSAuthorizationStatus.NOT_DETERMINED) {
        this.start();
        this.once('locationChanged', (location) => {
          this.stop();

          /*
            * If there isn't found a location object, users may deny the location request. 
            * So handling denied situation by checking location.
          */
          if (!location) {
            reject({ type: 'precise', result: PermissionResult.DENIED });
          } else {
            resolve({ ...location, type: 'precise', result: PermissionResult.GRANTED }); // For iOS, location type doesn't matter at all.
          }

        });
      } else {
        PermissionIOS.requestPermission('LOCATION')
          .then(() => {
            this.start();
            this.once('locationChanged', (location) => {
              this.stop();
              resolve({ ...location, type: 'precise', result: PermissionResult.GRANTED }); // For iOS, location type doesn't matter at all.
            });
          })
          .catch(() => {
            reject({ type: 'precise', result: PermissionResult.DENIED });
          });
      }
    });
  }
  preConstruct() {
    super.preConstruct();
    this.addIOSProps(this.getIOSProps());
    this._authorizationStatus = this.ios?.authorizationStatus.NotDetermined;
  }
  protected createNativeObject() {
    return new __SF_CLLocationManager();
  }
  private getIOSProps(): ILocation['ios'] {
    return {
      authorizationStatus: PermissionIOSAuthorizationStatus,
      native: { authorizationStatus: IOS_NATIVE_AUTHORIZATION_STATUS },
      locationServicesEnabled: () => {
        return __SF_CLLocationManager.locationServicesEnabled();
      }
    };
  }

  getAuthorizationStatus = (): PermissionIOSAuthorizationStatus => {
    const authorizationStatus = Invocation.invokeClassMethod('CLLocationManager', 'authorizationStatus', [], 'int') as unknown as number;

    return authorizationStatus;
  }

  start() {
    this.stop();

    this.delegate = new __SF_CLLocationManagerDelegate();

    if (__SF_CLLocationManager.locationServicesEnabled()) {
      this.nativeObject.delegate = this.delegate;
      this.delegate.didUpdateLocations = (e) => {
        this.onLocationChanged?.(e);
        this.emit('locationChanged', e);
      };
      this.delegate.didChangeAuthorizationStatus = () => {
        const authStatus = this.getAuthorizationStatus();

        /* 
          * Notify locationChanged event if user deny the location permission
          * Because getCurrentLocation() returns promise.
          * So, basically reject the promise due to denied permission
        */
        if (authStatus === PermissionIOSAuthorizationStatus.DENIED) {
          this.onLocationChanged?.();
          this.emit('locationChanged');
        }

        if (typeof this.ios.onChangeAuthorizationStatus === 'function' && this._authorizationStatus !== authStatus) {

          this._authorizationStatus = authStatus;
          this.ios.onChangeAuthorizationStatus(authStatus === this.ios.authorizationStatus.Authorized);
        }
      };

      this.nativeObject.requestWhenInUseAuthorization();
      this.nativeObject.startUpdatingLocation();
    }
  }
  stop() {
    this.nativeObject.stopUpdatingLocation();
    this.nativeObject.delegate = undefined;
    this.delegate = undefined;
  }
  getLastKnownLocation(onSuccess: (e: { latitude: number; longitude: number }) => void, onFailure: () => void) {
    const location = this.nativeObject.lastKnownLocation();
    if (location) {
      onSuccess?.(location);
    } else {
      onFailure?.();
    }
  }
}

const SFLocationIOS = new LocationIOS();

export default SFLocationIOS;
