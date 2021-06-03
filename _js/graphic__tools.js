var _tools_ = {

    __moduleName:             '_tools_',

    __initializeDistance: function() {
        _view_.__setTouchEventsFunctionString(
            '_tools_.__setDistancePoint(_view_.__touchStartLocation);',
            '_track_.__trackEntry(_tools_.__moduleName, _view_.__modelLocation);',
            '_tools_.__setDistancePoint(_view_.__modelLocation, _view_.__fuzzValue);',
            '_tools_.__cancelDistance();'
        );
        this.__toolsData                         = {};
        this.__parameterNames                    = [_parameter_.__fromPoint,          _parameter_.__toPoint];
        this.__parameterTypes                    = [_parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint];
        this.__parameterIndex                    = 0;
        this.__parameterName                     = this.__parameterNames[this.__parameterIndex];
        this.__parameterType                     = this.__parameterTypes[this.__parameterIndex];
    },
    __setNextEditParameter: function() {
        if (this.__parameterIndex < (this.__parameterNames.length - 1)) {
            this.__parameterIndex               += 1;
            this.__parameterName                 = this.__parameterNames[this.__parameterIndex];
            this.__parameterType                 = this.__parameterTypes[this.__parameterIndex];
        }
    },
    __setDistancePoint: function(__currentPoint, __fuzzValue) {
        if (this.__parameterName === _parameter_.__fromPoint) {
            this.__toolsData[this.__parameterName]  = __currentPoint;
            this.__setNextEditParameter();
        } else if (_utils_.__getDistance(this.__toolsData[_parameter_.__fromPoint], __currentPoint) > __fuzzValue) {
            this.__finalizeDistance(__currentPoint);
        }
    },
    __finalizeDistance: function(__currentPoint) {
        var __distance = _utils_.__getDistance(this.__toolsData[_parameter_.__fromPoint], __currentPoint);
        this.__cancelDistance();
        alert(__distance);
    },
    __cancelDistance: function() {
        _view_.__resetTouchEventsFunctionString();
        delete this.__toolsData;
        delete this.__parameterNames;
        delete this.__parameterTypes;
        delete this.__parameterIndex;
        delete this.__parameterName;
        delete this.__parameterType;
    }
};
