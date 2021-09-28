const TypeUtil = require("../../util/type");
const {
    EventEmitterMixin,
    EventEmitter
  } = require("../../core/eventemitter");

const Events = require('./events');

AsyncTask.prototype = Object.assign({}, EventEmitterMixin);

function AsyncTask(params) {
    var self = this;

    self.android = {};
    self.ios = {};
    this.emitter = new EventEmitter();

    self.nativeObject = new __SF_NSOperationQueue();

    var _task;
    var _onComplete;
    var _onCancelled;

    const EventFunctions = {
        [Events.Cancelled]: function() {
            _onCancelled = function (state) {
                this.emitter.emit(Events.CallStateChanged, state);
            } 
        },
        [Events.Complete]: function() {
            _onComplete = function (state) {
                this.emitter.emit(Events.CallStateChanged, state);
            } 
        },
        [Events.PreExecute]: function() {
            //Android only
        }
    }

    Object.defineProperties(self, {
        'task': {
            get: function() {
                return _task;
            },
            set: function(value) {
                if (TypeUtil.isFunction(value)) {
                    _task = value;
                }
            }
        },
        'onComplete': {
            get: function() {
                return _onComplete;
            },
            set: function(value) {
                if (TypeUtil.isFunction(value)) {
                    _onComplete = value;
                }
            }
        },
        'onCancelled': {
            get: function() {
                return _onCancelled;
            },
            set: function(value) {
                if (TypeUtil.isFunction(value)) {
                    _onCancelled = value;
                }
            }
        },
        'run': {
            value: function() {
                if (self.nativeObject.operationCount == 0) {
                    var operation = __SF_NSBlockOperation.blockOperationWithJSValue(function() {
                        self.task && self.task();
                    });

                    operation.setCompletionBlockWithJSValue(function() {
                        __SF_NSOperationQueue.mainQueue().addOperationWithJSValue(function() {
                            this.cancelled ? (self.onCancelled && self.onCancelled()) : (self.onComplete && self.onComplete());
                        }.bind(this));
                    }.bind(operation));

                    self.nativeObject.addOperation(operation);
                } else {
                    throw new Error("Cannot execute task: the task is already running.");
                }
            }
        },
        'cancel': {
            value: function() {
                self.nativeObject.cancelAllOperations();
            }
        },
        'on': { 
            value: (event, callback) => {
                EventFunctions[event].call(this);
                this.emitter.on(event, callback);
            }
        }
    });

    // Assign parameters given in constructor
    if (params) {
        for (var param in params) {
            this[param] = params[param];
        }
    }
}

module.exports = AsyncTask;