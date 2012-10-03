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
                    autoOpen: false,
                    title: extractAttribute('title'),
                    width: extractStyle('width', '0px')
                })
				.dialog('option', 'position', (function () {
				    var p = extractAttribute('position');
				    return p ? p.split(',') : '';
				}
						()))
                .disableSelection()
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
                    $div.find('#sol-name').text(sol.name);
                    $div.find('#sol-owner').text(sol.owner || 'none');
                    $div.find('#sol-coord').text(CMN.misc.coordsToString(sol.coord));
                    $div.find('#sol-inhabited').text(sol.inhabited ? 'Inhabited' : 'Uninhabited');
                    $div.find('#sol-mass').text(sol.mass);
                    $div.find('.sol-trade-items').text((function () {
                        var str = '';
                        sol.hold.forEach(function (item) {
                            if (item.quantity > 0) {
                                str += item.name + ' - quantity ' + item.quantity + ' - prices: export ' + item.exportPrice + ', import ' + item.importPrice + '\n';
                            }
                        });
                        if (str === '') {
                            str = '<no trade items>';
                        }
                        return str;
                    }
							()));
                    $div.find('#vessels').text((function () {
                        var str = '',
                        shipsHere = SR.vessels.allShips.filter(function (ship) {
                            return ship.dest === sol;
                        });
                        if (shipsHere.length === 0) {
                            return '<no ships>';
                        }
                        shipsHere.forEach(function (ship) {
                            str += ship.name + '\n';
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
                    $div.find('#sol-name').text(sol.name);

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
                        $div.find('#ship-dest-name').text(ship.dest.name);
                        $div.find('#ship-dest-coord').text(CMN.misc.coordsToString(ship.dest.coord));
                    }
                    $div.find('#ship-name').text(ship.name || '<unnamed>');
                    $div.find('#ship-class').text(SR.shipClasses.item[ship.classIndex].name);
                    $div.find('#ship-coord').text(CMN.misc.coordsToString(ship.coord));
                    setDest();

                    (function () {
                        var $buttonDiv,
						show = {
						    changeDest: false,
						    loadHold: false
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
                                // Hide all currently shown dialogs.
                                X.hideAll();

                                N.askDestinationSolar(function (sol) {
                                    if (sol) {
                                        // Close this vessel dialog.
                                        $div.dialog('close');

                                        // Set the destination.
                                        ship.dest = sol;
                                        ship.arrived = false;
                                        setDest();
                                    }

                                    // Re-show all the other dialogs.
                                    X.showAll();
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
                    var $gl = $div.find('#goods-list'),
					    liHtml = CMN.misc.getElementHtml($gl.find('li')),
					    $li,
					    bothHolds,
					    i,
					    item,
					    allItems = '';

                    function setQuantities($li, item) {
                        $li.find('.sol-import-price').text(item.sol.importPrice);
                        $li.find('.sol-export-price').text(item.sol.exportPrice);
                        $li.find('.sol-quantity').text(item.sol.quantity);
                        $li.find('.ship-quantity').text(item.ship.quantity);
                    }

                    bothHolds = (function () {
                        var solHold,
						shipHold,
						retval;

                        // Wrap the hold items with a (sol/ship) group specifier.
                        function mapper(g) {
                            return function (i) {
                                return {
                                    group: g,
                                    item: i
                                };
                            };
                        }

                        solHold = _(ship.dest.hold).map(mapper('sol'));
                        shipHold = _(ship.hold).map(mapper('ship'));

                        retval =
							// Join the arrays.
							_(solHold).chain()
							    .concat(shipHold)
							    // Group by the trade item name (such as 'Water' or 'Flish'). (Actually the name index. Let's keep it all numbers, hey.)
							    .groupBy(function (e) {
							        return e.item.nameIndex;
							    })
							    // Map each item into a handy object.
							    .map(function (e) {
							        var sol = _(e).find(function (g) {
							            return g.group === 'sol';
							        }),
								    ship = _(e).find(function (g) {
								        return g.group === 'ship';
								    });
							        if (sol === undefined || ship === undefined) {
							            throw new Error("Didn't match sol to ship holds.");
							        }
							        return {
							            name: sol.item.name,
							            sol: sol.item,
							            ship: ship.item
							        };
							    })
							    // Retrieve the array of trade item names and sol/ship quantities.
							    .value();

                        return retval;
                    }());

                    // bothHolds should now resemble this:
                    //[{name:'Water',sol.quantity:40,ship.quantity:41},
                    // {name:'Flish',sol.quantity:30,ship.quantity:0}]

                    // Iterate the array of combined hold data.
                    for (i = 0; i < bothHolds.length; i++) {
                        item = bothHolds[i];

                        // Turn the list item HTML into an actual element.
                        $li = $(liHtml);

                        // Append the index to the id.
                        $li.get(0).id += i;

                        // Put the text and quantities.
                        $li.find('#item-name').text(item.name);
                        setQuantities($li, item);

                        // Get the list item as HTML text and append.
                        allItems += CMN.misc.getElementHtml($li);
                    }

                    $gl.html(allItems);

                    $gl.find('.buy-button').button().click(function () {
                        var $li = $(this).parents('li'),
                            id = CMN.misc.parseFirstInt($li.get(0).id),
                            item = bothHolds[id];

                        if (item.sol.quantity > 0) {
                            item.sol.quantity--;
                            item.ship.quantity++;
                            setQuantities($li, item);
                        }
                    });

                    $gl.find('.sell-button').button().click(function () {
                        var $li = $(this).parents('li'),
                            id = CMN.misc.parseFirstInt($li.get(0).id),
                            item = bothHolds[id];
                        if (item.ship.quantity > 0) {
                            item.ship.quantity--;
                            item.sol.quantity++;
                            setQuantities($li, item);
                        }
                    });

                    // Make button functions.
                    //$gl.find('.buy-button'

                    // Make the list items into buttons.
                    // $gl.find('li').button().click(function () {
                    // // When clicked, close the dialog and return the chosen index.
                    // $div.dialog('close');
                    // callback($(this).attr('listIndex'));
                    // });

                    // Show the div as a jQueryUI dialog.
                    N.showDialog($div);
                });
            };

            N.askDestinationSolar = function (callback) {
                var $div;

                function finished(sol) {
                    // Close the "ask destination" dialog.
                    $div.dialog('close');

                    // Make sure it's a solar.
                    sol = CMN.misc.isInstance(sol, 'SR.Solar') ? sol : undefined;

                    // Pass the solar into the callback.
                    callback(sol);
                }

                // Put SR.controls into it's "object chooser" mode.
                // It takes a callback for when the user selects a matching object.
                SR.controls.beginObjectChooserMode(['SR.Solar'], finished);

                // Make a div for the dialog.
                $div = $('<div></div>');

                // Load its content.
                $div.load('../markup/dialogs.html #dest-chooser', function () {

                    // The cancel button.
                    $div.find('#cancel-button').button().click(finished);

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
					liHtml = CMN.misc.getElementHtml($cl.find('li')),
					$li,
					i,
					found,
					allItems = '';

                    for (i = 0; i < objs.length; i++) {
                        found = objs[i];
                        if (!(found instanceof SR.Solar || found instanceof SR.Vessel)) {
                            throw new Error('Unknown object to show in list.');
                        }

                        // Turn the list item HTML into an actual element.
                        $li = $(liHtml);

                        // Append the index to the id.
                        $li.get(0).id += i;

                        // Put the text.
                        $li.text('{0} ({1})'.format(found.name, CMN.misc.coordsToString(found.coord)));

                        // Get the list item as HTML text and append.
                        allItems += CMN.misc.getElementHtml($li);
                    }

                    $cl.html(allItems);

                    // Make the list items into buttons.
                    $cl.find('li').button().click(function () {
                        var id,
						match,
						index;
                        // Close the dialog.
                        $div.dialog('close');
                        // Return the chosen index.
                        callback(CMN.misc.parseFirstInt($(this).get(0).id));
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
