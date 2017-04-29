;((($, window, document, undefined) => {
  'use strict';

  Foundation.libs.tooltip = {
    name : 'tooltip',

    version : '5.0.3',

    settings : {
      additional_inheritable_classes : [],
      tooltip_class : '.tooltip',
      append_to: 'body',
      touch_close_text: 'Tap To Close',
      disable_for_touch: false,
      tip_template(selector, content) {
        return '<span data-selector="' + selector + '" class="' 
          + Foundation.libs.tooltip.settings.tooltip_class.substring(1) 
          + '">' + content + '<span class="nub"></span></span>';
      }
    },

    cache : {},

    init(scope, method, options) {
      this.bindings(method, options);
    },

    events() {
      var self = this;

      if (Modernizr.touch) {
        $(this.scope)
          .off('.tooltip')
          .on('click.fndtn.tooltip touchstart.fndtn.tooltip touchend.fndtn.tooltip', 
            '[data-tooltip]', function (e) {
            var settings = $.extend({}, self.settings, self.data_options($(this)));
            if (!settings.disable_for_touch) {
              e.preventDefault();
              $(settings.tooltip_class).hide();
              self.showOrCreateTip($(this));
            }
          })
          .on('click.fndtn.tooltip touchstart.fndtn.tooltip touchend.fndtn.tooltip', 
            this.settings.tooltip_class, function (e) {
            e.preventDefault();
            $(this).fadeOut(150);
          });
      } else {
        $(this.scope)
          .off('.tooltip')
          .on('mouseenter.fndtn.tooltip mouseleave.fndtn.tooltip', 
            '[data-tooltip]', function (e) {
            var $this = $(this);

            if (/enter|over/i.test(e.type)) {
              self.showOrCreateTip($this);
            } else if (e.type === 'mouseout' || e.type === 'mouseleave') {
              self.hide($this);
            }
          });
      }
    },

    showOrCreateTip($target) {
      var $tip = this.getTip($target);

      if ($tip && $tip.length > 0) {
        return this.show($target);
      }

      return this.create($target);
    },

    getTip($target) {
      var selector = this.selector($target);
      var tip = null;

      if (selector) {
        tip = $('span[data-selector="' + selector + '"]' + this.settings.tooltip_class);
      }

      return (typeof tip === 'object') ? tip : false;
    },

    selector($target) {
      var id = $target.attr('id');
      var dataSelector = $target.attr('data-tooltip') || $target.attr('data-selector');

      if ((id && id.length < 1 || !id) && typeof dataSelector != 'string') {
        dataSelector = 'tooltip' + Math.random().toString(36).substring(7);
        $target.attr('data-selector', dataSelector);
      }

      return (id && id.length > 0) ? id : dataSelector;
    },

    create($target) {
      var $tip = $(this.settings.tip_template(this.selector($target), $('<div></div>').html($target.attr('title')).html()));
      var classes = this.inheritable_classes($target);

      $tip.addClass(classes).appendTo(this.settings.append_to);
      if (Modernizr.touch) {
        $tip.append('<span class="tap-to-close">'+this.settings.touch_close_text+'</span>');
      }
      $target.removeAttr('title').attr('title','');
      this.show($target);
    },

    reposition(target, tip, classes) {
      var width;
      var nub;
      var nubHeight;
      var nubWidth;
      var column;
      var objPos;

      tip.css('visibility', 'hidden').show();

      width = target.data('width');
      nub = tip.children('.nub');
      nubHeight = nub.outerHeight();
      nubWidth = nub.outerHeight();

      tip.css({'width' : (width) ? width : 'auto'});

      objPos = (obj, top, right, bottom, left, width) => obj.css({
        'top' : (top) ? top : 'auto',
        'bottom' : (bottom) ? bottom : 'auto',
        'left' : (left) ? left : 'auto',
        'right' : (right) ? right : 'auto'
      }).end();

      objPos(tip, (target.offset().top + target.outerHeight() + 10), 'auto', 'auto', target.offset().left);

      if (this.small()) {
        objPos(tip, (target.offset().top + target.outerHeight() + 10), 'auto', 'auto', 12.5, $(this.scope).width());
        tip.addClass('tip-override');
        objPos(nub, -nubHeight, 'auto', 'auto', target.offset().left);
      } else {
        var left = target.offset().left;
        if (Foundation.rtl) {
          left = target.offset().left + target.offset().width - tip.outerWidth();
        }
        objPos(tip, (target.offset().top + target.outerHeight() + 10), 'auto', 'auto', left);
        tip.removeClass('tip-override');
        if (classes && classes.indexOf('tip-top') > -1) {
          objPos(tip, (target.offset().top - tip.outerHeight() - 10), 'auto', 'auto', left)
            .removeClass('tip-override');
        } else if (classes && classes.indexOf('tip-left') > -1) {
          objPos(tip, (target.offset().top + (target.outerHeight() / 2) - (tip.outerHeight() / 2)), 'auto', 'auto', (target.offset().left - tip.outerWidth() - nubHeight))
            .removeClass('tip-override');
        } else if (classes && classes.indexOf('tip-right') > -1) {
          objPos(tip, (target.offset().top + (target.outerHeight() / 2) - (tip.outerHeight() / 2)), 'auto', 'auto', (target.offset().left + target.outerWidth() + nubHeight))
            .removeClass('tip-override');
        }
      }

      tip.css('visibility', 'visible').hide();
    },

    small() {
      return matchMedia(Foundation.media_queries.small).matches;
    },

    inheritable_classes(target) {
      var inheritables = ['tip-top', 'tip-left', 'tip-bottom', 'tip-right', 'noradius'].concat(this.settings.additional_inheritable_classes);
      var classes = target.attr('class');

      var filtered = classes ? $.map(classes.split(' '), (el, i) => {
        if ($.inArray(el, inheritables) !== -1) {
          return el;
        }
      }).join(' ') : '';

      return $.trim(filtered);
    },

    show($target) {
      var $tip = this.getTip($target);

      this.reposition($target, $tip, $target.attr('class'));
      $tip.fadeIn(150);
    },

    hide($target) {
      var $tip = this.getTip($target);

      $tip.fadeOut(150);
    },

    // deprecate reload
    reload() {
      var $self = $(this);

      return ($self.data('fndtn-tooltips')) ? $self.foundationTooltips('destroy').foundationTooltips('init') : $self.foundationTooltips('init');
    },

    off() {
      $(this.scope).off('.fndtn.tooltip');
      $(this.settings.tooltip_class).each(function (i) {
        $('[data-tooltip]').get(i).attr('title', $(this).text());
      }).remove();
    },

    reflow() {}
  };
})(jQuery, this, this.document));
