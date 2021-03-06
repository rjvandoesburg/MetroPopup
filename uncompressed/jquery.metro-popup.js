(function( $ ) 
{	
	opts = new Array();
	obj = new Array();
	objcounter = 0;
	
	$.fn.metroPopup = function(options) 
	{
		return this.each(function() 
		{
			if(options != undefined)
			{				
				options = optionsLoop(options, $.fn.metroPopup.defaults);
			}
			else {
				options = $.extend(true, $.fn.metroPopup.defaults, options);
			}
			
			opts[objcounter] = options;
    		$(this).click(onClick);
    		$(this).attr('data-mpid', objcounter);
    		
    		createOverlayer(true);
    		
    		obj[objcounter] = this;

    		objcounter++;
		});
		
		function onClick(e) {
			e.preventDefault();
			id = $(this).attr('data-mpid');
			setTable(true, id);

			if($(this).attr('data-mpmessage') != undefined)
			{
				$('#mp-overlayer #mp-message-content-message').html($(this).attr('data-mpmessage'));
			}
			else {
				$('#mp-overlayer #mp-message-content-message').html('Are you sure you want to do this');
			}
			$('#mp-overlayer #mp-overlayer-yes-button-id').val($(this).attr('data-mpid'));
			
			$('#mp-overlayer').show();
			
			return false;
		}
	},
	
	$.metroPopup = function(options)
	{
		singleCallOpts = '';
		multiple_buttons = false;
		if($(options.buttons).length > 0)
		{
			for(var i = 0; i < $(options.buttons).length; i++)
			{				
				options.buttons[i] = optionsLoop(options.buttons[i], $.metroPopup.single.button);
			}
			console.log(options);
			singleCallOpts = options;
			multiple_buttons = true;
		}
		else {
			options = optionsLoop(options, $.metroPopup.single);
			singleCallOpts = options;
		}
		createOverlayer(false);
		setTable(false);
		
		$('#mp-overlayer').show();
	},
	$.mpHide = function()
	{
		/*
		 * function that can be called by the user to hide the pop-up
		 */
		$('#mp-overlayer').hide();
	};
	
	function optionsLoop(options, defaultOptions)
	{
		$.each(defaultOptions, function(parentKey, parentValue) {
			if($.isPlainObject(parentValue))
			{
				$.each(parentValue, function(childKey, childValue) {
					if(options[parentKey] == undefined)
					{
						options[parentKey] = parentValue;
					}
					
					if(options[parentKey][childKey] == undefined)
					{
						options[parentKey][childKey] = childValue;
					}
				});
			}
			else {
				if(options[parentKey] == undefined)
				{
					options[parentKey] = parentValue;
				}
			}
		});
		
		return options;
	}
	
	function createOverlayer(is_default)
	{
		append = '\
			<div id="mp-overlayer">\
    			<div id="mp-overlayer-background"></div>\
    			<div id="mp-overlayer-message">\
    				<div id="mp-message-content">\
    					<div id="mp-message-table">\
    						<div style="clear:both"></div>\
    					</div>\
    				</div>\
    			</div>\
    		</div>\
		';
		if($('body').children('#mp-overlayer').length == 0)
		{
			$('body').append(append);
		}
	}
	
	function setTable(is_default, id)
	{
		table = '';
		/*
		 * Check if it is a message box or a dialog box
		 */
		if(is_default)
		{
			/*
			 * Dialog box
			 */
			yes_style = opts[id].yes_color['style'];
			if(!check_style(yes_style))
			{
				yes_style = 'default';
			}
			
			yes_color = '';
			if(opts[id].yes_color['custom'] == true)
			{
				yes_color = 'style="\
					background-color:#' + opts[id].yes_color['background'] + ';\
					border-color:#' + opts[id].yes_color['border'] + ';\
					color:#' + opts[id].yes_color['text_color'] + ';\
				"';
				
				$(document).off('mouseenter', '#mp-overlayer #mp-overlayer-yes-button');
				$(document).off('mouseleave', '#mp-overlayer #mp-overlayer-yes-button');
				$(document).on({
    				mouseenter: function() {
    					$(this).css({'color': '#' + opts[id].yes_color['hover_text_color']});
    				},
    				mouseleave: function() {
    					$(this).css({'color': '#' + opts[id].yes_color['text_color']});
    				}
				},'#mp-overlayer #mp-overlayer-yes-button');
			}
			
			no_style = opts[id].no_color['style'];
			if(!check_style(no_style))
			{
				no_style = 'default';
			}
			
			no_color = '';
			if(opts[id].no_color['custom'] == true)
			{
				no_color = 'style="\
					background-color:#' + opts[id].no_color['background'] + ';\
					border-color:#' + opts[id].no_color['background'] + ';\
					color:#' + opts[id].no_color['text_color'] + ';\
				"';
				
				$(document).off('mouseenter', '#mp-overlayer #mp-overlayer-no-button');
				$(document).off('mouseleave', '#mp-overlayer #mp-overlayer-no-button');
				$(document).on({
    				mouseenter: function() {
    					$(this).css({'color': '#' + opts[id].no_color['hover_text_color']});
    				},
    				mouseleave: function() {
    					$(this).css({'color': '#' + opts[id].no_color['text_color']});
    				}
				},'#mp-overlayer #mp-overlayer-no-button');
			}
			
			table += '\
				<div id="mp-message-content-message"></div>\
				<div id="mp-message-content-buttons">\
					<div style="width:50%;" class="mp-message-content-buttons-button">\
						<a class="mp-overlayer_button_' + yes_style + '" ' + yes_color + ' id="mp-overlayer-yes-button">\
            				' + opts[id].yes_text + '\
            				<input type="hidden" id="mp-overlayer-yes-button-id" />\
            			</a>\
					</div>\
					<div style="width:50%;" class="mp-message-content-buttons-button">\
						<a class="mp-overlayer_button_' + no_style + '" ' + no_color + ' id="mp-overlayer-no-button">' + opts[id].no_text + '</a>\
						<div style="clear:both;"></div>\
					</div>\
				</div>\
			';
		}
		else {
			/*
			 * Message box
			 */
			table += '\
					<div id="mp-message-content-message">' + singleCallOpts.message + '</div>\
					<div id="mp-message-content-buttons">\
				';

			/*
			 * Check how many buttons the user wants to display
			 */
			if(multiple_buttons)
			{
				/*
				 * If user has specified to use more than 1 button
				 */
				width = (100 / $(singleCallOpts.buttons).length);
				for(var i = 0; i < $(singleCallOpts.buttons).length; i++)
				{
					style = singleCallOpts.buttons[i].color['style'];
					if(!check_style(style))
					{
						style = 'default';
					}
					
					color = '';
					if(singleCallOpts.buttons[i].color['custom'] == true)
					{
						color = 'style="\
							background-color:#' + singleCallOpts.buttons[i].color['background'] + ';\
							border-color:#' + singleCallOpts.buttons[i].color['border'] + ';\
							color:#' + singleCallOpts.buttons[i].color['text_color'] + ';\
						"';
						
						color_hover = singleCallOpts.buttons[i].color['hover_text_color'];
						color_normal = singleCallOpts.buttons[i].color['text_color'];
						$(document).off('mouseenter', '#mp-overlayer #mp-overlayer-' + i + '-button');
						$(document).off('mouseleave', '#mp-overlayer #mp-overlayer-' + i + '-button');
						$(document).on({
		    				mouseenter: function() {
		    					$(this).css({'color': '#' + color_hover});
		    				},
		    				mouseleave: function() {
		    					$(this).css({'color': '#' + color_normal});
		    				}
						},'#mp-overlayer #mp-overlayer-' + i + '-button');
					}
					
					table += '\
						<div style="width:' + width + '%" class="mp-message-content-buttons-button">\
	    					<a class="mp-overlayer_button_' + style + '" ' + color + ' id="mp-overlayer-' + i + '-button"'; 
					
					if(singleCallOpts.buttons[i]['action'] == undefined || singleCallOpts.buttons[i]['action'] == '')
					{
						$(document).off('click', '#mp-overlayer #mp-overlayer-' + i + '-button');
						$(document).on('click', '#mp-overlayer #mp-overlayer-' + i + '-button', function() {
							$.mpHide();
						});
					}
					else {
						action = singleCallOpts.buttons[i]['action'];
						
						$(document).off('click', '#mp-overlayer #mp-overlayer-' + i + '-button');
						$(document).on('click', '#mp-overlayer #mp-overlayer-' + i + '-button', function() {
							action();
							$.mpHide();
						});
					}
					table += '>\
							' + singleCallOpts.buttons[i]['button_text'] + '\
							</a>\
						</div>\
					';
				}
				table += '\
					<div style="clear:both;"></div>\
					</div>\
				';
			}
			else {
				/*
				 * If user has only specified 1 button
				 */
				style = singleCallOpts.button.color['style'];
				if(!check_style(style))
				{
					style = 'default';
				}
				
				color = '';
				if(singleCallOpts.button.color['custom'] == true)
				{
					/*
					 * Check if the user wants to use custom css settings via de plugin
					 */
					color = 'style="\
						background-color:#' + singleCallOpts.button.color['background'] + ';\
						border-color:#' + singleCallOpts.button.color['border'] + ';\
						color:#' + singleCallOpts.button.color['text_color'] + ';\
					"';
					
					color_hover = singleCallOpts.button.color['hover_text_color'];
					color_normal = singleCallOpts.button.color['text_color'];
					$(document).off('mouseenter', '#mp-overlayer #mp-overlayer-1-button');
					$(document).off('mouseleave', '#mp-overlayer #mp-overlayer-1-button');
					$(document).on({
	    				mouseenter: function() {
	    					$(this).css({'color': '#' + color_hover});
	    				},
	    				mouseleave: function() {
	    					$(this).css({'color': '#' + color_normal});
	    				}
					},'#mp-overlayer #mp-overlayer-1-button');
				}
				
				table += '\
					<div style="width:100%" class="mp-message-content-buttons-button">\
    					<a class="mp-overlayer_button_' + style + '" ' + color + ' id="mp-overlayer-1-button"'; 
				
				if(singleCallOpts.button['action'] == undefined || singleCallOpts.button['action'] == '')
				{
					/*
					 * Don't set an action if the user hasn't supplied one
					 */
					$(document).off('click', '#mp-overlayer #mp-overlayer-1-button');
					$(document).on('click', '#mp-overlayer #mp-overlayer-1-button', function() {
						$.mpHide();
					});
				}
				else {
					/*
					 * Set the custom action set by the user
					 */
					action = singleCallOpts.button['action'];
					
					$(document).off('click', '#mp-overlayer #mp-overlayer-1-button');
					$(document).on('click', '#mp-overlayer #mp-overlayer-1-button', function() {
						action();
						$.mpHide();
					});
				}
				table += '>\
						' + singleCallOpts.button['button_text'] + '\
						</a>\
					</div>\
				';
				
				table += '\
					<div style="clear:both;"></div>\
					</div>\
				';
			}
		}
		$('#mp-overlayer #mp-message-table').html(table);
	}

	/*
	 * Check if provided valid style
	 */
	function check_style(needle)
	{
		haystack = Array('default','red','orange', 'green');
		
        for (key in haystack) 
        {            
    		if (haystack[key] == needle) 
    		{
                	return true;
            }
        }
        
	    return false;
	}

	/*
	 * When pressed on default no button, hide the pop-up
	 */
	$(document).on("click", '#mp-overlayer #mp-overlayer-no-button', function(e){
		$.mpHide();
	});

	/*
	 * When pressed on default yes button, execute action
	 */
	$(document).on("click", '#mp-overlayer #mp-overlayer-yes-button', function(e){
		id = $('#mp-overlayer #mp-overlayer-yes-button-id').val();
		
		if($(obj[id]).prop('tagName') == 'A')
		{
			if($(obj[id]).attr('target') != undefined)
			{		
				window.open($(obj[id]).attr('href'), $(obj[id]).attr('target')); 
			}
			else {
				document.location = $(obj[id]).attr('href');
			}		
		}
		else if($(obj[id]).prop('tagName') == 'INPUT')
		{
			$(obj[id]).parents('form').submit();
		}
		
		$('#mp-overlayer').hide();
	});

	/*
	 * Default settings for the dialog box
	 */
	$.fn.metroPopup.defaults = {
		yes_text: 'Yes',
		yes_color: {
			style: 'default',
			custom: false,
			background: '81ADBC',
			border: '979797',
			text_color: 'FFFFFF',
			hover_text_color: '343434'
		},
		no_text: 'No',
		no_color: {
			style: 'default',
			custom: false,
			background: '81ADBC',
			border: '979797',
			text_color: 'FFFFFF',
			hover_text_color: '343434'
		}
	},

	/*
	 * Default settings for a single button
	 */
	$.metroPopup.single = {
		message: '',
		button: {
			button_text: 'Ok',
			action: '',
			color: {
				style: 'default',
				custom: false,
				background: '81ADBC',
				border: '979797',
				text_color: 'FFFFFF',
				hover_text_color: '343434'
			}
		}
	};
	
})( jQuery );
