import { IImageView } from '../imageview/imageview';
import { SVGImageViewEvents } from './svgimageview-events';

export interface ISVGImageView<TEvent extends string = SVGImageViewEvents> extends IImageView<TEvent | SVGImageViewEvents> {
}
