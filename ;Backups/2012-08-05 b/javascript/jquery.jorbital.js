/*
 * jOrbital - jQuery Plugin
 *
 * Version: 1.0.32 (18/07/2010)
 * Requires: jQuery v1.42+
 *
 */
(function ($) {
	"use strict";
	
	var config = {
		disableIE6 : true,
		disableIE7 : true
	},
	defaults = {
		selector : '.orbit',
		radius : 2.0,
		inDuration : 400,
		outDuration : 400,
		mousePropagation : true
	};
	
	function vecLength(vec) {
		return Math.sqrt((vec.x * vec.x) + (vec.y * vec.y));
	}
	
	function vecAngle(V1, V2) {
		var param,
		angle;
		param = (V1.x * V2.x + V1.y * V2.y) / (vecLength(V1) * vecLength(V2));
		if (param > 1 || param < -1) {
			param = 0;
		}
		angle = Math.acos(param);
		return angle;
	}
	
	function vecClock(V) {
		var SV = {
			x : 0,
			y : 1
		},
		angle = vecAngle(SV, V);
		
		if (V.x >= 0) {
			angle = Math.PI - angle;
		}
		if (V.x < 0) {
			angle = Math.PI + angle;
		}
		
		return angle;
	}
	
	function distance(x1, y1, x2, y2) {
		var dx = x1 - x2,
		dy = y1 - y2;
		return Math.sqrt(dx * dx + dy * dy);
	}
	
	function maxDimension(elements) {
		var max_dimension = 0;
		
		elements.each(function (i, planet) {
			var $planet = $(planet),
			width = $planet.outerWidth(),
			height = $planet.outerHeight();
			
			if (width > max_dimension) {
				max_dimension = width;
			}
			if (height > max_dimension) {
				max_dimension = height;
			}
		});
		
		return max_dimension;
	}
	
	function setup($o, effect) {
		var data,
		$planet,
		//parent_zIndex,
		//zIndex,
		offset;
		
		if ($.fx.off) {
			return false;
		}
		
		data = $.extend({}, defaults, effect);
		
		if (data.inDuration === 0) {
			data.inDuration = 1;
		}
		
		$o.css({
			position : ($o.parent().hasClass('orbit') ? "absolute" : "relative")
		});
		
		data.planets = $o.children(data.selector).children().size();
		
		$o.children(data.selector).show().children().show();
		
		data.r = maxDimension($o.children(data.selector).children()) * data.radius;
		
		if (data.r === 0) {
			data.r = maxDimension($o);
		}
		
		// parent_zIndex = parseInt($o.parent().parent().css('z-index'));
		// if (parent_zIndex) {
		// zIndex = parent_zIndex - 1;
		// } else {
		// zIndex = 0;
		// }
		//zIndex = 0;
		
		if (!$.browser.msie) {
			$o.children(data.selector).hide().css({
				"z-index" : 5,
				'position' : 'absolute',
				'left' : -data.r + $o.outerWidth() / 2,
				'top' : -data.r + $o.outerHeight() / 2,
				'width' : data.r * 2,
				'height' : data.r * 2
			});
		} else {
			$o.children(data.selector).hide().css({
				'position' : 'absolute',
				'left' : -data.r + $o.outerWidth() / 2,
				'top' : -data.r + $o.outerHeight() / 2,
				'width' : data.r * 2,
				'height' : data.r * 2
			});
		}
		
		data.circleRange = [0, Math.PI * 2];
		
		data.step = (data.circleRange[1] - data.circleRange[0]) / data.planets;
		
		$o.addClass("jOrbital");
		
		$o.children(data.selector).children().each(function (i, planet) {
			$planet = $(planet);
			$planet.stop().css({
				left : data.r + Math.cos( - Math.PI / 2 + data.step * i) * (data.r * 0.5) - $planet.outerWidth() / 2,
				top : data.r + Math.sin( - Math.PI / 2 + data.step * i) * (data.r * 0.5) - $planet.outerHeight() / 2,
				position : 'absolute'
			});
			
		});
		
		offset = $o.offset();
		
		$o.mouseenter(function () {
			var $this = $(this),
			pos,
			r,
			step,
			$parent,
			angle,
			pos1,
			pos2,
			data = $this.data("jOrbital");
			
			if (data.mousePropagation && $this.hasClass('animated')) {
				return false;
			}
			
			pos = $this.offset();
			r = $o.outerWidth();
			
			$this.find('jOrbital').hide();
			
			$this.parent().children().css({
				'z-index' : 1
			});
			
			if (data.r === 0) {
				$this.children(data.selector).show();
				data.r = maxDimension($this.children(data.selector).children()) * data.radius;
				$this.children(data.selector).hide();
			}
			
			if ($this.parent().parent().hasClass('jOrbital')) {
				$parent = $this.parent().parent();
				pos1 = $this.offset();
				pos2 = $this.parent().parent().offset();
				
				pos1.left += $this.outerWidth() / 2;
				pos2.left += $parent.outerWidth() / 2;
				pos1.top += $this.outerHeight() / 2;
				pos2.top += $parent.outerHeight() / 2;
				
				angle = vecClock({
						x : pos2.left - pos1.left,
						y : pos2.top - pos1.top
					}) + Math.PI / 2 + 0.25;
				
				data.circleRange = [angle, angle + Math.PI];
				data.step = (data.circleRange[1] - data.circleRange[0]) / data.planets;
			}
			
			$this.children(data.selector).css({
				opacity : 1
			}).fadeIn(data.inDuration, function () {
				/* animate planets */
				$(this).children().addClass('animated').each(function (i, planet) {
					var $planet = $(planet);
					$planet.animate({
						left : data.r + Math.cos( - Math.PI / 2 + data.step * i + data.circleRange[0]) * data.r - $planet.outerWidth() / 2,
						top : data.r + Math.sin( - Math.PI / 2 + data.step * i + data.circleRange[0]) * data.r - $planet.outerHeight() / 2
					}, {
						complete : function () {
							$(this).removeClass('animated');
						},
						duration : data.inDuration,
						queue : true
					});
				});
			});
			
			/* planets inital position */
			
			step = (Math.PI * 2) / $this.children(data.selector).children().size();
			$this.parent().children().css({
				"z-index" : 2
			});
			$this.css({
				"z-index" : 1
			});
			$this.children(data.selector).children().each(function (i, planet) {
				var $planet = $(planet);
				$planet.stop().css({
					left : data.r + Math.cos( - Math.PI / 2 + step * i) * (data.r * 0.5) - $planet.outerWidth() / 2,
					top : data.r + Math.sin( - Math.PI / 2 + step * i) * (data.r * 0.5) - $planet.outerHeight() / 2,
					position : 'absolute'
				});
			});
		});
		
		$o.mouseleave(function () {
			var r,
			step;
			
			$(this).children(data.selector).fadeOut(data.outDuration);
			
			r = $(this).outerWidth();
			step = (Math.PI * 2) / $(this).children(data.selector).children().size();
			
			$(this).children(data.selector).children().each(function (i, planet) {
				var $planet = $(planet);
				$planet.animate({
					left : data.r - $(this).outerWidth() / 2,
					top : data.r - $(this).outerHeight() / 2
				}, {
					complete : function () {
						$(this).find('jOrbital').hide();
					},
					duration : data.outDuration,
					queue : true
				});
				
			});
		});
		
		$o.data('jOrbital', data);
		
		//		$o.children( data.selector ).hide();
		
	}
	
	$.jOrbital = function (command, options) {
		switch (command) {
		case 'config':
			config = $.extend({}, config, options);
			break;
		case 'defaults':
			defaults = $.extend({}, defaults, options);
			break;
		}
	};
	
	$.fn.jOrbital = function (command, options) {
		var item,
		str;
		
		if (config.disableIE6 && $.browser.msie && parseInt($.browser.version) <= 6) {
			return this;
		}
		
		if (config.disableIE7 && $.browser.msie && parseInt($.browser.version) <= 7) {
			return this;
		}
		
		if (command === undefined) {
			command = {};
		}
		
		if (command instanceof Array) {
			for (item in command) {
				this.each(function (io, o) {
					setup($(o), command[item]);
				});
			}
			return this;
		} else if (typeof command === 'object') {
			return this.each(function (i, o) {
				setup($(o), command);
			});
		} else {
			if (typeof options !== 'object') {
				options = {};
			}
			options.type = command;
			
			return this.each(function (i, o) {
				setup($(o), options);
			});
		}
	};
	
}
	(jQuery));
