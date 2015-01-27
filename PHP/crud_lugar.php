<?php

	include 'database.php';

	header('Content-type: application/json');
	header('Access-Control-Allow-Origin: *'); 

	$enlace =  mysql_connect($ip_db, $user_db, $pwd_db, $db_name);
	if (!$enlace) {
		die('No pudo conectarse: ');
	}else {
		mysql_select_db($db_name, $enlace) or die('Could not select database.');
		
		if (isset($_GET['accion'])) {
			$accion = $_GET['accion'];
		} else {
			$accion = "empty";
		}
		
		$data = array();
		$rows = array();
		
		if ($accion == "query_lugares") {
			$sth = mysql_query("SELECT * from lugar ");
			$rows = array();
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "query_lugar" ) {
			$idLugar = $_GET['idLugar'];
			$sth = mysql_query("SELECT * from lugar WHERE idLugar = '$idLugar'");
			$rows = array();
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "query_lugar_to_add") {
			$rows = array();
			$idEvento = $_GET['idEvento'];
			$sth = mysql_query("SELECT * FROM lugar a where a.idLugar not in (select lugar_idLugar from lugar_has_evento where evento_idEvento = '$idEvento')") or $rows["error"] =mysql_error();
			
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if(isset($_GET['files'])) {  
			$error = false;
			$files = array();
			
			$result = mysql_query("SHOW TABLE STATUS LIKE 'lugar'");
			$row = mysql_fetch_array($result);
			$nextId = $row['Auto_increment'];
			
			if (isset( $_REQUEST['idLugar'])){
				$nextId = $_REQUEST['idLugar'];
			}
			if(!file_exists('./lugares/')) {
				mkdir ('./lugares/', 0777);
			}
			if(!file_exists('./lugares/'.$nextId)) {
				mkdir ('./lugares/'.$nextId, 0777);
			} 
						
			$uploaddir = './lugares/'.$nextId.'/';
			
			foreach($_FILES as $file) {
				$ext = explode (".",basename($file['name']));
				if(move_uploaded_file($file['tmp_name'], $uploaddir."lugar_img.".$ext[1])) {
					$files[] = '/lugares/'.$nextId.'/'."lugar_img.".$ext[1];
				} else {
					$error = true;
				}
			}
			$data = ($error) ? array('error' => 'There was an error uploading your files') : array('files' => $files);
			echo json_encode($data);
		} 
		
		if ($accion == "new_lugar") {
			$rows = array();
			
			$t_nombre = $_REQUEST['t_nombre'];
			$t_descripcion = $_REQUEST['t_descripcion'];
			$t_direccion = $_REQUEST['t_direccion'];
			$t_latitud = $_REQUEST['t_latitud'];
			$t_longitud = $_REQUEST['t_longitud'];
			
			if (isset($_REQUEST['filenames'])) {
				if  (isset($_REQUEST['filenames'][0])) {
					$t_img_path = $_REQUEST['filenames'][0];
				}
			} else {
				$t_img_path = "";
			}
			
			$result = mysql_query("SHOW TABLE STATUS LIKE 'lugar'");
			$row = mysql_fetch_array($result);
			$nextId = $row['Auto_increment'];
			
			$res = mysql_query("INSERT INTO lugar (lug_nombre, lug_descripcion, lug_imagen, lug_direccion, lug_latitud, lug_longitud)
				VALUES ('$t_nombre', '$t_descripcion', '$t_img_path', '$t_direccion', '$t_latitud', '$t_longitud') ") or $rows["error"] =mysql_error();

			$rows["respuesta"] = "ok";
			$rows["id"] = "$nextId";
			$rows["name"] = $t_img_path;
			
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "update_lugar") {
			$rows = array();
			
			$t_nombre = $_REQUEST['t_nombre'];
			$t_descripcion = $_REQUEST['t_descripcion'];
			$t_direccion = $_REQUEST['t_direccion'];
			$t_latitud = $_REQUEST['t_latitud'];
			$t_longitud = $_REQUEST['t_longitud'];
			
			if (isset($_REQUEST['filenames'])) {
				if  (isset($_REQUEST['filenames'][0])) {
					$t_img_path = $_REQUEST['filenames'][0];
				}
			} else {
				$t_img_path = "";
			}
						
			$nextId = $_REQUEST['idLugar']; 
			
			$res = mysql_query("UPDATE lugar SET lug_nombre='$t_nombre', lug_descripcion='$t_descripcion', lug_imagen='$t_img_path', lug_direccion='$t_direccion', lug_latitud='$t_latitud', lug_longitud='$t_longitud' WHERE idLugar=$nextId") or $rows["error"] =mysql_error();

			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "delete_lugar") {
			$rows = array();
			$idLugar = $_REQUEST['idLugar'];
			
			$res = mysql_query("DELETE FROM lugar WHERE idLugar='$idLugar'") or $rows["error"] =mysql_error();

			$rows["respuesta"] = "ok";
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
	}
	mysql_close($enlace);
	$enlace = false;

?>