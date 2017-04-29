/*jslint unparam: true, browser: true, indent: 2 */
;((($, window, document, undefined) => {
  'use strict';

  Foundation.libs.tab = {
    name : 'tab',

    version : '5.0.3',

    settings : {
      active_class: 'active',
      callback() {}
    },

    init(scope, method, options) {
      this.bindings(method, options);
    },

    events() {
      $(this.scope).off('.tab').on('click.fndtn.tab', '[data-tab] > dd > a', function (e) {
        e.preventDefault();

        var tab = $(this).parent();
        var tabs = tab.closest('[data-tab]');
        var target = $('#' + this.href.split('#')[1]);
        var siblings = tab.siblings();
        var settings = tabs.data('tab-init');

        // allow usage of data-tab-content attribute instead of href
        if ($(this).data('tab-content')) {
          target = $('#' + $(this).data('tab-content').split('#')[1]);
        }

        tab.addClass(settings.active_class).trigger('opened');
        siblings.removeClass(settings.active_class);
        target.siblings().removeClass(settings.active_class).end().addClass(settings.active_class);
        settings.callback(tab);
        tabs.trigger('toggled', [tab]);
      });
    },

    off() {},

    reflow() {}
  };
})(jQuery, this, this.document));
