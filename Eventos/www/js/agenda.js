var text_ip = '';
var text_puerto = '';
var activeAgenda; //id del agenda seleccionado para ver detalles o edicion
var activeEvent; //id del evento seleccionado para ver detalles 
var activeEspacio;
var usu_perfil;
var idUsuario;

$(function() {
	security();
	$('#frm_new_agenda').on('submit', submitForm_newagenda);
	$(document).on("pagehide", "div[data-role=page]", function(event){
		$(event.target).remove();
	});
	$('#logout').bind('tap', function(e) {
		window.localStorage.setItem('usu_perfil', -1);
		window.localStorage.setItem('idUsuario', -1);
		window.location = "../index.html";
    });
});

function contains(a, b) {
	for(var i=0; i < a.length; i++) {
		if(a[i].getTime() == b.getTime()) {
			return true;
		}
	}
	return false;
}


$(document).on('pageinit','#page_r_espacio_agenda',function(e){
	activeEvent = window.localStorage.getItem('activeEvent');
	activeAgenda = localStorage.getItem('activeAgenda');
	
	getIpPortserver();
	var urlServer = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_agenda.php?jsoncallback=?";
	var httpImagen = "http://" + text_ip + ":" + text_puerto + "/web/eventos/";
    var output = "";
    var div_output= $('#listEspaciosAdd');

    $.ajax({
        url: urlServer,
        data: {
            'accion': 'query_espacios_to_add', 'idEvento': activeEvent, idAgenda: activeAgenda
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 6000,
        success: function(data, status){
        	div_output.empty();
        	
            $.each(data, function(i,item){
            	output = '<li id="r_espacio' + item.idEspacio + '" data-icon="plus"><a href="#">';
            	if (!$.isEmptyObject(item.esp_imagen)) {
            		output += '<img src="' + httpImagen + item.esp_imagen + '">';
            	}
        		output += '' + item.esp_nombre + '</a>';
				output += '</li>';
                div_output.append(output);
                div_output.listview("refresh");
				$('#r_espacio' + (item.idEspacio)).bind('tap', function(e) {
					$.ajax({
						url: urlServer,
						type: 'POST',
						data: {'accion': 'new_espacio_agenda', idEvento: activeEvent, idEspacio: item.idEspacio, idAgenda: activeAgenda},
						cache: false,
						dataType: 'jsonp',
						jsonp: 'jsoncallback',
						success: function(data, textStatus, jqXHR) {
							if(typeof data.error === 'undefined') {
								alert("Espacio agregado exitosamente");
//								location.reload();
								window.history.go(-1);
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
                });
            });
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

$(document).on('pageinit','#page_agenda',function(e) {
	window.localStorage.setItem('activeAgenda', -1);
	activeEvent = window.localStorage.getItem('activeEvent');
	getIpPortserver();
	var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_agenda.php?jsoncallback=?";
    var output = "";
    var output1 = "";
    
    var div_output= $('#listagenda');
    
    var weekday = new Array(7);
    weekday[6]=  "Domingo";
    weekday[0] = "Lunes";
    weekday[1] = "Martes";
    weekday[2] = "Miercoles";
    weekday[3] = "Jueves";
    weekday[4] = "Viernes";
    weekday[5] = "Sabado";

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
			var fechas = new Array();
			var countFechas = new Array();
			var tempData = data;
			$.each(tempData, function(i,item){
				var fecha = new Date(item.age_fecha);
				if (!contains(fechas,fecha)) {
					fechas.push(fecha); 
				}
			});
//			fechas.sort(); 
			for(var j=0; j < fechas.length; j++) {
				var tempData = data;
				var count = 0;
				$.each(tempData, function(i,item){
					var fecha = new Date(item.age_fecha);
					if (fecha.getDate() == fechas[j].getDate()) {
						count++;
					}
				});
				countFechas.push(count);
			}
            for(var j=0; j < fechas.length; j++) {
				tempDate = data;
				var barFecha = true;
				$.each(tempData, function(i,item) {
                	var fecha = new Date(item.age_fecha);
					output = "";
                	if (barFecha) {
						var fecha1 = fechas[j];
						var dia = weekday[fecha1.getDay()]; 
						var mes = month[fecha1.getMonth()];
						barFecha = false;
                		output1 = '<li data-role="list-divider">' + dia + ', ' + mes + ' ' + fecha1.getUTCDate() + ', ' + fecha1.getFullYear() + ' <span class="ui-li-count">' + countFechas[j] + '</span></li>';
						div_output.append(output1);
                	}
                	if (fechas[j].getTime() == fecha.getTime()) {
                		output = '<li id="' + i + 'agenda' + item.idAgenda + '"><a data-ajax="false" href="g_agenda_q.html">';
                    	output += '<h2>' + item.age_actividad + '</h2>';
                    	output += '<p><strong>' + ((item.esp_nombre == null)?"Sin espacio asignado":item.esp_nombre) + '</strong></p>';
                    	output += '<p>Hasta: ' + item.age_hora_fin + '</p>';
                    	output += '<p class="ui-li-aside"><strong>Desde: ' + item.age_hora_inicio + '</strong>PM</p>';
                    	output += '</a></li>';
						div_output.append(output);
						div_output.listview("refresh");
						$('#' + i + 'agenda' + item.idAgenda).bind('tap', function(e) {
							
							window.localStorage.setItem('activeAgenda', item.idAgenda);
						});
                	}
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
	activeEvent = localStorage.getItem('activeEvent');
	usu_perfil = window.localStorage.getItem('usu_perfil');
	idUsuario = window.localStorage.getItem('idUsuario');
	
	getIpPortserver();
	var archivoValidacion = "http://" + text_ip + ":" + text_puerto + "/web/eventos/crud_agenda.php?jsoncallback=?";
	var httpImagen = "http://" + text_ip + ":" + text_puerto + "/web/eventos/";
	var div_output = $('#agenda_content');
	var output;
	var capacidad = 0;
	var cupo = 0;
	
	$.ajax({
		url: archivoValidacion,
		type: 'POST',
		data: {'accion': 'query_usuario_agenda', idAgenda: activeAgenda, idUsuario: idUsuario},
		cache: false,
		dataType: 'jsonp',
		jsonp: 'jsoncallback',
		success: function(data, textStatus, jqXHR) {
			if(typeof data.error === 'undefined') {
				$.each(data, function(i,item){
					$('#btn_r_usuario').hide();
				});
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
	
    $.ajax({
        url: archivoValidacion,
        data: {
            'accion': 'query_agenda', idAgenda: activeAgenda
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 6000,
        success: function(data, status){
        	div_output.empty();
            $.each(data, function(i,item) {
				output = '<div class="ui-body ui-body-a ui-corner-all ">';
            	output += '<h1>' + item.age_actividad + '</h1>';
				output += '<span class="ui-btn-c ui-btn-icon-notext ui-icon-calendar" style="position:relative;padding-left:2em;" />  ' + item.age_fecha + ' ';
				output += '<span class="ui-btn-b ui-btn-icon-notext ui-icon-clock" style="position:relative;padding-left:2em;" /> ' + item.age_hora_inicio + ' ' + ' - ' + item.age_hora_fin + '';
				output += '</div>';
				
				if (!$.isEmptyObject(item.age_descripcion)) {
					output += '<br>';
					output += '<div class="ui-body ui-body-a ui-corner-all ">';
					output += '' + item.age_descripcion + '';
					output += '</div>';
				}
				output += '<div class="card-separator"></div>';
            });
			div_output.append(output);
			div_output.load();
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
    
    var list_output= $('#list_espacios');

    $.ajax({
        url: archivoValidacion,
        data: {
            'accion': 'query_r_espacios', 'idEvento': activeEvent, idAgenda: activeAgenda
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 6000,
        success: function(data, status){
        	list_output.empty();
        	
            if ($.isEmptyObject(data)) {
            	output = '<p>&nbsp; No se encontraron espacios relacionados</p>';
                list_output.append(output);
                list_output.load();
            }
            $.each(data, function(i,item){
            	$("#btn_r_espacio").hide();
            	output = '<li id="r_espacio' + item.idEspacio + '"><a data-ajax="false" href="g_espacio_q.html">';
            	if (!$.isEmptyObject(item.esp_imagen)) {
            		output += '<img src="' + httpImagen + item.esp_imagen + '">';
            	}
        		output += '<h2>' + item.esp_nombre + '</h2></a>';
        		if (!$.isEmptyObject(usu_perfil)) {
        			if (usu_perfil != -1 && usu_perfil != 3 && usu_perfil != 4) {
        				output += '<a id="delete_r_espacio' + item.idEspacio + '" href="#" >Elimina Relacion</a>';
        			}
        		}
        		capacidad = item.esp_capacidad;
				output += '</li>';
				list_output.append(output);
				list_output.listview("refresh");
				$('#r_espacio' + (item.idEspacio)).bind('tap', function(e) {
                	window.localStorage.setItem('activeEspacio', item.idEspacio);
                });
				$('#delete_r_espacio' + (item.idEspacio)).bind('tap', function(e) {
					$.ajax({
				        url: archivoValidacion,
				        data: {
				            accion: 'delete_r_espacio', idEvento: activeEvent, idEspacio: item.idEspacio, idAgenda: activeAgenda
				        },
				        dataType: 'jsonp',
				        jsonp: 'jsoncallback',
				        timeout: 6000,
				        success: function(data, status){
				        	alert("Se elimino relacion de espacio con agenda exitosamente");
				        	location.reload();
				        },
				        beforeSend: function(){
				            showLoading();
				        },
				        complete: function(){
				            $.mobile.loading( "hide" );
				        },
				        error: function(jqXHR, textStatus, errorThrown){
				        	console.log('ERRORS: ' + textStatus + " " + jqXHR.responseText);
				        	div_output.empty();
				            $.mobile.loading( "hide" );
				            alert('Error conectando al servidor.');
				        }
				    });
                });
            });
        },
        beforeSend: function(){
            showLoading();
        },
        complete: function(){
            $.mobile.loading( "hide" );
        },
        error: function(jqXHR, textStatus, errorThrown){
        	console.log('ERRORS: ' + textStatus + " " + jqXHR.responseText);
        	list_output.empty();
            $.mobile.loading( "hide" );
            alert('Error conectando al servidor.');
        }
    });
    
    //Relacion Usuarios
    var list_usuarios= $('#list_usuarios');

    $.ajax({
        url: archivoValidacion,
        data: {
            'accion': 'query_usuarios_agenda', idAgenda: activeAgenda
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        timeout: 6000,
        success: function(data, status){
        	list_usuarios.empty();
        	cupo = data.length;
        	$("#MyHeaderID ").text("Asistentes confirmados " + cupo + "/" + capacidad);
        	if (cupo == capacidad) {
        		$("#btn_r_usuario ").hide();
        	}
//        	$("#nro_asistentes").load();
            if ($.isEmptyObject(data)) {
            	output = '<p>&nbsp; No se encontraron usarios relacionados</p>';
                list_usuarios.append(output);
                list_usuarios.load();
            }
            $.each(data, function(i,item){
            	output = '<li id="r_usuario' + item.idUsuario + '"><a data-ajax="false" href="g_usuario_q.html">';
            	if (!$.isEmptyObject(item.usu_imagen)) {
            		output += '<img src="' + httpImagen + item.usu_imagen + '">';
            	}
        		output += '<h2>' + item.usu_nombre + ' ' + item.usu_apellido + '</h2></a>';
        		if (!$.isEmptyObject(usu_perfil)) {
        			if ((usu_perfil != -1 && usu_perfil != 3 &&  usu_perfil != 4) || idUsuario == item.idUsuario) {
        				output += '<a id="delete_r_usuario' + item.idUsuario + '" href="#" >Elimina Relacion</a>';
        			}
        		}
				output += '</li>';
				list_usuarios.append(output);
				list_usuarios.listview("refresh");
				$('#r_usuario' + (item.idUsuario)).bind('tap', function(e) {
                	window.localStorage.setItem('activeUsuario', item.idUsuario);
                });
				$('#delete_r_usuario' + (item.idUsuario)).bind('tap', function(e) {
					$.ajax({
				        url: archivoValidacion,
				        data: {
				            accion: 'delete_r_usuario', idUsuario: item.idUsuario, idAgenda: activeAgenda
				        },
				        dataType: 'jsonp',
				        jsonp: 'jsoncallback',
				        timeout: 6000,
				        success: function(data, status){
				        	alert("Se elimino relacion de usuario con agenda exitosamente");
				        	location.reload();
				        },
				        beforeSend: function(){
				            showLoading();
				        },
				        complete: function(){
				            $.mobile.loading( "hide" );
				        },
				        error: function(jqXHR, textStatus, errorThrown){
				        	console.log('ERRORS: ' + textStatus + " " + jqXHR.responseText);
				        	div_output.empty();
				            $.mobile.loading( "hide" );
				            alert('Error conectando al servidor.');
				        }
				    });
                });
            });
        },
        beforeSend: function(){
            showLoading();
        },
        complete: function(){
            $.mobile.loading( "hide" );
        },
        error: function(jqXHR, textStatus, errorThrown){
        	console.log('ERRORS: ' + textStatus + " " + jqXHR.responseText);
        	list_usuarios.empty();
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
    
    $('#btn_r_usuario').bind('tap', function(e) {
    	$.ajax({
            url: archivoValidacion,
            data: {
                'accion': 'r_usuario_agenda', idAgenda: activeAgenda, idUsuario: idUsuario
            },
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 6000,
            success: function(data, status){
            	if(typeof data.error === 'undefined') {
            		alert("Usuario agregado exitosamente");
            		$("#btn_r_usuario").hide();
            		location.reload();
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
		if (usu_perfil == -1) {
			$("#btn_menu_home").hide();
			$("#btn_new_agenda").hide();
			$("#btn_r_espacio").hide();
			$("#btnm_delete_agenda").hide();
			$("#btn_edit_agenda").hide();
		}
		if (usu_perfil == 3) {
			$("#btn_new_agenda").hide();
			$("#btn_r_espacio").hide();
			$("#btnm_delete_agenda").hide();
			$("#btn_edit_agenda").hide();
			
			$("#menu_invitado").hide();
			$("#menu_organizador").hide();
			$("#menu_coordinador").hide();
			$("#mnuComites").hide();
			$("#mnuEncuestas").hide();
			$("#mnuLugares").hide();
			$("#mnuPatrocinadores").hide();
			$("#mnuPublicaciones").hide();
			$("#mnuUsuarios").hide();
			$("#mnuInscripciones").hide();
		}
		if (usu_perfil == 4) {
			$("#btn_new_agenda").hide();
			$("#btn_r_espacio").hide();
			$("#btnm_delete_agenda").hide();
			$("#btn_edit_agenda").hide();
			
			$("#menu_invitado").hide();
			$("#menu_organizador").hide();
			$("#menu_coordinador").hide();
			$("#mnuComites").hide();
			$("#mnuEncuestas").hide();
			$("#mnuLugares").hide();
			$("#mnuPatrocinadores").hide();
			$("#mnuUsuarios").hide();
			$("#mnuInscripciones").hide();
		}
	}
}


