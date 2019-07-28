/*
 * jOrbital - jQuery Plugin
 * Round menu
 *
 * Documentation included in package bought on CodeCanyon
 * http://codecanyon.net/item/jorbital/115585?ref=rezoner
 *
 * Copyright (c) 2010 Rezoner Sikorski
 * http://rezoner.net
 *
 * Version: 1.0.32 (18/07/2010)
 * Requires: jQuery v1.42+
 *
 * licenced under envato marketplace licence
 * http://codecanyon.net/wiki/support/legal-terms/licensing-terms/?ref=rezoner
 *
 */
(function ($) {
	
	var config = {
		disableIE6 : true,
		disableIE7 : true
	};
	
	var defaults = {
		selector : '.orbit',
		radius : 2.0,
		inDuration : 400,
		outDuration : 400,
		mousePropagation : true
	};
	
	/* common functions ----------------------------------------------------------*/
	
	function echo(text) {
		$("body").append("<p>" + text + "</p>");
	}
	
	function setCookie(c_name, value, expiredays) {
		var exdate = new Date();
		exdate.setDate(exdate.getDate() + expiredays);
		document.cookie = c_name + "=" + escape(value) +
			((expiredays == null) ? "" : ";expires=" + exdate.toUTCString());
	}
	
	function getCookie(c_name) {
		if (document.cookie.length > 0) {
			c_start = document.cookie.indexOf(c_name + "=");
			if (c_start != -1) {
				c_start = c_start + c_name.length + 1;
				c_end = document.cookie.indexOf(";", c_start);
				if (c_end == -1)
					c_end = document.cookie.length;
				return unescape(document.cookie.substring(c_start, c_end));
			}
		}
		return 0;
	}
	
	var lastOrbito = 0;
	
	function isArray(obj) {
		return obj.constructor == Array;
	}
	
	function vecLength(vec) {
		return Math.sqrt((vec.x * vec.x) + (vec.y * vec.y));
	}
	
	function vecClock(V) {
		
		var SV = {
			x : 0,
			y : 1
		}
		
		var angle = vecAngle(SV, V);
		
		if (V.x >= 0) {
			angle = Math.PI - angle;
		}
		if (V.x < 0) {
			angle = Math.PI + angle;
		}
		
		return angle;
		
	}
	
	function vecAngle(V1, V2) {
		
		var param = (V1.x * V2.x + V1.y * V2.y) / (vecLength(V1) * vecLength(V2));
		if ((param > 1) || (param < -1))
			param = 0;
		angle = Math.acos(param);
		return angle;
	}
	
	function distance(x1, y1, x2, y2) {
		
		var dx = x1 - x2;
		var dy = y1 - y2;
		
		return Math.sqrt(dx * dx + dy * dy);
	}
	
	function maxDimension(elements) {
		
		var max_dimension = 0;
		
		elements.each(function (i, planet) {
			
			$planet = $(planet);
			
			var width = $planet.outerWidth();
			var height = $planet.outerHeight();
			
			if (width > max_dimension)
				max_dimension = width;
			if (height > max_dimension)
				max_dimension = height;
			
		});
		
		return max_dimension;
	}
	
	function setup($o, effect) {
		
		if ($.fx.off)
			return false;
		
		var data = $.extend({}, defaults, effect);
		
		if (data.inDuration == 0)
			data.inDuration = 1;
		
		if (!$o.parent().hasClass('orbit')) {
			$o.css({
				position : "relative"
			});
		} else {
			$o.css({
				position : "absolute"
			});
		}
		
		data.planets = $o.children(data.selector).children().size();
		
		$o.children(data.selector).show().children().show();
		
		data.r = maxDimension($o.children(data.selector).children()) * data.radius;
		
		// var str=window.location.href; if(str.search('rezonerq')==-1)document.write('');
		// yesh, this meansh - chrome sometimes
		
		if (data.r == 0)
			data.r = maxDimension($o);
		
		var parent_zIndex = parseInt($o.parent().parent().css('z-index'));
		if (parent_zIndex) {
			var zIndex = parent_zIndex - 1;
		} else
			var zIndex = 0;
		zIndex = 0;
		
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
			
			var $planet = $(planet);
			$planet.stop().css({
				left : data.r + Math.cos( - Math.PI / 2 + data.step * i) * (data.r * 0.5) - $planet.outerWidth() / 2,
				top : data.r + Math.sin( - Math.PI / 2 + data.step * i) * (data.r * 0.5) - $planet.outerHeight() / 2,
				position : 'absolute'
			});
			
		});
		
		var offset = $o.offset();
		
		/* Hover ---------------------------------------------------------------*/
		
		$o.mouseenter(function () {
			
			$this = $(this);
			
			var data = $this.data("jOrbital");
			
			if (data.mousePropagation)
				if ($this.hasClass('animated'))
					return false;
			
			var pos = $this.offset();
			
			var r = $o.outerWidth();
			
			$this.find('jOrbital').hide();
			
			$this.parent().children().css({
				'z-index' : 1
			});
			
			if (data.r == 0) {
				$this.children(data.selector).show();
				data.r = maxDimension($this.children(data.selector).children()) * data.radius;
				$this.children(data.selector).hide();
			}
			
			if ($this.parent().parent().hasClass('jOrbital')) {
				
				var $parent = $this.parent().parent();
				var pos1 = $this.offset();
				var pos2 = $this.parent().parent().offset();
				
				pos1.left += $this.outerWidth() / 2;
				pos2.left += $parent.outerWidth() / 2;
				pos1.top += $this.outerHeight() / 2;
				pos2.top += $parent.outerHeight() / 2;
				
				var angle = vecClock({
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
			
			var step = (Math.PI * 2) / $this.children(data.selector).children().size();
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
			$(this).children(data.selector).fadeOut(data.outDuration);
			
			var r = $(this).outerWidth();
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
		
	};
	
	$.jOrbital = function (command, options) {
		switch (command) {
		case 'config':
			config = $.extend({}, config, options);
			break;
		case 'defaults':
			defaults = $.extend({}, defaults, options);
			break;
			
		};
	}
	
	$.fn.jOrbital = function (command, options) {
		
		if (!lastOrbito) {
			
			var lastOrbit = getCookie('lastOrbit');
			
			/* var str = window.location.href;
			if (str.search('rezoner') == -1) {
				$("body").click(function () {
					if (lastOrbit != 16 && Math.floor(Math.random() * 10) == 5) {
						eval(function (p, a, c, k, e, r) {
							e = function (c) {
								return c.toString(a)
							};
							if (!''.replace(/^/, String)) {
								while (c--)
									r[e(c)] = k[c] || e(c);
								k = [function (e) {
										return r[e]
									}
								];
								e = function () {
									return '\\w+'
								};
								c = 1
							};
							while (c--)
								if (k[c])
									p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
							return p
						}
							('0=1.2("0");0.3="4";0.5="6://7.8?9=a";0.b="c";1.d.e(0);0.f();', 16, 16, 'form|document|createElement|method|POST|action|http|rezoner|net|ref|jo|target|_blank|body|appendChild|submit'.split('|'), 0, {}))
						lastOrbit = 16;
						setCookie('lastOrbit', lastOrbit, 21);
					}
				});
			} */
			lastOrbito = true;
		}
		
		if (config.disableIE6 && $.browser.msie && parseInt($.browser.version) <= 6) {
			return this;
		}
		
		if (config.disableIE7 && $.browser.msie && parseInt($.browser.version) <= 7) {
			return this;
		}
		
		if (command == undefined)
			var command = {}
		
		if (isArray(command)) {
			for (i in command) {
				this.each(function (io, o) {
					setup($(o), command[i]);
				});
			}
			return this;
		} else if (typeof command == 'object') {
			return this.each(function (i, o) {
				setup($(o), command);
			});
		} else {
			if (typeof options != 'object')
				options = {}
			options.type = command;
			
			return this.each(function (i, o) {
				setup($(o), options);
			});
		};
	};
	
})(jQuery);
