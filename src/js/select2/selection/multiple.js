define([
  'jquery',
  './base',
  '../utils'
], function ($, BaseSelection, Utils) {
  function MultipleSelection ($element, options) {
    MultipleSelection.__super__.constructor.apply(this, arguments);
  }

  Utils.Extend(MultipleSelection, BaseSelection);

	MultipleSelection.prototype.render = function () {
	    var $selection = MultipleSelection.__super__.render.call(this);
	    const showOther = !!this.options.get('showOther');
	    const maxRenderedTagCount = this.options.get('maxRenderedTagCount') ? this.options.get('maxRenderedTagCount') -1 : 4;

	    $selection.addClass('select2-selection--multiple');

	    if (showOther) {
		if(this.$element.find('option').length > maxRenderedTagCount) {
		    $selection.html(
			'<span class="select2-selection__clearAll">✖</span>' +
			'<ul class="select2-selection__rendered"></ul>'
		    );
		} else {
		    $selection.html(
			'<span class="select2-selection__clearAll hidden">✖</span>' +
			'<ul class="select2-selection__rendered"></ul>'
		    );
		}
	    } else {
		$selection.html(
		    '<ul class="select2-selection__rendered"></ul>'
		);
	    }


	    return $selection;
	};

  MultipleSelection.prototype.bind = function (container, $container) {
    var self = this;

    MultipleSelection.__super__.bind.apply(this, arguments);

    this.$selection.on('click', function (evt) {
      self.trigger('toggle', {
        originalEvent: evt
      });
    });

    this.$selection.on(
      'click',
      '.select2-selection__choice__remove',
      function (evt) {
        // Ignore the event if it is disabled
        if (self.options.get('disabled')) {
          return;
        }

        var $remove = $(this);
        var $selection = $remove.parent();

        var data = $selection.data('data');

        self.trigger('unselect', {
          originalEvent: evt,
          data: data
        });
      }
    );

	this.$selection.on(
	'click',
	'.select2-selection__clearAll',
	function (evt) {
	    evt.preventDefault()
	    self.$element.val(null).trigger('change');
	    $(this).addClass('hidden');
	}
	);
  };

  MultipleSelection.prototype.clear = function () {
    this.$selection.find('.select2-selection__rendered').empty();
  };

  MultipleSelection.prototype.display = function (data, container) {
    var template = this.options.get('templateSelection');
    var escapeMarkup = this.options.get('escapeMarkup');

    return escapeMarkup(template(data, container));
  };

  MultipleSelection.prototype.selectionContainer = function () {
    var $container = $(
      '<li class="select2-selection__choice">' +
        '<span class="select2-selection__choice__remove" role="presentation">' +
          '&times;' +
        '</span>' +
      '</li>'
    );

    return $container;
  };

	MultipleSelection.prototype.update = function (data) {
	    const maxRenderedTagCount = this.options.get('maxRenderedTagCount') ? this.options.get('maxRenderedTagCount') -1 : false;
	    const showOther = !!this.options.get('showOther');
	    this.clear();

	    if (data.length === 0) {
		return;
	    }

	    var $selections = [];

	    for (var d = 0; d < data.length; d++) {
		if (maxRenderedTagCount && d > maxRenderedTagCount) {
		    break;
		}
		var selection = data[d];

		var $selection = this.selectionContainer();
		var formatted = this.display(selection, $selection);

		$selection.append(formatted);
		$selection.prop('title', selection.title || selection.text);

		$selection.data('data', selection);

		$selections.push($selection);
	    }

	    var $rendered = this.$selection.find('.select2-selection__rendered');


	    // if (showOther) {
	    //
	    // }

	    if (maxRenderedTagCount && data.length > maxRenderedTagCount) {
		let more = data.length // - maxRenderedTagCount;
		if (showOther) {
		    Utils.appendMany($rendered, $selections);
		    more = more - maxRenderedTagCount - 1;
		    $rendered.append(
			`<li class="select2-selection__choice select2-selection__choice--more" title="More">+${more} others</li>`
			//     `<li class="select2-selection__choice" title="Selected"><span class="select2-selection__clearAllTag select2-selection__clearAll" >×</span>${more} selected</li>`
		    );
		} else {
		    $rendered.append(
			//    `<li class="select2-selection__choice select2-selection__choice--more select2-selection__clearAll" title="More">✖ ${more} selected</li>`
			`<li class="select2-selection__choice" title="Selected"><span class="select2-selection__clearAllTag select2-selection__clearAll" >×</span>${more} selected</li>`
		    );
		}
		this.$selection.find('.select2-selection__clearAll').removeClass('hidden');
	    } else {
		this.$selection.find('.select2-selection__clearAll').addClass('hidden');
		Utils.appendMany($rendered, $selections);
	    }
	};

  return MultipleSelection;
});
