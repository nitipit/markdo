;((($, window, document, undefined) => {
  'use strict';

  Foundation.libs.accordion = {
    name : 'accordion',

    version : '5.0.3',

    settings : {
      active_class: 'active',
      toggleable: true
    },

    init(scope, method, options) {
      this.bindings(method, options);
    },

    events() {
      $(this.scope).off('.accordion').on('click.fndtn.accordion', '[data-accordion] > dd > a', function (e) {
        var accordion = $(this).parent();
        var target = $('#' + this.href.split('#')[1]);
        var siblings = $('> dd > .content', target.closest('[data-accordion]'));
        var settings = accordion.parent().data('accordion-init');
        var active = $('> dd > .content.' + settings.active_class, accordion.parent());

        e.preventDefault();

        if (active[0] == target[0] && settings.toggleable) {
          return target.toggleClass(settings.active_class);
        }

        siblings.removeClass(settings.active_class);
        target.addClass(settings.active_class);
      });
    },

    off() {},

    reflow() {}
  };
})(jQuery, this, this.document));
