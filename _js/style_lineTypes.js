var _lineTypes_ = {
    
    /* ************************************************************* */
    // PROPERTIES: None
    __moduleName:       '_lineTypes_',
    __lineTypeAdd:      'lineTypeAdd',
    __lineTypeEdit:     'lineTypeEdit',
    __lineTypeRemove:   'lineTypeRemove',
    __lineTypeSelect:   'lineTypeSelect',
    __lineTypeSet:      'lineTypeSet',
    __editLineTypeName: null,

    //  Edit parameters:
    __parameters: {
        __parameterNames:     [_parameter_.__lineTypeName,        'dashSequence'],
        __parameterTypes:     [_parameter_.__parameterTypeString, _parameter_.__parameterTypeString],
    },

    /* ************************************************************* */
    // PROCEDURES
    __reset: function() {
        _model_[_parameter_.__lineWidth]                  = _parameter_.__layerOptionDefault;
        _model_[_parameter_.__lineType]                   = _parameter_.__layerOptionDefault;
        _model_[_parameter_.__lineTypes]                  = {
                                                            solid:    [],
                                                            dashDot:  [3, 5, 1, 5],
                                                            dash:     [1, 5],
                                                            longDash: [3, 15],
                                                          };
        _model_[_parameter_.__lineTypeScale]                             = 1.0;
        _model_[_parameter_.__objectLineTypeScale]                       = 1.0;
    },

        // ADD LINETYPE
    __addLineTypeSetup: function() {
        var __message                            = _messages_.__getMessage(this.__lineTypeAdd);
        _inputMultiple_.__setMultipleInput(__message, this.__parameters,  null, '_lineTypes_.__addLineTypeFollow(__parameterValues)');
    },
    __addLineTypeFollow: function(__parameterValues) {
        var __dataString                         = ('' + __parameterValues.dashSequence);
        if (__dataString.indexOf(',') > -1) {
            var __currentDash                    = [];
            var __segmentDataElements            = __dataString.split(',');
            var __segmentIndex                   = 0;
            for (var __segmentIndex = 0; __segmentIndex < s.length; __segmentIndex += 1) {
                var __segmentData                = __segmentDataElements[__segmentIndex];
                if (isNaN(__segmentData)) {
                    _events_.__callError(this.__moduleName, _messages_.__getMessage(_parameter_.__dataError));
                    return;
                } else {
                    __currentDash.push(parseInt(__segmentData));
                }
            }
            _model_[_parameter_.__lineTypes][__parameterValues.__lineTypeName]   = __currentDash;
        } else {
            _events_.__callError(this.__moduleName, _messages_.__getMessage(_parameter_.__dataError));
        }
    },



        // REMOVE LINETYPE
    __removeLineType: function() {
        _inputSingle_.__setPropertyChoiceInput(this.__lineTypeRemove, Object.keys(_model_[_parameter_.__lineTypes]), null, false, '_lineTypes_.__removeSelectedLineType(__inputValue)');
    },
    __removeSelectedLineType: function(__lineTypeName) {
        delete _model_[_parameter_.__lineTypes][__lineTypeName];
        if (_model_[_parameter_.__lineType] === __lineTypeName) {
            var __lineTypeKeys                   = Object.keys(_model_[_parameter_.__lineTypes]);
            _model_[_parameter_.__lineType]      = __lineTypeKeys[0];
        }
    },

        // EDIT LINETYPE
    __selectLineTypeForEdition: function() {
        var __theseLineTypes                     = $.extend(true,{}, _model_[_parameter_.__lineTypes]);
        delete __theseLineTypes.solid;
        _inputSingle_.__setPropertyChoiceInput(this.__lineTypeSelect, Object.keys(__theseLineTypes), null, false, '_lineTypes_.__editLineTypeSetup(__inputValue)');
    },
    __editLineTypeSetup: function(__lineTypeName) {
        this.__editLineTypeName                  = __lineTypeName;
        _inputSingle_.__setPropertyValueInput(this.__lineTypeEdit, _model_[_parameter_.__lineTypes][__lineTypeName], '_lineTypes_.__editLineTypeFollow(__inputValue)');
    },
    __editLineTypeFollow: function(__parameterValue) {
        try {
            var __lineTypeValue                  = eval('[' + __parameterValue + ']');
            if (__lineTypeValue.length) {
                _model_[_parameter_.__lineTypes][this.__editLineTypeName] = __lineTypeValue;
                _paint_.__paintEntry();
            } else {
                _events_.__callError(this.__moduleName, _messages_.__getMessage(_parameter_.__dataError));
            }
        } catch (ex) {
            _events_.__callError(this.__moduleName, _messages_.__getMessage(_parameter_.__dataError));
        }
        this.__editLineTypeName                  = null;
    },

        // SET CURRENT LINETYPE
    __setLineType: function() {
        _inputSingle_.__setPropertyChoiceInput(this.__lineTypeSet, Object.keys(_model_[_parameter_.__lineTypes]), _model_[_parameter_.__lineType], true, '_lineTypes_.__setSessionLineType(__inputValue)');
    },
    __setSessionLineType: function(__lineTypeName) {
        if (__lineTypeName === _parameter_.__layerOptionDefault) {
            _model_[_parameter_.__lineType]      = _parameter_.__layerOptionDefault;
        }else if (_model_[_parameter_.__lineTypes][__lineTypeName]) {
            _model_[_parameter_.__lineType]      = __lineTypeName;
        }
    },
};
