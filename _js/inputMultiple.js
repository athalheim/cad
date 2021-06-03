var _inputMultiple_ = {

    __moduleName:     '_inputMultiple_',
    __entryLocation:   null,
    __parameterNames:  null,
    __parameterTypes:  null,
    __parameterValues: null,
    __inputObject:     null,
    __callback:        null,
    __updateCallback:  null,


    /* ********************************************************** */
    // DATA ENTRY DISPLACEMENT CONTROL
        // 1. Initiate control displacement
    __inputPointerEventDown: function(__event) {
        // Skip any input control
        if (__event.target.parentElement.localName === 'td') return;
        __event.preventDefault();
        this.__entryLocation                     = _browser_.__getPointerLocation(__event);
    },
        // 2. Move control
    __inputPointerEventMove: function(__event) {
        __event.preventDefault();
        if (this.__entryLocation) {
            var __currentPoint                   = _browser_.__getPointerLocation(__event);
            var __displacement                   = {x: (__currentPoint.x - this.__entryLocation.x), y:(__currentPoint.y - this.__entryLocation.y)};
            var __multipleInputDiv               = this.__getMultipleInput();
            var __dataEntryWrapperLocation       = __multipleInputDiv.offset();
            this.__lastInputLocation             = {
                                                    x: (__dataEntryWrapperLocation.left + __displacement.x), 
                                                    y: (__dataEntryWrapperLocation.top  + __displacement.y),
                                                   };
            // Keep location within canvas bounds
            var __cadCanvas                          = _utils_.__getCanvasElement();
            var __canvasOffset                       = _utils_.__getCanvasOffset();
            // Horizontal alignment
            this.__lastInputLocation.x           = Math.max(this.__lastInputLocation.x, 0);
            this.__lastInputLocation.x           = Math.min(this.__lastInputLocation.x, ((__canvasOffset.left +  __cadCanvas[_parameter_.__width]) - __multipleInputDiv.width()));
            // Vertical alignment
            this.__lastInputLocation.y           = Math.max(this.__lastInputLocation.y, 0);
            this.__lastInputLocation.y           = Math.min(this.__lastInputLocation.y, ((__canvasOffset.top +  __cadCanvas[_parameter_.__height]) - __multipleInputDiv.height()));
            this.__locateMultipleInput();
        }
    },
        // 3. Stop control displacement
    __inputPointerEventUp: function(__event) {
        __event.preventDefault();
        this.__entryLocation                     = null;
    },
    __locateMultipleInput: function() {
        this.__getMultipleInput().css({
            zIndex: 200,
            left:   this.__lastInputLocation.x,
            top:    this.__lastInputLocation.y,
        });
    },
    __getMultipleInput: function() {
        return $('#multipleInputDiv');
    },


    /* ********************************************************** */
    // CONSTRUCTION
    __setMultipleInput: function(__inputMessage, __parameters, __thisObject, __callback, __updateCallback) {
        // Store parameter lists for submit procedure
        this.__parameterNames                    = __parameters.__parameterNames;
        this.__parameterTypes                    = __parameters.__parameterTypes;
        this.__parameterValues                   = __parameters.__parameterValues;
        this.__inputObject                       = __thisObject;
        this.__callback                          = __callback;
        this.__updateCallback                    = __updateCallback;
        // Build:
            // Part 1: header and table declaration
        var __multipleInputHtmlFragment          = '<div id="multipleInputDiv" style="cursor: pointer; position:absolute; border: solid darkblue; background-color: lightgray;">';
        __multipleInputHtmlFragment             += ' <span>' + __inputMessage + '</span>';
        __multipleInputHtmlFragment             += ' <table id="dataTable">';
            // Part 2: table rows
        for (var __parameterIndex = 0; __parameterIndex < this.__parameterNames.length; __parameterIndex += 1) {
            var __parameterName                  = this.__parameterNames[__parameterIndex];
            var __parameterType                  = this.__parameterTypes[__parameterIndex];
            var __parameterValue                 = null;
            if (this.__parameterValues) {
                try {
                    __parameterValue             = eval(this.__parameterValues[__parameterIndex]);
                } catch(ex) {
                    __parameterValue             = this.__parameterValues[__parameterIndex];
                }
            }
            // Check exception for linear objects:
            var __displayedValue                 = '';
            switch (__parameterName) {
                case _parameter_.__arrayObjectsMode:
                    __displayedValue                 = _parameter_.__arrayModeSingle;
                    break;
                case _parameter_.__endPoint:
                    var __currentPoint               = this.__inputObject[_parameter_.__points][0];
                    __displayedValue                 = _utils_.__roundValue(__currentPoint.x) + ', ' + _utils_.__roundValue(__currentPoint.y);
                    break;
                case _parameter_.__nextPoint:
                    if (this.__inputObject[_parameter_.__points].length === 1) {
                        var __currentPoint           = this.__inputObject[_parameter_.__points][0];
                        __displayedValue             = _utils_.__roundValue(__currentPoint.x) + ', ' + _utils_.__roundValue(__currentPoint.y);
                    } else {
                        __displayedValue             = '(' + this.__inputObject[_parameter_.__points].length + ' points)';
                    }
                    break;
                default:
                    if (__parameterValue !== null) {
                        __displayedValue             = __parameterValue;
                    } else if (this.__inputObject) {
                        var __objectValue            = '';
                        if (_utils_.__ownsProperty(this.__inputObject, __parameterName)) {
                            __objectValue            = this.__inputObject[__parameterName];
                        }
                        if (_utils_.__hasXproperty(__objectValue)) {
                            __displayedValue         = _utils_.__roundValue(__objectValue.x) + ', ' + _utils_.__roundValue(__objectValue.y);
                        } else if (__objectValue === _parameter_.__layerOptionDefault) {
                            __displayedValue         = _messages_.__getMessage(_parameter_.__layerOption);
                            var __layerName          = this.__inputObject[_parameter_.__layer];
                            var __thisLayer          = _model_[_parameter_.__layers][__layerName];
                            __displayedValue        += _parameter_.__colonSpace + __thisLayer[__parameterName];
                        } else if (__parameterType === _parameter_.__parameterTypeNumeric) {
                            __displayedValue         = _utils_.__roundValue(__objectValue);
                        } else {
                            __displayedValue         = __objectValue;
                        }
                    }
            }
            __multipleInputHtmlFragment         += this.__buildParameterRow(__parameterName, __parameterType, __displayedValue);
        }
            // Part 3: table last row: cancel and submit buttons
        __multipleInputHtmlFragment             += '  <tr>';
        __multipleInputHtmlFragment             += '   <td>';
        __multipleInputHtmlFragment             += '    <button onclick="_inputMultiple_.__cancelInput()">' + _messages_.__getMessage('cancel') + '</button>';
        __multipleInputHtmlFragment             += '   </td>';
        __multipleInputHtmlFragment             += '   <td>';
        __multipleInputHtmlFragment             += '    <button onclick="_inputMultiple_.__submitInput()">' + _messages_.__getMessage('ok') + '</button>';
        if (this.__updateCallback) {
            __multipleInputHtmlFragment         += '    <button onclick="_inputMultiple_.__updateObjectFromMultipleInputTable()">' + _messages_.__getMessage('update') + '</button>';
        }
        __multipleInputHtmlFragment             += '   </td>';
        __multipleInputHtmlFragment             += '  </tr>';
        __multipleInputHtmlFragment             += ' </table>';
        __multipleInputHtmlFragment             += '</div>';
            // Display and locate
        var __canvasOffset                       = _utils_.__getCanvasOffset();
        _utils_.__getCanvas().parent().append(__multipleInputHtmlFragment);
        var __multipleInputDiv                   = this.__getMultipleInput();
        var __cadCanvas                          = _utils_.__getCanvasElement();
        this.__lastInputLocation                 = {
                                                    x: __canvasOffset.left + ((__cadCanvas[_parameter_.__width] - __multipleInputDiv[0].offsetWidth) * 0.5),
                                                    y: __canvasOffset.top  + ((__cadCanvas[_parameter_.__height] - __multipleInputDiv[0].offsetHeight) * 0.5),
                                                   };
        this.__locateMultipleInput();
        _browser_.__setComponentEvents('multipleInputDiv', '_inputMultiple_.__inputPointerEventDown(__event);', '_inputMultiple_.__inputPointerEventMove(__event);', '_inputMultiple_.__inputPointerEventUp(__event);');
            // Disable context menu
        __multipleInputDiv.contextmenu(function(__event) {
            __event.preventDefault();
        });
        this.__parameterName                     = null;
        this.__parameterType                     = null;
        this.__parameterValue                    = null;
    },
        // Build two-cell parameter row
    __buildParameterRow: function(__parameterName, __parameterType, __displayedValue) {
        var __rowString                          = '<tr id="'      + __parameterName + 'Div">';
        // Header cell
        __rowString                             += ' <th';
        __rowString                             += '  id="'        + __parameterName + 'Prompt"';
        __rowString                             += '  data-name="' + __parameterName + '"';
        __rowString                             += '  data-type="' + __parameterType + '"';
        __rowString                             += '  style="cursor: pointer; text-align: right;">';
        __rowString                             += _messages_.__getMessage(__parameterName); 
        __rowString                             += ' </th>';
        // Data cell:
        __rowString                             += ' <td onclick="_inputMultiple_.__selectParameter(\'' + __parameterName + '\', \'' + __parameterType + '\' );">';
        if (__parameterType.length === 1) {
            // Simple parameter:
            if (__parameterType === _parameter_.__parameterTypeBoolean) {
                __rowString                     += this.__buildCheckInputControl(__parameterName, __displayedValue);
            } else if (__parameterType === _parameter_.__parameterTypePoint) {
                __rowString                     += this.__buildPointInputControl(__parameterName, __displayedValue);
            } else  {
                // Textbox
                if (('lineTypeScale,lineWidth'.indexOf(__parameterName) > -1) && ((__displayedValue === '') || (__displayedValue === 0.0))){
                    __rowString                 += '  <input id="' + __parameterName + '" type="text"  value="' + _messages_.__getMessage(_parameter_.__layerOption) + '">';
                } else if (this.__isMultilineContent(__parameterName)) {
                    __rowString                 += '  <textarea id="' + __parameterName + '" cols="40" rows="5">' + __displayedValue + '</textarea>';
                } else {
                    __rowString                 += '  <input id="' + __parameterName + '" type="text"  value="' + __displayedValue + '">';
                }
             }
       } else {
            // Select?
            var __parameterTypeList              = eval(__parameterType);
            var __parameterKeys                  = null;
            if (__parameterTypeList.length) {
                __parameterKeys                  = __parameterTypeList;
            } else {
                __parameterKeys                  = Object.keys(__parameterTypeList);
            }
            if (typeof __parameterKeys === 'string') {
                __rowString                     += '  <input id="' + __parameterName + '" type="text"  value="' + __parameterKeys + '">';
            } else if (__parameterKeys.length === 0) {
                __rowString                     += '  <input id="' + __parameterName + '" type="text"  value="' + __parameterTypeList + '">';
            } else if (__parameterKeys.length === 1) {
                // One value: textBox
                __rowString                     += '  <input id="' + __parameterName + '" type="text"  value="' + __displayedValue + '">';
            } else if (__parameterKeys.indexOf['x'] > -1 ) {
                var __rowData                    = _utils_.__roundValue(__parameterTypeList.x) + ', ' + _utils_.__roundValue(__parameterTypeList.y);
                __rowString                     += '  <input id="' + __parameterName + '" type="text"  value="' + __rowData + '">';
            } else {
                // More than one value: select
                __rowString                     += this.__buildSelectControl(__parameterName, __displayedValue, __parameterKeys);
            }
        }
        __rowString                             += ' </td>';
        __rowString                             += '</tr>';
        return __rowString;
    },
    __isMultilineContent: function(__parameterName) {
        if (this.__inputObject) {
            return ((this.__inputObject[_parameter_.__type] === _text_.__textMultiline) && (__parameterName === _parameter_.__content));
        }
        return false;
    },
    __buildCheckInputControl: function(__parameterName, __parameterValue) {
        var __inputString                          = '  <input id="' + __parameterName + '" type="checkbox"';
        if (__parameterValue === true) {
            __inputString                         += '  checked="true"';
        }
        __inputString                             += '/>';
        return __inputString;
    },
    __buildPointInputControl: function(__parameterName, __parameterValue) {
        var __inputString                          = '  <input id="' + __parameterName + '" type="text"';
        if (_utils_.__hasXproperty(__parameterValue)) {
            __inputString                         += ' value="' + _utils_.__roundValue(__parameterValue.x) + ', ' + _utils_.__roundValue(__parameterValue.y) + '"';
        } else {
            __inputString                         += ' value="' + __parameterValue + '"';
        }
        __inputString                             += '/>';
        return __inputString;
    },
    __buildSelectControl: function(__parameterName, __displayedValue, __keys) {
        var __selectString                       = '  <select id="' + __parameterName + '">';
        if (__displayedValue === '') {
            __selectString                      += '   <option>' + _messages_.__getMessage('inputSelectOption') + '</option>';
        } else {
            // Graphical object
            // Add _parameter_.__layer option when applicable
            if ('color,lineType,lineTypeScale,lineWidth'.indexOf(__parameterName) > -1) {
                if (__displayedValue.indexOf(_messages_.__getMessage(_parameter_.__layerOption)) > -1) {
                    // Already with layer option: display value
                    __selectString              += '   <option value="' + _parameter_.__layerOptionDefault + '"';
                    __selectString              += ' selected="selected"';
                    __selectString              += '>' + __displayedValue + '</option>';
                } else {
                    __selectString              += '>' + _messages_.__getMessage(_parameter_.__layerOption) + '</option>';
                }
            }
        }
        $.each(__keys , function(__key, __value) {
            __selectString                      += '   <option value="' + __value + '"';
            if (__value === __displayedValue) {
                __selectString                  += ' selected="selected"';
            }
            __selectString                      += '>' + _messages_.__getMessage(__value) + '</option>';
        });
        __selectString                          += '  </select>';
        return __selectString;
    },


    /* ********************************************************** */
    // UPDATES
    //   UPDATE DATA POINT FROM SCREEN POINTER
    __selectParameter: function(__parameterName, __parameterType) {
        this.__parameterName                     = __parameterName;
        this.__parameterType                     = __parameterType;
        if (this.__parameterType === _parameter_.__parameterTypePoint) {
            _view_.__setTouchEventsFunctionString(
                '',
                '',
                '_inputMultiple_._setParameterPoint(_view_.__modelLocation);',
                ''
            );
        } else {
            _view_.__resetTouchEventsFunctionString();
        }
    },
    _setParameterPoint: function(__currentPoint) {
        var __dataContainer                      = $('#' + this.__parameterName)[0];
        __dataContainer.value                    = _utils_.__roundValue(__currentPoint.x) + ', ' + _utils_.__roundValue(__currentPoint.y);
        _view_.__resetTouchEventsFunctionString();
        this.__parameterName                     = null;
        this.__parameterType                     = null;
    },
    //   UPDATE TABLE FROM OBJECT
    __updateMultipleInputTable: function() {
        var __rowHeaders                         = document.getElementsByTagName('th');
        $.each( __rowHeaders, function( __rowIndex, __rowHeader ){
            if (__rowHeader.attributes[_parameter_.__dataName]) {
                var __parameterName              = __rowHeader.attributes[_parameter_.__dataName].value;
                var __data                       = null;
                if (__parameterName === _parameter_.__endPoint) {
                    var __data                   = _inputMultiple_.__inputObject[_parameter_.__points][0];
                }  else {
                    var __data                   = _inputMultiple_.__inputObject[__parameterName];
                }
                if (__data) {
                    if (_utils_.__hasXproperty(__data)) {
                        __data = _utils_.__roundValue(__data.x) + ', ' + _utils_.__roundValue(__data.y);
                    }
                    var __dataContainer          = document.getElementById(__parameterName);
                    if (__dataContainer.type === 'checkbox') {
                        __dataContainer.checked  = __data;
                    } else if (__dataContainer.value) {
                        __dataContainer.value    = __data;
                    } else {
                        __dataContainer.innerText = __data;
                    }
                }
            }
        });
    },
    //   UPDATE OBJECT FROM DATA
    __updateObjectFromMultipleInputTable: function() {
        var __parameterValues                    = this.__buildOutputParametersList();
        if (__parameterValues !== null) {
            eval(this.__updateCallback);
            _paint_.__paintEntry();
        }
    },


    /* ********************************************************** */
    // PROCESS RESULT
    __submitInput: function() {
        var __parameterValues                    = this.__buildOutputParametersList();
        if (__parameterValues !== null) {
            eval(this.__callback);
            this.__cancelInput();
        }
    },
    __buildOutputParametersList: function() {
        var __parameterValues                    = {};
        var __rowHeaders                         = document.getElementsByTagName('th');
        $.each( __rowHeaders, function( __rowIndex, __rowHeader ){
            if (__rowHeader.attributes[_parameter_.__dataName]) {
                var __parameterName              = __rowHeader.attributes[_parameter_.__dataName].value;
                var __parameterType              = __rowHeader.attributes[_parameter_.__dataType].value;
                var __inputValue                 = _inputMultiple_.__getContainerData(__parameterName, __parameterType);
                if (__inputValue === null) {
                    return null;
                }
                __parameterValues[__parameterName] = __inputValue;
            }
        });
        return __parameterValues;
    },
    __getContainerData: function(__parameterName, __parameterType) {
        var __dataContainer                      = document.getElementById(__parameterName);
        var __inputValue                         = '';
        if (__dataContainer.type === 'checkbox') {
            return __dataContainer.checked;
        } else if (__dataContainer.value) {
            __inputValue                         = __dataContainer.value;
        } else {
            __inputValue                         = __dataContainer.innerText;
        }
        // Evaluate container data
        if (__inputValue !== '') {
            if (__inputValue.indexOf(_messages_.__getMessage(_parameter_.__layerOption)) > -1) {
                __inputValue                     = _parameter_.__layerOptionDefault;
            } else if (__parameterType === _parameter_.__parameterTypePoint) {
                __inputValue                     = _utils_.__checkPointFromInput(__inputValue);
            } else if (__parameterType === _parameter_.__parameterTypeNumeric) {
                if (isNaN(__inputValue)) {
                    _events_.__callError(this.__moduleName, _messages_.__getMessage(_parameter_.__invalidParamEntry) + __parameterName);
                    return null;
                } else {
                    switch (__parameterName) {
                        case _parameter_.__sideCount:
                        case _parameter_.__arrayColumns:
                        case _parameter_.__arrayRows:
                        case _parameter_.__arrayCount:
                            __inputValue         = parseInt(__inputValue);
                            break;
                        default:
                            __inputValue         = parseFloat(__inputValue);
                    }
                }
            }
        }
        return __inputValue;
    },


    // Reset multiple input
    __cancelInput: function() {
        this.__callback                          = null;
        this.__inputObject                       = null;
        this.__parameterNames                    = null;
        this.__parameterTypes                    = null;
        this.__parameterName                     = null;
        this.__parameterType                     = null;
        this.__getMultipleInput().remove();
        _paint_.__paintEntry();
    }

};
