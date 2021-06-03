var _view_ = {
    
    __moduleName:                   '_view_',
    __currentView:                  null,
    __area:                         {
                                        x:      0.0, 
                                        y:      0.0,
                                        width:  3000.0,
                                        height: 2000.0,
                                        scale:  1.0,
                                    },
    __viewDisplayMargin:            5,
    __zoomInAndOutFactor:           1.4,

    __fuzzFactor:                   5,
    __fuzzValue:                    0,

    /* ****************************************************** */
    // POINTER (mouse/touch) location values
    __pointerLocation:              {x:0, y:0},
    __modelLocation:                {x:0, y:0},

    __panStartLocation:             null,
    __zoomStartLocation:            null,
    __touchStartLocation:           null,
    __lastTouchLocation:            null,

    // Specific Procedures called with view events
    __touchEventsFunctionStrings:   null,


    /* ****************************************************** */
    // Procedures
    /* ****************************************************** */

    __initializeLastTouchLocation: function() {
        _view_.__setTouchEventsFunctionString(
            '',
            '',
            '_view_.__setLastTouchLocation(_view_.__modelLocation);',
            '_view_.__cancelLastTouchLocation();',
        );
    },
    __setLastTouchLocation: function(__currentPoint) {
        this.__lastTouchLocation = __currentPoint;
        _view_.__resetTouchEventsFunctionString();
    },
    __cancelLastTouchLocation: function() {
        this.__lastTouchLocation = null;
        _view_.__resetTouchEventsFunctionString();
    },


    // Step 1: Set model units from pointer location: y-direction is reversed
    __setModelLocation: function(__cursorLocation) {
        var __cadCanvas                            = _utils_.__getCanvasElement();
        return {
            x: this.__area.x + (this.__area[_parameter_.__width]  *        (__cursorLocation.x / __cadCanvas[_parameter_.__width])),
            y: this.__area.y + (this.__area[_parameter_.__height] * (1.0 - (__cursorLocation.y / __cadCanvas[_parameter_.__height]))),
        }
    },
        // Step 2: Adjust location to nearest anchor or grid point
    __adjustLocationToAnchorsAndGrid: function(__cursorLocation) {
        var __modelLocation                      = this.__setModelLocation(__cursorLocation);
        if (_grid_.__isSnapToGrid) {
            return this.__setModelLocationToGrid(__modelLocation);
        } else if (_anchor_.__isSnapToAnchor) {
            if (this.__isPointWithinFuzzDistance(_anchor_.__anchorIntersectionPoint,  __modelLocation)) {
                return _anchor_.__anchorIntersectionPoint;
            } else if (this.__isPointWithinFuzzDistance(_anchor_.__anchorPerpendicularPoint, __modelLocation)) {
                return _anchor_.__anchorPerpendicularPoint;
            } else if (this.__isPointWithinFuzzDistance(_anchor_.__anchorObjectPoint,        __modelLocation)) {
                return _anchor_.__anchorObjectPoint;
            }
        }
            // None of the above
        return __modelLocation;
    },
    __isPointWithinFuzzDistance: function(__currentPoint, __modelLocation) {
        if (__currentPoint) {
            return (_utils_.__getDistance(__currentPoint, __modelLocation) < this.__fuzzValue);
        }
    },
    __setModelLocationToGrid: function(__currentPoint) {
        // Horizontal:
        var __deltaX                             = (__currentPoint.x - _grid_.__gridOrigin.x) % _grid_.__gridXspacing;
        __currentPoint.x                        -= __deltaX;
        if (__deltaX > (_grid_.__gridXspacing * 0.5)) {
            __currentPoint.x                    += _grid_.__gridXspacing;
        }
        // Vertical:
        var __deltaY                             = (__currentPoint.y - _grid_.__gridOrigin.y) % _grid_.__gridYspacing;
        __currentPoint.y                        -= __deltaY;
        if (__deltaY > (_grid_.__gridYspacing * 0.5)) {
            __currentPoint.y                    += _grid_.__gridYspacing;
        }
        return __currentPoint;
    },
        // Step 3: Adjust pointer location from model units: y-direction is reversed
    __setPointerLocation: function(__currentPoint) {
        var __cadCanvas                          = _utils_.__getCanvasElement();
        return {
            x: Math.round(((       (__currentPoint.x - this.__area.x) / this.__area[_parameter_.__width])   * __cadCanvas[_parameter_.__width]) + 0.5),
            y: Math.round(((1.0 - ((__currentPoint.y - this.__area.y) / this.__area[_parameter_.__height])) * __cadCanvas[_parameter_.__height]) + 0.5),
        }
    },


    /********************************************************************** */
    // RESET VIRE MODE
    // Called from this module: '__resize', '__zoomAll', '__initializeZoomBox', '__zoomBox', '__updateArea' and '__processTouchEnd'
    __resetViewMode: function() {
        this.__panStartLocation                  = null;
        this.__zoomStartLocation                 = null;
        this.__fuzzValue                         = (this.__fuzzFactor  / this.__area[_parameter_.__scale]);
        _tooltip_.__hideTooltip();
        _grid_.__setGridDotSize();
        _paint_.__paintEntry();
    },


    /********************************************************************** */
    // AREA AND SCALE PROCEDURES
    // Called from '__setViewScaleAndArea' and '__resize' in this module
    __setViewScale: function(__thisCanvas, __area) {
        var sideMargins                          = this.__viewDisplayMargin * 2;
        var __xScale                             = (__thisCanvas[_parameter_.__width]  - sideMargins) / __area[_parameter_.__width];
        var __yScale                             = (__thisCanvas[_parameter_.__height] - sideMargins) / __area[_parameter_.__height];
        return                                     Math.min(__xScale, __yScale);
    },
    // Called from '__paintEntry' in '_paint_' module and '__zoomAll' and '__zoomBox' in this module
    __setViewScaleAndArea: function(__thisCanvas, __area) {
        var __viewScale                          = this.__setViewScale(__thisCanvas, __area);
        this.__fuzzValue                         = (this.__fuzzFactor                             / __viewScale);
        var __canvasScaledWidth                  = (__thisCanvas[_parameter_.__width]             / __viewScale);
        var __canvasScaledHeight                 = (__thisCanvas[_parameter_.__height]            / __viewScale);
        var __marginsWidth                       = Math.max((__canvasScaledWidth  - __area[_parameter_.__width]),  0.0) * 0.5;
        var __marginsHeight                      = Math.max((__canvasScaledHeight - __area[_parameter_.__height]), 0.0) * 0.5;
        return                                   {
                                                        x:      (__area.x - __marginsWidth),
                                                        y:      (__area.y - __marginsHeight),
                                                        width:  __canvasScaledWidth,
                                                        height: __canvasScaledHeight,
                                                        scale:  __viewScale,
                                                 };
    },


    /********************************************************************** */
    // RESIZE AND REFRESH
        // Called from cad module
    __resize: function() {
        _statusBar_.__locateStatusBar();
        _toolbar_.__resetToolbarLocation();
        var __cadCanvas                          = _utils_.__getCanvasElement();
        this.__area.scale                        = this.__setViewScale(__cadCanvas, this.__area);
        this.__resetViewMode();
    },


    /* ********************************************************************* */
    // ZOOM PROCEDURES (public)
    __zoomAll: function() {
        if (_model_[_parameter_.__limits]) {
            var __cadCanvas                      = _utils_.__getCanvasElement();
            this.__area                          = this.__setViewScaleAndArea(__cadCanvas, _model_[_parameter_.__limits]);
            this.__resetViewMode();
        }
    },

        // Called from context menu
    __initializeZoomBox: function() {
        this.__zoomStartLocation                 = true;
        this.__setTouchEventsFunctionString(
            'this.__zoomStartLocation            = {x:this.__pointerLocation.x, y:this.__pointerLocation.y};',
            'this.__followZoomBox(this.__pointerLocation);',
            'this.__zoomBox();',
            'this.__resetViewMode()',
        );
    },
    __followZoomBox: function(__currentPoint) {
        if (this.__zoomStartLocation) {
            var __area                           = _utils_.__getArea(this.__zoomStartLocation, __currentPoint);
            _track_.__trackZoomBox(__area);
        }
    },
        // Private function: '__zoomBox' uses screen coordinates on input
    __zoomBox: function() {
        this.__resetTouchEventsFunctionString();
        var __startPoint                     = this.__setModelLocation(this.__zoomStartLocation);
        var __currentPoint                   = this.__setModelLocation(this.__pointerLocation);
        var __newArea                        = _utils_.__getArea(__startPoint, __currentPoint);
        var __cadCanvas                      = _utils_.__getCanvasElement();
        this.__area                          = this.__setViewScaleAndArea(__cadCanvas, __newArea);
        this.__resetViewMode();
    },

    /* ********************************************************************* */
    // Scripts:
    __zoom_In: function()  { this.__updateArea(-1); },
    __zoom_Out: function() { this.__updateArea( 1); },
    // Called from wheel event
    __wheelUpdate: function(__wheelDirectionSign) {
        if (_user_[_parameter_.__isPullWheelToZoomIn]) {
            __wheelDirectionSign                *= -1;
        }
        if (__wheelDirectionSign > 0) {
            this.__updateArea(this.__zoomInAndOutFactor,         true);
        } else {
            this.__updateArea((1.0 / this.__zoomInAndOutFactor), true);
        }
    },
        // Common procedure (private)
    __updateArea: function(__scaleFactor, __isUsingPointer) {
        if (__isUsingPointer) {
            // Expand / contract around pointer location
            var __xProportion                    = ((this.__modelLocation.x - this.__area.x) / this.__area[_parameter_.__width]);
            var __yProportion                    = ((this.__modelLocation.y - this.__area.y) / this.__area[_parameter_.__height]);
            this.__area[_parameter_.__width]    *= __scaleFactor;
            this.__area[_parameter_.__height]   *= __scaleFactor;
            this.__area.x                        = (this.__modelLocation.x - (this.__area[_parameter_.__width]  * __xProportion));
            this.__area.y                        = (this.__modelLocation.y - (this.__area[_parameter_.__height] * __yProportion));
        } else {
            // Expand / contract around view center
            this.__area.x                       += (this.__area[_parameter_.__width]  * (1.0 - __scaleFactor) * 0.5);
            this.__area.y                       += (this.__area[_parameter_.__height] * (1.0 - __scaleFactor) * 0.5);
            this.__area[_parameter_.__width]    *= __scaleFactor;
            this.__area[_parameter_.__height]   *= __scaleFactor;
        }
        this.__area[_parameter_.__scale]        /= __scaleFactor;
        this.__resetViewMode();
    },


    /********************************************************************** */
    // PAN PROCEDURE
    __followPan: function(__cursorLocation) {
        this.__area.x                           -= ((__cursorLocation.x - this.__panStartLocation.x) / this.__area[_parameter_.__scale]);
        this.__area.y                           += ((__cursorLocation.y - this.__panStartLocation.y) / this.__area[_parameter_.__scale]);
        this.__panStartLocation                  = __cursorLocation;
        _paint_.__paintEntry();
    },


    /********************************************************************** */
    // EXTERNAL PROCEDURES (managed by view events)
    __setTouchEventsFunctionString: function(__startString, __moveString, __endString, __cancelString) {
        this.__touchEventsFunctionStrings        = {
                                                    __startString:  __startString,
                                                    __moveString:   __moveString,
                                                    __endString:    __endString,
                                                    __cancelString: __cancelString,
                                                   };
    },
    __resetTouchEventsFunctionString: function() {
        delete this.__touchEventsFunctionStrings;
    },


    /********************************************************************** */
    // EVENTS
    __processTouchStart: function() {
        this.__touchStartLocation                = this.__modelLocation;
        if (this.__touchEventsFunctionStrings) {
            eval(this.__touchEventsFunctionStrings.__startString);
            _view_.__lastTouchLocation           = this.__modelLocation;
        } else if (_anchor_.__anchorObjectPoint) {
            _anchor_.__setEditObject();
        } else {
            this.__panStartLocation              = this.__pointerLocation;
        }
        _tooltip_.__displayTooltip(this.__pointerLocation, this.__modelLocation);
    },

    __processTouchMove: function(__pointerLocation) {
        if (this.__panStartLocation) {
            _crosshairs_.__locateCrosshair(__pointerLocation);
            this.__followPan(__pointerLocation);
        } else {
            this.__modelLocation                     = this.__adjustLocationToAnchorsAndGrid(__pointerLocation);
            this.__pointerLocation                   = this.__setPointerLocation(this.__modelLocation);
            _crosshairs_.__locateCrosshair(this.__pointerLocation);
            _anchor_.__getAnchorObjects(this.__modelLocation, this.__fuzzValue);
            if (this.__touchEventsFunctionStrings) {
                eval(this.__touchEventsFunctionStrings.__moveString);
            } else if (_modelTools_.__isListStarted(_model_)) {
                _track_.__trackEntry('', this.__modelLocation);
            }
        }
        _tooltip_.__displayTooltip(this.__pointerLocation, this.__modelLocation);
        _statusBar_.__updateStatusBars();
    },

    __processTouchEnd: function() {
        if (this.__panStartLocation) {
            this.__resetViewMode();
        } else if (this.__touchEventsFunctionStrings) {
            eval(this.__touchEventsFunctionStrings.__endString);
            _view_.__lastTouchLocation             = this.__modelLocation;
        }
        delete this.__touchStartLocation;
    },

};
