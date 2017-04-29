;((($, window, document, undefined) => {
  'use strict';

  Foundation.libs.magellan = {
    name : 'magellan',

    version : '5.0.3',

    settings : {
      active_class: 'active',
      threshold: 0
    },

    init(scope, method, options) {
      this.fixed_magellan = $("[data-magellan-expedition]");
      this.magellan_placeholder = $('<div></div>').css({
        height: this.fixed_magellan.outerHeight(true)
      }).hide().insertAfter(this.fixed_magellan);
      this.set_threshold();
      this.set_active_class(method);
      this.last_destination = $('[data-magellan-destination]').last();
      this.events();
    },

    events() {
      var self = this;

      $(this.scope)
        .off('.magellan')
        .on('arrival.fndtn.magellan', '[data-magellan-arrival]', function (e) {
        var $destination = $(this);
        var $expedition = $destination.closest('[data-magellan-expedition]');

        var active_class = $expedition.attr('data-magellan-active-class')
          || self.settings.active_class;

        $destination
          .closest('[data-magellan-expedition]')
          .find('[data-magellan-arrival]')
          .not($destination)
          .removeClass(active_class);
        $destination.addClass(active_class);
      });

      this.fixed_magellan
        .off('.magellan')
        .on('update-position.fndtn.magellan', function() {
          var $el = $(this);
        })
        .trigger('update-position');

      $(window)
        .off('.magellan')
        .on('resize.fndtn.magellan', () => {
          this.fixed_magellan.trigger('update-position');
        })
        .on('scroll.fndtn.magellan', () => {
          var windowScrollTop = $(window).scrollTop();
          self.fixed_magellan.each(function() {
            var $expedition = $(this);
            if (typeof $expedition.data('magellan-top-offset') === 'undefined') {
              $expedition.data('magellan-top-offset', $expedition.offset().top);
            }
            if (typeof $expedition.data('magellan-fixed-position') === 'undefined') {
              $expedition.data('magellan-fixed-position', false);
            }
            var fixed_position = (windowScrollTop + self.settings.threshold) > $expedition.data("magellan-top-offset");
            var attr = $expedition.attr('data-magellan-top-offset');

            if ($expedition.data("magellan-fixed-position") != fixed_position) {
              $expedition.data("magellan-fixed-position", fixed_position);
              if (fixed_position) {
                $expedition.addClass('fixed');
                $expedition.css({position:"fixed", top:0});
                self.magellan_placeholder.show();
              } else {
                $expedition.removeClass('fixed');
                $expedition.css({position:"", top:""});
                self.magellan_placeholder.hide();
              }
              if (fixed_position && typeof attr != 'undefined' && attr != false) {
                $expedition.css({position:"fixed", top:attr + "px"});
              }
            }
          });
        });


      if (this.last_destination.length > 0) {
        $(window).on('scroll.fndtn.magellan', e => {
          var windowScrollTop = $(window).scrollTop();
          var scrolltopPlusHeight = windowScrollTop + $(window).height();
          var lastDestinationTop = Math.ceil(self.last_destination.offset().top);

          $('[data-magellan-destination]').each(function () {
            var $destination = $(this);
            var destination_name = $destination.attr('data-magellan-destination');
            var topOffset = $destination.offset().top - $destination.outerHeight(true) - windowScrollTop;
            if (topOffset <= self.settings.threshold) {
              $("[data-magellan-arrival='" + destination_name + "']").trigger('arrival');
            }
            // In large screens we may hit the bottom of the page and dont reach the top of the last magellan-destination, so lets force it
            if (scrolltopPlusHeight >= $(self.scope).height() && lastDestinationTop > windowScrollTop && lastDestinationTop < scrolltopPlusHeight) {
              $('[data-magellan-arrival]').last().trigger('arrival');
            }
          });
        });
      }
    },

    set_threshold() {
      if (typeof this.settings.threshold !== 'number') {
        this.settings.threshold = (this.fixed_magellan.length > 0) ?
          this.fixed_magellan.outerHeight(true) : 0;
      }
    },

    set_active_class(options) {
      if (options && options.active_class && typeof options.active_class === 'string') {
        this.settings.active_class = options.active_class;
      }
    },

    off() {
      $(this.scope).off('.fndtn.magellan');
      $(window).off('.fndtn.magellan');
    },

    reflow() {}
  };
})(jQuery, this, this.document));
