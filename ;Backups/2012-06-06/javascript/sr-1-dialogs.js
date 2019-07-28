(function (global) {
	"use strict";
	
	var spaceReign = global.spaceReign = global.spaceReign || {},
	dialogs = spaceReign.dialogs = spaceReign.dialogs || {},
	log = global.cmnLog,
	cmnMisc = global.cmnMisc,
	cmnSpatial = global.cmnSpatial,
	Vector = cmnSpatial.Vector,
	Solar = spaceReign.Solar,
	Vessel = spaceReign.Vessel,
	vessels = spaceReign.vessels,
	starMap = spaceReign.starMap;
	
	function coordsToString(vector) {
		var v = vector;
		function f(n) {
			return n.toFixed(3);
		}
		return '({0},{1},{2})'.format(f(v.x), f(v.y), f(v.z));
	}
	
	dialogs.showObject = function (chosen) {
		if (chosen.obj instanceof Solar) {
			dialogs.showSolar(chosen.obj, chosen.objCoord);
		} else {
			throw new Error('Unknown object type clicked.');
		}
	}
	
	dialogs.showObjectsChooser = function (objs, callback) {
		var $div;
		
		// Make an object dialog div.
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
				if (found.obj instanceof Solar) {
					str += '<li listIndex="{0}">'.format(i);
					str += found.obj.name;
					str += ' ' + coordsToString(found.objCoord);
					str += '</li>';
				} else {
					throw new Error('Unknown object to show in list.');
				}
			}
			
			$cl.html(str);
			
			// Make the list items into buttons.
			$cl.find('li').button().click(function () {
				// When clicked, close the dialog and return the chosen index.
				$div.remove();
				callback($(this).attr('listIndex'));
			});
			
			// Show the div as a jQueryUI dialog.
			$div.dialog({
				autoOpen : false,
				title : 'Please choose an object',
				close : function () {
					$(this).remove();
				}
			}).dialog('open');
		});
	};
	
	dialogs.showSolar = function (sol, spaceCoord) {
		var $div;
		
		// Make an object dialog div.
		$div = $('<div></div>');
		
		// Load its content.
		$div.load('../markup/dialogs.html #solar', function () {
			// Set the solar information.
			$div.find('#sol-name').html(sol.name);
			$div.find('#sol-coords').html(coordsToString(spaceCoord));
			$div.find('#sol-mass').html('&nbsp;');
			$div.find('#vessels').html((function () {
					var str = '',
					shipsHere = vessels.allShips.filter(function (ship) {
							return ship.dest === sol;
						});
					debugger;
					if (shipsHere.length == 0) {
						return cmnMisc.escapeHtmlEntities('<no ships>');
						//return $('<div>&nbsp;</div>').text('<no ships>').html();
					}
					shipsHere.forEach(function (ship) {
						str += ship.name + '<br>';
					});
					return str;
				}
					()));
			
			// Show the div as a jQueryUI dialog.
			$div.dialog({
				autoOpen : false,
				title : 'Solar System',
				close : function () {
					$(this).remove();
				}
			}).dialog('open');
		});
	};
}
	(this));
