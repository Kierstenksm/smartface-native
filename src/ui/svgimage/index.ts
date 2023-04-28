import { AbstractSvgImage } from "./svgimage";

class SvgImageimpl extends AbstractSvgImage {}

const SvgImage: typeof SvgImageimpl = require(`./svgimage.${Device.deviceOS.toLowerCase()}`).default;
type SvgImage = SvgImageimpl;

export default SvgImage;

