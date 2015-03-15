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
		
		if ($accion == "query_patrocinadores") {
			$sth = mysql_query("SELECT * from patrocinador ");
			$rows = array();
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "query_patrocinador" ) {
			$idPatrocinador = $_GET['idPatrocinador'];
			$sth = mysql_query("SELECT * from patrocinador WHERE idPatrocinador = '$idPatrocinador'");
			$rows = array();
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "query_r_patrocinadores") {
			$rows = array();
			$idEvento = $_GET['idEvento'];
			$sth = mysql_query("SELECT * FROM patrocinador a 
				join patrocinador_has_evento b on a.idPatrocinador = b.patrocinador_idPatrocinador
				join evento c on c.idEvento = b.evento_idEvento
				WHERE c.idEvento = $idEvento") or $rows["error"] =mysql_error();
			
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "query_patrocinador_to_add") {
			$rows = array();
			$idEvento = $_GET['idEvento'];
			$sth = mysql_query("SELECT * FROM patrocinador a where a.idPatrocinador not in (select patrocinador_idPatrocinador from patrocinador_has_evento where evento_idEvento = '$idEvento')") or $rows["error"] =mysql_error();
			
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if(isset($_GET['files'])) {  
			$error = false;
			$files = array();
			
			$result = mysql_query("SHOW TABLE STATUS LIKE 'patrocinador'");
			$row = mysql_fetch_array($result);
			$nextId = $row['Auto_increment'];
			
			if (isset( $_REQUEST['idPatrocinador'])){
				$nextId = $_REQUEST['idPatrocinador'];
			}
			if(!file_exists('./patrocinadores/')) {
				mkdir ('./patrocinadores/', 0777);
			} 
			if(!file_exists('./patrocinadores/'.$nextId)) {
				mkdir ('./patrocinadores/'.$nextId, 0777);
			} 
						
			$uploaddir = './patrocinadores/'.$nextId.'/';
			
			foreach($_FILES as $file) {
				$ext = explode (".",basename($file['name']));
				if(move_uploaded_file($file['tmp_name'], $uploaddir."patrocinador_img.".$ext[1])) {
					$files[] = '/patrocinadores/'.$nextId.'/'."patrocinador_img.".$ext[1];
				} else {
					$error = true;
				}
			}
			$data = ($error) ? array('error' => 'There was an error uploading your files') : array('files' => $files);
			echo json_encode($data);
		} 
		
		if ($accion == "new_patrocinador") {
			$rows = array();
			
			$t_nombre = $_REQUEST['t_nombre'];
			$t_descripcion = $_REQUEST['t_descripcion'];
			if (isset($_REQUEST['filenames'])) {
				if  (isset($_REQUEST['filenames'][0])) {
					$t_img_path = $_REQUEST['filenames'][0];
				}
			} else {
				$t_img_path = "";
			}
			
			$result = mysql_query("SHOW TABLE STATUS LIKE 'patrocinador'");
			$row = mysql_fetch_array($result);
			$nextId = $row['Auto_increment'];
			
			$res = mysql_query("INSERT INTO patrocinador (pat_nombre, pat_descripcion, pat_imagen)
				VALUES ('$t_nombre', '$t_descripcion', '$t_img_path') ") or $rows["respuesta"] =mysql_error();

			$rows["respuesta"] = "ok";
			$rows["id"] = "$nextId";
			$rows["name"] = $t_img_path;
			
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "new_patrocinador_evento") {
			$rows = array();
			
			$idEvento = $_REQUEST['idEvento'];
			$idPatrocinador = $_REQUEST['idPatrocinador'];
			
			$res = mysql_query("INSERT INTO patrocinador_has_evento ( patrocinador_idPatrocinador, evento_idEvento)
				VALUES ('$idPatrocinador', '$idEvento') ") or $rows["error"] =mysql_error();
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "update_patrocinador") {
			$rows = array();
			
			$t_nombre = $_REQUEST['t_nombre'];
			$t_descripcion = $_REQUEST['t_descripcion'];
			if (isset($_REQUEST['filenames'])) {
				if  (isset($_REQUEST['filenames'][0])) {
					$t_img_path = $_REQUEST['filenames'][0];
				}
			} else {
				$t_img_path = "";
			}
						
			$nextId = $_REQUEST['idPatrocinador']; 
			
			$res = mysql_query("UPDATE patrocinador SET pat_nombre='$t_nombre', pat_descripcion='$t_descripcion', pat_imagen='$t_img_path' WHERE idPatrocinador=$nextId") or $rows["respuesta"] =mysql_error();

			$rows["respuesta"] = "ok";
			$rows["id"] = "$nextId";
			$rows["name"] = $t_img_path;
			
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "delete_patrocinador") {
			$rows = array();
			$idPatrocinador = $_REQUEST['idPatrocinador'];
			
			$res = mysql_query("DELETE FROM patrocinador WHERE idPatrocinador='$idPatrocinador'") or $rows["error"] =mysql_error();

			$rows["respuesta"] = "ok";
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "delete_r_patrocinador") {
			$rows = array();
			$idPatrocinador = $_REQUEST['idPatrocinador'];
			$idEvento = $_REQUEST['idEvento'];
			
			$res = mysql_query("DELETE FROM patrocinador_has_evento WHERE patrocinador_idPatrocinador='$idPatrocinador' and evento_idEvento='$idEvento'") or $rows["error"] =mysql_error();

			$rows["respuesta"] = "ok";
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
	}
	mysql_close($enlace);
	$enlace = false;

?>