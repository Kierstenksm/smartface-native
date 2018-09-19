/*globals requireClass*/
const OkHttpClient = requireClass("okhttp3.OkHttpClient");
const OkHttpCallback = requireClass("okhttp3.Callback");
const OkHttpRequest = requireClass("okhttp3.Request");
const RequestBody = requireClass("okhttp3.RequestBody");
const TimeUnit = requireClass("java.util.concurrent.TimeUnit");
const MediaType = requireClass("okhttp3.MediaType");
const AndroidConfig = require("sf-core/util/Android/androidconfig");

const Blob = require("../../blob");

const WITHOUT_BODY_METHODS = {
    "GET": 0,
    "HEAD": 1,
    "COPY": 2,
    "PURGE": 3
};

const CONTENT_TYPE_KEY = "CONTENT-TYPE";
var activity = AndroidConfig.activity;

const Request = function() {
    Object.defineProperties(this, {
        'cancel': {
            value: function() {
                this.nativeObject.cancel();
            }
        }
    });
};


function http(params) {
    const self = this;

    self.clientBuilder = new OkHttpClient.Builder();

    var _timeout, // default OkHttp timeout. There is no way getting timout for public method.
        _defaultHeaders;
    var _cookiePersistentEnable = false;
    Object.defineProperties(self, "timeout", {
        get: function() {
            return _timeout;
        },
        set: function(value) {
            if (typeof(value) !== "number")
                throw new Error("timeout must be a number.");

            _timeout = value;
            self.clientBuilder.connectTimeout(_timeout, TimeUnit.MILLISECONDS);
            self.clientBuilder.readTimeout(_timeout, TimeUnit.MILLISECONDS);
            self.clientBuilder.writeTimeout(_timeout, TimeUnit.MILLISECONDS);
            self.client = self.clientBuilder.build();
        },
        enumerable: true
    });

    Object.defineProperty(self, "headers", {
        get: function() {
            return _defaultHeaders;
        },
        set: function(headers) {
            if (headers)
                _defaultHeaders = headers;
        }
    });

    self.android = {};
    Object.defineProperty(self.android, 'cookiePersistenceEnable', {
        get: function() {
            return _cookiePersistentEnable;
        },
        set: function(value) {
            if (typeof value !== "boolean")
                return;
            _cookiePersistentEnable = value;
            if (_cookiePersistentEnable) {
                self.clientBuilder.cookieJar(createCookieJar());
            }
            else {
                const NativeCookieJar = requireClass("okhttp3.CookieJar");
                self.clientBuilder.cookieJar(NativeCookieJar.NO_COOKIES);
            }
        },
        enumerable: true
    });
    // Assign parameters given in constructor
    if (params) {
        for (var param in params) {
            self[param] = params[param];
        }
    }

    self.client = self.clientBuilder.build();
    self.timeout = 60000;
}

http.prototype.cancelAll = function() {
    var dispatcher = this.client.dispatcher();
    dispatcher && dispatcher.cancelAll();
};

http.prototype.upload = function(params) {
    params && (params.method = "POST");
    return this.request(params, true, true);
};

http.prototype.requestString = function(params) {
    if (!params)
        throw new Error("Required request parameters.");
    var requestOnLoad = params.onLoad;
    params.onLoad = function(e) {
        if (e && e.body)
            e.string = e.body.toString();
        requestOnLoad && runOnUiThread(requestOnLoad, e);
    };
    return this.request(params, false, false);
};

http.prototype.requestImage = function(params) {
    if (!params)
        throw new Error("Required request parameters.");

    var requestOnLoad = params.onLoad;
    const Image = require("sf-core/ui/image");

    params.onLoad = function(e) {
        if (e && e.body) {
            e.image = Image.createFromBlob(e.body);
        }

        requestOnLoad && runOnUiThread(requestOnLoad, e);
    };
    return this.request(params, false, false);
};

http.prototype.requestJSON = function(params) {
    if (!params)
        throw new Error("Required request parameters.");

    var requestOnLoad = params.onLoad;
    params.onLoad = function(e) {
        if (e && e.body) {
            e.JSON = JSON.parse(e.string);
        }
        requestOnLoad && runOnUiThread(requestOnLoad, e);
    };
    return this.requestString(params, false, false);
};

http.prototype.requestFile = function(params) {
    if (!params)
        throw new Error("Required request parameters.");

    var requestOnLoad = params.onLoad;
    params.onLoad = function(e) {
        const IO = require("sf-core/io");
        var cacheDir = activity.getCacheDir().getAbsolutePath();
        var path;
        if (params.fileName)
            path = cacheDir + IO.Path.Separator + params.fileName;
        else
            path = cacheDir + params.url.substring(params.url.lastIndexOf('/'));
        var file = new IO.File({ path: path });
        if (e && e.body) {
            var stream = file.openStream(IO.FileStream.StreamType.WRITE, IO.FileStream.ContentMode.BINARY);
            var blob = new Blob(e.body.parts, { type: {} });
            stream.write(blob);
            stream.close();
            e.file = file;
        }

        requestOnLoad && runOnUiThread(requestOnLoad, e);
    };

    return this.request(params, false, false);
};

