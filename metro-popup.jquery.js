(function( $ ) {
	$.fn.metroPopup = function(options) 
	{
		opts = $.extend({}, $.fn.metroPopup.defaults, options);
		counter = 0;
		obj = new Array();
		
		return this.each(function() 
		{
    		$(this).click(onClick);
    		$(this).attr('data-mpid', counter);
    		
    		createOverlayer(true);
    		
    		obj[counter] = this;

			counter++;
		});
		
		function onClick(e) {
			e.preventDefault();
			setTable(true);
			$('#mp-overlayer #mp-message-content-message').html($(this).attr('data-mpmessage'));
			$('#mp-overlayer #mp-overlayer-yes-button-id').val($(this).attr('data-mpid'));
			
			$('#mp-overlayer').show();
			
			return false;
		}
	};
	
	$.metroPopup = function(options){
		singleCallOpts = $.extend({}, $.metroPopup.defaults, options);
		
		createOverlayer(false);
		setTable(false);
		
		$('#mp-overlayer').show();
	}
	
	$.mpHide = function()
	{
		$('#mp-overlayer').hide();
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
	
	function setTable(is_default)
	{
		table = '';
		if(is_default)
		{
			table += '\
				<div id="mp-message-content-message"></div>\
				<div id="mp-message-content-buttons">\
					<div class="mp-message-content-buttons-button">\
						<a class="mp-overlayer_button" id="mp-overlayer-yes-button">\
            				' + opts.yes_text + '\
            				<input type="hidden" id="mp-overlayer-yes-button-id" />\
            			</a>\
					</div>\
					<div class="mp-message-content-buttons-button">\
						<a class="mp-overlayer_button" id="mp-overlayer-no-button">' + opts.no_text + '</a>\
					</div>\
				</div>\
			';
		}
		else {
			table += '\
					<div id="mp-message-content-message">' + singleCallOpts.message + '</div>\
					<div id="mp-message-content-buttons">\
				';
			for(i = 0; i < $(singleCallOpts.buttons).length; i++)
			{
				button_id = singleCallOpts.buttons[i]['button_text'].replace(' ', '-');
				table += '\
					<div class="mp-message-content-buttons-button">\
    					<a class="mp-overlayer_button" id="mp-overlayer-' + button_id + '-button"'; 
				
				if(singleCallOpts.buttons[i]['action'] == undefined || singleCallOpts.buttons[i]['action'] == '')
				{
					$(document).off('click', '#mp-overlayer #mp-overlayer-' + button_id + '-button');
					$(document).on('click', '#mp-overlayer #mp-overlayer-' + button_id + '-button', function() {
						$.mpHide();
					});
				}
				else {
					action = singleCallOpts.buttons[i]['action'];
					
					$(document).off('click', '#mp-overlayer #mp-overlayer-' + button_id + '-button');
					$(document).on('click', '#mp-overlayer #mp-overlayer-' + button_id + '-button', function() {
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
				</div>\
			';
		}
		$('#mp-overlayer #mp-message-table').html(table);
	}
	
	$(document).on("click", '#mp-overlayer #mp-overlayer-no-button', function(e){
		$('#mp-overlayer').hide();
	});
	
	$(document).on("click", '#mp-overlayer #mp-overlayer-yes-button', function(e){
		id = $('#mp-overlayer #mp-overlayer-yes-button-id').val();
		
		if($(obj[id]).prop('tagName') == 'A')
		{
			document.location = $(obj[id]).attr('href');
		}
		else if($(obj[id]).prop('tagName') == 'INPUT')
		{
			$(obj[id]).parents('form').submit();
		}
		
		$('#mp-overlayer').hide();
	});
	
	$.fn.metroPopup.defaults = {
		yes_text: 'Yes',
		no_text: 'No'
	}
	
	$.metroPopup.defaults = {
		buttons: [{
			button_text: 'Ok',
			action: ''
		}],
		message: ''
	}
	
})( jQuery );
