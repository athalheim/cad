var _inputSelect_ = {

    __selectObjectByType: function(__mode, __valuesList, __callback, __defaultValue) {
        var __dataSelectDiv =  '<div id="dataSelectWrapper" style="position:absolute; border: solid darkblue; background-color: lightgray;">' +
                               '  <span      id="dataObjectPrompt"         style="cursor: pointer; background-color: lightgray;" title="' + _messages_.__getMessage('inputDrag') + '">' + _messages_.__getMessage('inputCommand') + '</span>' +
                               '  <select    id="dataObjectSelect"         onchange="_inputSelect_.__submitSelectInput(document.getElementById(\'dataObjectSelect\').value)"></select>' +
                               '  <button    id="dataObjectSelectCancel"   onclick="_inputSelect_.__resetSelect()">Cancel</button>' +
                               '</div>';
        _utils_.__getCanvas().parent().append(__dataSelectDiv);
        $('#dataObjectPrompt').html(_messages_.__getMessage(__mode));
        this.__buildSelectOptionsList(__valuesList, __defaultValue);
        this.__callback                            = __callback;
        this.__centerSelectEntry();
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
        $('#dataObjectSelect').html(__dataSelectOptions);
        document.getElementById('dataObjectSelect').focus();
    },
    __centerSelectEntry: function() {
        var __canvasOffset                       = _utils_.__getCanvasOffset();
        var __cadCanvas                          = _utils_.__getCanvasElement();
        var __leftBorder                         = __canvasOffset.left + ((__cadCanvas[_parameter_.__width]  - $('.dataSelectWrapper').width())  * 0.5);
        var __topBorder                          = __canvasOffset.top  + ((__cadCanvas[_parameter_.__height] - $('.dataSelectWrapper').height()) * 0.5);
        $('#dataSelectWrapper').css({
            left: __leftBorder,
            top:  __topBorder,
        });
    },
    // After Selection
    __submitSelectInput: function(__inputValue) {
        eval(this.__callback);
        this.__resetSelect();
    },
    // Calcel Selection
    __resetSelect: function() {
        $('#dataSelectWrapper').remove();
    },

};
