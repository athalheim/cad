var _template_ = {

    // TEMPLATES
    // List and load templates
    __moduleName:   '_template_',
        // NOTE: All formats landscape, using metric values
    __templateList: {
        none: {   width:   500,  height:  300 },
        // Metric
        // Margins: left: 20, others: 10
        a0:{      width:   1158, height:  821 },    // 1188 x 841
        a1:{      width:   811,  height:  574 },    //  841 x 594
        a2:{      width:   564,  height:  400 },    //  594 x 420
        a3:{      width:   390,  height:  277 },    //  420 x 297
        a4:{      width:   267,  height:  190 },    //  297 x 210
        // Imperial
        letter:{  width:   249,  height:  196 },    //  279 x 216
        legal:{   width:   326,  height:  196 },    //  216 x 216
        tabloid:{ width:   402,  height:  259 },    //  279 x 279
    },
    __templateScales:        ['1:1', '1:10', '1:20', '1:50', '1:100'],

    __parameters: {
        __parameterNames:    [_parameter_.__templateName,                  _parameter_.__templateScale],
        __parameterTypes:    ['Object.keys(_template_.__templateList)',    '_template_.__templateScales'],
        __parameterValues:   ['_user_[_parameter_.__defaultTemplateName]', '_user_[_parameter_.__defaultTemplateScale]'],
    },


    /* ************************************************ */

    __chooseTemplate: function() {
        var __message                                                          = _messages_.__getMessage(this.__moduleName);
        _inputMultiple_.__setMultipleInput(__message, this.__parameters, null, '_template_.__setTemplateFollow(__parameterValues)');
    },
    __setTemplateFollow: function(__parameterValues) {
        _model_[_parameter_.__template]                                        = {};
        if (__parameterValues) {
            _model_[_parameter_.__template][_parameter_.__name]                = __parameterValues[_parameter_.__templateName];
            if (__parameterValues[_parameter_.__templateScale].indexOf(':') > -1) {
                _model_[_parameter_.__template][_parameter_.__scale]           = __parameterValues[_parameter_.__templateScale];
            } else {
                _model_[_parameter_.__template][_parameter_.__scale]           = this.__templateScales[0];
            }
            _userTools_.__setUserParameter(_parameter_.__defaultTemplateName, _model_[_parameter_.__template][_parameter_.__name]);
            _userTools_.__setUserParameter(_parameter_.__defaultTemplateScale, _model_[_parameter_.__template][_parameter_.__scale]);
        } else {
            _model_[_parameter_.__template][_parameter_.__name]                = _user_[_parameter_.__defaultTemplateName];
            _model_[_parameter_.__template][_parameter_.__scale]               = _user_[_parameter_.__defaultTemplateScale];
        }

        _model_[_parameter_.__template][_parameter_.__origin]                  = {x: 0, y: 0};
        var __thisTemplate                                                     = this.__templateList[_model_[_parameter_.__template][_parameter_.__name]];
        _model_[_parameter_.__template][_parameter_.__width]                   = __thisTemplate[_parameter_.__width];
        _model_[_parameter_.__template][_parameter_.__height]                  = __thisTemplate[_parameter_.__height];
        var __scaleParts                           = _model_[_parameter_.__template][_parameter_.__scale].split(':');
        _model_[_parameter_.__template][_parameter_.__scale]                   = parseInt(__scaleParts[1]);
        if (_model_[_parameter_.__template][_parameter_.__name] === _parameter_.__none) {
            _modelTools_.__setModelLimits();
        } else {
            this.__getTemplate(_model_[_parameter_.__template][_parameter_.__name]);
        }
    },
    __getTemplate: function(__filename) {
        if (_utils_.__isUrlUsingHttp) {
            this.__loadTemplateFromHttp(__filename);
        } else {
            this.__loadTemplateFromLocal(__filename);
        }
    },

    __scriptTag: null,
    __loadTemplateFromLocal: function(__filename) {
        var __filepath                             = '.\\_js_templates\\' + __filename + '.js';
        this.__scriptTag                         = _utils_.__createElementByTag('script');
        this.__scriptTag.onload                  = function() {
            _template_.__processTemplate(currentTemplate);
            document.head.removeChild(_template_.__scriptTag);
            _template_.__scriptTag               = null;
        };
        document.head.appendChild(this.__scriptTag);
        this.__scriptTag.src                     = __filepath;
    },
    __loadTemplateFromHttp: function(__filename) {
        var __filepath                           = '_templates/' + __filename + '.json';
        $.getJSON(__filepath, function(__templateData) {
            this.__processTemplate(__templateData);
        });
    },
    __processTemplate: function(__templateData) {
        _model_[_parameter_.__template][_parameter_.__limits]                  = __templateData[_parameter_.__limits];
        this.__setTemplateLayers(__templateData[_parameter_.__layers]);
        this.__setTemplateFontStyles(__templateData[_parameter_.__fontStyles]);
        this.__setTemplateLineTypes(__templateData[_parameter_.__lineTypes]);
        _model_[_parameter_.__template][_parameter_.__list]                    = __templateData[_parameter_.__list];
        this.__setTitleBlockLanguage();
        _modelTools_.__setModelLimits();
    },
    __setTemplateLayers: function(__layers) {
        $.each( __layers, function( __thisId, __thisLayer ) {
            if (!_model_[_parameter_.__layers][__thisId]) {
                _model_[_parameter_.__layers][__thisId]          = __thisLayer;
            }
        });
    },
    __setTemplateFontStyles: function(__fontStyles) {
        $.each( __fontStyles, function( __thisId, __fontStyle ) {
            if (!_model_[_parameter_.__fontStyles][__thisId]) {
                _model_[_parameter_.__fontStyles][__thisId]  = __fontStyle;
            }
        });
    },
    __setTemplateLineTypes: function(__lineTypes) {
        $.each( __lineTypes, function( __thisId, __lineType ) {
            if (!_model_[_parameter_.__lineTypes][__thisId]) {
                _model_[_parameter_.__lineTypes][__thisId]    = __lineType;
            }
        });
    },
    __setTitleBlockLanguage: function() {
        $.each( _model_[_parameter_.__template][_parameter_.__list], function( __thisId, __thisObject ) {
            if (__thisObject[_parameter_.__title]) {
                __thisObject[_parameter_.__content]               = _messages_.__getMessage(__thisObject[_parameter_.__title]) + ':';
            }
        });
    },

    
    /* ************************************************ */

    __editTemplate: function() {
        var __parameters                           = {
                                                     __parameterNames:    [],
                                                     __parameterTypes:    [],
                                                     __parameterValues:   [],
                                                   };
        $.each( _model_[_parameter_.__template][_parameter_.__list], function( __thisId, __thisObject ) {
            if (__thisObject[_parameter_.__attribute]) {
                var __parameterName                = __thisObject[_parameter_.__attribute];
                var __parameterTitle               = __parameterName + _parameter_.__Title;
                __parameters.__parameterNames.push(__parameterTitle);
                __parameters.__parameterTypes.push(_parameter_.__parameterTypeString);
                __parameters.__parameterValues.push(__thisObject[_parameter_.__content]);
            }
        });
        var __message                              = _messages_.__getMessage(this.__moduleName);
        _inputMultiple_.__setMultipleInput(__message, __parameters, null, '_template_.__finalizeTemplateEdit(__parameterValues)');
    },
    __finalizeTemplateEdit: function(__parameterValues) {
        $.each( __parameterValues, function( __parameterTitle, __parameterValue ) {
            var __parameterName                    = __parameterTitle.replace(_parameter_.__Title,'');
            $.each( _model_[_parameter_.__template][_parameter_.__list], function( __thisId, __thisObject ) {
                if (__thisObject[_parameter_.__attribute] === __parameterName) {
                    __thisObject[_parameter_.__content]           = __parameterValue;
                    return false;
                }
            });
        });
        _paint_.__paintEntry();
    },


    /* ************************************************ */

    __initializeMoveTemplate: function() {
        _inputSingle_.__setSingleInput('moveTemplate', 'newOrigin', _parameter_.__parameterTypePoint, '_template_.__moveTemplate(__inputValue);');
    },
    __moveTemplate: function(__newOrigin) {
        _model_[_parameter_.__template][_parameter_.__origin]                  = {x: __newOrigin.x, y: __newOrigin.y};
    },

};
