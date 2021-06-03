var _list_ = {

    __moduleName:    'list',
    __entryLocation:   null,

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
            var __multipleInputDiv               = this.__getListInput();
            var __dataEntryWrapperLocation       = __multipleInputDiv.offset();
            this.__lastInputLocation             = {
                                                    x: (__dataEntryWrapperLocation.left + __displacement.x), 
                                                    y: (__dataEntryWrapperLocation.top  + __displacement.y),
                                                   };
            // Keep location within canvas bounds
            var __cadCanvas                      = _utils_.__getCanvasElement();
            var __canvasOffset                   = _utils_.__getCanvasOffset();
            // Horizontal alignment
            this.__lastInputLocation.x           = Math.max(this.__lastInputLocation.x, 0);
            this.__lastInputLocation.x           = Math.min(this.__lastInputLocation.x, ((__canvasOffset.left +  __cadCanvas[_parameter_.__width]) - __multipleInputDiv.width()));
            // Vertical alignment
            this.__lastInputLocation.y           = Math.max(this.__lastInputLocation.y, 0);
            this.__lastInputLocation.y           = Math.min(this.__lastInputLocation.y, ((__canvasOffset.top +  __cadCanvas[_parameter_.__height]) - __multipleInputDiv.height()));
            this.__locateListInput();
        }
    },
        // 3. Stop control displacement
    __inputPointerEventUp: function(__event) {
        __event.preventDefault();
        this.__entryLocation                     = null;
    },
    __locateListInput: function() {
        this.__getListInput().css({
            zIndex: 200,
            left:   this.__lastInputLocation.x,
            top:    this.__lastInputLocation.y,
        });
    },


    __getListInput: function() {
        return $('#listInputDiv');
    },
    

    __setListInput: function(__callback, __updateCallback) {
    // Build:
        if (_modelTools_.__isListStarted(_model_)) {
            // Part 1: header and table declaration
            var __listInputHtmlFragment              = '<div id="listInputDiv" style="cursor: pointer; position:absolute; border: solid darkblue; background-color: lightgray;">';
            __listInputHtmlFragment                 += ' <span>' + _messages_.__getMessage(_parameter_.__modelList) + '</span>';
            __listInputHtmlFragment                 += ' <table id="dataTable" style="display:block;height:200px;overflow: auto;">';
            __listInputHtmlFragment                 += ' <tbody>';
            $.each(_model_[_parameter_.__list] , function(__thisId, __thisObject) {
                __listInputHtmlFragment             += '  <tr>';
                __listInputHtmlFragment             += '   <td onclick="_list_.__select(\'' + __thisId + '\')">';
                __listInputHtmlFragment             += '    ' + __thisId + ':' + __thisObject[_parameter_.__type];
                __listInputHtmlFragment             += '   </td>';
                __listInputHtmlFragment             += '  </tr>';
            });
            __listInputHtmlFragment                 += ' </tbody>';
            __listInputHtmlFragment                 += ' </table>';
                // Part 3: table last row: cancel and submit buttons
                __listInputHtmlFragment             += '    <button onclick="_list_.__cancelInput()">' + _messages_.__getMessage('cancel') + '</button>';
                __listInputHtmlFragment             += '    <button onclick="_list_.__submitInput()">' + _messages_.__getMessage('ok') + '</button>';
                if (this.__updateCallback) {
                    __listInputHtmlFragment         += '    <button onclick="_list_.__updateObjectFromMultipleInputTable()">' + _messages_.__getMessage('update') + '</button>';
                }
            __listInputHtmlFragment                 += '</div>';
                // Display and locate
            var __canvasOffset                       = _utils_.__getCanvasOffset();
            _utils_.__getCanvas().parent().append(__listInputHtmlFragment);
            var __listInputDiv                       = this.__getListInput();
            var __cadCanvas                          = _utils_.__getCanvasElement();
            this.__lastInputLocation                 = {
                                                        x: __canvasOffset.left + ((__cadCanvas[_parameter_.__width]  - __listInputDiv[0].offsetWidth) * 0.5),
                                                        y: __canvasOffset.top  + ((__cadCanvas[_parameter_.__height] - __listInputDiv[0].offsetHeight) * 0.5),
                                                    };
            this.__locateListInput();
            _browser_.__setComponentEvents('listInputDiv', '_list_.__inputPointerEventDown(__event);', '_list_.__inputPointerEventMove(__event);', '_list_.__inputPointerEventUp(__event);');
                // Disable context menu
                __listInputDiv.contextmenu(function(__event) {
                __event.preventDefault();
            });
        } else {
            alert( _messages_.__getMessage('emptyModel'));
        }
    },
    
    __select: function(__thisId) {
        _selection_.__selectionSet = [__thisId];
        _paint_.__paintEntry();
    },

    __submitInput: function() {
        this.__cancelInput();
    },


    // Reset multiple input
    __cancelInput: function() {
        this.__callback                          = null;
        _selection_.__selectionSet = null;
        this.__getListInput().remove();
        _paint_.__paintEntry();
    }
};
