var _toolbar_ = {

    __moduleName:        '_toolbar_',
    __lastInputLocation: {x:0, y:0},
    __entryLocation:     null,
    __toolbarItemList:   [
                            'setLastTouchLocation',
                            'spacer',
                            'selectArcType',
                            'selectCircleType',
                            'selectEllipseType',
                            'selectPolylineType',
                            'selectRectangleType',
                            'selectTextType',
                            'spacer',
                            'selectDimensionType',
                            'spacer',
                            'zoomAll',
                            'zoomBox',
                            'spacer',
                            'snapSettingsDialog',
                            'selectCoordinateType'
                         ],


    __resetToolbarLocation: function() {
        var __cadCanvas                          = _utils_.__getCanvasElement();
        var __canvasOffset                       = _utils_.__getCanvasOffset();
        this.__lastInputLocation                  = {
                                                    x: ((__canvasOffset.left + __cadCanvas[_parameter_.__width]) - ($('#toolbar').width() + 6)) ,
                                                    y: __canvasOffset.top,
                                                   };
        this.__locateToolbar();
    },
    __locateToolbar: function() {
        $('#toolbar').css({
            left: this.__lastInputLocation.x,
            top:  this.__lastInputLocation.y,
        });
    },
    
    // Called from '_messages_' module to update prompt with language in use
    __setToolbarTitle: function() {
        $('caption').html(_messages_.__getMessage('userToolbar'));
    },
    
    // TOOLBAR MOVE CONTROL
        // 1. Initiate control displacement
    __toolbarEventDown: function(__event) {
        __event.preventDefault();
        this.__entryLocation                       = _browser_.__getPointerLocation(__event);
    },
        // 2. Move control
    __toolbarEventMove: function(__event) {
        __event.preventDefault();
        if (this.__entryLocation) {
            var __pointerLocation                = _browser_.__getPointerLocation(__event);
            var __displacement                   = {x: (__pointerLocation.x - this.__entryLocation.x), y:(__pointerLocation.y - this.__entryLocation.y)};
            var __toolbarImgLocation             = $('#toolbar').offset();
            this.__lastInputLocation             = {
                                                    x: (__toolbarImgLocation.left + __displacement.x), 
                                                    y: (__toolbarImgLocation.top  + __displacement.y),
                                                   };
            this.__locateToolbar();
        }
    },
        // 3. Stop control displacement
    __toolbarEventUp: function(__event) {
        __event.preventDefault();
        this.__entryLocation                     = null;
    },

};


$(document).ready(function() {
    if ($('#toolbar').length === 0) {
        var __toolbarDiv                         = '<table id="toolbar" class="toolbar">' +
                                                   ' <caption style="background-color:darkGrey; font-weight:bold;">' + _messages_.__getMessage('userToolbar') + '</caption>' +
                                                   ' <tr id="toolbarRow"></tr>' +
                                                   '</table>';
        _utils_.__getCanvas().parent().append(__toolbarDiv);
        $.each( _toolbar_.__toolbarItemList , function( __itemIndex, __toolbarItemId ) {
            var __toolbarCell                      = $('<td ></td >');
            if (__toolbarItemId === 'spacer') {
                __toolbarCell.addClass('toolbarHalfCell');
            } else {
                var __toolbarImg                   = $('<img id="index_' + __itemIndex + '"/>');
                __toolbarImg[0].setAttribute('src', '_icons/' + __toolbarItemId + '.png');
                __toolbarCell[0].setAttribute(_parameter_.__title, _messages_.__getMessage(__toolbarItemId));
                var __toolbarItem                      = _menu_.__getMenuItem(__toolbarItemId);
                if (__toolbarItem) {
                    __toolbarCell[0].setAttribute('data-action', __toolbarItem[_parameter_.__action]);
                }
                __toolbarCell.addClass('toolbarCell');
                __toolbarCell.append(__toolbarImg);
            }
            $('#toolbarRow').append(__toolbarCell);
        });
        _toolbar_.__locateToolbar();
        $(".toolbarCell").click(function() {
            eval(this.getAttribute('data-action'));
          });
        _browser_.__setComponentEvents('toolbar', '_toolbar_.__toolbarEventDown(__event);', '_toolbar_.__toolbarEventMove(__event);', '_toolbar_.__toolbarEventUp(__event);');
    }
        // No context menu at this time: right-click brings back control to upper-left corner.
    $('#toolbar').contextmenu(function(__event) {
        __event.preventDefault();
        _toolbar_.__resetToolbarLocation();
    });
});
