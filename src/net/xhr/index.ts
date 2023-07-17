import { AbstractXHR } from './xhr';


const XHR: typeof AbstractXHR = require(`./xhr.${Device.deviceOS.toLowerCase()}`).default;
type XHR = AbstractXHR;
export default XHR;
