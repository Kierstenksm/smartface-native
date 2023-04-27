import { ConstructorOf } from '../../core/constructorof';
import { ISvgImageView } from './svgimageview';

/**
 * @class UI.SvgImageView
 * @extends UI.ImageView
 * @since 5.1.1
 *
 * SvgImageView is simply an svgimage container where UI.SvgImage is displayed inside.
 *
 *     @example
 *     import SvgImage from '@smartface/native/ui/svgimage';
 *     import SvgImageView from '@smartface/native/ui/svgimageview';
 *
 *     const mySvgImage = SvgImage.createFromFile("assets://sample.svg")
 *     const mySvgImageView = new SvgImageView({
 *         svgImage: mySvgImage,
 *         width: 200, height: 200
 *     });
 *
 *     myPage.layout.addChild(mySvgImageView);
 *
 */
const SvgImageView: ConstructorOf<ISvgImageView, Partial<ISvgImageView>> = require(`./svgimageview.${Device.deviceOS.toLowerCase()}`).default;
type SvgImageView = ISvgImageView;

export default SvgImageView;
