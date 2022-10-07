import NativeEventEmitterComponent from "../../core/native-event-emitter-component";
import { MobileOSProps } from "../../core/native-mobile-component";
import Screen from "../../device/screen";
import AndroidConfig from "../../util/Android/androidconfig";
import ColorAndroid from "../color/color.android";
import { IFlexLayout } from "../flexlayout/flexlayout";
import FlexLayoutAndroid from "../flexlayout/flexlayout.android";
import { IView } from "../view/view";
import { IBottomSheet } from "./bottomsheet";
import { BottomSheetEvents } from "./bottomsheet-events";

const SFBottomSheetDialogFragment = requireClass("io.smartface.android.sfcore.ui.bottomsheet.SFBottomSheetDialogFragment");
const NativeMaterialR = requireClass("com.google.android.material.R");
const NativeBottomSheetBehavior = requireClass("com.google.android.material.bottomsheet.BottomSheetBehavior");

const BOTTOM_SHEET_FRAGMENT_MANAGER_TAG = "SF_MODAL_BOTTOM_SHEET";

export default class BottomSheetAndroid<TEvent extends string = BottomSheetEvents, TProps extends MobileOSProps<{}, {}> = MobileOSProps<{}, {}>>
    extends NativeEventEmitterComponent<TEvent | BottomSheetEvents, any, TProps>
    implements IBottomSheet {

    protected createNativeObject(params?: TProps) {
        return this.createModalBottomSheet();
    }

    protected preConstruct(params?: any) {
        this._isShowing = false;
        this._borderRadius = 0;
        this._detents = ["medium"];
        super.preConstruct(params);
    }

    private _bottomSheetBehavior?: any;
    private _contentWrapper: IFlexLayout;
    private _isShowing: boolean;
    private _view: IView;
    private _borderRadius: number;
    private _detents: ("medium" | "large")[];

    show(): void {
        if (this._isShowing) return;
        this._isShowing = true;
        this.nativeObject.show(AndroidConfig.activity.getSupportFragmentManager(), BOTTOM_SHEET_FRAGMENT_MANAGER_TAG);
    }

    dismiss(): void {
        this.nativeObject.dismiss();
    }

    get isShowing(): IBottomSheet['isShowing'] {
        return this._isShowing;
    }

    get view(): IBottomSheet['view'] {
        return this._view;
    }

    set view(value: IBottomSheet['view']) {
        this._view = value;
        this.updateView(this._view);
    }

    get borderRadius(): IBottomSheet['borderRadius'] {
        return this._borderRadius;
    }

    set borderRadius(value: IBottomSheet['borderRadius']) {
        this._borderRadius = value;
        this.updateBorderRadius(this._borderRadius);
    }

    get detents(): IBottomSheet['detents'] {
        return this._detents;
    }

    set detents(value: IBottomSheet['detents']) {
        this._detents = value;
        this.applyDetents(this._detents);
    }

    onDismissed: () => void;

    private initializeContentWrapper() {
        this._contentWrapper && this._contentWrapper.removeAll();
        this._contentWrapper = new FlexLayoutAndroid({
            backgroundColor: ColorAndroid.WHITE,
            masksToBounds: true,
            borderTopLeftRadius: this._borderRadius,
            borderTopRightRadius: this._borderRadius,
        });
        this._view && this._contentWrapper.addChild(this._view);
        return this._contentWrapper;
    }

    private createModalBottomSheet() {
        const callbacks = {
            onCreateView: (inflater, container, savedInstanceState) => {
                return this.initializeContentWrapper().nativeObject;
            },
            onDialogShow: (dialog) => {
                const bottomSheetFrameLayout = dialog.findViewById(NativeMaterialR.id.design_bottom_sheet);
                bottomSheetFrameLayout.setBackgroundResource(ColorAndroid.TRANSPARENT.nativeObject);
                this._bottomSheetBehavior = dialog.getBehavior();
                this.applyDetents(this._detents);
            },
            onDismiss: () => {
                this._isShowing = false;
                this.emit('dismissed');
                this.onDismissed?.();
            }
        };
        return new SFBottomSheetDialogFragment(callbacks);
    }

    private applyDetents(value: IBottomSheet['detents']) {
        if (!this._bottomSheetBehavior) return;

        const height = value.length > 1 ? "both" : value[0];
        switch (height) {
            case "medium":
                this._bottomSheetBehavior.setState(NativeBottomSheetBehavior.STATE_EXPANDED);
                this._bottomSheetBehavior.setSkipCollapsed(true);
                this._contentWrapper && (this._contentWrapper.height = Screen.height / 2);
                break;
            case "both":
                this._bottomSheetBehavior.setState(NativeBottomSheetBehavior.STATE_HALF_EXPANDED);
                this._bottomSheetBehavior.setFitToContents(false);
                this._bottomSheetBehavior.setSkipCollapsed(true);
                this._contentWrapper && (this._contentWrapper.height = Screen.height);
                break;
            case "large":
                this._bottomSheetBehavior.setState(NativeBottomSheetBehavior.STATE_EXPANDED);
                this._bottomSheetBehavior.setSkipCollapsed(true);
                this._contentWrapper && (this._contentWrapper.height = Screen.height);
                break;
            default:
                break;
        }
    }

    private updateView(view: IView) {
        if (!this._contentWrapper) return;
        this._contentWrapper.removeAll();
        this._contentWrapper.addChild(view);
    }

    private updateBorderRadius(value: number) {
        if (!this._contentWrapper) return;
        this._contentWrapper.borderTopLeftRadius = value;
        this._contentWrapper.borderTopRightRadius = value;
    }
}
