(function ($) {
	"use strict";
	
	var original_init = $.ui.dialog.prototype._init;
	
	// Custom dialog init.
	$.ui.dialog.prototype._init = function () {
		var self = this;
		
		original_init.apply(this, arguments);
		
		this.uiDialogTitlebar.append('<a href="#" class="dialog-pin-w ui-dialog-titlebar-pin"><span class="ui-icon ui-icon-pin-w"></span></a>');
		this.uiDialogTitlebar.append('<a href="#" class="dialog-pin-s ui-dialog-titlebar-unpin"><span class="ui-icon ui-icon-pin-s"></span></a>');
		
		// Pinning button event.
		this.uiDialogTitlebarPin = $('.dialog-pin-w', this.uiDialogTitlebar).hover(function () {
				$(this).addClass('ui-state-hover');
			}, function () {
				$(this).removeClass('ui-state-hover');
			}).click(function () {
				self.pin(true);
				return false;
			});
		
		// Unpinning button event.
		this.uiDialogTitlebarUnpin = $('.dialog-pin-s', this.uiDialogTitlebar).hover(function () {
				$(this).addClass('ui-state-hover');
			}, function () {
				$(this).removeClass('ui-state-hover');
			}).click(function () {
				self.pin(false);
				return false;
			}).hide();
	};
	
	// Custom dialog functions.
	$.extend($.ui.dialog.prototype, {
		pin : function (shouldPin) {
			// Swap the buttons.
			if (shouldPin) {
				this.uiDialogTitlebarPin.hide();
				this.uiDialogTitlebarUnpin.show();
			} else {
				this.uiDialogTitlebarUnpin.hide();
				this.uiDialogTitlebarPin.show();
			}
		},
		close : function () {
			$(this.element).remove();
		},
		closeUnpinned : function () {
			if (this.uiDialogTitlebarPin.is(':visible')) {
				$(this.element).dialog('close');
			}
		}
	});
}
	(jQuery));
