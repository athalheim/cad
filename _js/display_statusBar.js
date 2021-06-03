var _statusBar_ = {

    __moduleName:             '_statusBar_',
    __isStatusBarDisplayed:   true,

    /* ********************************************************************* */
    // STATUS BAR
    __statusWidth:            [0.20, 0.45, 0.25, 0.10],
    __status1PropertiesNames: [_parameter_.__layer,            _parameter_.__color,           'lType',                           'ltScale',                              'lWidth',                           'oScale'],
    __status1PropertiesList:  ['_model_[_parameter_.__layer]', '_user_[_parameter_.__color]', '_model_[_parameter_.__lineType]', '_model_[_parameter_.__lineTypeScale]', '_model_[_parameter_.__lineWidth]', '_model_[_parameter_.__objectLineTypeScale]'],

    __toggleStatusBar: function() {
        this.__isStatusBarDisplayed     = !this.__isStatusBarDisplayed;
        this.__locateStatusBar();
    },
    __locateStatusBar: function() {
        if (this.__isStatusBarDisplayed) {
            var __cadCanvas                        = _utils_.__getCanvasElement();
            var __statusX                          = 0;
            var __statusWidth                      = 0;
            var __statusIndex                      = 0; 
            for (var __statusIndex = 0; __statusIndex < this.__statusWidth.length; __statusIndex += 1) {
                __statusWidth                      = (__cadCanvas[_parameter_.__width] * this.__statusWidth[__statusIndex]);
                $('#status' + __statusIndex).css(_parameter_.__left,    __statusX);
                $('#status' + __statusIndex).css(_parameter_.__width,   __statusWidth);
                __statusX                         += __statusWidth;
            }
            var __canvasOffset                       = _utils_.__getCanvasOffset();
            var __status0Height                    = $('#status0').height();
            $('.status').css(_parameter_.__top,     (__canvasOffset.top + __cadCanvas[_parameter_.__height] - __status0Height));
            $('.status').css('display', 'inline');
        } else {
            $('.status').css('display', _parameter_.__none);
        }
    }, 
    __updateStatusBars: function() {
        this.__updateStatusBarFirst();
        this.__updateStatusBarSecond();
        this.__updateStatusBarThird();
        this.__updateStatusBarFourth();
    },
    // Status 0: Pointer location
    __updateStatusBarFirst: function() {
        var x                                    = _unit_.__getLengthExpression(_view_.__modelLocation.x);
        var y                                    = _unit_.__getLengthExpression(_view_.__modelLocation.y);
        var __status0Text                          = ('x: ' + x + ', y: ' + y);
        $('#status0').html('Location: ' + __status0Text);
    },

    // Drawing structure properties
    __updateStatusBarSecond: function() {
        var __status1Text = '';
        $.each(_statusBar_.__status1PropertiesNames , function( __index,  __propertyName) {
            var __propertyExpression               = _statusBar_.__status1PropertiesList[__index];
            var __propertyValue                    = eval(__propertyExpression);
            if (__status1Text !== '') {
                __status1Text                     += ', ';
            }
            if (__propertyValue === ''){
                __propertyValue                    = _parameter_.__layerOptionDefault;
            }
            __status1Text                         += __propertyName + ':' + __propertyValue;
        });
        $('#status1').html(__status1Text);
    },

    // Anchor, Snap
    __updateStatusBarThird: function() {
        var __status2Text                          = 'Anchor:';
        __status2Text                             += _anchor_.__isSnapToAnchor?'On':'Off';
        __status2Text                             += ', Grid:';
        __status2Text                             += _grid_.__isSnapToGrid?'On':'Off';
        $('#status2').html(__status2Text);
    },

    // Selection:
    __updateStatusBarFourth: function() {
        var __status3Text                          = 'Selection: 0';
        if (_selection_.__selectionSet) {
            __status3Text                          = 'Selection: ' + _selection_.__selectionSet.length;
        } else if (_anchor_.__anchorIds) {
            __status3Text                          = 'Anchors: ' + _anchor_.__anchorIds.length;
        }
        $('#status3').html(__status3Text);
    },

};

$(document).ready(function() {
    if ($('.status').length === 0) {
        var __statusDiv                            = '';
        __statusDiv                               += '<span class="status" id="status0">Location</span>';
        __statusDiv                               += '<span class="status" id="status1" style="cursor: help;">Mode</span>';
        __statusDiv                               += '<span class="status" id="status2">Span 3</span>';
        __statusDiv                               += '<span class="status" id="status3">Span 4</span>';
        _utils_.__getCanvas().parent().append(__statusDiv);
        _statusBar_.__locateStatusBar();

        $('#status0').attr(_parameter_.__title, _messages_.__getMessage('status0Title'));
        $('#status1').attr(_parameter_.__title, _messages_.__getMessage('status1Title'));

        $('#status0').contextmenu(function(__event) {
            __event.preventDefault();
            _unit_.__setUnitSetup();
        });
        $('#status1').contextmenu(function(__event) {
            __event.preventDefault();
            var __status1                          = $('#status1').offset();
            _menu_.__location                    = {x:__status1.left, y:__status1.top};
            _menu_.__showMenu('__settingsMenu', false);
        });
        $('#status2').contextmenu(function(__event) {
            __event.preventDefault();
        });
        $('#status3').contextmenu(function(__event) {
            __event.preventDefault();
        });
    }
});
