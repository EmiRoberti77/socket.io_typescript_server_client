"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.outPut = exports.SPACE = exports.messageType = void 0;
var messageType;
(function (messageType) {
    messageType["connection"] = "connection";
    messageType["connect"] = "connect";
    messageType["disconnect"] = "disconnect";
    messageType["chatMessage"] = "chatMessage";
    messageType["screenName"] = "screenName";
    messageType["systemMessage"] = "systemMessage";
})(messageType || (exports.messageType = messageType = {}));
exports.SPACE = ' ';
var outPut;
(function (outPut) {
    outPut["newClient"] = "new client connected";
    outPut["disconnected"] = "disconnected";
    outPut["serverStarted"] = "server started";
})(outPut || (exports.outPut = outPut = {}));
