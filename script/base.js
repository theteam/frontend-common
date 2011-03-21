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

(function() {
	
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
})();