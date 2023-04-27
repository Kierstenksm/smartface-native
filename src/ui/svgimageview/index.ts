import { ConstructorOf } from '../../core/constructorof';
import { ISVGImageView } from './svgimageview';

/**
 * @class UI.SVGImageView
 * @extends UI.ImageView
 * @since 5.1.1
 *
 * SVGImageView is simply an svgimage container where UI.SVGImage is displayed inside.
 *
 *     @example
 *     import SVGImage from '@smartface/native/ui/svgimage';
 *     import SVGImageView from '@smartface/native/ui/svgimageview';
 *
 *     const mySvgImage = SVGImage.createFromFile("assets://sample.svg")
 *     const mySvgImageView = new SVGImageView({
 *         svgImage: mySvgImage,
 *         width: 200, height: 200
 *     });
 *
 *     myPage.layout.addChild(mySvgImageView);
 *
 */
const SVGImageView: ConstructorOf<ISVGImageView, Partial<ISVGImageView>> = require(`./svgimageview.${Device.deviceOS.toLowerCase()}`).default;
type SVGImageView = ISVGImageView;

export default SVGImageView;
