var text_ip = '';
var text_puerto = '';
var activeAgenda; //id del agenda seleccionado para ver detalles o edicion
var activeEvent; //id del evento seleccionado para ver detalles 
var usu_perfil;

$(function() {
	security();
	$('#frm_new_agenda').on('submit', submitForm_newagenda);
});

$(document).on('pageinit','#page_agenda',function(e) {
	window.localStorage.setItem('activeAgenda', -1);
	activeEvent = window.localStorage.getItem('activeEvent');
	getIpPortserver();
	var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_agenda.php?jsoncallback=?";
    var output = "";
    var output1 = "";
    
    var div_output= $('#listagenda');
    
    var weekday = new Array(7);
    weekday[0]=  "Domingo";
    weekday[1] = "Lunes";
    weekday[2] = "Martes";
    weekday[3] = "Miercoles";
    weekday[4] = "Jueves";
    weekday[5] = "Viernes";
    weekday[6] = "Sabado";

    var month = new Array();
    month[0] = "Enero";
    month[1] = "Febrero";
    month[2] = "Marzo";
    month[3] = "Abril";
    month[4] = "Mayo";
    month[5] = "Junio";
    month[6] = "Julio";
    month[7] = "Agotos";
    month[8] = "Septiembre";
    month[9] = "Octubre";
    month[10] = "Noviembre";
    month[11] = "Diciembre";
    
    $.ajax({
        url: archivoValidacion,
        data: {
            'accion': 'query_agendas', 'idEvento': activeEvent
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 6000,
        success: function(data, status){
        	div_output.empty();
        	
            if ($.isEmptyObject(data)) {
            	output += '<div class="ui-body ui-body-a ui-corner-all ">';
            	output += '<p>No se encontraron registros en la Base de Datos para mostrar</p>';
                output += '</div>';
                div_output.append(output);
                div_output.load();
            }
            var repeat = true;
            var veces = 1;
            var date = null;
            while(repeat) {
            	veces--;
            	if (veces == 0) repeat = false;
            	
            	$.each(data, function(i,item){
            		var nodo = $( item );
                	var fecha = new Date(item.age_fecha);
                	var dia = weekday[fecha.getDay()]; 
                	var mes = month[fecha.getMonth()];
                	
                	if (date == null) { 
                		date = fecha;
                		output1 = '<li data-role="list-divider">' + dia + ', ' + mes + ' ' + fecha.getUTCDate() + ', ' + fecha.getFullYear() + ' <span class="ui-li-count">1</span></li>';
                	}
                	if (date.getTime() == fecha.getTime()) {
                		alert("fecha igual");
                		output = '<li id="agenda' + item.idAgenda + '"><a data-ajax="false" href="g_agenda_q.html">';
                    	output += '<h2>' + item.age_actividad + '</h2>';
                    	output += '<p><strong>' + ((item.esp_nombre == null)?"Sin espacio asignado":item.esp_nombre) + '</strong></p>';
                    	output += '<p>Hasta: ' + item.age_hora_fin + '</p>';
                    	output += '<p class="ui-li-aside"><strong>Desde: ' + item.age_hora_inicio + '</strong>PM</p>';
                    	output += '</a></li>';
                	} else {
                		alert("fecha diferente");
//                		veces++;
                		repeat = true;
                	}
                	if (!nodo.next() === 'undefined') {
                		repeat = true;
                		veces++;
                	}
                    div_output.append(output1);
                    div_output.append(output);
                    div_output.listview("refresh");
                    $('#agenda' + item.idAgenda).bind('tap', function(e) {
                    	window.localStorage.setItem('activeAgenda', item.idAgenda);
                    });
                });
            }
            
        },
        beforeSend: function(){
            showLoading();
        },
        complete: function(){
            $.mobile.loading( "hide" );
        },
        error: function(){
        	div_output.empty();
            $.mobile.loading( "hide" );
            alert('Error conectando al servidor.');
        }
    });
});

$(document).on('pageinit','#page_agenda_query',function(e){
	activeAgenda = localStorage.getItem('activeAgenda');
	getIpPortserver();
	var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_agenda.php?jsoncallback=?";

    $.ajax({
        url: archivoValidacion,
        data: {
            'accion': 'query_agenda', idAgenda: activeAgenda
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 6000,
        success: function(data, status){
        	$('#nombre').empty();
        	$('#descripcion').empty();
            $.each(data, function(i,item){
            	
            	$('#descripcion').append(item.age_descripcion);
            	$('#descripcion').load();
            });
        },
        beforeSend: function(){
            showLoading();
        },
        complete: function(){
            $.mobile.loading( "hide" );
        },
        error: function(){
        	$('#nombre').empty();
        	$('#descripcion').empty();
            $.mobile.loading( "hide" );
            alert('Error conectando al servidor.');
        }
    });
    
    $('#btn_delete_agenda').bind('tap', function(e) {
    	$.ajax({
            url: archivoValidacion,
            data: {
                'accion': 'delete_agenda', id: activeAgenda
            },
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 6000,
            success: function(data, status){
            	if(typeof data.error === 'undefined') {
            		alert("agenda eliminado exitosamente");
            		window.history.go(-2);
            	} else {
                    console.log('ERRORS: ' + data.error);
                }
            },
            beforeSend: function(){
                showLoading();
            },
            complete: function(){
                $.mobile.loading( "hide" );
            },
            error: function(){
                $.mobile.loading( "hide" );
                alert('Error conectando al servidor.');
            }
        });
    });
});

$(document).on('pageinit','#crud_agenda',function(e){
	activeAgenda = window.localStorage.getItem('activeAgenda');
	
	if (activeAgenda != -1) {
		getIpPortserver();
	    
	    var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_agenda.php?jsoncallback=?";
	    
	    $.ajax({
	        url: archivoValidacion,
	        data: {
	            'accion': 'query_agenda', 'idAgenda': activeAgenda
	        },
	        dataType: 'jsonp',
	        jsonp: 'jsoncallback',
	        timeout: 6000,
	        success: function(data, status){
		        if(typeof data.error === 'undefined') {
		        	$.each(data, function(i,item){ 
		        		$("#t_fecha").val(item.age_fecha);
		        		$("#t_hora_inicio").val(item.age_hora_inicio);
		        		$("#t_hora_fin").val(item.age_hora_fin);
		        		$("#t_actividad").val(item.age_actividad);		        		
		        		$("#t_descripcion").val(item.age_descripcion);
		        	});
	        	} else {
	                console.log('ERRORS: ' + data.error);
	            }
	        },
	        beforeSend: function(){
	            showLoading();
	        },
	        complete: function(){
	            $.mobile.loading("hide");
	        },
	        error: function(){
	            $.mobile.loading("hide");
	            alert('Error conectando al servidor.');
	        }
	    });
	}
});

function submitForm_newagenda(event) {
    activeAgenda = window.localStorage.getItem('activeAgenda');
    activeEvent = window.localStorage.getItem('activeEvent');
    var accion = '&accion=new_agenda&idEvento=' + activeEvent;
    if (activeAgenda != -1) { // valor -1 indica nuevo, valor diferente indica edicion
    	accion = '&accion=update_agenda&idAgenda='+ activeAgenda;
    }
    
    var formData = $('#frm_new_agenda').serialize() + accion;
    getIpPortserver();
    var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_agenda.php?jsoncallback=?";
    
    $.ajax({
        url: urlServer,
        type: 'POST',
        data: formData,
        cache: false,
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        success: function(data, textStatus, jqXHR) {
            if(typeof data.error === 'undefined') {
            	window.history.back();
            } else {
                console.log('ERRORS: ' + data.error);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('ERRORS: ' + textStatus);
            $.mobile.loading( "hide" );
        },
        complete: function() {
        	$.mobile.loading( "hide" );
        }
    });
    return false;
}

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
		if (usu_perfil != -1) {
			
		}
	}
}


