import { IBottomSheet } from "./bottomsheet";

const BottomSheet: ConstructorOf<IBottomSheet, Partial<IBottomSheet>> = require(`./bottomsheet.${Device.deviceOS.toLowerCase()}`).default;
type BottomSheet = IBottomSheet;

export default BottomSheet;