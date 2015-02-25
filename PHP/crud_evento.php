<?php

	include 'database.php';

	header('Content-type: application/json');
	header('Access-Control-Allow-Origin: *'); 

	$enlace =  mysql_connect($ip_db, $user_db, $pwd_db, $db_name);
	if (!$enlace) {
		die('No pudo conectarse: ');
	}else {
		mysql_select_db($db_name, $enlace) or die('Could not select database.');
		
		$accion = $_GET['accion'];
		$data = array();
		$rows = array();
		
		if ($accion == "queryEventos") {
			$sth = mysql_query("SELECT * from evento ");
			$rows = array();
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "queryEvento" ) {
			$evento = $_GET['evento'];
			$sth = mysql_query("SELECT * from evento WHERE idEvento = '$evento'") or $rows["error"] =mysql_error();
			$rows = array();
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "query_subscribir_evento") {
			$rows = array();
			
			$idEvento = $_REQUEST['idEvento'];
			$idComite = $_REQUEST['idUsuario'];
			
			$sth = mysql_query("SELECT * FROM usuario_has_evento WHERE usuario_idUsuario= '$idUsuario' and evento_idEvento='$idEvento'") or $rows["error"] =mysql_error();
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "query_mis_eventos") {
			$idUsuario = $_GET['idUsuario'];
			$sth = mysql_query("SELECT * FROM evento a JOIN usuario_has_evento b ON b.usuario_idUsuario = $idUsuario 
								AND evento_idEvento = a.idEvento AND estado = 'activo'");
			$rows = array();
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if(isset($_GET['files'])) {  
			$error = false;
			$files = array();
			
			$result = mysql_query("SHOW TABLE STATUS LIKE 'evento'");
			$row = mysql_fetch_array($result);
			$nextId = $row['Auto_increment'];
			
			if (isset( $_REQUEST['id'])){
				$nextId = $_REQUEST['id'];
			}
			if(!file_exists('./eventos/')) {
				mkdir ('./eventos/', 0777);
			} 
			if(!file_exists('./eventos/'.$nextId)) {
				mkdir ('./eventos/'.$nextId, 0777);
			} 
						
			$uploaddir = './eventos/'.$nextId.'/';
			
			foreach($_FILES as $file) {
				$ext = explode (".",basename($file['name']));
				if(move_uploaded_file($file['tmp_name'], $uploaddir."evento_img.".$ext[1])) {
					$files[] = '/eventos/'.$nextId.'/'."evento_img.".$ext[1];
				} else {
					$error = true;
				}
			}
			$data = ($error) ? array('error' => 'There was an error uploading your files') : array('files' => $files);
			echo json_encode($data);
		} 
		
		if ($accion == "new_evento") {
			$rows = array();
			
			$t_nombre = $_REQUEST['t_nombre'];
			$t_fecha_inicio = $_REQUEST['t_fecha_inicio']; 
			$t_fecha_fin = $_REQUEST['t_fecha_fin']; 
			$t_descripcion = $_REQUEST['t_descripcion'];
			$t_titulo_img = $_REQUEST['t_titulo_img'];
			if (isset($_REQUEST['filenames'])) {
				if  (isset($_REQUEST['filenames'][0])) {
					$t_img_path = $_REQUEST['filenames'][0];
				}
			} else {
				$t_img_path = "";
			}
			
			$t_temas = $_REQUEST['t_temas']; 
			$t_costos = $_REQUEST['t_costos']; 
			$t_tipo = $_REQUEST['t_tipo']; 
			$t_fecha_articulos = $_REQUEST['t_fecha_articulos']; 
			$t_pagina = $_REQUEST['t_pagina']; 
			$t_facebook = $_REQUEST['t_facebook']; 
			$t_twitter= $_REQUEST['t_twitter']; 
			
			
			$result = mysql_query("SHOW TABLE STATUS LIKE 'evento'");
			$row = mysql_fetch_array($result);
			$nextId = $row['Auto_increment'];
			
			$res = mysql_query("INSERT INTO evento (eve_nombre, eve_fecha_inicio, eve_fecha_fin, eve_descripcion, eve_titulo_imagen, eve_imagen, eve_temas, eve_costos, eve_tipo, eve_recepcion_articulos, eve_pagina_web, eve_facebook, eve_twitter)
				VALUES ('$t_nombre', '$t_fecha_inicio', '$t_fecha_fin', '$t_descripcion', '$t_titulo_img', '$t_img_path', '$t_temas'
						, '$t_costos', $t_tipo, '$t_fecha_articulos', '$t_pagina', '$t_facebook', '$t_twitter') ") or $rows["respuesta"] =mysql_error();

			$rows["respuesta"] = "ok";
			$rows["id"] = "$nextId";
			$rows["name"] = $t_img_path;
			
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "subscribir_evento") {
			$rows = array();
			
			$idEvento = $_REQUEST['idEvento'];
			$idComite = $_REQUEST['idUsuario'];
			
			$res = mysql_query("INSERT INTO usuario_has_evento ( usuario_idUsuario, evento_idEvento, estado)
				VALUES ('$idUsuario', '$idEvento', 'pendiente') ") or $rows["error"] =mysql_error();
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "update_evento") {
			$rows = array();
			
			$t_nombre = $_REQUEST['t_nombre'];
			$t_fecha_inicio = $_REQUEST['t_fecha_inicio']; 
			$t_fecha_fin = $_REQUEST['t_fecha_fin']; 
			$t_descripcion = $_REQUEST['t_descripcion'];
			$t_titulo_img = $_REQUEST['t_titulo_img'];
			if (isset($_REQUEST['filenames'])) {
				if  (isset($_REQUEST['filenames'][0])) {
					$t_img_path = $_REQUEST['filenames'][0];
				}
			} else {
				$t_img_path = "";
			}
			
			$t_temas = $_REQUEST['t_temas']; 
			$t_costos = $_REQUEST['t_costos']; 
			$t_tipo = $_REQUEST['t_tipo']; 
			$t_fecha_articulos = $_REQUEST['t_fecha_articulos']; 
			$t_pagina = $_REQUEST['t_pagina']; 
			$t_facebook = $_REQUEST['t_facebook']; 
			$t_twitter= $_REQUEST['t_twitter']; 

			$nextId = $_REQUEST['id']; 
			
			$res = mysql_query("UPDATE evento SET eve_nombre='$t_nombre', eve_fecha_inicio='$t_fecha_inicio', eve_fecha_fin='$t_fecha_fin', eve_descripcion='$t_descripcion', eve_titulo_imagen='$t_titulo_img', eve_imagen='$t_img_path', 
			eve_temas='$t_temas', eve_costos='$t_costos', eve_tipo= '$t_tipo', eve_recepcion_articulos='$t_fecha_articulos', eve_pagina_web='$t_pagina', 
			eve_facebook='$t_facebook', eve_twitter='$t_twitter' WHERE idEvento=$nextId") or $rows["respuesta"] =mysql_error();

			$rows["respuesta"] = "ok";
			$rows["id"] = "$nextId";
			$rows["name"] = $t_img_path;
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "delete_evento") {
			$rows = array();
			$idEvento = $_REQUEST['idEvento'];
			
			$res = mysql_query("DELETE FROM evento WHERE idEvento='$idEvento'") or $rows["error"] =mysql_error();

			$rows["respuesta"] = "ok";
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
	}
	mysql_close($enlace);
	$enlace = false;

?>