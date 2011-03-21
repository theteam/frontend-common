window.theTeam || (window.theTeam = {});

/*
	usage:
		var pagination = new theTeam.Pagination($element, 5, opts).bind('change', function(event) {
			// ...
		});
	
	params:
		target - $element to insert pagination container into
		pages - Number of pages to cater for
		options:
			prevNext - Add previous and next links to the start and end of the pagination
		
	properties:
		$container - <ol> container
		current - Current page number
		
	methods:
		totalPages() - Get total number of pages
		totalPages(num, initialPage) - Rebuild the page numbers for a new total
		changeTo(num [, preventChangeEvent]) - Change the page number, optionally supress the 'change' event
		next() - Go to the next page, does nothing if there's no next page
		prev() - Go to the previous page, does nothing if there's no previous page
		
	events:
		change - Fired when the page is changed. Return false to prevent UI updating.
			event.from - page moving from
			event.to - page moving to
*/
theTeam.Pagination = (function() {
	function Pagination(container, pages, opts) {
		var pagination = this;
		
		pagination._$ = $(this);
		pagination._opts = opts || {};
		
		pagination._$container = $('<ol class="pagination"></ol>').delegate('a', 'click', function() {
			var num = parseFloat(this.innerHTML) || this.parentNode.className;
			
			switch (num) {
				case 'next':
					pagination.next();
					break;
				case 'prev':
					pagination.prev();
					break;
				case 'next-set':
					pagination.changeTo( pagination._end + 1 );
					break;
				case 'prev-set':
					pagination.changeTo( pagination._start - 1 );
					break;
				default:
					pagination.changeTo(num);
					break;
			}
			
			return false;
		}).appendTo(container);
		
		pagination.totalPages(pages, 1);
	}
	var PaginationProto = Pagination.prototype;
	
	PaginationProto.bind = function(name, func) {
		this._$.bind(name, func);
		return this;
	};
	PaginationProto.trigger = function(name, props) {
		var event = $.extend( new $.Event(name), props );
		this._$.trigger(event);
		return event;
	};
	PaginationProto.totalPages = function(newTotal, initial) {
		if (newTotal === undefined) {
			return this._totalPages;
		}
		if (newTotal !== this._totalPages) {	
			this._buildListItems(newTotal, initial);
		}
		
		this.current = 0;
		this._totalPages = newTotal;
		this.changeTo(initial, true);
		return this;
	};
	PaginationProto._buildListItems = function(newTotal, targetPage) {
		var htmlStr = '',
			start = this._start = Math.floor( (targetPage - 1) / 10) * 10 + 1,
			end = this._end = Math.min(start + 9, newTotal);
		
		if (newTotal > 1) {				
			if (newTotal > 10 && start > 1) {
				htmlStr += '<li class="prev-set"><a href="#">Pages ' + (start - 10) + '-' + (start - 1) + '</a></li>';
			}
			
			if (this._opts.prevNext) {
				htmlStr += '<li class="prev"><a href="#">Previous</a></li>';
			}
			
			for (var i = start; i <= end; i++) {
				htmlStr += '<li class="num"><a href="#">' + i + '</a></li>';
			}
			
			if (this._opts.prevNext) {
				htmlStr += '<li class="next"><a href="#">Next</a></li>';
			}
			
			if (newTotal > 10 && end !== newTotal) {
				htmlStr += '<li class="next-set"><a href="#">Pages ' + (start + 10) + '-' + Math.min(end + 10, newTotal) + '</a></li>';
			}
		}
		
		this._$container.html(htmlStr);
		return this;
	}
	PaginationProto.changeTo = function(num, preventFire) {
		if (this.current === num) { return this; }
		
		// going to another page set?
		if (num > this._end || num < this._start) {
			this._buildListItems(this._totalPages, num);
		}
		
		if (!preventFire) {
			var event = this.trigger('change', {
				from: this.current,
				to: num
			});
			if ( event.isDefaultPrevented() ) { return this; }
		}
		
		this._$container.children('.num').removeClass('active').eq(num - this._start).addClass('active');
		
		this.current = +num;
		return this;
	};
	PaginationProto.next = function() {
		var newPage = this.current + 1;
		if (newPage <= this._totalPages) {
			this.changeTo(newPage);
		}
		return this;
	};
	PaginationProto.prev = function() {
		var newPage = this.current - 1;
		if (newPage > 0) {
			this.changeTo(newPage);
		}
		return this;
	};

	return Pagination;
})();