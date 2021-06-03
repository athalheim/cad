var _inputSingle_ = {

    __moduleName:        '_inputSingle_',
    __invalidEntry:      'invalidEntry',
    // Provides five (5) ways of entering data:
    //  -Simple data entry with submit button
    //  -Select with cancel button
    //  -File selector
    //  -Image selector
    //  -True/False

    /* **************************************************************/
    // DATA ENTRY LOCATION
    __inputMode:         null,
    __inputObject:       null,
    __entryLocation:     null,
    __callback:          null,
    __cadFilename:       null,

    __lastInputLocation: {x:0, y:0},

    __resetDataEntryLocation: function() {
        var __canvasOffset                       = _utils_.__getCanvasOffset();
        this.__lastInputLocation                 = {
                                                        x: __canvasOffset.left,
                                                        y: __canvasOffset.top,
                                                   };
        this.__locateDataEntry();
    },
    __locateDataEntry: function() {
        $('.dataEntryWrapper').css({
            left: this.__lastInputLocation.x,
            top:  this.__lastInputLocation.y,
        });
    },
    __centerDataEntry: function() {
        var __canvasOffset                       = _utils_.__getCanvasOffset();
        var __cadCanvas                          = _utils_.__getCanvasElement();
        var __leftBorder                         = __canvasOffset.left + ((__cadCanvas[_parameter_.__width]  - $('.dataEntryWrapper').width())  * 0.5);
        var __topBorder                          = __canvasOffset.top  + ((__cadCanvas[_parameter_.__height] - $('.dataEntryWrapper').height()) * 0.5);
        $('.dataEntryWrapper').css({
            left: __leftBorder,
            top:  __topBorder,
        });
    },

    // DATA ENTRY MOVE CONTROL
        // 1. Initiate control displacement
    __inputPointerEventDown: function(__event) {
        __event.preventDefault();
        this.__entryLocation                     = _browser_.__getPointerLocation(__event);
    },
        // 2. Move control
    __inputPointerEventMove: function(__event) {
        __event.preventDefault();
        if (this.__entryLocation) {
            var p                                = _browser_.__getPointerLocation(__event);
            var __displacement                   = {x: (p.x - this.__entryLocation.x), y:(p.y - this.__entryLocation.y)};
            var __dataEntryWrapperLocation       = $('.dataEntryWrapper').offset();
            this.__lastInputLocation             = {
                                                        x: (__dataEntryWrapperLocation.left + __displacement.x), 
                                                        y: (__dataEntryWrapperLocation.top  + __displacement.y),
                                                   };
            this.__locateDataEntry();
        }
    },
        // 3. Stop control displacement
    __inputPointerEventUp: function(__event) {
        __event.preventDefault();
        this.__entryLocation = null;
    },


    /* ################################################ */

    // COMMON
    __disableAllInputs: function( __parameterType) {
           // 1:
        $('#dataEntry'         ).css('display', _parameter_.__none);
        document.getElementById('dataEntry').value          = '';
        $('#dataMultilineEntry').css('display', _parameter_.__none);
        document.getElementById('dataMultilineEntry').value = '';
        $('#dataEntrySubmit'   ).css('display', _parameter_.__none);
            // 2:
        $('#dataSelect'        ).css('display', _parameter_.__none);
        $('#dataSelectCancel'  ).css('display', _parameter_.__none);
            // 3:
        $('#dataEntryTrue'     ).css('display', _parameter_.__none);
        $('#dataEntryFalse'    ).css('display', _parameter_.__none);
            // 4:
        $('#dataEntryImage'    ).css('display', _parameter_.__none);
            // 5:
        $('#dataEntryJsonFile' ).css('display', _parameter_.__none);
            // Prompt
        $('#dataPrompt').removeAttr(_parameter_.__dataName);
        $('#dataPrompt').removeAttr(_parameter_.__dataType);
        $('#dataPrompt').removeAttr(_parameter_.__dataTooltip);
        if (!__parameterType) {
            this.__locateDataEntry();
        } else if ((__parameterType === _parameter_.__parameterTypePoint) || (__parameterType === _parameter_.__parameterTypeNumeric)) {
            this.__locateDataEntry();
        } else {
            this.__centerDataEntry();
        }
    },


    /* ################################################ */
    // CAD (5)
    __setCadSingleInput: function(__callback) {
        this.__callback                            = __callback;
        this.__disableAllInputs('json');
        document.getElementById("dataEntryJsonFile").value = '';
        $('#dataEntryJsonFile').css('display', 'inline');
        this.__setElementFocus('dataEntryJsonFile');
    },
    __submitCadInput: function(__event) {
        var __targetFile                         = __event.target.files[0];
        var __newFileReader                      = new FileReader();
        __newFileReader.onloadend                = function(__event) {
            var __filedata                       = __event.target.result;
            var __cadFilename                    = __targetFile.name;
            eval(_inputSingle_.__callback);
            _inputSingle_.__resetInput();
        };
        __newFileReader.readAsText(__targetFile);
    },


    /* ################################################ */
    // Direct calls

    __setPropertyChoiceInput: function(__mode, __valuesList, __defaultValue, __isAddingLayer, __callback) {
        this.__disableAllInputs('property');
        this.__updatePromptTitle(_messages_.__getMessage(__mode));
        this.__inputMode                         = __mode;
        this.__callback                          = __callback;
        this.__buildSelectOptionsList(__valuesList, __defaultValue, __isAddingLayer);
        $('#dataSelectCancel').css('display', 'inline');
    },
    __setPropertyValueInput: function(__mode, __defaultValue, __callback) {
        this.__disableAllInputs('property');
        this.__updatePromptTitle(_messages_.__getMessage(__mode));
        this.__inputMode                         = __mode;
        this.__callback                          = __callback;
        this.__setDataEntryValue(__defaultValue);
    },

    /* ################################################ */
    // UPDATE TITLE
    // Called from '_messages_' module to update prompt with language in use

    __setCommandTitle: function() {
        var __parameterName                      = $('#dataPrompt').attr(_parameter_.__dataName)?$('#dataPrompt').attr(_parameter_.__dataName):'';
        var __parameterType                      = $('#dataPrompt').attr(_parameter_.__dataType)?$('#dataPrompt').attr(_parameter_.__dataType):'';
        this.__updatePromptTitle(_messages_.__getMessage(__parameterName), ((__parameterType === _parameter_.__parameterTypePoint) || (__parameterType === _parameter_.__parameterTypeNumeric)));
    },

    /* ################################################ */
    // Input from add and dimension
    __initializeInput: function(__mode, __thisObject, __parameterName, __parameterType) {
        this.__inputMode                         = __mode;
        this.__inputObject                       = __thisObject;
        this.__setParameterInput(__parameterName, __parameterType);
    },
    // Input from modelTools and template
    __setSingleInput: function(__mode, __parameterName, __parameterType, __callback) {
        this.__inputMode                         = __mode;
        this.__callback                          = __callback;
        this.__setParameterInput(__parameterName, __parameterType);
        _view_.__setTouchEventsFunctionString(
            '',
            '',
            '_inputSingle_.__submitInput(this.__modelLocation);',
            ''
        );
    },

    __setParameterInput: function(__parameterName, __parameterType) {
        this.__disableAllInputs(__parameterType);
        $('#dataPrompt').attr(_parameter_.__dataName, __parameterName);
        $('#dataPrompt').attr(_parameter_.__dataType, __parameterType);
            // Prompt:
        this.__updatePromptTitle(_messages_.__getMessage(__parameterName), ((__parameterType === _parameter_.__parameterTypePoint) || (__parameterType === _parameter_.__parameterTypeNumeric)));
            // Then, enable only the required control
        if (__parameterType === _parameter_.__parameterTypeBoolean) {
            $('#dataEntryTrue').html(_messages_.__getMessage(__parameterName + 'True'));
            $('#dataEntryFalse').html(_messages_.__getMessage(__parameterName + 'False'));
            $('#dataEntryTrue').css('display', 'inline');
            $('#dataEntryFalse').css('display', 'inline');
        } else if (__parameterName === _parameter_.__url) {
            if (_utils_.__isUrlUsingHttp) {
                // TODO
            } else {
                $('#dataEntryImage').css('display', 'inline');
                this.__setElementFocus('dataEntryImage');
            }
        } else if (__parameterType.length === 1) {
            if (this.__inputObject) {
                if ((__parameterName === _parameter_.__content) && (this.__inputObject[_parameter_.__type] === _text_.__textMultiline )) {
                    this.__setMultilineDataEntry(this.__inputObject[__parameterName]);
                } else if (_utils_.__ownsProperty(this.__inputObject, __parameterName)) {
                    this.__setDataEntryValue(this.__inputObject[__parameterName]);
                } else {
                    this.__setDataEntryValue('');
                }
            } else {
                this.__setDataEntryValue('');
            }
        } else {
            this.__listParameterOptions(__parameterName, __parameterType);
        }
    },
    __setMultilineDataEntry: function() {
        $('#dataMultilineEntry').css('display', 'inline');
        var __dataEntryInput                     = document.getElementById("dataMultilineEntry");
        __dataEntryInput.value                   = '';
        if (_utils_.__ownsProperty(this.__inputObject, _parameter_.__content)) {
            __dataEntryInput.value               = this.__inputObject[_parameter_.__content];
        }
        $('#dataEntrySubmit').css('display', 'inline');
        this.__setElementFocus('dataMultilineEntry');
    },
    __setDataEntryValue: function(__inputValue) {
        var __dataEntryInput                     = document.getElementById("dataEntry");
        if (__inputValue) {
            if (_utils_.__hasXproperty(__inputValue)) {
                __dataEntryInput.value           = __inputValue.x + ',' + __inputValue.y;
            } else {
                __dataEntryInput.value           = __inputValue;
            }
        } else {
            __dataEntryInput.value               = '';
        }
        $('#dataEntry').css('display', 'inline');
        $('#dataEntrySubmit').css('display', 'inline');
        this.__setElementFocus('dataEntry');
    },
    __listParameterOptions: function(__parameterName, __parameterType) {
        //List:
        var __parameterKeys                      = null;
        var __parameterTypeList                  = eval(__parameterType);
        if (_utils_.__ownsProperty(__parameterTypeList, 'length')) {
            __parameterKeys                      = __parameterTypeList;
        } else {
            __parameterKeys                      = Object.keys(__parameterTypeList);
        }
        if (__parameterKeys.length === 1) {
            // Only one entry in the list
            this.__setDataEntryValue(__parameterKeys[0]);
        } else {
            this.__buildSelectOptionsList(__parameterKeys);
        }
    },

    __buildSelectOptionsList: function(__keys, __defaultValue, __isAddingLayer) {
        var __dataSelectOptions                  = '';
        if (!__defaultValue) {
            __dataSelectOptions                 += '<option>' + _messages_.__getMessage('inputSelectOption') + '</option>';
        } else if (__isAddingLayer) {
            __dataSelectOptions                 += '<option>' + _messages_.__getMessage(_parameter_.__layerOption) + '</option>';
        }
        $.each(__keys , function(__key, __value) {
            __dataSelectOptions                 += '<option value="' + __value + '"';
            if (__value === __defaultValue) {
                __dataSelectOptions             += ' selected="selected"';
            }
            __dataSelectOptions                 += '>' + _messages_.__getMessage(__value) + '</option>';
        });
        $('#dataSelect').html(__dataSelectOptions);
        $('#dataSelect').css('display', 'inline');
        this.__setElementFocus('dataSelect');
    },


    __updatePromptTitle: function(__promptTitle, __isTooltipSet) {
        $('#dataPrompt').html(__promptTitle);
        if (__isTooltipSet) {
            $('#dataPrompt').attr(_parameter_.__dataTooltip, __promptTitle);
        } else {
            $('#dataPrompt').attr(_parameter_.__dataTooltip, '');
        }
    },


    /* ********************************************************* */
    // SUBMIT procedures called directly from input controls
    // Expected types: point (from ponter), boolean, string

    // Process text entry
    __submitEntry: function() {
        if ($('#dataMultilineEntry').css('display').indexOf('inline') > -1) {
            this.__submitInput(document.getElementById('dataMultilineEntry').value);
        } else {
            // Simple Text entry:
            var __inputValue                     = document.getElementById('dataEntry').value;
                // Check for repeated command:
            if ($('#dataPrompt').html() === _messages_.__getMessage('inputRepeat')) {
                var __menuItem                   = _menu_.__getMenuItem(__inputValue);
                if (__menuItem) {
                    eval(__menuItem[_parameter_.__action]);
                    return;
                }
            }
                // Get string
            var __parameterType                  = $('#dataPrompt').attr(_parameter_.__dataType);
            switch (__parameterType) {
                case _parameter_.__parameterTypeString:
                    this.__submitInput(__inputValue);
                    break;
                case _parameter_.__parameterTypePoint:
                    __inputValue = this.__checkPointEntry(__inputValue);
                    break;
                case _parameter_.__parameterTypeNumeric:
                    if (isNaN(__inputValue)) {
                        _events_.__callError(this.__moduleName, _messages_.__getMessage('invalid'));
                    } else {
                        this.__submitInput(parseFloat(__inputValue));
                    }
                    break;
                default:
                    _events_.__callError(this.__moduleName, _messages_.__getMessage('invalid'));
            }
        }
    },
    __checkPointEntry: function(__inputValue) {
        if ((__inputValue.indexOf('@')> -1) || (__inputValue.indexOf(',')> -1) || (__inputValue.indexOf('<') > -1)) {
            __inputValue                     = _utils_.__checkPointFromInput(__inputValue);
            if (__inputValue) {
                this.__submitInput(__inputValue);
            } else {
                _events_.__callError(this.__moduleName, _messages_.__getMessage('invalid'));
            }
        } else {
            // Options:
            //   Polyline/polygon: arc/linear option
            //   Text:             alignment
            switch (this.__inputObject[_parameter_.__type]) {
                case _polyline_.__polylineType:
                case _polyline_.__polygonType:
                case _text_.__textMultiline:
                    this.__submitInput(__inputValue);
                    break;
                default:
                    _events_.__callError(this.__moduleName, _messages_.__getMessage('invalidEntry'));
            }
        }

    },

    // Process selected option
    __submitSelectInput: function(__inputValue) {
        if (__inputValue === _messages_.__getMessage(_parameter_.__layerOption)) {
            __inputValue                         = _parameter_.__layerOptionDefault;
        }
        if (this.__callback) {
            var __callback                       = this.__callback;
            this.__resetInput();
            eval(__callback);
        } else {
            this.__submitInput(__inputValue);
        }
    },


    __submitInput: function(__inputValue) {
        switch(this.__inputMode) {
            case _add_.__moduleName:
                _add_.__addParameterData(__inputValue);
                break;
            case _dimension_.__moduleName:
                _dimension_.__addDimensionParameter(__inputValue);
                break;
            case _edit_.__moduleName:
                if (this.__callback) {
                    eval(this.__callback);
                } else {
                    _events_.__callError(this.__moduleName, _messages_.__getMessage('invalidOption'));
                }
                break;

            case _array_.__moduleName:
            case _print_.__moduleName:
            case _tooltip_.__moduleName:
                eval(this.__callback);
                this.__resetInput();
                break;
            default:
                _events_.__callError(this.__moduleName, _messages_.__getMessage('invalidOption'));
        }
        document.getElementById('dataEntry').value = '';
        this.__setElementFocus('dataEntry');
    },


    /* ********************************************************* */
    // (4) Input File
    __submitImageInput: function(__event) {
        var __newImage                           = new Image();
        __newImage.src                           = URL.createObjectURL(__event.target.files[0]);
        if (this.__inputMode === '_add_') {
            _add_.__addParameterData(__newImage, __event.target.value);
        } else if (this.__inputMode === '_edit_') {
            // TODO: update image?
        }
    },


    /* ********************************************************* */
    // Called from add module
    __resetInput: function() {
        if (_view_.__touchEventsFunctionStrings) {
            if (_view_.__touchEventsFunctionStrings.__cancelString) {
                eval(_view_.__touchEventsFunctionStrings.__cancelString);
            }
        }
        _view_.__resetTouchEventsFunctionString();
        this.__callback                          = null;
        this.__disableAllInputs();
        $('#dataEntry').css('display', 'inline');
        $('#dataEntrySubmit').css('display', 'inline');
        var __dataEntry                          = document.getElementById("dataEntry");
        __dataEntry.value                        = '';
        this.__inputMode                         = null;
        var __promptTitle                        = _messages_.__getMessage('inputCommand');
        if (this.__inputObject) {
            if (this.__inputObject[_parameter_.__type]) {
                __promptTitle                    = _messages_.__getMessage('inputRepeat');
                __dataEntry.value                = this.__inputObject[_parameter_.__type];
                if (this.__inputObject.option) {
                    __dataEntry.value           += this.__inputObject.option;
                }
            }
        }
        this.__updatePromptTitle(__promptTitle);
        this.__inputObject                       = null;
    },

    __setElementFocus: function(__elementId) {
        document.getElementById(__elementId).focus();
    },

};


