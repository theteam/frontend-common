(function($) {
	/*
		Show/hide elements based on the selected state of form field(s).
		
		You must hide the toggled form fields initially via CSS, so they aren't
		visible as the page is loading.
		
		// show #extra-fields when .my-checkbox is checked
		$('.my-checkbox').toggleField('#extra-fields');
		
		// show $( $('.my-checkbox').data('toggle') ) when .my-checkbox is checked
		$('.my-checkbox').toggleField();
		
		// For <select> elements, the value of data-toggle on the selected option is shown
		$('select').toggleField();
	*/
	
	function handleSelect( $input ) {
		$input.find('option').each(function() {
			var $option = $(this),
				selector = $option.data('toggle');
			
			syncRelated( this, selector );
		});
	}
	
	function handleInput( $allOfName ) {
		var name = $allOfName.prop('name');
		
		if ( name && $allOfName.is(':radio') ) {
			$allOfName = $( $allOfName.closest('form').prop( name ) );
		}
		
		$allOfName.each(function() {
			var $input = $(this),
				selector = $input.data('toggle');
			
			syncRelated( this, selector );
		});
	}
	
	function syncRelated( input, toSync ) {
		if ( !toSync ) { return; }
		
		if ( input.checked || input.selected ) {
			$( toSync ).css('display', 'block');
		}
		else {
			$( toSync ).css('display', '');
		}
	}
	
	function fieldChange() {
		var $input = $(this);
		
		// Special behaviour for <select> elements
		if (this.nodeName.toLowerCase() == 'select') {
			handleSelect( $input );
		}
		// else it's pretty simple...
		else {
			handleInput( $input );
		}
	}
	
	$.fn.toggleField = function(toToggle) {
		this.each(function() {
			var $elm = $(this),
				$allOfName = $elm,
				name = $elm.prop('name');
			
			toToggle && $elm.data('toggle', toToggle);
			
			if ( name && $allOfName.is(':radio') ) {
				$allOfName = $( $allOfName.closest('form').prop( name ) );
			}
			
			// Process initially selected inputs and child options
			$elm.find('option:selected').andSelf().each(function() {
				syncRelated( this, toToggle || $(this).data('toggle') );
			});
			
			// Add change event, unless we're already listening
			$allOfName.filter(function() {
				return !$(this).data('toggleEventSet');
			}).data('toggleEventSet', true).change(fieldChange);
			
			
		})
	};
})(jQuery);