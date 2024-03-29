/*******************************************************************************
 * * jQuery Masonry version 1.2.0 * copyright David DeSandro, licensed GPL & MIT *
 * http://desandro.com/resources/jquery-masonry
 ******************************************************************************/
;
(function($) {
	var n = $.event, resizeTimeout;
	n.special["smartresize"] = {
		setup : function() {
			$(this).bind("resize", n.special.smartresize.handler)
		},
		teardown : function() {
			$(this).unbind("resize", n.special.smartresize.handler)
		},
		handler : function(a, b) {
			var c = this, args = arguments;
			a.type = "smartresize";
			if (resizeTimeout)
				clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(function() {
				jQuery.event.handle.apply(c, args)
			}, b === "execAsap" ? 0 : 100)
		}
	};
	$.fn.smartresize = function(a) {
		return a ? this.bind("smartresize", a) : this.trigger("smartresize",
				[ "execAsap" ])
	};
	$.fn.masonry = function(l, m) {
		function getBricks(a, b) {
			a.$bricks = b.itemSelector == undefined ? b.$brickParent.children()
					: b.$brickParent.find(b.itemSelector)
		}
		function placeBrick(a, b, c, d, e, f) {
			var g = 0;
			for (i = 0; i < b; i++) {
				if (c[i] < c[g])
					g = i
			}
			var h = {
				left : e.colW * g + e.posLeft,
				top : c[g]
			};
			if (e.masoned && f.animate) {
				a.animate(h, {
					duration : f.animationOptions.duration,
					easing : f.animationOptions.easing,
					complete : f.animationOptions.complete,
					step : f.animationOptions.step,
					queue : f.animationOptions.queue,
					specialEasing : f.animationOptions.specialEasing
				})
			} else {
				a.css(h)
			}
			for (i = 0; i < d; i++) {
				e.colY[g + i] = c[g] + a.outerHeight(true)
			}
		}
		;
		function masonrySetup(a, b, c) {
			getBricks(c, b);
			if (b.columnWidth == undefined) {
				c.colW = c.masoned ? a.data('masonry').colW : c.$bricks
						.outerWidth(true)
			} else {
				c.colW = b.columnWidth
			}
			c.colCount = Math.floor(a.width() / c.colW);
			c.colCount = Math.max(c.colCount, 1)
		}
		;
		function masonryArrange(e, f, g) {
			if (!g.masoned)
				e.css('position', 'relative');
			if (!g.masoned || f.appendedContent != undefined) {
				g.$bricks.css('position', 'absolute')
			}
			var h = $('<div />');
			e.prepend(h);
			g.posTop = Math.round(h.position().top);
			g.posLeft = Math.round(h.position().left);
			h.remove();
			if (g.masoned && f.appendedContent != undefined) {
				g.colY = e.data('masonry').colY;
				for (i = e.data('masonry').colCount; i < g.colCount; i++) {
					g.colY[i] = g.posTop
				}
			} else {
				g.colY = [];
				for (i = 0; i < g.colCount; i++) {
					g.colY[i] = g.posTop
				}
			}
			if (f.singleMode) {
				g.$bricks.each(function() {
					var a = $(this);
					placeBrick(a, g.colCount, g.colY, 1, g, f)
				})
			} else {
				g.$bricks.each(function() {
					var a = $(this);
					var b = Math.ceil(a.outerWidth(true) / g.colW);
					b = Math.min(b, g.colCount);
					if (b == 1) {
						placeBrick(a, g.colCount, g.colY, 1, g, f)
					} else {
						var c = g.colCount + 1 - b;
						var d = [ 0 ];
						for (i = 0; i < c; i++) {
							d[i] = 0;
							for (j = 0; j < b; j++) {
								d[i] = Math.max(d[i], g.colY[i + j])
							}
						}
						placeBrick(a, c, d, b, g, f)
					}
				})
			}
			g.wallH = 0;
			for (i = 0; i < g.colCount; i++) {
				g.wallH = Math.max(g.wallH, g.colY[i])
			}
			var k = {
				height : g.wallH - g.posTop
			};
			if (g.masoned && f.animate) {
				e.animate(k, {
					duration : f.animationOptions.duration,
					easing : f.animationOptions.easing,
					complete : f.animationOptions.complete,
					step : f.animationOptions.step,
					queue : f.animationOptions.queue,
					specialEasing : f.animationOptions.specialEasing
				})
			} else {
				e.css(k)
			}
			if (!g.masoned)
				e.addClass('masoned');
			m.call(g.$bricks);
			e.data('masonry', g)
		}
		;
		function masonryResize(a, b, c) {
			c.masoned = a.data('masonry') != undefined;
			var d = a.data('masonry').colCount;
			masonrySetup(a, b, c);
			if (c.colCount != d)
				masonryArrange(a, b, c)
		}
		;
		return this.each(function() {
			var a = $(this);
			var b = $.extend( {}, $.masonry);
			b.masoned = a.data('masonry') != undefined;
			var c = b.masoned ? a.data('masonry').options : {};
			var d = $.extend( {}, b.defaults, c, l);
			b.options = d.saveOptions ? d : c;
			m = m || function() {
			};
			if (b.masoned && d.appendedContent != undefined) {
				d.$brickParent = d.appendedContent
			} else {
				d.$brickParent = a
			}
			getBricks(b, d);
			if (b.$bricks.length) {
				masonrySetup(a, d, b);
				masonryArrange(a, d, b);
				var e = c.resizeable;
				if (!e && d.resizeable) {
					$(window).bind('smartresize.masonry', function() {
						masonryResize(a, d, b)
					})
				}
				if (e && !d.resizeable)
					$(window).unbind('smartresize.masonry')
			} else {
				return this
			}
		})
	};
	$.masonry = {
		defaults : {
			singleMode : false,
			columnWidth : undefined,
			 itemSelector: '.box:visible',
			appendedContent : undefined,
			saveOptions : true,
			resizeable : true,
			animate : false,
			animationOptions : {}
		},
		colW : undefined,
		colCount : undefined,
		colY : undefined,
		wallH : undefined,
		masoned : undefined,
		posTop : 0,
		posLeft : 0,
		options : undefined,
		$bricks : undefined,
		$brickParent : undefined
	}
})(jQuery);