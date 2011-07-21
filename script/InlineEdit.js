(function() {
	function InlineEdit( $container ) {
		$container = $( $container );
		var inlineEdit = this;
		
		$container.delegate('.inline-edit', 'focus', function() {
			inlineEdit._showEditorFor( $(this) );
		});
		
		$container.find('.inline-edit').prop('tabIndex', 0);
		this.$container = $container;
	}
	
	var InlineEditProto = InlineEdit.prototype = new scampCat.EventEmitter;
	
	InlineEditProto._showEditorFor = function( $elm ) {
		var	inlineEdit = this,
			initialVal,
			$inputElm = inlineEdit._createInput( $elm );
		
		function save() {
			var newVal = $inputElm.val();
			
			if (newVal === initialVal) {
				end();
			}
			else {
				$inputElm.hide();
				
				inlineEdit.saveValue( $elm, $inputElm.val() ).done(function(transformedVal) {
					$elm.html( transformedVal );
					end();
				});
			}
		}
		
		function end() {
			$elm.show();
			$inputElm.remove();
		}
		
		$elm.hide();
		
		inlineEdit.populateInput( $elm ).done(function(val) {
			initialVal = val;
			$inputElm.insertAfter( $elm ).val(val).focus();	
		});
		
		$inputElm.blur(save).keyup(function() {
			switch (event.keyCode) {
				case 13: // enter
					if ( $elm.data('editType') != 'textarea' ) {
						$inputElm.blur();
						event.preventDefault();
					}
					break;
				case 27: // esc
					end();
					event.preventDefault();
					break;
			}
		});
	};
	
	InlineEditProto._createInput = function( $elm ) {
		if ( $elm.data('editType') === 'textarea' ) {
			return $('<textarea/>');
		}
		return $('<input type="text" class="text" />');
	};
	
	InlineEditProto.populateInput = function( $elm ) {
		// this can be overwritten to change the input to something else
		var deferred = new $.Deferred;
		deferred.resolve( $elm.html() );
		return deferred.promise();
	};
	
	var $escapeElm = $('<b/>');
	InlineEditProto.saveValue = function( $elm, val ) {
		// this can be overwritten to change the ouput to something else
		var deferred = new $.Deferred;
		deferred.resolve( $escapeElm.text(val).html() );
		return deferred.promise();
	};
	
	scampCat.InlineEdit = InlineEdit;
})();