
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Folding Pattern - templates
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
(function (global) {
	"use strict";
	
	// Create a name-space in the global space.
	var foldingPattern = global.foldingPattern = global.foldingPattern || {};
	
	//====================================
	// The template for making a singleton.
	//====================================
	foldingPattern.singletonTemplate = (function () {
		var N = {}, // Enclosed (private) members are here.
		    X = {}; // Exposed (public) members are here.
		
		(function ENCLOSED_FIELDS() {
			N.myField = 0;
		}());
		
		(function ENCLOSED_METHODS() {
			N.myMethod = function () {
				N.myField++;
			};
		}());
		
		(function EXPOSED_PROPERTIES() {
			Object.defineProperty(X, 'myProperty', {
				get : function () {
					return N.myField;
				}
			});
		}());
		
		(function EXPOSED_METHODS() {
			X.myMethod = N.myMethod;
		}());
		
		// Return the exposed object instance.
		return X;
	}());
	//====================================
	
	
	//====================================
	// The template for making a type.
	//====================================
	// This function is used to segregate the components of the type.
	(function () {
		// Here is the constructor section.
		var thisType = foldingPattern.TypeTemplate = function () {
			var N = {}, // Enclosed (private) members are here.
			    X = this; // Exposed (public) members are here.
			
			(function ENCLOSED_FIELDS() {
				N.myField1 = 0;
			}());
			
			(function EXPOSED_FIELDS() {
				X.myField2 = 0;
			}());
			
			// The properties below have access to the enclosed fields.
			// Careful with functions exposed within the closure of the constructor,
			// every new instance will have it's own copy.
			(function EXPOSED_PROPERTIES_WITHIN_CONSTRUCTOR() {
				Object.defineProperty(X, 'myProperty1', {
					get : function () {
						return N.myField1;
					},
					set : function (value) {
						N.myField1 = value;
					}
				});
			}());
		};
		
		// Here is the prototype section.
		(function PROTOTYPE() {
			var P = thisType.prototype;
			
			(function EXPOSED_PROPERTIES_WITHIN_PROTOTYPE() {
				Object.defineProperty(P, 'myProperty2', {
					get : function () {
						return this.myField2;
					}
				});
			}());
			
			(function EXPOSED_METHODS() {
				P.myMethod = function () {
					return this.myProperty1 + this.myField2;
				};
			}());
		}());
	}());
	//====================================
	
}(this));
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Folding Pattern - examples
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
(function (global) {
	"use strict";
	
	var foldingPattern = global.foldingPattern = global.foldingPattern || {};
	
	//====================================
	// An example of making a singleton.
	//====================================
	foldingPattern.singletonExample = (function () {
		var N = {}, // Enclosed (private) members are here.
		    X = {}; // Exposed (public) members are here.
		
		(function ENCLOSED_FIELDS() {
			N.toggle = false;
			N.text = '';
			N.count = 0;
			N.numbers = [1, 2, 3];
		}());
		
		(function ENCLOSED_METHODS() {
			// An enclosed instance method.
			N.tweak = function () {
				N.toggle = !N.toggle;
				if (N.toggle) {
					X.count++;
				}
				N.incrementNumbersByCount();
				N.text = 'tweaked';
			};
			
			// An enclosed instance method that references exposed members.
			N.incrementNumbersByCount = function () {
				var i;
				for (i = 0; i < X.numbers.length; i++) {
					X.numbers[i] += X.count;
				}
			};
		}());
		
		(function EXPOSED_PROPERTIES() {
			Object.defineProperty(X, 'numberCount', {
				get : function () {
					return this.numbers.length;
				}
			});
			
			Object.defineProperty(X, 'count', {
				get : function () {
					return N.count;
				}
			});
			
			Object.defineProperty(X, 'numbers', {
				get : function () {
					return N.numbers;
				}
			});
		}());
		
		(function EXPOSED_METHODS() {
			// Expose an enclosed function.
			X.tweak = N.tweak;
		}());
		
		// Return the exposed object instance.
		return X;
	}());
	//====================================
	
	
	//====================================
	// An example of making a type.
	//====================================
	// This function is used to segregate the components of the type.
	(function () {
		// Here is the constructor section.
	    var thisType = foldingPattern.TypeExample = function () {
			var N = {}, // Enclosed (private) members are here.
			    X = this; // Exposed (public) members are here.
			
			(function ENCLOSED_FIELDS() {
				N.toggle = false;
				N.text = '';
			}());
			
			(function EXPOSED_FIELDS() {
				X.count = 0;
				X.numbers = [1, 2, 3];
			}());
			
			// The properties below have access to the enclosed fields.
			// Careful with functions exposed within the closure of the constructor,
			// every new instance will have it's own copy.
			(function EXPOSED_PROPERTIES_WITHIN_CONSTRUCTOR() {
				Object.defineProperty(X, 'toggle', {
					get : function () {
						var before = N.toggle;
						N.toggle = !N.toggle;
						return before;
					}
				});
				
				Object.defineProperty(X, 'text', {
					get : function () {
						return N.text;
					},
					set : function (value) {
						N.text = value;
					}
				});
			}());
		};
		
		// Here is the prototype section.
		(function PROTOTYPE() {
			var P = thisType.prototype;
			
			(function EXPOSED_PROPERTIES_WITHIN_PROTOTYPE() {
				Object.defineProperty(P, 'numberLength', {
					get : function () {
						return this.numbers.length;
					}
				});
			}());
			
			(function EXPOSED_METHODS() {
				P.incrementNumbersByCount = function () {
					var i;
					for (i = 0; i < this.numbers.length; i++) {
						this.numbers[i] += this.count;
					}
				};
				P.tweak = function () {
					if (this.toggle) {
						this.count++;
					}
					this.text = 'tweaked';
				};
			}());
		}());

	}());
	//====================================
	
}(this));
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
