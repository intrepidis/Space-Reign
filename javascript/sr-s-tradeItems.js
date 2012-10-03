(function (global) {
    "use strict";

    var SR = global.SR = global.SR || {};

    SR.tradeItems = (function () {
        var N = {}, // Enclosed (private) members are here.
		    X = {}; // Exposed (public) members are here.

        (function ENCLOSED_FIELDS() {
            N.goods = [
                //[name, base-cost-per-holacre]
                ["Diamonds", 1],
                ["Bears", 200],
                ["Water", 500],
                ["Oil", 40],
                ["Flish", 200]
            ];
            N.goodsIndex_NAME = 0;
            N.goodsIndex_COST = 1;
        }());

        (function EXPOSED_FIELDS() {
            // Define the names of the trade items.
            X.item = _(N.goods).map(function (o) { return o[N.goodsIndex_NAME]; });
            X.cost = _(N.goods).map(function (o) { return o[N.goodsIndex_COST]; });
        }());

        (function EXPOSED_PROPERTIES() {
            Object.defineProperty(X, 'length', {
                get: function () {
                    return X.item.length;
                }
            });
        }());

        (function EXPOSED_METHODS() {
            X.makeTradeItems = function (callback) {
                var arrayFrom0ToLength = _.range(X.length);
                if (callback === undefined) {
                    // Use an empty function.
                    callback = function () { };
                }
                return _(arrayFrom0ToLength).map(function (index) {
                    var item = new SR.TradeItem(index);
                    callback(item);
                    return item;
                });
            };

            X.getIndexByName = function (itemName) {
                return X.item.indexOf(itemName);
            };
        }());

        // Return the exposed object instance.
        return X;
    }());
}(this));