$(document).ready(function() {
    if ($('.dataEntryWrapper').length === 0) {
        var __dataEntryDiv =  '<div class="dataEntryWrapper" style="position:absolute; border: solid darkblue; background-color: lightgray;">' +
                            // Title
                            '  <span      id="dataPrompt"         style="cursor: pointer; background-color: lightgray;" title="' + _messages_.__getMessage('inputDrag') + '">' + _messages_.__getMessage('inputCommand') + '</span>' +
                            // 1: text entry (single and multiline) with ok button
                            '  <input     id="dataEntry"          type="text" value="">' +
                            '  <textarea  id="dataMultilineEntry" style="display:none"                                  cols="40" rows="5"></textarea>' +
                            '  <button    id="dataEntrySubmit"                                                          onclick="_inputSingle_.__submitEntry()">Ok</button>' +
                            // 2: select list
                            '  <select    id="dataSelect"         style="display:none"                                  onchange="_inputSingle_.__submitSelectInput(document.getElementById(\'dataSelect\').value)"></select>' +
                            '  <button    id="dataSelectCancel"   style="display:none"                                  onclick="_inputSingle_.__resetInput()">Cancel</button>' +
                            // 3: true/false buttons
                            '  <button    id="dataEntryTrue"      style="display:none"                                  onclick="_inputSingle_.__submitInput(true)">True</button>' +
                            '  <button    id="dataEntryFalse"     style="display:none"                                  onclick="_inputSingle_.__submitInput(false)">False</button>' +
                            // 4: url to get image
                            '  <input    id="dataEntryImage"      style="display:none" type="file" accept="image/*"     onchange="_inputSingle_.__submitImageInput(__event)"></input>' +
                            // 5: CAD file
                            '  <input    id="dataEntryJsonFile"   style="display:none" type="file" accept=".json"       onchange="_inputSingle_.__submitCadInput(event)"></input>' +
                            // 6: Cancel
                            '  <button   id="dataEntryCancel"                                                           onclick="_inputSingle_.__resetInput()">X</button>' +
                            '</div>';
        _utils_.__getCanvas().parent().append(__dataEntryDiv);
        _inputSingle_.__resetDataEntryLocation();
        $('#dataEntry').keyup(function(__event){
            if (__event.keyCode === 13) {
                _inputSingle_.__submitEntry();
            } else if ($('#dataPrompt').attr(_parameter_.__dataName) === _parameter_.__content) {
                _track_.__trackEntry(_add_.__moduleName, _view_.__modelLocation);
            }
        });
        $('#dataMultilineEntry').keyup(function(__event){
            _track_.__trackEntry(_add_.__moduleName, _view_.__modelLocation);
        });
        _browser_.__setComponentEvents('dataPrompt', '_inputSingle_.__inputPointerEventDown(__event);', '_inputSingle_.__inputPointerEventMove(__event);', '_inputSingle_.__inputPointerEventUp(__event);');
    }
        // No context menu at this time: right-click brings back control to upper-left corner.
    $('.dataEntryWrapper').contextmenu(function(__event) {
        __event.preventDefault();
        _inputSingle_.__resetDataEntryLocation();
    });
});
