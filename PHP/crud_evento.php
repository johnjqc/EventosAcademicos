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
			
			$is_active = $_REQUEST['is_active']; 

			$result = mysql_query("SHOW TABLE STATUS LIKE 'evento'");
			$row = mysql_fetch_array($result);
			$nextId = $row['Auto_increment'];
			
			$res = mysql_query("INSERT INTO evento (eve_nombre, eve_fecha_inicio, eve_fecha_fin, eve_estado, eve_descripcion, eve_titulo_imagen, eve_imagen)
				VALUES ('$t_nombre', '$t_fecha_inicio', '$t_fecha_fin', '$is_active', '$t_descripcion', '$t_titulo_img', '$t_img_path') ") or $rows["respuesta"] =mysql_error();

			$rows["respuesta"] = "ok";
			$rows["id"] = "$nextId";
			$rows["name"] = $t_img_path;
			
			
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
			
			$is_active = $_REQUEST['is_active']; 

			$nextId = $_REQUEST['id']; 
			
			$res = mysql_query("UPDATE evento SET eve_nombre='$t_nombre', eve_fecha_inicio='$t_fecha_inicio', eve_fecha_fin='$t_fecha_fin', eve_estado='$is_active', eve_descripcion='$t_descripcion', eve_titulo_imagen='$t_titulo_img', eve_imagen='$t_img_path' WHERE idEvento=$nextId") or $rows["respuesta"] =mysql_error();

			$rows["respuesta"] = "ok";
			$rows["id"] = "$nextId";
			$rows["name"] = $t_img_path;
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
	}
	mysql_close($enlace);
	$enlace = false;

?>