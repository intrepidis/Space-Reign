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
				var $infoDiv = $div.children();
				
				// Get the preferred style, if present.
				function extractAttribute(attrName) {
					var attr = $infoDiv.attr(attrName);
					$infoDiv.attr(attrName, '');
					if (attr === '') {
						attr = undefined;
					}
					return attr;
				}
				
				// Get the preferred style, if present.
				function extractStyle(styleName, undefinedValue) {
					var style = $infoDiv.css(styleName);
					$infoDiv.css(styleName, '');
					if (style === undefinedValue) {
						style = undefined;
					}
					return style;
				}
				
				// Show the dialog via jQuery UI.
				$div.dialog({
					autoOpen : false,
					title : extractAttribute('title'),
					width : extractStyle('width', '0px')
				})
				.dialog('option', 'position', (function () {
						var p = extractAttribute('position');
						return p ? p.split(',') : '';
					}
						()))
				.dialog('open');
			};
			
			N.showSolar = function (sol) {
				var $div;
				
				if (!(sol instanceof SR.Solar)) {
					throw new Error('The parameter should be of Solar type.');
				}
				
				// Make a div for the dialog.
				$div = $('<div></div>');
				
				// Load its content.
				$div.load('../markup/dialogs.html #solar', function () {
					// Set the solar information.
					$div.find('#sol-name').html(sol.name);
					$div.find('#sol-owner').html(sol.owner || 'none');
					$div.find('#sol-coord').html(CMN.misc.coordsToString(sol.coord));
					$div.find('#sol-inhabited').html(sol.inhabited ? 'Inhabited' : 'Uninhabited');
					$div.find('#sol-mass').html(sol.mass);
					$div.find('#sol-trade-items').html((function () {
							var str = 'Trade items:';
							if (sol.hold.length === 0) {
								return CMN.misc.escapeHtmlEntities('<no trade items>');
							}
							sol.hold.forEach(function (item) {
								str += '<br>' + SR.tradeItems.item[item.nameIndex];
							});
							return str;
						}
							()));
					$div.find('#vessels').html((function () {
							var str = '',
							shipsHere = SR.vessels.allShips.filter(function (ship) {
									return ship.dest === sol;
								});
							if (shipsHere.length === 0) {
								return CMN.misc.escapeHtmlEntities('<no ships>');
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
				
				// Make a div for the dialog.
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
				
				// Make a div for the dialog.
				$div = $('<div></div>');
				
				// Load its content.
				$div.load('../markup/dialogs.html #vessel', function () {
					// Set the vessel information.
					function setDest() {
						$div.find('#ship-dest-name').html(ship.dest.name);
						$div.find('#ship-dest-coord').html(CMN.misc.coordsToString(ship.dest.coord));
					}
					$div.find('#ship-name').html(ship.name || '<unnamed>');
					$div.find('#ship-class').html(SR.shipClasses.item[ship.classIndex].name);
					$div.find('#ship-coord').html(CMN.misc.coordsToString(ship.coord));
					setDest();
					
					(function () {
						var $buttonDiv,
						show = {
							changeDest : false,
							loadHold : false
						};
						
						if (ship.owner === SR.companies.playerCompany) {
							show.changeDest = true;
							if (ship.arrived) {
								show.loadHold = true;
							}
						}
						
						$buttonDiv = $div.find('#change-dest-button');
						if (show.changeDest) {
							$buttonDiv.button().click(function changeDest() {
								N.askDestinationSolar(function (sol) {
									ship.dest = sol;
									ship.arrived = false;
									setDest();
								});
							});
						} else {
							$buttonDiv.hide();
						}
						
						$buttonDiv = $div.find('#load-hold-button');
						if (show.loadHold) {
							$buttonDiv.button().click(function loadHold() {
								N.tradeGoods(ship);
							});
						} else {
							$buttonDiv.hide();
						}
					}
						());
					
					// Show the div as a jQueryUI dialog.
					N.showDialog($div);
				});
			};
			
			N.tradeGoods = function (ship) {
				var $div;
				
				if (!(ship instanceof SR.Vessel)) {
					throw new Error('The parameter should be of Vessel type.');
				}
				
				// Make a div for the dialog.
				$div = $('<div></div>');
				
				// Load its content.
				$div.load('../markup/dialogs.html #trade-goods', function () {
					// Propagate the list.
					var $cl = $div.find('#goods-list'),
					li = $cl.find('li').wrap('<p>').parent().html(),
					bothHolds,
					i,
					item,
					allItems = '';
					
					bothHolds = (function () {
						var solHold,
						shipHold,
						retval;
						
						// Wrap the hold items with a (sol/ship) group specifier.
						function mapper(g) {
							return function (i) {
								return {
									group : g,
									item : i
								};
							};
						}
						solHold = _(ship.dest.hold).map(mapper('sol'));
						shipHold = _(ship.hold).map(mapper('ship'));
						
						retval =
							// Join the arrays.
							_(solHold).chain()
							.concat(shipHold)
							// Group by the trade item name (such as 'Water' or 'Flish').
							.groupBy(function (e) {
								return e.item.nameIndex;
							})
							// Map each item as a handy object.
							.map(function (e) {
								var sol = _(e).find(function (g) {
										return g.group === 'sol';
									}),
								ship = _(e).find(function (g) {
										return g.group === 'ship';
									});
								return {
									name : SR.tradeItems.item[sol ? sol.item.nameIndex : ship.item.nameIndex],
									solQty : sol ? sol.item.quantity : 0,
									shipQty : ship ? ship.item.quantity : 0
								};
							})
							// Retrieve the array of trade item names and sol/ship quantities.
							.value();
						
						return retval;
					}
						());
					
					// bothHolds should now resemble this:
					//[{name:'Water',solQty:40,shipQty:41},
					// {name:'Flish',solQty:30,shipQty:0}]
					
					// Iterate the array of combined hold data.
					for (i = 0; i < bothHolds.length; i++) {
						item = bothHolds[i];
						allItems += li.format(i, item.name, item.solQty, item.shipQty);
					}
					
					$cl.html(allItems);

					// Make button functions.
					//$cl.find('.buy-button'
					
					// Make the list items into buttons.
					// $cl.find('li').button().click(function () {
					// // When clicked, close the dialog and return the chosen index.
					// $div.dialog('close');
					// callback($(this).attr('listIndex'));
					// });
					
					// Show the div as a jQueryUI dialog.
					N.showDialog($div);
				});
			};
			
			N.askDestinationSolar = function (callBack) {
				var $div;
				
				function cleanup() {
					// Close the "ask destination" dialog.
					$div.dialog('close');
					
					// Re-show all the other dialogs.
					X.showAll();
				}
				
				// Hide all currently shown dialogs.
				X.hideAll();
				
				// Put SR.controls into it's "object chooser" mode.
				SR.controls.beginObjectChooserMode(['SR.Solar'], function (sol) { // Call-back for when the user selects a matching object.
					callBack(sol);
					cleanup();
				});
				
				// Make a div for the dialog.
				$div = $('<div></div>');
				
				// Load its content.
				$div.load('../markup/dialogs.html #dest-chooser', function () {
					
					// The cancel button.
					$div.find('#cancel-button').button().click(cleanup);
					
					// Show the div as a jQueryUI dialog.
					N.showDialog($div);
					$div.dialog('pin').dialog('hidePin');
				});
			};
		}
			());
		
		(function EXPOSED_METHODS() {
			X.hideAll = function () {
				// Hide all existing dialogs.
				$('.ui-dialog').each(function () {
					var $this = $(this);
					$this.data('display-backup', $this.css('display'));
					$this.css('display', 'none');
				});
			};
			
			X.showAll = function () {
				// Show all existing dialogs.
				$('.ui-dialog').each(function () {
					var $this = $(this),
					val = $this.data('display-backup');
					$this.removeData('display-backup');
					if (val) {
						$this.css('display', val);
					} else {
						$('.ui-dialog').css('display', 'inherit');
					}
				});
			};
			
			X.closeUnpinned = function () {
				// Close existing dialogs that haven't been pinned.
				$('.ui-dialog-content').dialog('closeUnpinned');
			};
			
			X.showObject = function (obj) {
				
				if (obj instanceof SR.Solar) {
					N.showSolar(obj);
				} else if (obj instanceof SR.Vessel) {
					N.showVessel(obj);
				}
				
				log.add('Unknown object type clicked.');
			};
			
			X.showObjectsChooser = function (objs, callback) {
				var $div;
				
				// Make a div for the dialog.
				$div = $('<div></div>');
				
				// Load its content.
				$div.load('../markup/dialogs.html #obj-chooser', function () {
					// Propagate the list with the object types and names.
					var $cl = $div.find('#choice-list'),
					li = $cl.find('li').wrap('<p>').parent().html(),
					i,
					found,
					text,
					allItems = '';
					
					for (i = 0; i < objs.length; i++) {
						found = objs[i];
						if (!(found instanceof SR.Solar || found instanceof SR.Vessel)) {
							throw new Error('Unknown object to show in list.');
						}
						text = '{0} ({1})'.format(found.name, CMN.misc.coordsToString(found.coord));
						allItems += li.format(i, text);
					}
					
					$cl.html(allItems);
					
					// Make the list items into buttons.
					$cl.find('li').button().click(function () {
						// When clicked, close the dialog and return the chosen index.
						$div.dialog('close');
						callback($(this).attr('listIndex'));
					});
					
					// Show the div as a jQueryUI dialog.
					N.showDialog($div);
					$div.dialog('hidePin');
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
