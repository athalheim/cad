var _unit_ = {

    __moduleName:             '_unit_',
    __formats: {
        metric: {
            fraction:         'decimal',
            baseUnit:         'mm',
            topUnit:          'm',
            topBaseUnitCount: 1000,
        },
        arch: {
            fraction:         'fraction',
            baseUnit:         '"',
            topUnit:          '\'',
            topBaseUnitCount: 12,
        },
        none: {
            fraction:         'decimal',
            baseUnit:         '',
            topUnit:          '',
            topBaseUnitCount: 100,
        },
    },


    __getLengthExpression: function(__length) {
        var __lengthExpression          = '';
        if (__length < 0) {
            __lengthExpression          = '-';
        }
        __length                        = Math.abs(__length);
        if (!_model_[_parameter_.__units]) {
            _model_[_parameter_.__units]               = 'metric';
        }
        var __currentFormat             = this.__formats[_model_[_parameter_.__units]];
        switch(_model_[_parameter_.__units]) {
            case _parameter_.__none:
                __lengthExpression         += _utils_.__roundValue(__length, __currentFormat[_parameter_.__topBaseUnitCount]) ;
                break;
            case 'metric':
                if (Math.round(__length) > 999) {
                    __lengthExpression     += _utils_.__roundValue(__length/1000, 1000) + __currentFormat[_parameter_.__topUnit];
                } else {
                    __lengthExpression     += _utils_.__roundValue(__length, 1) + __currentFormat[_parameter_.__baseUnit];
                }
                break;
            default:
                var __feet                  = Math.floor(__length / __currentFormat[_parameter_.__topBaseUnitCount]);
                __length                   -= (__feet * __currentFormat[_parameter_.__topBaseUnitCount]);
                var __inches                = Math.floor(__length);
                var __fraction              = (__length % 1);
                if (Math.round(__feet) > 0) {
                    __lengthExpression     += __feet + __currentFormat[_parameter_.__topUnit] + _parameter_.__space;
                }
                __lengthExpression         += __inches + _parameter_.__space;
                if (__fraction > 0.0) {
                    __fraction              = Math.round(__fraction * 16);
                    if (__fraction > 0) {
                        var __denominator   = 16;
                        while ((__denominator > 1) && ((__fraction % 2) === 0)) {
                            __fraction     /= 2;
                            __denominator  /= 2;
                        }
                        __lengthExpression += __fraction + '/' + __denominator;
                    }
                }
                __lengthExpression         += __currentFormat[_parameter_.__baseUnit];
        }
        return __lengthExpression;
    },

    __setUnitSetup: function() {
        _inputSingle_.__setPropertyChoiceInput(this.__moduleName, Object.keys(this.__formats), _model_[_parameter_.__units], false, '_unit_.__setUnitFollow(__inputValue)');
    },
    __setUnitFollow: function(__thisId) {
        if (this[_parameter_.__formats][__thisId]) {
            _model_[_parameter_.__units]                   = id;
        }
    },
};
