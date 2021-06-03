var _fontStyles_ = {

    __moduleName:        '_fontStyles_',
    __fontStylesAdd:     'fontStylesAdd',
    __fontStylesEdit:    'fontStylesEdit',
    __fontStylesRemove:  'fontStylesRemove',
    __fontStylesSelect:  'fontStylesSelect',
    __fontStylesSet:     'fontStylesSet',
    __editFontStyleName: null,

    /* ************************************************************* */
    // PROPERTIES:
    //  Edit parameters:
    __parameters: {
        __parameterNames:    [_parameter_.__fontStyleName,       _parameter_.__fontName,            _parameter_.__fontWeight],
        __parameterTypes:    [_parameter_.__parameterTypeString, _parameter_.__parameterTypeString, '_fontStyles_.__fontWeightList'],
    },


    __fontWeightList:        [_parameter_.__regular, _parameter_.__bold, _parameter_.__italic, _parameter_.__bolditalic],

    /* ************************************************************* */
    // PROCEDURES
    __reset: function() {
        _model_[_parameter_.__fontStyle]                           = 'standard';
        _model_[_parameter_.__fontStyles]                          = {
                                                        standard: {
                                                            fontName:      'arial',
                                                            fontWeight:    _parameter_.__regular,
                                                        },
                                                        bold: {
                                                            fontName:      'arial',
                                                            fontWeight:    _parameter_.__bold,

                                                        },
                                                        italic: {
                                                            fontName:      'arial',
                                                            fontWeight:    _parameter_.__italic,
                                                        }
                                                    };
    },


    __addFontStyleSetup: function() {
        var __message                               = _messages_.__getMessage(this.__fontStylesAdd);
        _inputMultiple_.__setMultipleInput(__message, this.__parameters,  null, '_fontStyles_.__addFontStyleFollow(__parameterValues)');
    },
    __addFontStyleFollow: function(__parameterValues) {
        _model_[_parameter_.__fontStyles][__parameterValues[_parameter_.__fontStyleName]]  = {
                                                                fontName:       __parameterValues[_parameter_.__fontName],
                                                                fontWeight:     __parameterValues[_parameter_.__fontWeight],
                                                           };
        _model_[_parameter_.__fontStyle]                           = __parameterValues[_parameter_.__fontStyleName];
    },

    
    // Called from menu to select font style name from available list
    __selectFontStyleForEdition: function() {
        _inputSingle_.__setPropertyChoiceInput(this.__fontStylesSelect,  Object.keys(_model_[_parameter_.__fontStyles]), null, false, '_fontStyles_.__editFontStyleSetup(__inputValue)');
    },
    // callback from '__selectFontStyleForEdition' above
    __editFontStyleSetup: function(__fontStyleName) {
        this.__editFontStyleName                   = __fontStyleName;
        var __thisFontStyle                         = _model_[_parameter_.__fontStyles][__fontStyleName];
        var __parameters                            = {
                                                        __parameterNames:  this.__parameters.__parameterNames,
                                                        __parameterTypes:  this.__parameters.__parameterTypes,
                                                        __parameterValues: [__fontStyleName, __thisFontStyle[_parameter_.__fontName], __thisFontStyle[_parameter_.__fontWeight]],
                                                    };
        var __message                               = _messages_.__getMessage(this.__fontStylesEdit) + _parameter_.__colonSpace + __fontStyleName;
        _inputMultiple_.__setMultipleInput(__message, __parameters, _model_[_parameter_.__fontStyles][__fontStyleName], '_fontStyles_.__editFontStyleFollow(__parameterValues)');
    },
    // Callback from '_editFontStyle' above
    __editFontStyleFollow: function(__parameterValues) {
        var __thisFontStyle                         = _model_[_parameter_.__fontStyles][this.__editFontStyleName];
        __thisFontStyle[_parameter_.__fontName]                    = __parameterValues[_parameter_.__fontName];
        __thisFontStyle[_parameter_.__fontWeight]                  = __parameterValues[_parameter_.__fontWeight];
        // Changing the font style name?
        if (__parameterValues[_parameter_.__fontStyleName] !== this.__editFontStyleName) {
            // Delete previous entry
            delete _model_[_parameter_.__fontStyles][this.__editFontStyleName];
            // Replace current font style name, as required
            if (_model_[_parameter_.__fontStyle] === this.__editFontStyleName) {
                _model_[_parameter_.__fontStyle]                   = __parameterValues[_parameter_.__fontStyleName];
            }
            // Replace font style name in model text objects
            $.each( _model_[_parameter_.__list], function( __thisId, __thisObject ) {
                if (__thisObject[_parameter_.__fontStyle]) {
                    __thisObject[_parameter_.__fontStyle]          = __parameterValues[_parameter_.__fontStyleName];
                }
            });
        }
        // Replace / add font style
        _model_[_parameter_.__fontStyles][__parameterValues[_parameter_.__fontStyleName]] = __thisFontStyle;
        this.__editFontStyleName                  = null;
    },


    // Called from menu to select font style name from available list
    __removeFontStyle: function() {
        _inputSingle_.__setPropertyChoiceInput(this.__fontStylesRemove,  Object.keys(_model_[_parameter_.__fontStyles]), null, false, '_fontStyles_.__removeSelectedFontStyle(__inputValue)');
    },
    // callback from '__removeFontStyle' above
    __removeSelectedFontStyle: function(__fontStyleName) {
            // TODO: check for in-use font:
        if (__fontStyleName ===_model_[_parameter_.__fontStyle]) {
            // Default to first font style
            var __fontStyleKeys                     = Object.keys(_model_[_parameter_.__fontStyles]);
            _model_[_parameter_.__fontStyle]                       = __fontStyleKeys[0];
        }
            // Check objects to rename previous font style to current
        $.each( _model_[_parameter_.__list], function( __thisId, __thisObject ) {
            if  (_utils_.__typeToClass[__thisObject[_parameter_.__type]] === _text_.__moduleName) {
                if (__thisObject[_parameter_.__fontStyle]  === __fontStyleName) {
                    __thisObject[_parameter_.__fontStyle]          = _model_[_parameter_.__fontStyle];
                }
            }
        });
        delete _model_[_parameter_.__fontStyles][__fontStyleName];
    },


    // Called from menu to select font style name from available list
    __setFontStyle: function() {
        _inputSingle_.__setPropertyChoiceInput(this.__fontStylesSet, Object.keys(_model_[_parameter_.__fontStyles]), _model_[_parameter_.__fontStyle], false, '_fontStyles_.__setSessionFontStyle(__inputValue)');
    },
    // callback from '__setFontStyle' above
    __setSessionFontStyle: function(__fontStyleName) {
        if (__fontStyleName === _parameter_.__layerOptionDefault) {
            _model_[_parameter_.__fontStyle]                       = _parameter_.__layerOptionDefault;
        } else if (_model_[_parameter_.__fontStyles][__fontStyleName]) {
            _model_[_parameter_.__fontStyle]                       = __fontStyleName;
        }
    },

};
