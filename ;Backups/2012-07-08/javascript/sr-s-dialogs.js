(function (global) {
	"use strict";
	
	var SR = global.SR = global.SR || {},
	CMN = global.CMN,
	log = CMN.log;
	
	SR.dialogs = (function () {
		var N = {}, // Enclosed (private) members are here.
		X = {}; // Exposed (public) members are here.
		
		(function ENCLOSED_METHODS() {
			// Show a div as a jQuery UI dialog.
			N.showDialog = function ($div) {
				var $infoDiv = $div.children(),
				title,
				width;
				
				// Get the title attribute of the DIV tag.
				title = $infoDiv.attr('title'),
				// Clear the title attribute, otherwise an annoying tooltip appears.
				$infoDiv.attr('title', '');
				
				// Get the preferred width, if present.
				width = $infoDiv.css('width');
				$infoDiv.css('width', '');
				if (width === '0px') {
					width = undefined;
				}
				
				// Show the dialog via jQuery UI.
				$div.dialog({
					autoOpen : false,
					title : title,
					width : width
				}).dialog('open');
			};
			
			N.showSolar = function (sol) {
				var $div;
				
				if (!(sol instanceof SR.Solar)) {
					throw new Error('The parameter should be of Solar type.');
				}
				
				// Make a div for the solar dialog.
				$div = $('<div></div>');
				
				// Load its content.
				$div.load('../markup/dialogs.html #solar', function () {
					// Set the solar information.
					$div.find('#sol-name').html(sol.name);
					$div.find('#sol-owner').html(sol.owner || 'none');
					$div.find('#sol-coord').html(CMN.misc.coordsToString(sol.coord));
					$div.find('#sol-inhabited').html(sol.inhabited ? 'Inhabited' : 'Uninhabited');
					$div.find('#sol-mass').html(sol.mass);
					$div.find('#sol-trade-items').html('&nbsp;');
					$div.find('#vessels').html((function () {
							var str = '',
							shipsHere = SR.vessels.allShips.filter(function (ship) {
									return ship.dest === sol;
								});
							//debugger;
							if (shipsHere.length == 0) {
								return CMN.misc.escapeHtmlEntities('<no ships>');
								//return $('<div>&nbsp;</div>').text('<no ships>').html();
							}
							shipsHere.forEach(function (ship) {
								str += ship.name + '<br>';
							});
							return str;
						}
							()));
					
					if (sol.owner === SR.companies.playerCompany) {
						$div.find('#construction-button').button().click(function () {
							N.showConstruction(sol);
						});
					} else {
						$div.find('#construction-button').hide();
					}
					
					// Show the div as a jQueryUI dialog.
					N.showDialog($div);
				});
			};
			
			N.showConstruction = function (sol) {
				var $div;
				
				if (!(sol instanceof SR.Solar)) {
					throw new Error('The parameter should be of Solar type.');
				}
				
				// Make a div for the construction dialog.
				$div = $('<div></div>');
				
				// Load its content.
				$div.load('../markup/dialogs.html #construction', function () {
					// Set the solar information.
					$div.find('#sol-name').html(sol.name);
					
					// Show the div as a jQueryUI dialog.
					N.showDialog($div);
				});
			};
			
			N.showVessel = function (ship) {
				var $div;
				
				if (!(ship instanceof SR.Vessel)) {
					throw new Error('The parameter should be of Vessel type.');
				}
				
				// Make a div for the vessel dialog.
				$div = $('<div></div>');
				
				// Load its content.
				$div.load('../markup/dialogs.html #vessel', function () {
					// Set the vessel information.
					$div.find('#ship-name').html(ship.name || '<unnamed>');
					$div.find('#ship-class').html(SR.shipClasses[ship.classIndex].name);
					$div.find('#ship-coord').html(CMN.misc.coordsToString(ship.coord));
					$div.find('#ship-dest-name').html(ship.dest.name);
					$div.find('#ship-dest-coord').html(CMN.misc.coordsToString(ship.dest.coord));
					
					// Show the div as a jQueryUI dialog.
					N.showDialog($div);
				});
			};
		}
			());
		
		(function EXPOSED_METHODS() {
			X.showObject = function (obj) {
				// Close existing dialogs.
				$('.ui-dialog-content').dialog('closeUnpinned');
				
				if (obj instanceof SR.Solar) {
					N.showSolar(obj);
				} else if (obj instanceof SR.Vessel) {
					N.showVessel(obj);
				}
				
				log.add('Unknown object type clicked.');
			};
			
			X.showObjectsChooser = function (objs, callback) {
				var $div;
				
				// Close existing dialogs.
				$('.ui-dialog-content').dialog('closeUnpinned');
				
				// Make a div for the object dialog.
				$div = $('<div></div>');
				
				// Load its content.
				$div.load('../markup/dialogs.html #obj-chooser', function () {
					// Propagate the list with the object types and names.
					var $cl = $div.find('#choice-list'),
					i,
					found,
					str = '';
					
					for (i = 0; i < objs.length; i++) {
						found = objs[i];
						if (found instanceof SR.Solar || found instanceof SR.Vessel) {
							str += '<li listIndex="{0}">'.format(i);
							str += found.name;
							str += ' ({0})'.format(CMN.misc.coordsToString(found.coord));
							str += '</li>';
						} else {
							throw new Error('Unknown object to show in list.');
						}
					}
					
					$cl.html(str);
					
					// Make the list items into buttons.
					$cl.find('li').button().click(function () {
						// When clicked, close the dialog and return the chosen index.
						$div.dialog('closeUnpinned');
						callback($(this).attr('listIndex'));
					});
					
					// Show the div as a jQueryUI dialog.
					N.showDialog($div);
				});
			};
		}
			());
		
		// Return the exposed object instance.
		return X;
	}
		());
}
	(this));
