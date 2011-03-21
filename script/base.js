
(function() {
	// get an element's auto-height
	/*$.fn.fullHeight = function() {
		var height = this.height(),
			autoHeight = this.height('auto').height();
			
		this.height(height);
		return autoHeight;
	};*/
	
	// Make element's width and heights static
	/*$.fn.staticSize = function() {
		this.each(function() {
			var $this = $(this);
			$this.width( $this.width() ).height( $this.height() );
		});
	};*/
	
	// listen for keyup after a ms delay
	/*$.fn.keyupDelay = function(delay, callback) {
		var timeout;
		
		this.keyup(function() {
			var args = arguments,
				context = this;
			
			clearTimeout(timeout);
			
			timeout = setTimeout(function() {
				callback.apply(context, args);
			}, delay);
		});
		
		return this;
	}*/
	
	// $('#char-count').charCount('#input-element', 500); // init
	// $('#char-count').charCount('update'); // manually trigger an update
	// Requires: keyupDelay
	/*$.fn.charCount = function($input, limit) {
		var $countElm = this;
		
		if ( !this[0] ) { return $countElm; }
		
		if ($input === 'update') {
			$countElm.data('charCountUpdator')();
		}
		else {
			var update = function() {
				var charsLeft = limit - $input.val().length;
				
				if (charsLeft < 0) {
					$countElm.html('<span class="over">' + (charsLeft * -1) + '</span> character' + (charsLeft === -1 ? '' : 's') + ' over');
				}
				else {
					$countElm.html('<span>' + charsLeft + '</span> character' + (charsLeft === 1 ? '' : 's') + ' remaining');
				}
			};
			$countElm.data('charCountUpdator', update);
			$input = $( $input ).keyupDelay( 100, update );
			update();
		}
		return $countElm;
	}*/
	
	// Make labels a placeholder that shows & hides
	// The label should be hidden by default, via CSS, if js is enabled
	// Label must have a for attribute
	/*$.fn.placeholder = function() {
		this.each(function() {
			var $label = $(this),
				$input = $( '#' + $label.attr('for') );
			
			function hideLabel() {
				$label.hide();
			}
			
			function showLabelIfInputEmpty() {
				!$input.val() && $label.show();
			}
			
			$input.keydown(hideLabel).focus(hideLabel).blur(showLabelIfInputEmpty);
			showLabelIfInputEmpty();
		});
	};*/
	
	// cycle a set of class names for selected items
	// eg $('#some-list').children().cycleClasses('odd', 'even');
	// eg $('#some-list').children().cycleClasses([odd', 'even]);
	/*$.fn.cycleClasses = function() {
		var classNames = $.isArray( arguments[0] ) ? arguments[0] : arguments,
			len = classNames.length;
			
		this.addClass(function(i) {
			return classNames[i % len];
		});
	};*/
	
	// get/set the caret position in a text field
	// eg $('input.whatever').caret(); // returns 0-indexed caret start position
	// eg $('input.whatever').caret(0, 5); // select chars 0-5
	/*$.fn.caret = function(start, end) {
		var inputElm = this[0];
		
		if (start === undefined) {
			var r;
	
			if (!window.opera && document.selection && document.selection.createRange) { // IE
				range = document.selection.createRange();
				range.collapse();
				range.setEndPoint( 'StartToStart', inputElm.createTextRange() );
				r = range.text.length;
			}
			else { // moz, saf, opera
				r = inputElm.selectionStart;
			}
			return r;
		}
		else {
			end = (end === undefined) ? start : end;
	
			var character = 'character',
				range;
	
			if (!window.opera && inputElm.createTextRange) { // IE
				range = inputElm.createTextRange();
				range.moveStart(character, start);
				range.moveEnd(character, end - inputElm.value.length);
				range.select();
			}
			else { // moz, saf, opera
				inputElm.select();
				inputElm.selectionStart = start;
				inputElm.selectionEnd = end;
			}
			return this;
		}
	}*/
	
	// make a string html safe
	/*function h(str) {
		str = str + '';
		if (!str) { return ''; }
		
		return str
			.replace(/&/g,'&amp;')
			.replace(/</g,'&lt;')
			.replace(/>/g,'&gt;')
			.replace(/"/g,'&quot;');
	}*/
	
	/*
		Get a supported css property name for a css property
		Will search common vendor prefixes for supported value.
		
		usage:
			getCssPropertyName('border-radius');
			// returns...
			// 'border-radius' if supported, else...
			// '-moz-border-radius' if supported, else...
			// '-webkit-border-radius' if supported, else...
			// etc etc, else ''
	 */
	/*var getCssPropertyName = (function() {
		var style = document.createElement('b').style,
			prefixes = ['Webkit', 'O', 'Ie', 'Moz'],
			cache = {};

		return function(propertyName) {
			if ( propertyName in cache ) {
				return cache[propertyName];
			}

			var supportedValue = '',
				i = prefixes.length,
				upperCamelPropertyName,
				camelPropertyName = propertyName.replace(/-([a-z])/ig, function( all, letter ) {
					return letter.toUpperCase();
				});

			if ( camelPropertyName in style ) {
				supportedValue = propertyName;
			}
			else {
				// uppercase first char
				upperCamelPropertyName = camelPropertyName.slice(0,1).toUpperCase() + camelPropertyName.slice(1);
				while (i--) if ( prefixes[i] + upperCamelPropertyName in style ) {
					// convert MozBlah to -moz-blah
					supportedValue = (prefixes[i] + upperCamelPropertyName).replace( /([A-Z])/g, '-$1' ).toLowerCase();
					break;
				}
			}

			return cache[propertyName] = supportedValue;
		}
	})();*/
	
	$(window).bind('load', function() {
		// apply some bg images on-load to give priority to other images
		document.documentElement.className += ' on-load';
	});
})(window, document);