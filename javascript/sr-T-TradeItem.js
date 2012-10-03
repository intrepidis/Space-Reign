(function (global) {
    "use strict";

    var SR = global.SR = global.SR || {},
        thisType;

    // A holacre is a standard cube unit of measure for interstella shipments.
    thisType = SR.TradeItem = function (nameIndex) {
        var N = {}, // Enclosed (private) members are here.
            X = this; // Exposed (public) members are here.

        (function EXPOSED_FIELDS() {
            // The index in the trade item names array.
            X.nameIndex = nameIndex;

            // How many goods this instance represents.
            // (In holacres, as a rough estimate. Can be negative, meaning in heavy demand.)
            X.quantity = 0;
        }());
    };

    // Here is the prototype section.
    (function PROTOTYPE() {
        var P = thisType.prototype;

        (function EXPOSED_PROPERTIES() {
            Object.defineProperty(P, 'name', {
                get: function () {
                    return SR.tradeItems.item[this.nameIndex];
                }
            });

            // How much the solar system will pay for a holacre of the goods.
            Object.defineProperty(P, 'importPrice', {
                get: function () {
                    return this.quantity > 100 ? 1 : 20;
                }
            });

            // How much the solar system sells a holacre of the goods for.
            Object.defineProperty(P, 'exportPrice', {
                get: function () {
                    return this.quantity > 100 ? 30 : 1000;
                }
            });
        }());
    }());

}(this));
