(function( $ ) {
	
	option_counter = 0
	opts = new Array();
	obj = new Array();
	objcounter = 0;
	
	$.fn.metroPopup = function(options) 
	{
		return this.each(function() 
		{
			opts[objcounter] = $.extend({}, $.fn.metroPopup.defaults, options);
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
	
	function setTable(is_default, id)
	{
		table = '';
		if(is_default)
		{
			table += '\
				<div id="mp-message-content-message"></div>\
				<div id="mp-message-content-buttons">\
					<div style="width:50%;" class="mp-message-content-buttons-button">\
						<a class="mp-overlayer_button" id="mp-overlayer-yes-button">\
            				' + opts[id].yes_text + '\
            				<input type="hidden" id="mp-overlayer-yes-button-id" />\
            			</a>\
					</div>\
					<div style="width:50%;" class="mp-message-content-buttons-button">\
						<a class="mp-overlayer_button" id="mp-overlayer-no-button">' + opts[id].no_text + '</a>\
						<div style="clear:both;"></div>\
					</div>\
				</div>\
			';
		}
		else {
			table += '\
					<div id="mp-message-content-message">' + singleCallOpts.message + '</div>\
					<div id="mp-message-content-buttons">\
				';
			width = (100 / $(singleCallOpts.buttons).length);
			for(i = 0; i < $(singleCallOpts.buttons).length; i++)
			{
				//button_id = singleCallOpts.buttons[i]['button_text'].replace(' ', '-');
				table += '\
					<div style="width:' + width + '%" class="mp-message-content-buttons-button">\
    					<a class="mp-overlayer_button" id="mp-overlayer-' + i + '-button"'; 
				
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
		$('#mp-overlayer #mp-message-table').html(table);
	}
	
	$(document).on("click", '#mp-overlayer #mp-overlayer-no-button', function(e){
		$.mpHide();
	});
	
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
