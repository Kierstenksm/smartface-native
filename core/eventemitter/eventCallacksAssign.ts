import { INativeComponent } from '../inative-component';
import { IEventEmitter } from './event-emitter';

export function eventCallacksAssign(targetInstance: INativeComponent & IEventEmitter, eventFunctions: { [key: string]: (...params: any[]) => void; }, emit: boolean = true) {
  Object.keys(eventFunctions).forEach(event => {
    targetInstance.nativeObject[`on${event}`] = (...params: any[]) => {
      eventFunctions[event](targetInstance);
      emit && targetInstance.emit(event, ...params);
    };
  });
}
