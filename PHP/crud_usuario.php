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
		
		if ($accion == "query_usuarios") {
			$sth = mysql_query("SELECT * from usuario");
			$rows = array();
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "query_usuario" ) {
			$idUsuario = $_GET['idUsuario'];
			$sth = mysql_query("SELECT * from usuario WHERE idUsuario = '$idUsuario'");
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
			
			$result = mysql_query("SHOW TABLE STATUS LIKE 'usuario'");
			$row = mysql_fetch_array($result);
			$nextId = $row['Auto_increment'];
			
			if (isset( $_REQUEST['idUsuario'])){
				$nextId = $_REQUEST['idUsuario'];
			}
			if(!file_exists('./usuarios/')) {
				mkdir ('./usuarios/', 0777);
			}
			if(!file_exists('./usuarios/'.$nextId)) {
				mkdir ('./usuarios/'.$nextId, 0777);
			} 
						
			$uploaddir = './usuarios/'.$nextId.'/';
			
			foreach($_FILES as $file) {
				$ext = explode (".",basename($file['name']));
				if(move_uploaded_file($file['tmp_name'], $uploaddir."usuario_img.".$ext[1])) {
					$files[] = '/usuarios/'.$nextId.'/'."usuario_img.".$ext[1];
				} else {
					$error = true;
				}
			}
			$data = ($error) ? array('error' => 'There was an error uploading your files') : array('files' => $files);
			echo json_encode($data);
		} 
		
		if ($accion == "new_usuario") {
			$rows = array();
			
			$t_identificacion = $_REQUEST['t_identificacion'];
			$t_nombre = $_REQUEST['t_nombre'];
			$t_apellido = $_REQUEST['t_apellido'];
			$t_nacionalidad = $_REQUEST['t_nacionalidad'];
			$t_email = $_REQUEST['t_email'];
			$t_telefono = $_REQUEST['t_telefono'];
			$t_contrasena = $_REQUEST['t_contrasena'];
			$t_perfil = $_REQUEST['t_perfil'];
			$t_estado = $_REQUEST['t_estado'];
			$t_institucion = $_REQUEST['t_institucion'];
			$t_nivel_academico = $_REQUEST['t_nivel_academico'];
			$t_biografia = $_REQUEST['t_biografia'];
			$t_profesion = $_REQUEST['t_profesion'];
			
			if (isset($_REQUEST['filenames'])) {
				if  (isset($_REQUEST['filenames'][0])) {
					$t_archivo_path = $_REQUEST['filenames'][0];
				}
			} else {
				$t_archivo_path = "";
			}
			
			$result = mysql_query("SHOW TABLE STATUS LIKE 'usuario'");
			$row = mysql_fetch_array($result);
			$nextId = $row['Auto_increment'];
			
			$res = mysql_query("INSERT INTO usuario (usu_identificacion ,usu_nombre ,usu_apellido ,usu_nacionalidad ,usu_email ,usu_telefono ,usu_contrasena ,usu_imagen ,usu_perfil ,usu_estado ,usu_institucion ,usu_nivel_academico ,usu_biografia ,usu_profesion) VALUES ('$t_identificacion', '$t_nombre', '$t_apellido', '$t_nacionalidad', '$t_email', '$t_telefono', '$t_contrasena', '$t_archivo_path' ,'$t_perfil', '$t_estado', '$t_institucion', '$t_nivel_academico', '$t_biografia', '$t_profesion') ") or $rows["error"] =mysql_error();
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "update_usuario") {
			$rows = array();
			
			$t_identificacion = $_REQUEST['t_identificacion'];
			$t_nombre = $_REQUEST['t_nombre'];
			$t_apellido = $_REQUEST['t_apellido'];
			$t_nacionalidad = $_REQUEST['t_nacionalidad'];
			$t_email = $_REQUEST['t_email'];
			$t_telefono = $_REQUEST['t_telefono'];
			$t_contrasena = $_REQUEST['t_contrasena'];
			$t_perfil = $_REQUEST['t_perfil'];
			$t_estado = $_REQUEST['t_estado'];
			$t_institucion = $_REQUEST['t_institucion'];
			$t_nivel_academico = $_REQUEST['t_nivel_academico'];
			$t_biografia = $_REQUEST['t_biografia'];
			$t_profesion = $_REQUEST['t_profesion'];
			
			if (isset($_REQUEST['filenames'])) {
				if  (isset($_REQUEST['filenames'][0])) {
					$t_archivo_path = $_REQUEST['filenames'][0];
				}
			} else {
				$t_archivo_path = "";
			}
						
			$nextId = $_REQUEST['idUsuario']; 
			
			$res = mysql_query("UPDATE usuario SET usu_identificacion='$t_identificacion' ,usu_nombre='$t_nombre' ,usu_apellido='$t_apellido' ,usu_nacionalidad='$t_nacionalidad' ,usu_email='$t_email' ,usu_telefono='$t_telefono' ,usu_contrasena='$t_contrasena' ,usu_imagen='$t_archivo_path' ,usu_perfil='$t_perfil' ,usu_estado='$t_estado' ,usu_institucion='$t_institucion' ,usu_nivel_academico='$t_nivel_academico' ,usu_biografia='$t_biografia' ,usu_profesion='$t_profesion' WHERE idUsuario=$nextId") or $rows["error"] =mysql_error();

			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "delete_usuario") {
			$rows = array();
			$idUsuario = $_REQUEST['idUsuario'];
			
			$res = mysql_query("DELETE FROM usuario WHERE idUsuario='$idUsuario'") or $rows["error"] =mysql_error();

			$rows["respuesta"] = "ok";
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
	}
	mysql_close($enlace);
	$enlace = false;

?>