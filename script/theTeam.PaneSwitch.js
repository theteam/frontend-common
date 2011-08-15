(function() {
	function PaneSwitch(opts) {
		this.$container = $('<div class=""/>').css({
			overflow: 'hidden',
			zoom: '1',
			position: 'relative'
		});
		
		this._opts = $.extend({
			easing: 'swing',
			duration: 500
		}, opts || {});
		
		this.pages = [];
		// properties that don't need initialised...
		// this.$currentPage 
	}
	
	var PaneSwitchProto = PaneSwitch.prototype;
	
	PaneSwitchProto.addPage = function($page) {
		$page = $($page).appendTo( this.$container ).css({
			overflow: 'hidden',
			zoom: 1
		});
		
		this.pages.push($page);
		
		if (this.pages.length === 1) {
			$page.css({
				display: 'block'
			});
			this.$currentPage = $page;
		}
		else {
			$page.css({
				display: 'none',
				opacity: 0
			});
		}
		return this;
	};
	
	PaneSwitchProto.gotoPage = function(index) {
		var $container = this.$container,
			$currentPage = this.$currentPage,
			$nextPage = this.pages[index],
			animOpts = this._opts;
			
		if ($currentPage === $nextPage || !$currentPage || !$nextPage) {
			// exit if switching to same page, or nextpage/currentpage doesn't exist
			return this;
		}
		
		// static height
		$container.height( $container.height() );
		
		$currentPage.add( $nextPage ).css({
			position: 'absolute',
			bottom: 0,
			left: 0,
			display: 'block',
			width: '100%'
		});
		
		$nextPage.stop(true).animate({
			opacity: 1
		}, $.extend({ complete: function() {
			$nextPage.css({
				position: 'relative',
				opacity: '',
				filter: '',
				width: ''
			});
		}}, animOpts));
		
		$currentPage.stop(true).animate({
			opacity: 0
		}, animOpts);
		
		$container.stop(true).animate({
			height: $nextPage.height()
		}, $.extend({ complete: function() {
			$currentPage.css('display', 'none');
			$container.height('auto');
		}}, animOpts));
		
		this.$currentPage = $nextPage;
		return this;
	};
	
	theTeam.PaneSwitch = PaneSwitch;
})();