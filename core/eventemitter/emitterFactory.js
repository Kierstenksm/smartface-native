const { EventEmitter } = require('./emitterClass');

/**
 * This callback will be executed after the handler function is set.
 * Can get any param, can return anything.
 * @callback EventCallback
 */

/**
 * This function will be bound to this
 * @param {Object} target - Target type, "this" should be passed
 * @param {string} event - The event to be handled
 * @param {EventCallback} callback - Pass null or empty function if you don't need to set any callback
 * @param  {Object} args - This might take multiple parameters and can get anything.
 * @returns {Function} - The function to be used on the native parts as event handler.
 */
 function EventEmitterWrapper(target, event, callback, ...args) {
  const handler = function(...args) {
    return target.emitter.emit(event, ...args);
  }
  typeof callback === 'function' && callback();
  return handler.bind(target, ...args);
}

/**
 * This function adds core eventemitter functionality to the targeted class.
 * It modifies the class and the instance.
 * - It adds Events list as Class.Events as static variable
 * - It mixins the eventEmitter class if not inherited
 * - It adds relevant inheritance to the class if there is a parent class
 * - It alters the 'on' method relevant with inheritance
 *  * @example
 * ```
 * // viewGroup-Android.js
 * const Events = { ...View.Events, ...EventList }; // Inherit the Parent Events
 * const EventFunctions = {
 *   [EventsList.ViewAdded]: function() {
 *     this.onViewAdded = EventEmitterWrapper(this, EventList.ViewAdded, null);
 *   }
 * } 
 * 
 * function ViewGroup() {
 *   function emitterCallBack() {
 *     if (!this.didSetHierarchyChangeListener) {
 *       setHierarchyChangeListener(this);
 *     }
 *   }
 *   EventEmitterCreator(this, ViewGroup, EventFunctions, Events, emitterCallBack.bind(this));
 * }
 * 
 * ```
 * @param {*} targetInstance this object
 * @param {*} targetClass The Current Class
 * @param {*} eventFunctions Object of Functions. It will be bound to the current context using targetInstance parameter. If there is no function to inherit, pass empty object.
 * @param {*} eventList If this is an inheritence, please combine them and pass it as parameter.
 * @param {*} callback This will be invoked after the relevant eventFunction is called. Will be bound to 'targetInstance' There is no filter.
 */
function EventEmitterCreator(targetInstance, targetClass, eventFunctions, eventList, eventCallback = () => {}) {
  const targetEmitter = targetInstance.emitter;
  targetClass.Events = { ...eventList };
  if (targetEmitter) {
    //Means this is an inheritance
    const parentOnFunction = targetInstance.on;
    Object.defineProperty(targetInstance, 'on', {
        value: (event, callback) => {
            if (typeof eventFunctions[event] === 'function') {
              eventFunctions[event].call(targetInstance);
              typeof eventCallback === 'function' && eventCallback.call(targetInstance);
              targetInstance.emitter.on(event, callback);
              return () => targetInstance.emitter.off(event, callback);
            }
            else {
              if (typeof parentOnFunction === 'function') {
                return parentOnFunction(event, callback);
              }
            }
        },
        configurable: true
    });
  }
  else {
    //Means this is the parent class
    targetInstance.emitter = new EventEmitter();
    Object.defineProperty(targetInstance, 'on', {
      value: (event, callback) => {
        if (typeof eventFunctions[event] === 'function') {
          eventFunctions[event].call(targetInstance);
          typeof eventCallback === 'function' && eventCallback.call(targetInstance);
          targetInstance.emitter.on(event, callback);
        }
          // Don't handle anything if the event isn't there
        return () => targetInstance.emitter.off(event, callback);
      },
      configurable: true
    });
  }
}

module.exports = {
  EventEmitterWrapper,
  EventEmitterCreator
};
