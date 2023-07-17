import NativeEventEmitterComponent from "../../core/native-event-emitter-component";
import { MobileOSProps } from "../../core/native-mobile-component";
import { IView } from "../view/view";
import { IBottomSheet } from "./bottomsheet";
import { BottomSheetEvents } from "./bottomsheet-events";

export default class BottomSheetIOS<TEvent extends string = BottomSheetEvents, TProps extends MobileOSProps<{}, {}> = MobileOSProps<{}, {}>>
    extends NativeEventEmitterComponent<TEvent | BottomSheetEvents, any, TProps>
    implements IBottomSheet {
    protected createNativeObject(params?: TProps) { }
    view: IView;
    borderRadius: number = 0;
    detents: ("large" | "medium")[] = ["medium"];
    isShowing: boolean = false;
    show(): void { }
    dismiss(): void { }
    onDismissed: () => void;
}
