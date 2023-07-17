import { ConstructorOf } from '../../core/constructorof';
import { IIcon } from './icon';

const Icon: ConstructorOf<IIcon, Partial<IIcon>> = require(`./icon.${Device.deviceOS.toLowerCase()}`).default;
type Icon = IIcon;

export default Icon;
