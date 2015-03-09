var mainloaded = false;
var text_ip = '';
var text_puerto = '';
var activeLugar;
var activeEvent;
var usu_perfil;

var files;

$(function() {
	security(); 
	$(document).on("pagehide", "div[data-role=page]", function(event){
		$(event.target).remove();
	});
	
	$('#btn-submit').bind('tap', function(e) {
		getIpPortserver();
	    activeEvent = window.localStorage.getItem('activeEvent');
	    
	    var accion = 'accion=resetpwd&evento=' + activeEvent + "&email=" + $('#txt-email').val();
	    
	    var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/login.php";
	    
	    $.ajax({
	        url: urlServer,
	        type: 'POST',
	        data: accion,
	        dataType: 'jsonp',
	        jsonp: 'jsoncallback',
	        success: function(data, textStatus, jqXHR) {
	        	if(typeof data.error === 'undefined') {
	        		alert("Un correo fue enviado con su nueva clave");
//	                window.history.back();
	        		window.location = "signin.html"; //"endpwdreset.html";
	        	} else {
	        		console.log('ERRORS: ' + data.error);
	        		alert("Message sent ERROR!");
	        	}
	        	
	        },
	        error: function(jqXHR, textStatus, errorThrown) {
	            console.log('ERRORS: ' + textStatus + jqXHR.responseText);
	            $.mobile.loading( "hide" );
	        },
	        beforeSend: function(){
	            showLoading();
	        },
	        complete: function() {
	        	$.mobile.loading( "hide" );
	        }
	    });
    });
	
	$('#btn-submit-newpwd').bind('tap', function(e) {
		getIpPortserver();
	    activeEvent = window.localStorage.getItem('activeEvent');
	    
	    var accion = 'accion=resetpwd&evento=' + activeEvent + "&tmppwd=" + $('#txt-tmp-password').val()
	    	+ "&newpwd=" + $('#txt-new-password').val();
	    
	    var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/login.php";
	    
	    $.ajax({
	        url: urlServer,
	        type: 'POST',
	        data: accion,
	        dataType: 'jsonp',
	        jsonp: 'jsoncallback',
	        success: function(data, textStatus, jqXHR) {
	        	if(typeof data.error === 'undefined') {
	        		alert("Mensaje enviado");
//	                window.history.back();
	        		window.location = "endpwdreset.html";
	        	} else {
	        		console.log('ERRORS: ' + data.error);
	        		alert("Message sent ERROR!");
	        	}
	        	
	        },
	        error: function(jqXHR, textStatus, errorThrown) {
	            console.log('ERRORS: ' + textStatus + jqXHR.responseText);
	            $.mobile.loading( "hide" );
	        },
	        complete: function() {
	        	$.mobile.loading( "hide" );
	        }
	    });
    });
});


function showLoading() {
    $.mobile.loading( "show", {
        text: 'Loading',
        textVisible: true,
        theme: 'b',
    });
}

function getIpPortserver() {
	text_ip = window.localStorage.getItem('text_ip');
    text_puerto = window.localStorage.getItem('text_puerto');
    
    if ($.isEmptyObject(text_puerto)) {
        text_puerto = "80";
    }
}

function security() {
	usu_perfil = window.localStorage.getItem('usu_perfil');
	
	if (!$.isEmptyObject(usu_perfil)) {
		
	}
}
