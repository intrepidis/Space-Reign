(function (global) {
	"use strict";
	
	var SR = global.SR = global.SR || {},
	CMN = global.CMN,
	log = CMN.log,
	dialogs = SR.dialogs = SR.dialogs || {};
	
	function coordsToString(vector) {
		var v = vector;
		function f(n) {
			return n.toFixed(3);
		}
		return '{0},{1},{2}'.format(f(v.x), f(v.y), f(v.z));
	}
	
	dialogs.showObject = function (obj) {
		// Close existing dialogs.
		$('.ui-dialog-content').dialog('closeUnpinned');
		
		if (obj instanceof SR.Solar) {
			dialogs.showSolar(obj);
		} else if (obj instanceof SR.Vessel) {
			dialogs.showVessel(obj);
		}
		
		log.add('Unknown object type clicked.');
	}
	
	dialogs.showObjectsChooser = function (objs, callback) {
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
					str += ' ({0})'.format(coordsToString(found.coord));
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
			$div.dialog({
				autoOpen : false,
				title : 'Please choose an object'
			}).dialog('open');
		});
	};
	
	dialogs.showSolar = function (sol) {
		var $div;
		
		if (!(sol instanceof SR.Solar)) {
			throw new Error('The parameter should be of Solar type.');
		}
		
		// Make a div for the solar dialog.
		$div = $('<div></div>');
		
		// Load its content.
		$div.load('../markup/dialogs.html #solar', function () {
			// Set the solar information.
			$div.find('#sol-name').html('Name: {0}'.format(sol.name));
			$div.find('#sol-coord').html('Coordinate: {0}'.format(coordsToString(sol.coord)));
			$div.find('#sol-inhabited').html(sol.inhabited ? 'Inhabited' : 'Uninhabited');
			$div.find('#sol-mass').html('Mass: {0}'.format(sol.mass));
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
						str += ship.getNameWithShipClass() + '<br>';
					});
					return str;
				}
					()));
			
			// Show the div as a jQueryUI dialog.
			$div.dialog({
				autoOpen : false,
				title : 'Solar System'
			}).dialog('open');
		});
	};
	
	dialogs.showVessel = function (ship) {
		var $div;
		
		if (!(ship instanceof SR.Vessel)) {
			throw new Error('The parameter should be of Vessel type.');
		}
		
		// Make a div for the vessel dialog.
		$div = $('<div></div>');
		
		// Load its content.
		$div.load('../markup/dialogs.html #vessel', function () {
			// Set the vessel information.
			$div.find('#ship-name').html('Name: {0}'.format(ship.name||'<unnamed>'));
			$div.find('#ship-class').html('Class: {0}'.format(SR.shipClasses[ship.classIndex].name));
			$div.find('#ship-coord').html('Coordinate: {0}'.format(coordsToString(ship.coord)));
			$div.find('#ship-dest').html('Destination: {0} ({1})'.format(ship.dest.name, coordsToString(ship.dest.coord)));
			
			// Show the div as a jQueryUI dialog.
			$div.dialog({
				autoOpen : false,
				title : 'Space Vessel'
			}).dialog('open');
		});
	};
}
	(this));
