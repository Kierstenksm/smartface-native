import { IBlurView } from './blurview';
import ViewAndroid from '../view/view.android';
import { BlurViewEvents } from './blurview-events';
import AndroidConfig from '../../util/Android/androidconfig';
import View from '../view';
import { IColor } from '../color/color';

const RenderScriptBlur = requireClass('eightbitlab.com.blurview.RenderScriptBlur');
const NativeBlurView = requireClass('eightbitlab.com.blurview.BlurView');

export default class BlurViewAndroid<TEvent extends string = BlurViewEvents> extends ViewAndroid<TEvent | BlurViewEvents, any, IBlurView> implements IBlurView {
  private _overlayColor: IColor;
  private _rootView: View;
  private _blurRadius: number;
  constructor(params?: Partial<IBlurView>) {
    super(params);
    this.addAndroidProps(this.getAndroidProps());
  }

  createNativeObject() {
    return new NativeBlurView(AndroidConfig.activity);
  }

  protected preConstruct(params?: Partial<IBlurView<'touch' | 'touchCancelled' | 'touchEnded' | 'touchMoved'>>): void {
    this._blurRadius = 16;
    super.preConstruct(params);
  }

  protected getAndroidProps() {
    const self = this;
    return {
      get overlayColor(): IColor {
        return self._overlayColor;
      },
      set overlayColor(value: IColor) {
        self._overlayColor = value;
        self.refreshBlurView();
      },
      get rootView(): View {
        return self._rootView;
      },
      set rootView(value: View) {
        self._rootView = value;
        self.refreshBlurView();
      },
      get blurRadius(): number {
        return self._blurRadius;
      },
      set blurRadius(value: number) {
        // maximum radius value is 25.
        // If you give a larger number than 25, the app will crash.
        if (value < 0 || value > 25) {
          return;
        }

        self._blurRadius = value;
        self.refreshBlurView();
      }
    };
  }
  refreshBlurView() {
    if (!this._rootView) {
      return;
    }
    const renderScriptBlur = new RenderScriptBlur(AndroidConfig.activity);
    const blurViewFacade = this.nativeObject.setupWith(this._rootView.nativeObject, renderScriptBlur);
    blurViewFacade.setBlurRadius(this._blurRadius);

    if (this._overlayColor) {
      blurViewFacade.setOverlayColor(this._overlayColor.nativeObject);
    }
  }
}
