/*
---

name: CustomInput

license: MIT-style license.

copyright: Copyright (c) 2011 [Ryan Florence](http://ryanflorence.com/).

author: Ryan Florence

requires:
  - Core/Class.Extras
  - Core/Element.Event
  - More/Element.Position

provides: [CustomInput]

...
*/

(function (){
	var id = 0;
	function getId (){ return ++id; }
	function f () { return false; }

	var CustomInput = this.CustomInput = new Class({

		Implements: [Options, Events],

		options: {
			className: 'custom_input',
			position: true
		},

		sharedEvents: {},

		initialize: function (element, options){
			this.setOptions(options);
			this.element = document.id(element);

			['mousedown', 'mouseup', 'mouseenter', 'mouseleave', 'focus', 'blur', 'change'].each(function (event){
				this.sharedEvents[event] = this[event].bind(this);
			}, this);
			this.boundClick = this.click.bind(this);

			this.setupElement().createMask();

			this.element.store('custom_input', this);
		},

		setupElement: function (){
			if (this.element.getStyle('position') === 'static') this.element.setStyle('position', 'relative');
			this.element.setStyle('opacity', 0).setStyle('visibility', 'visible');
			this.element.addEvents(this.sharedEvents)
				.addEvent('click', this.boundClick)
				.addClass('custom_input_element ' + this.options.className + '_element');
			return this;
		},

		createMask: function (){
			var id = this.element.get('id') || this.makeId(),
				index = this.element.get('z-index');

			this.mask = new Element('label', {
				'for': id,
				'class': 'custom_input',
				styles: {
					MozUserSelect: 'none',
					WebkitUserSelect: 'none'
				}
			}).addClass(this.options.className);

			if (this.options.position) this.mask.position({
				relativeTo: this.element,
				position: 'upperLeft'
			});

			if (this.element.get('disabled')) this.mask.addClass('disabled');
			this.mask.inject(this.element, 'before');

			this.mask.onselectstart = this.ondragstart = f;

			document.getElements('label[for='+id+']').addEvents(this.sharedEvents);

			return this;
		},

		makeId: function (){
			var id = 'custom-element-id-' + getId();
			this.element.set('id', id);
			return id;
		},

		click: function (){
			this.mask.toggleClass('clicked');
		},

		mousedown: function (){
			this.mask.addClass('active');
		},

		mouseup: function (){
			this.mask.removeClass('active');
		},

		mouseenter: function (){
			this.mask.addClass('hover');
		},

		mouseleave: function (){
			this.mask.removeClass('hover');
		},

		focus: function (){
			this.mask.addClass('focus');
		},

		blur: function (){
			this.mask.removeClass('focus');
		},

		change: function (){}
	});

}).call(this);

Element.Properties.disabled = {
	set: function (value){
		this.disabled = value;
		var instance = this.retrieve('custom_input');
		if (!instance) return;
		instance.mask[(value ? 'add' : 'remove') + 'Class']('disabled');
	}, 
 
	get: function(){ 
		return this.disabled;
	}
};

