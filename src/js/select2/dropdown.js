define([
  'jquery',
  './utils'
], function ($, Utils) {
  function Dropdown ($element, options) {
    this.$element = $element;
    this.options = options;

    Dropdown.__super__.constructor.call(this);
  }

  Utils.Extend(Dropdown, Utils.Observable);

	Dropdown.prototype.render = function () {
	    // TODO: Unrealiable selector
	    const select2id = $(this.$element[0]).attr('id');
	    const showSelectAll = !!this.options.get('showSelectAll');
	    const multiple = !!this.options.get('multiple');

	    let selectAllHTML = '';
	    if (multiple && showSelectAll) {
		selectAllHTML = '<div class="selectAll">' +
		    `<span data-s2-id="${select2id}" class="selectAll selectAll--selectable">Select All</span>` +
		    '</div>';
	    }

	    var $dropdown = $(
		'<span class="select2-dropdown">' +
		'<span class="select2-before__slot">' + selectAllHTML + '</span>' +
		'<span class="select2-results"></span>' +
		'<span class="select2-afer__slot"></span>' +
		'</span>'
	    );

	    $dropdown.attr('dir', this.options.get('dir'));

	    this.$dropdown = $dropdown;

	    return $dropdown;
	};

	Dropdown.prototype.bind = function () {
	    const showSelectAll = !!this.options.get('showSelectAll');
	    const multiple = !!this.options.get('multiple');
	    if (multiple && showSelectAll) {
		this.$dropdown.on('mouseup', '.select2-before__slot span.selectAll',
		    function (evt) {
			evt.preventDefault();
			// use checkbox status instead
			const s2id = $(this).data('s2-id');
			const $s2 = $(`select#${s2id}`);
			const s2 = document.querySelector(`select#${s2id}`);
			const selectedOptions = [...s2.selectedOptions].map(option => option.value);
			const optionSelector = document.getElementById(`select2-${s2id}-results`);
			const optionsWithData = [...optionSelector.childNodes].map(option => {
			    return $(option).data('data');
			});
			//console.log(optionsWithData);
			const $results = $(`ul#select2-${s2id}-results.select2-results__options`);

			// console.log('Select All is clicked');
			console.log('selectedOptions', selectedOptions);
			console.log('optionsWithData', optionsWithData);

			// use checkbox status instead
			let allSelected = this.classList.contains('selectAll--selected');

			if (allSelected) {
			    console.log('unselect all');
			    $s2.val(null).trigger('change.select2');
			    $(this).addClass('selectAll--selectable');
			    $(this).removeClass('selectAll--selected');
			    //$results.trigger('unselectAll', [optionsWithData]);
			} else {
			    console.log('select all');
			    $results.trigger('selectAll', [optionsWithData]);
			}
			$s2.trigger('change.select2');
		    });

		// TODO: bind on select / deselect events instead
		const s2id = this.$dropdown.find('.select2-before__slot span.selectAll').data('s2-id');
		const $s2 = $(`select#${s2id}`);

		// this.on('results:all', function (params) {
		//     console.log('results:all');
		// });
		$s2.on('change.select2', function (evt) {
		    console.log('s2 change');
		    const s2id = $(this).attr('id');
		    const s2 = this;
		    const selectedOptions = [...s2.selectedOptions].map(option => option.value);
		    const optionSelector = document.getElementById(`select2-${s2id}-results`);
		    if (!optionSelector) {
			return;
		    }
		    const optionsWithData = [...optionSelector.childNodes].map(option => {
			return $(option).data('data');
		    });

		    let allSelected = true;
		    for (let i = 0; i < optionsWithData.length; i++) {
			if (!selectedOptions.includes(optionsWithData[i].id)) {
			    allSelected = false;
			    break;
			}
			// if (optionsWithData[i].selected === undefined) {
			//     if (!selectedOptions.includes(optionsWithData[i].id)) {
			//         allSelected = false;
			//         break;
			//     }
			// } else {
			//     if (optionsWithData[i].selected === false) {
			//         allSelected = false;
			//         break;
			//     }
			// }
		    }

		    $selectAllButton = $('.select2-dropdown span.selectAll');
		    if (allSelected) {
			console.log('All Selected');
			$selectAllButton.addClass('selectAll--selected');
			$selectAllButton.removeClass('selectAll--selectable');
		    } else {
			console.log('Not All Selected');
			$selectAllButton.removeClass('selectAll--selected');
			$selectAllButton.addClass('selectAll--selectable');
		    }
		});
	    }
	};

  Dropdown.prototype.position = function ($dropdown, $container) {
    // Should be implmented in subclasses
  };

  Dropdown.prototype.destroy = function () {
    // Remove the dropdown from the DOM
    this.$dropdown.remove();
  };

  return Dropdown;
});