http.prototype.request = function(params, isMultipart, isRunOnBackgroundThread) {
    if (!checkInternet()) {
        params && typeof params.onError === "function" && runOnUiThread(params.onError, { message: "No network connection" });
        return;
    }

    var request = new Request();
    var callback = OkHttpCallback.implement({
        onFailure: function(call, e) {
            if (e)
                var message = e.getMessage();
            params && typeof params.onError === "function" && runOnUiThread(params.onError, { message: message });
        },
        onResponse: function(call, response) {
            var statusCode = response.code();
            var responseHeaders = getResponseHeaders(response.headers());

            if (statusCode != 304 && response.body()) {
                var bytes = response.body().bytes();
                var responseBody = new Blob(bytes, { type: {} });
            }

            if (response.isSuccessful()) {
                if (params && typeof params.onLoad === "function") {
                    if (isRunOnBackgroundThread) {
                        params.onLoad({
                            statusCode: statusCode,
                            headers: responseHeaders,
                            body: responseBody
                        });
                    }
                    else {
                        runOnUiThread(params.onLoad, {
                            statusCode: statusCode,
                            headers: responseHeaders,
                            body: responseBody
                        });
                    }
                }
            }
            else {
                params && typeof params.onError === "function" && runOnUiThread(
                    params.onError, {
                        statusCode: statusCode,
                        headers: responseHeaders,
                        message: response.message(),
                        body: responseBody
                    });
            }
        }
    });
    var okhttpRequest = createRequest(params, isMultipart, this.headers);
    request.nativeObject = this.client.newCall(okhttpRequest);
    request.nativeObject.enqueue(callback);
    return request;
};

function createRequest(params, isMultipart, httpManagerHeaders) {
    if (!params || !params.url) {
        throw new Error("URL parameter is required.");
    }
    var builder = new OkHttpRequest.Builder();
    builder = builder.url(params.url);

    var contentType = null;
    if (params.headers) {
        var keys = Object.keys(params.headers);
        for (var i = 0; i < keys.length; i++) {
            if (keys[i].toUpperCase() === CONTENT_TYPE_KEY)
                contentType = params.headers[keys[i]];
            builder.addHeader(keys[i], params.headers[keys[i]]);
        }
    }

    if (httpManagerHeaders) {
        keys = Object.keys(httpManagerHeaders);
        for (var i = 0; i < keys.length; i++) {
            if (keys[i].toUpperCase() === CONTENT_TYPE_KEY)
                contentType = httpManagerHeaders[keys[i]];
            builder.addHeader(keys[i], httpManagerHeaders[keys[i]]);
        }
    }

    if (params.method) {
        if (params.method in WITHOUT_BODY_METHODS) {
            builder = builder.method(params.method, null);
        }
        else {
            var body = createRequestBody(params.body, contentType, isMultipart);
            builder = builder.method(params.method, body);
        }
    }
    return builder.build();
}

function createRequestBody(body, contentType, isMultipart) {
    if (!body) {
        return RequestBody.create(null, array([], "byte"));
    }
    if (!isMultipart || body instanceof Blob) {
        var mediaType = null;
        if (contentType)
            mediaType = MediaType.parse(contentType);
        var content = null;
        if (body instanceof Blob)
            content = array(body.parts, "byte");
        else if (typeof(body) === "string")
            content = body;
        return RequestBody.create(mediaType, content);
    }
    else {
        return createMultipartBody(body);
    }
}

function createMultipartBody(bodies) {
    const MultipartBody = requireClass("okhttp3.MultipartBody");
    var builder = new MultipartBody.Builder();
    builder.setType(MultipartBody.FORM);
    for (var i = 0; i < bodies.length; i++) {
        if (!bodies[i].name) {
            throw new Error("Name of the upload part data cannot be empty.");
        }
        if (bodies[i].contentType)
            var mediaType = MediaType.parse(bodies[i].contentType);
        if (bodies[i].value)
            var body = RequestBody.create(mediaType, array(bodies[i].value.parts, "byte"));
        if (!body) {
            throw new Error("Upload method must include request body.");
        }
        var fileName = null;
        if (bodies[i].fileName)
            fileName = bodies[i].fileName;
        builder.addFormDataPart(bodies[i].name, fileName, body);
    }
    return builder.build();
}



function getResponseHeaders(headers) {
    var responseHeaders = {};
    var headersSize = headers.size();
    for (var i = 0; i < headersSize; i++) {
        responseHeaders[headers.name(i)] = headers.value(i);
    }
    return responseHeaders;
}

function checkInternet() {
    const Network = require("../../device/network");
    if (Network.connectionType === Network.ConnectionType.None)
        return false;
    return true;
}

function runOnUiThread(requestOnLoad, e) {
    const Runnable = requireClass("java.lang.Runnable");
    var runnable = Runnable.implement({
        run: function() {
            requestOnLoad(e);
        }
    });
    activity.runOnUiThread(runnable);
}

function createCookieJar() {
    const NativePersistenCookieJar = requireClass("com.franmontiel.persistentcookiejar.PersistentCookieJar");
    const NativeSetCookieCache = requireClass("com.franmontiel.persistentcookiejar.cache.SetCookieCache");
    const NativeSharedPrefsCookiePersistor = requireClass("com.franmontiel.persistentcookiejar.persistence.SharedPrefsCookiePersistor");

    var cookieJar = new NativePersistenCookieJar(new NativeSetCookieCache(), new NativeSharedPrefsCookiePersistor(activity));

    return cookieJar;
}

module.exports = http;
