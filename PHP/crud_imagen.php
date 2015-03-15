<?php
	error_reporting(0);
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
		
		if ($accion == "query_imagenes") {
			$idGaleria = $_GET['idGaleria'];
			$sth = mysql_query("SELECT * from imagen where galeria_idGaleria=$idGaleria");
			$rows = array();
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "query_imagen" ) {
			$rows = array();
			$idImagen = $_GET['idImagen'];
			$sth = mysql_query("SELECT * from imagen WHERE idImagen = '$idImagen'")or $rows["error"] =mysql_error();
			
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if(isset($_GET['files'])) {  
			$error = false;
			$files = array();
			
			$result = mysql_query("SHOW TABLE STATUS LIKE 'imagen'");
			$row = mysql_fetch_array($result);
			$nextId = $row['Auto_increment'];
			
			if (isset( $_REQUEST['id'])){
				$nextId = $_REQUEST['id'];
			}
			if(!file_exists('./imagenes/')) {
				mkdir ('./imagenes/', 0777);
			} 
			if(!file_exists('./imagenes/'.$nextId)) {
				mkdir ('./imagenes/'.$nextId, 0777);
			} 
						
			$uploaddir = './imagenes/'.$nextId.'/';
			
			foreach($_FILES as $file) {
				$ext = explode (".",basename($file['name']));
				if(move_uploaded_file($file['tmp_name'], $uploaddir."imagen_img.".$ext[1])) {
					$files[] = '/imagenes/'.$nextId.'/'."imagen_img.".$ext[1];
				} else {
					$error = true;
				}
			}
			$data = ($error) ? array('error' => 'There was an error uploading your files') : array('files' => $files);
			echo json_encode($data);
		}
		
		if ($accion == "new_imagen") {
			$rows = array();
			
			$idGaleria = $_REQUEST['id'];
			$t_nombre = $_REQUEST['t_nombre'];
			$t_descripcion = $_REQUEST['t_descripcion'];
			
			if (isset($_REQUEST['filenames'])) {
				if  (isset($_REQUEST['filenames'][0])) {
					$t_img_path = $_REQUEST['filenames'][0];
				}
			} else {
				$t_img_path = "";
			}
			
			$result = mysql_query("SHOW TABLE STATUS LIKE 'imagen'");
			$row = mysql_fetch_array($result);
			$nextId = $row['Auto_increment'];
			
			$res = mysql_query("INSERT INTO imagen (img_nombre, img_descripcion, img_imagen, galeria_idGaleria)
				VALUES ('$t_nombre', '$t_descripcion', '$t_img_path', '$idGaleria') ") or $rows["error"] =mysql_error();

			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "update_imagen") {
			$rows = array();
			
			$t_nombre = $_REQUEST['t_nombre'];
			$t_descripcion = $_REQUEST['t_descripcion'];
			$imagenId = $_REQUEST['id']; 
			
			if (isset($_REQUEST['filenames'])) {
				if  (isset($_REQUEST['filenames'][0])) {
					$t_img_path = $_REQUEST['filenames'][0];
				}
			} else {
				$t_img_path = "";
			}
			
			$res = mysql_query("UPDATE imagen SET img_nombre='$t_nombre', img_descripcion='$t_descripcion', img_imagen= '$t_img_path' WHERE idImagen=$imagenId") or $rows["error"] =mysql_error();

			$rows["respuesta"] = "ok";
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "delete_imagen") {
			$rows = array();
			$imagenId = $_REQUEST['id']; 
			
			$res = mysql_query("DELETE FROM imagen WHERE idImagen=$imagenId") or $rows["error"] =mysql_error();

			$rows["respuesta"] = "ok";
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
	}
	mysql_close($enlace);
	$enlace = false;

?>