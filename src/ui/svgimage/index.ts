import { SvgImageImpl } from "./svgimage";

const ISvgImage: typeof SvgImageImpl = require(`./svgimage.${Device.deviceOS.toLowerCase()}`).default;
type ISvgImage = SvgImageImpl;

export default ISvgImage;
