var _block_ = {

    __moduleName:     '_block_',
    __parameterNames: [_parameter_.__name,                _parameter_.__description,         _parameter_.__origin],
    __parameterTypes: [_parameter_.__parameterTypeString, _parameter_.__parameterTypeString, _parameter_.__parameterTypePoint],


    /* ************************************************************* */
    // Procedures:
    __updateAnchorPoints: function(__thisObject) {
        // TODO
    },


    /* ********************************************************************** */
    // OBJECT CONSTRUCTION
    /* 1. Initialization */

    /* 2. Finalization */
    __finalizeBlock: function(__thisBlock) {
        this.__updateAnchorPoints(__thisBlock);
    },
    /* 3. Add Parameter data */
    __addParameterData: function(__thisBlock, __data) {
        // Define parameterName scope here...
        switch (__parameterName) {
            case _parameter_.__name:
                __thisBlock[_parameter_.__name]            = __data;
                break;
            case _parameter_.__description:
                __thisBlock[_parameter_.__description]     = __data;
                break;
            case _parameter_.__origin:
                __thisBlock[_parameter_.__origin]          = __data;
                break;
        }
        return true;
    },


    __isHitByPointer: function(__thisBlock, __currentPoint, __fuzzValue) {
        return (_utils_.__isPointOnAnyVector(__thisBlock.__anchorPoints, __currentPoint, __fuzzValue, true) > -1);
    },

    __explodeBlock: function() {
        // TODO
    },

    /* ************************************************************* */
    // Procedures:
    __buildBlock: function() {
        return {
            description: '(empty)',
            list:        {},
       };
    },
    __addObjectsToBlock: function(__selection) {
        for (var __thisId in __selection) {
            var __thisObject                               = _modelTools_.__getObjectById(__thisId);
            var __newId                                    = _utils_.__buildId(this[_parameter_.__list]);
            this[_parameter_.__list][__newId]              = __thisObject;
            delete _model_[_parameter_.__list][__thisId];
        }
    },
    __addObjectToBlock: function(__thisObject) {
        var __thisId                                       = _utils_.__buildId(this[_parameter_.__list]);
        this[_parameter_.__list][__thisId]                 = __thisObject;
    },
    __removeObjectFromBlock: function(__thisId) {
        delete this[_parameter_.__list][__thisId];
    },

};
