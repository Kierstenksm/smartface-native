import { IColor } from '../../ui/color/color';

export enum StatusBarStyle {
  DEFAULT,
  LIGHTCONTENT
}

class StatusBarIOS {
  readonly Styles = StatusBarStyle;
  _backgroundColor? : IColor;
  get ios() {
    return {};
  }
  get android() {
    return {};
  }
  get height(): number | undefined {
    return __SF_UIApplication.sharedApplication().statusBarFrame.height;
  }
  get backgroundColor(): IColor | undefined {
    return this._backgroundColor;
  }
  set backgroundColor(value: IColor | undefined) {
    this._backgroundColor = value;
  }
  get visible(): boolean {
    return !__SF_UIApplication.sharedApplication().sf_statusBarHidden;
  }
  set visible(value: boolean) {
    __SF_UIApplication.sharedApplication().sf_statusBarHidden = !value;
  }
  get style(): StatusBarStyle {
    return __SF_UIApplication.sharedApplication().sf_statusBarStyle;
  }
  set style(value: StatusBarStyle) {
    __SF_UIApplication.sharedApplication().sf_statusBarStyle = value;
  }
}

const StatusBar = new StatusBarIOS();
export default StatusBar;
