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
		
		this.dialogIsPinned = this.uiDialogTitlebarPin.is(':visible');
	};
	
	// Custom dialog functions.
	$.extend($.ui.dialog.prototype, {
		pin : function (shouldPin) {
			// Swap which button is visible to achieve the graphical pinning effect.
			if (shouldPin === false) {
				this.uiDialogTitlebarUnpin.hide();
				this.uiDialogTitlebarPin.show();
				this.dialogIsPinned = false;
			} else { // true or undefined
				this.uiDialogTitlebarPin.hide();
				this.uiDialogTitlebarUnpin.show();
				this.dialogIsPinned = true;
			}
		},
		hidePin : function () {
			this.uiDialogTitlebarUnpin.hide();
			this.uiDialogTitlebarPin.hide();
		},
		showPin : function () {
			this.pin(this.dialogIsPinned);
		},
		close : function () {
			$(this.element).remove();
		},
		closeUnpinned : function () {
			if (!this.dialogIsPinned) {
				$(this.element).dialog('close');
			}
		}
	});
}
	(jQuery));
