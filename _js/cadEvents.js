var _events_ = {

    __moduleName:      '_events_',
    __isInternalError: true,
    


    __callError: function(__moduleName, __message) {
        if (this.__isInternalError) {
            alert('Module: ' + _messages_.__getMessage(__moduleName) + _parameter_.__newLine + __message);
        } else {
            _utils_.__getCanvas().triggerHandler({
                type: _parameter_.__error,
                __moduleName: __moduleName,
                __message: __message,
            });
        }
    },

};

$(document).ready(function() {
    _utils_.__getCanvas().on(_parameter_.__error, function(__event) {
        alert(_messages_.__getMessage('errorTriggeredIn') + __event.__moduleName + _parameter_.__colonSpace + __event.__message);
    });
});
