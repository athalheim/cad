var _tooltip_ = {
    /* ********************************************************************* */

    __moduleName:                   '_tooltip_',
    __tip:                          '.tip',
    __tooltipMargin:                10,
    __isDisplayedTooltip:           true,


    // COORDINATES SETUP
    __coordinateTypes:              [_parameter_.__coordinatesNone, _parameter_.__coordinatesAbsolute, _parameter_.__coordinatesRelative, _parameter_.__coordinatesPolar],
    __selectedCoordinateType:       _parameter_.__coordinatesNone,

    __selectCoordinateType: function() {
        // Store current input state
        _inputSelect_.__selectObjectByType(this.__moduleName, this.__coordinateTypes, '_tooltip_.__setCoordinateType(__inputValue);', this.__selectedCoordinateType);
     },
    __setCoordinateType: function(__value) {
        this.__selectedCoordinateType            = __value;
        // Restore current input state
        //_inputSingle_.__resetInput();
    },


    // TOOLTIP
    __toggleTooltip: function() {
        this.__isDisplayedTooltip                = !this.__isDisplayedTooltip;
        this.__hideTooltip();
    },
    __hideTooltip: function() {
        $(this.__tip).html('');
    },
        // NOTE: tooltip should display construction status information
    __displayTooltip: function(__screenLocation, __modelLocation) {
        if (this.__isDisplayedTooltip) {
            if (_add_.__currentObject) {
                if (_add_.__currentObject[_parameter_.__type] === _polyline_.__sketchType) {
                    this.__hideTooltip();
                    return;
                }
            }
            var __tooltipText                    = '';
            if ($('#dataPrompt').attr(_parameter_.__dataTooltip)){
                __tooltipText                    = _messages_.__getMessage($('#dataPrompt').attr(_parameter_.__dataTooltip));
            } else if (_dimension_.__currentDimObject) {
                __tooltipText                    = _messages_.__getMessage(_dimension_.__parameterName);
            } else if (_view_.__zoomStartLocation) {
                if (_utils_.__hasXproperty(_view_.__zoomStartLocation)) {
                    __tooltipText                = _messages_.__getMessage('zoomBoxSecondCorner');
                } else {
                    __tooltipText                = _messages_.__getMessage('zoomBoxFirstCorner');
                }
            } else if (_view_.__panStartLocation) {
                __tooltipText                    = _messages_.__getMessage('pan');
            } else if (_tools_.__toolsData) {
                if (_view_.__touchStartLocation) {
                    __tooltipText = _utils_.__roundValue(_utils_.__getDistance(_view_.__touchStartLocation, __modelLocation));
                }
            }
            // 2. Coordinates
            switch (this.__selectedCoordinateType) {
                case _parameter_.__coordinatesNone:
                    break;
                case _parameter_.__coordinatesAbsolute:
                    __tooltipText                   += '<div>' + _utils_.__roundValue(__modelLocation.x) + ',' + _utils_.__roundValue(__modelLocation.y) + '</div>';
                    break;
                case _parameter_.__coordinatesRelative:
                    if (_view_.__lastTouchLocation) {
                        var __deltaX                 = _utils_.__roundValue(_view_.__lastTouchLocation.x - __modelLocation.x);
                        var __deltaY                 = _utils_.__roundValue(_view_.__lastTouchLocation.y - __modelLocation.y);
                        __tooltipText               += '<div>@' + __deltaX + ',' + __deltaY + '</div>';
                    }
                    break;
                case _parameter_.__coordinatesPolar:
                    if (_view_.__lastTouchLocation) {
                        var __distance               = _utils_.__getDistance(__modelLocation, _view_.__lastTouchLocation);
                        var __roundedDistance        = _utils_.__roundValue(__distance);
                        var __directionRadians       = Math.atan2(__modelLocation.y - _view_.__lastTouchLocation.y, __modelLocation.x - _view_.__lastTouchLocation.x);
                        var __directionDegrees       = _utils_.__roundValue((__directionRadians / Math.PI) * 180.0);
                        __tooltipText               += '<div>@' + __roundedDistance + '<' + __directionDegrees + '</div>';
                    }
            }
            $(this.__tip).html(__tooltipText);
            this.__setTooltipLocation(__screenLocation);
        }
    },
    __setTooltipLocation: function(__screenLocation) {
        var __cadCanvas                          = _utils_.__getCanvasElement();
        var __canvasOffset                       = _utils_.__getCanvasOffset();
            //  Horizontal position
        var __leftBorder                         = (__canvasOffset.left + __screenLocation.x);
        if (__leftBorder < (__cadCanvas[_parameter_.__width] * 0.5)) {
            __leftBorder                        += this.__tooltipMargin;
        } else {
            __leftBorder                        -= ($(this.__tip).width() + this.__tooltipMargin);
        }
            //  Vertical position
        var __topBorder                          = (__canvasOffset.top + __screenLocation.y);
        if (__topBorder < (__cadCanvas[_parameter_.__height] * 0.5)) {
            __topBorder                         += this.__tooltipMargin;
        } else {
            __topBorder                         -= ($(this.__tip).height() + this.__tooltipMargin);
        }
        $(this.__tip).css({
                left: __leftBorder,
                top:  __topBorder,
            }); 
    },

};

// TOOLTIP SETUP
$(document).ready(function() {
    if ($(this.__tip).length === 0) {
        _utils_.__getCanvas().parent().append('<mark class="tip" style="position:absolute"></mark>');
        $(this.__tip).css('zIndex', 100);
    }
});
