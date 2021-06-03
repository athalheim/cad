var _layers_ ={

    __moduleName:    '_layers_',
    __layerAdd:      'layerAdd',
    __layerEdit:     'layerEdit',
    __layerRemove:   'layerRemove',
    __layerSelect:   'layerSelect',
    __layerSet:      'layerSet',
    __editLayerName: null,

    /* ************************************************************* */
    // Properties:
    //  Edit parameters:
    __parameters: {
        __parameterNames:  [_parameter_.__layerName,           _parameter_.__color,   _parameter_.__lineType,             _parameter_.__lineTypeScale,        _parameter_.__lineWidth,            _parameter_.__penSize, _parameter_.__isPrintable],
        __parameterTypes:  [_parameter_.__parameterTypeString, '_utils_.__colorList', '_model_[_parameter_.__lineTypes]', _parameter_.__parameterTypeNumeric, _parameter_.__parameterTypeNumeric, _print_.__penSizes,    _parameter_.__parameterTypeBoolean],
    },

    /* ************************************************************* */
    // Procedures:
    __reset: function() {
        _model_[_parameter_.__layer]             = '0';
        _model_[_parameter_.__layers]            = {
                                                    0: {
                                                        color:         _parameter_.__black, 
                                                        lineType:      'solid',
                                                        lineTypeScale: 1.0,
                                                        lineWidth:     0.35,
                                                        penSize:       0.35,
                                                        isPrintable:   true,
                                                    },
                                                    1: {
                                                        color:         _parameter_.__red, 
                                                        lineType:      'dash',
                                                        lineTypeScale: 1.0,
                                                        lineWidth:     0.25,
                                                        penSize:       0.25,
                                                        isPrintable:   true,
                                                    },
                                                   };
    },


    // Called from menu to select font style name from available list
    __addLayerSetup: function() {
        var __message                               = _messages_.__getMessage(this.__layerAdd);
        _inputMultiple_.__setMultipleInput(__message, this.__parameters, null, '_layers_.__addLayerFollow(__parameterValues)');
    },
    // callback from '_addLayer' above
    __addLayerFollow: function(__parameterValues) {
        var __thisLayer                             = {};
        __thisLayer[_parameter_.__color]                           = __parameterValues[_parameter_.__color];
        __thisLayer[_parameter_.__lineType]                        = __parameterValues[_parameter_.__lineType];
        if (__parameterValues[_parameter_.__lineTypeScale] !== '') {
            var __lineTypeScale                     = parseFloat(__parameterValues[_parameter_.__lineTypeScale]);
            if (__lineTypeScale > 0.0) {
                __thisLayer[_parameter_.__lineTypeScale]           = __lineTypeScale;
            } else {
                __thisLayer[_parameter_.__lineTypeScale]           = 1.0;
            }
        }
        if (__parameterValues[_parameter_.__lineWidth] !== '') {
            var __lineWidth                         = parseFloat(__parameterValues[_parameter_.__lineWidth]);
            if (__lineWidth >= 0.0) {
                __thisLayer[_parameter_.__lineWidth]               = __lineWidth;
            } else {
                __thisLayer[_parameter_.__lineWidth]               = 0.0;
            }
        }
        _model_[_parameter_.__layers][__parameterValues.__layerName]   = __thisLayer;
        this.__setSessionLayer(__parameterValues.__layerName);
    },


    // Called from menu to select font style name from available list
    __selectLayerForEdition: function() {
        _inputSingle_.__setPropertyChoiceInput(this.__layerSelect, Object.keys(_model_[_parameter_.__layers]), null, false, '_layers_.__editLayerSetup(__inputValue)');
    },
    // callback from '__selectLayerForEdition' above
    __editLayerSetup: function(__layerName) {
        this.__editLayerName                       = __layerName;
        var __message                               = _messages_.__getMessage(this.__layerEdit);
        _inputMultiple_.__setMultipleInput(__message, this.__parameters, _model_[_parameter_.__layers][__layerName], '_layers_.__editLayerFollow(__parameterValues)');
    },
    // callback from '_editLayer' above
    __editLayerFollow: function(__parameterValues) {
        var __thisLayer                             = _model_[_parameter_.__layers][this.__editLayerName];
        __thisLayer[_parameter_.__color]                           = __parameterValues[_parameter_.__color];
        __thisLayer[_parameter_.__lineType]                        = __parameterValues[_parameter_.__lineType];
        if (__parameterValues[_parameter_.__lineTypeScale] !== '') {
            var __layerLineTypeScale                = parseFloat(__parameterValues[_parameter_.__lineTypeScale]);
            if (__layerLineTypeScale > 0.0) {
                __thisLayer[_parameter_.__lineTypeScale]           = __layerLineTypeScale;
            } else {
                __thisLayer[_parameter_.__lineTypeScale]           = 1.0;
            }
        }
        if (__parameterValues[_parameter_.__lineWidth] !== '') {
            var __layerLineWidth                    = parseFloat(__parameterValues[_parameter_.__lineWidth]);
            if (__layerLineWidth >= 0.0) {
                __thisLayer[_parameter_.__lineWidth]               = __layerLineWidth;
            } else {
                __thisLayer[_parameter_.__lineWidth]               = 0.0;
            }
        }
        _model_[_parameter_.__layers][this.__editLayerName]         = __thisLayer;
        this.__editLayerName                       = null;
    },


    // Called from menu to select font style name from available list
    __removeLayer: function(__layerName) {
        _inputSingle_.__setPropertyChoiceInput(this.__layerRemove, Object.keys(_model_[_parameter_.__layers]), null, false, '_layers_.__removeSelectedLayer(__inputValue)');
    },
    // callback from '__removeLayer' above
    __removeSelectedLayer: function(__layerName) {
        if (this.__isLayerInUse(__layerName)) {
            _events_.__callError(this.__moduleName, 'layerInUse');
        } else {
            delete _model_[_parameter_.__layers][__layerName];
            if (_model_[_parameter_.__layer] === __layerName) {
                var __layerKeys                  = Object.keys(_model_[_parameter_.__layers]);
                _model_[_parameter_.__layer]     = __layerKeys[0];
            }
        }
    },
    __isLayerInUse: function(__thisLayer) {
        $.each( _model_[_parameter_.__list], function( __thisId, __thisObject ) {
            if (__thisObject[_parameter_.__layer] === __thisLayer) {
                return true;
            }
        });
    },


    // Called from menu to select font style name from available list
    __setLayer: function() {
        _inputSingle_.__setPropertyChoiceInput(this.__layerSet, Object.keys(_model_[_parameter_.__layers]), _model_[_parameter_.__layer], false, '_layers_.__setSessionLayer(__inputValue)');
    },
    // callback from '__setLayer' above
    __setSessionLayer: function(__thisId) {
        if (_model_[_parameter_.__layers][__thisId]) {
            _model_[_parameter_.__layer]                           = __thisId;
        }
    },

};
