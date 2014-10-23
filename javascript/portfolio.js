var portfolio = {

	init: function() {

		setTimeout(function() {
			$("body").addClass("is-loaded");
		}, 50);

		$(window).scroll(
			$.throttle(150, portfolio.ui.checkVisibility)
		);

		$(".icon--scroll-down").on("click", function() {
			$("html, body").animate({
				scrollTop: $(".project").first().offset().top
			}, 1000);
		});

	},

	ui: {

		checkVisibility: function() {

			$(".showcase").each(function() {

				var $this = $(this);

				if (!$this.hasClass("is-visible")) {

					if (portfolio.ui.isInViewport(this)) {
						$this.addClass("is-visible");
					}

				}

			});

		},

		isInViewport: function (element) {

			var rect = element.getBoundingClientRect();

			return (rect.top >= 0 && rect.left >= 0 && rect.top <= (window.innerHeight || document.documentElement.clientHeight));

		}

	}

}

$(function() {

	portfolio.init();

});
