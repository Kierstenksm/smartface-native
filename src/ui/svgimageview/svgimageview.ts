import { IImageView } from '../imageview/imageview';
import { SvgImageViewEvents } from './svgimageview-events';

export interface ISvgImageView<TEvent extends string = SvgImageViewEvents> extends IImageView<TEvent | SvgImageViewEvents> {
}
