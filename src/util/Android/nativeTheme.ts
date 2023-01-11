import Application from "../../application";
import { Appearance } from "../../application/application";
const NativeR = requireClass('android.R');

namespace AndroidNativeTheme {
  export function getAlertViewNativeThemeID() {
    return Application.appearance === Appearance.LIGHT ?
      NativeR.style.Theme_Material_Light_Dialog_Alert :
      NativeR.style.Theme_Material_Dialog_Alert;
  }
  export function getDialogNativeThemeID() {
    return Application.appearance === Appearance.LIGHT ?
      NativeR.style.Theme_Material_Light_Dialog :
      NativeR.style.Theme_Material_Dialog;
  }
}

export default AndroidNativeTheme;