var _userTools_ = {
    __toggleWheelPull: function() {
        this.__setUserParameter(_parameter_.__isPullWheelToZoomIn, !_user_[_parameter_.__isPullWheelToZoomIn]);
    },
    __setUserParameter: function(__parameterName, __parameterValue) {
        if (typeof(Storage) !== "undefined") {
            _user_[__parameterName]               = __parameterValue;
            localStorage.setItem(__parameterName, __parameterValue);
        }
    },
    __getUserParameters: function() {
        $.each( _user_, function( __parameterName, __parameterValue ) {
            _userTools_.__getUserParameter(__parameterName);
        });
    },
    __getUserParameter: function(__parameterName) {
        if (typeof(Storage) !== "undefined") {
            var __parameterValue                   = localStorage.getItem(__parameterName);
            if (__parameterValue) {
                _user_[__parameterName]           = __parameterValue;
            }
        }
    },

};

$(document).ready(function() {
    _userTools_.__getUserParameters();
});
