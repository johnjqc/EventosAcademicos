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
		$idLugar = $_REQUEST['idLugar'];
		$data = array();
		$rows = array();
		
		if ($accion == "query_publicaciones") {
			$idUsuario = $_REQUEST['idUsuario'];
			$usu_perfil = $_REQUEST['usu_perfil'];
			$sql = "";
			if ($usu_perfil == "1") {
				$sql = "SELECT * from publicacion";
			} else {
				$sql = "SELECT * from publicacion WHERE usuario_idUsuario= $idUsuario";
			}
			$rows = array();
			$sth = mysql_query($sql) or $rows["error"] =mysql_error();
			
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "query_publicacion" ) {
			$idPublicacion = $_GET['idPublicacion'];
			$rows = array();
			$sth = mysql_query("SELECT * from publicacion WHERE idPublicacion = '$idPublicacion'") or $rows["error"] =mysql_error();
			
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "query_r_publicaciones") {
			$rows = array();
			$idEvento = $_REQUEST['idEvento'];
			$idUsuario = $_REQUEST['idUsuario'];
			$sth = mysql_query("SELECT * FROM publicacion a WHERE a.evento_idEvento = $idEvento") or $rows["error"] =mysql_error();
			
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "query_publicacion_to_add") {
			$rows = array();
			$idEvento = $_GET['idEvento'];
			$idUsuario = $_REQUEST['idUsuario'];
			$usu_perfil = $_REQUEST['usu_perfil'];
			
			$sql = "";
			if ($usu_perfil == "1") {
				$sql = "SELECT * FROM publicacion a where a.evento_idEvento = 0";
			} else {
				$sql = "SELECT * FROM publicacion a where a.evento_idEvento = 0 AND a.usuario_idUsuario = $idUsuario";
			}
			
			$sth = mysql_query($sql) or $rows["error"] =mysql_error();
			
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if(isset($_GET['files'])) {  
			$error = false;
			$files = array();
			
			$result = mysql_query("SHOW TABLE STATUS LIKE 'publicacion'");
			$row = mysql_fetch_array($result);
			$nextId = $row['Auto_increment'];
			
			if (isset( $_REQUEST['idPublicacion'])){
				$nextId = $_REQUEST['idPublicacion'];
			}
			if(!file_exists('./publicaciones/')) {
				mkdir ('./publicaciones/', 0777);
			}
			if(!file_exists('./publicaciones/'.$nextId)) {
				mkdir ('./publicaciones/'.$nextId, 0777);
			} 
						
			$uploaddir = './publicaciones/'.$nextId.'/';
			
			foreach($_FILES as $file) {
				$ext = explode (".",basename($file['name']));
				if(move_uploaded_file($file['tmp_name'], $uploaddir."publicacion_file.".$ext[1])) {
					$files[] = '/publicaciones/'.$nextId.'/'."publicacion_file.".$ext[1];
				} else {
					$error = true;
				}
			}
			$data = ($error) ? array('error' => 'There was an error uploading your files') : array('files' => $files);
			echo json_encode($data);
		} 
		
		if ($accion == "new_publicacion") {
			$rows = array();
			
			$idEvento = $_REQUEST['idEvento'];
			$idUsuario = $_REQUEST['idUsuario'];
			$t_titulo = $_REQUEST['t_titulo'];
			$t_resumen = $_REQUEST['t_resumen'];
			$t_estado = "PENDIENTE";
			$t_otros_autores = $_REQUEST['t_otros_autores'];
			
			if (isset($_REQUEST['filenames'])) {
				if  (isset($_REQUEST['filenames'][0])) {
					$t_archivo_path = $_REQUEST['filenames'][0];
				}
			} else {
				$t_archivo_path = "";
			}
			
			$result = mysql_query("SHOW TABLE STATUS LIKE 'publicacion'");
			$row = mysql_fetch_array($result);
			$nextId = $row['Auto_increment'];
			
			$res = mysql_query("INSERT INTO publicacion (pub_titulo, pub_resumen, pub_estado, pub_otros_autores, pub_archivo, usuario_idUsuario )
				VALUES ('$t_titulo', '$t_resumen', '$t_estado', '$t_otros_autores', '$t_archivo_path','$idUsuario') ") or $rows["error"] =mysql_error();

			$rows["respuesta"] = "ok";
			$rows["id"] = "$nextId";
			$rows["name"] = $t_archivo_path;
			
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "new_publicacion_evento") {
			$rows = array();
			
			$idEvento = $_REQUEST['idEvento'];
			$idPublicacion = $_REQUEST['idPublicacion'];
			
			$res = mysql_query("UPDATE publicacion SET evento_idEvento = '$idEvento' WHERE idPublicacion='$idPublicacion' ") or $rows["error"] =mysql_error();
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "update_publicacion") {
			$rows = array();
			
			$t_titulo = $_REQUEST['t_titulo'];
			$t_resumen = $_REQUEST['t_resumen'];
			$t_otros_autores = $_REQUEST['t_otros_autores'];
			
			if (isset($_REQUEST['filenames'])) {
				if  (isset($_REQUEST['filenames'][0])) {
					$t_archivo_path = $_REQUEST['filenames'][0];
				}
			} else {
				$t_archivo_path = "";
			}
						
			$nextId = $_REQUEST['idPublicacion']; 
			
			$res = mysql_query("UPDATE publicacion SET pub_titulo='$t_titulo', pub_resumen='$t_resumen', pub_otros_autores= '$t_otros_autores', pub_archivo='$t_archivo_path' WHERE idPublicacion=$nextId") or $rows["error"] =mysql_error();

			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "delete_publicacion") {
			$rows = array();
			$idPublicacion = $_REQUEST['idPublicacion'];
			
			$res = mysql_query("DELETE FROM publicacion WHERE idPublicacion='$idPublicacion'") or $rows["error"] =mysql_error();

			$rows["respuesta"] = "ok";
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "delete_r_publicacion") {
			$rows = array();
			$idPublicacion = $_REQUEST['idPublicacion'];
			$idEvento = $_REQUEST['idEvento'];
			
			$res = mysql_query("UPDATE publicacion SET evento_idEvento = '0' WHERE idPublicacion='$idPublicacion'") or $rows["error"] =mysql_error();

			$rows["respuesta"] = "ok";
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
	}
	mysql_close($enlace);
	$enlace = false;

?>