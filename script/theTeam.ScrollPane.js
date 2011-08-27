window.theTeam || (window.theTeam = {});

/*
	Takes an element and makes it able to animate from page to page horizontally.

	Requires $.fn.staticSize
	
	usage:
		var scrollPane = new theTeam.ScrollPane('#list-of-items', {
			margin: 10,
			duration: 250,
			easing: 'easeInOutQuint'
		});
	
	params:
		container - Element to scroll. First page elements should be visible and
		            positioned correctly with CSS. Other elements should be hidden
		options:
			margin - Margin in pixels between pages, can be negative, default: 0
			duration - Duration for the animation in ms, default: 500
			easing - Easing function, default: swing
			fade - fade during transition, default: false
			loop - default: Don't loop
						'item' - No gaps, 1st item will appear in the space after the last item
	
	properties:
		itemsPerPage - Number of items per page. This is equal to the number of
		               visible items when the pane is created
		busy - True while the pane is animating
		totalPages - Total number of pages
		currentPage - Current page number
	
	methods:
		changeTo(pageNum, opts) - Move to a particular page
			options:
				forward - true: Move new page in from the right, false: Move new page in from the left. Default: auto, depends on previous page
				
		next() - Move to the next page
		prev() - Move to the previous page
*/
theTeam.ScrollPane = (function() {
	function ScrollPane($itemContainer, opts) {
		$itemContainer = $($itemContainer);
		
		this._opts = $.extend({
			margin: 0,
			duration: 500,
			easing: 'swing',
			fade: false,
			loop: ''
		}, opts || {});
		
		this.currentPage = 1;
		this._$itemContainer = $itemContainer;
		this._$pane = $('<div class="scroll-pane" />').css({ overflow: 'hidden', position: 'relative', zoom: 1 }).insertBefore($itemContainer).append($itemContainer);
		this._$items = $itemContainer.children();
		this.itemsPerPage = getItemsPerPage(this._$items);
		this.totalPages = Math.ceil( this._$items.length / this.itemsPerPage );
		this._positions = []; // positions for each visible item in its 'visible' position. Array of {top, left}
		this._paneWidth = 0; // set correctly in _fixPositions
		this.busy = false; // Will be busy during animations
		
		this._fixPos();
	}
	var ScrollPaneProto = ScrollPane.prototype;
	
	// Make the visible items position: absolute & record their positions
	ScrollPaneProto._fixPos = function() {
		var scrollPane = this,
			itemWidth = scrollPane._$items.width(),
			$itemContainer = scrollPane._$itemContainer;
		
		// fix width and height of scroll pane
		$itemContainer.staticSize();
		scrollPane._$pane.width( $itemContainer.outerWidth() ).height( $itemContainer.outerHeight() );
		scrollPane._paneWidth = scrollPane._$pane.width();
		
		// this is an array rather than jq as for looping carousels, we may want to represent them in a different order to the DOM, & jq likes to reorder
		scrollPane._currentItems = scrollPane._$items.slice(0, scrollPane.itemsPerPage).each(function() {
			var $this = $(this),
				position = $this.position();
			
			scrollPane._positions.push(position);
			$this.css(position);
		}).toArray();
		
		scrollPane._$itemContainer.css({
			position: 'absolute',
			left: 0,
			top: 0,
			overflow: 'visible'
		});
		
		scrollPane._$items.css('position', 'absolute').width(itemWidth);
	}
	
	// Reset the positions for the current page
	ScrollPaneProto._resetPos = function() {
		var	scrollPane = this,
			currentItems = scrollPane._currentItems;
		
		scrollPane._$items.hide();
		$(currentItems).show();
		
		$.each(currentItems, function(i, elm) {
			elm.style.left = scrollPane._positions[i].left + 'px';
		});
		
		this._$itemContainer.css('left', 0);
	};
	
	ScrollPaneProto.changeTo = function(pageNum, opts) {
		if (pageNum === this.currentPage || this.busy) { return this; }
		
		opts = opts || {};
		
		var scrollPane = this,
			moveBack = 'forward' in opts ? !opts.forward : pageNum < scrollPane.currentPage,
			start = scrollPane.itemsPerPage * (pageNum - 1) % scrollPane._$items.length,
			nextItems = scrollPane._getNextItems(start);
		
		scrollPane._posForAnim(nextItems, moveBack);
		scrollPane.busy = true;
		
		scrollPane._$itemContainer.animate({
			left: (scrollPane._paneWidth + scrollPane._opts.margin) * (moveBack ? 1 : -1)
		}, {
			duration: scrollPane._opts.duration,
			easing: scrollPane._opts.easing,
			complete: function() {
				scrollPane.busy = false;
				scrollPane._resetPos();
			}
		});
		
		// fade in/out
		scrollPane._opts.fade && scrollPane._fadeItems(nextItems, scrollPane._currentItems);
		
		scrollPane.currentPage = pageNum;
		scrollPane._currentItems = nextItems;
		return this;
	};
	
	// returns array rather than jQuery, as jQuery forces DOM ordering, which breaks looping
	ScrollPaneProto._getNextItems = function(start) {
		// fix negatives
		if (start < 0) {
			start = this._$items.length + start;
		}
		
		// normalise for looping
		var itemsPerPage = this.itemsPerPage,
			nextItems = this._$items.slice(start, start + itemsPerPage).toArray(),
			gaps = itemsPerPage - nextItems.length;
		
		if (gaps && this._opts.loop == 'item') {
			nextItems = nextItems.concat( this._$items.toArray().slice(0, gaps) );
		}
		
		return nextItems;
	};
	
	ScrollPaneProto._fadeItems = function(nextItems, currentItems) {
		var duration = this._opts.duration,
			easing = this._opts.easing;
		
		$(nextItems).css('opacity', 0).animate({
			opacity: 1
		}, {
			duration: duration,
			easing: easing,
			complete: function() {
				$(this).css('filter', '');
			}
		});
		
		$(currentItems).animate({
			opacity: 0
		}, {
			duration: duration,
			easing: easing
		});
	};
	
	ScrollPaneProto.next = function() {
		if (
			this.busy ||
			// if there's no next page & we're not looping
			(!this._opts.loop && this.currentPage === this.totalPages)
		) { return this; }
		
		this.changeTo( this.currentPage + 1 );
		return this;
	};
	
	ScrollPaneProto.prev = function() {
		if (
			this.busy ||
			// if there's no next page & we're not looping
			(!this._opts.loop && this.currentPage === 1)
		) { return this; }
		this.changeTo( this.currentPage - 1 );
		return this;
	};
	
	ScrollPaneProto._posForAnim = function(nextItems, moveBack) {
		var scrollPane = this;
		
		$(nextItems).show();
		
		$.each(nextItems, function(i, elm) {
			var style = elm.style,
				pos = scrollPane._positions[i];
				
			style.top = pos.top + 'px';
			style.left = (scrollPane._paneWidth + scrollPane._opts.margin) * (moveBack ? -1 : 1) + pos.left + 'px';
		});
		
		$( nextItems[nextItems.length - 1] ).addClass('first');
	};
	
	function getItemsPerPage($children) {
		var itemsPerPage = 0;
		
		while ( $children.eq(itemsPerPage).is(':visible') ) {
			itemsPerPage++;
		}
		
		return itemsPerPage;
	}
	
	return ScrollPane;
})();