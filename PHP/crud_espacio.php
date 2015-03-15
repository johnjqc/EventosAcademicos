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
		
		if (isset($_GET['accion'])) {
			$accion = $_GET['accion'];
		} else {
			$accion = "empty";
		}
		if (isset($_GET['idLugar'])) {
			$idLugar = $_REQUEST['idLugar'];
		} else {
			$idLugar = "empty";
		}
		
		$data = array();
		$rows = array();
		
		if ($accion == "query_espacios") {
			$sth = mysql_query("SELECT * from espacio where lugar_idLugar=$idLugar");
			$rows = array();
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "query_espacio" ) {
			$idEspacio = $_GET['idEspacio'];
			$sth = mysql_query("SELECT * from espacio WHERE idEspacio = '$idEspacio'");
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
			
			$result = mysql_query("SHOW TABLE STATUS LIKE 'espacio'");
			$row = mysql_fetch_array($result);
			$nextId = $row['Auto_increment'];
			
			if (isset( $_REQUEST['idEspacio'])){
				$nextId = $_REQUEST['idEspacio'];
			}
			if(!file_exists('./espacios/')) {
				mkdir ('./espacios/', 0777);
			}
			if(!file_exists('./espacios/'.$nextId)) {
				mkdir ('./espacios/'.$nextId, 0777);
			} 
						
			$uploaddir = './espacios/'.$nextId.'/';
			
			foreach($_FILES as $file) {
				$ext = explode (".",basename($file['name']));
				if(move_uploaded_file($file['tmp_name'], $uploaddir."espacio".$nextId."_img.".$ext[1])) {
					$files[] = '/espacios/'.$nextId.'/'."espacio".$nextId."_img.".$ext[1];
				} else {
					$error = true;
				}
			}
			$data = ($error) ? array('error' => 'There was an error uploading your files') : array('files' => $files);
			echo json_encode($data);
		} 
		
		if ($accion == "new_espacio") {
			$rows = array();
			
			$idLugar = $_REQUEST['idLugar'];
			$t_nombre = $_REQUEST['t_nombre'];
			$t_descripcion = $_REQUEST['t_descripcion'];
			$t_capacidad = $_REQUEST['t_capacidad'];
			$t_latitud = $_REQUEST['t_latitud'];
			$t_longitud = $_REQUEST['t_longitud'];
			
			if (isset($_REQUEST['filenames'])) {
				if  (isset($_REQUEST['filenames'][0])) {
					$t_img_path = $_REQUEST['filenames'][0];
				}
			} else {
				$t_img_path = "";
			}
			
			$result = mysql_query("SHOW TABLE STATUS LIKE 'espacio'");
			$row = mysql_fetch_array($result);
			$nextId = $row['Auto_increment'];
			
			$res = mysql_query("INSERT INTO espacio (esp_nombre, esp_descripcion, esp_imagen, esp_capacidad, esp_latitud, esp_longitud, lugar_idLugar)
				VALUES ('$t_nombre', '$t_descripcion', '$t_img_path', '$t_capacidad', '$t_latitud', '$t_longitud', '$idLugar') ") or $rows["error"] =mysql_error();

			$rows["respuesta"] = "ok";
			$rows["id"] = "$nextId";
			$rows["name"] = $t_img_path;
			
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "update_espacio") {
			$rows = array();
			
			$t_nombre = $_REQUEST['t_nombre'];
			$t_descripcion = $_REQUEST['t_descripcion'];
			$t_capacidad = $_REQUEST['t_capacidad'];
			$t_latitud = $_REQUEST['t_latitud'];
			$t_longitud = $_REQUEST['t_longitud'];
			
			if (isset($_REQUEST['filenames'])) {
				if  (isset($_REQUEST['filenames'][0])) {
					$t_img_path = $_REQUEST['filenames'][0];
				}
			} else {
				$t_img_path = "";
			}
						
			$nextId = $_REQUEST['idEspacio']; 
			
			$res = mysql_query("UPDATE espacio SET esp_nombre='$t_nombre', esp_descripcion='$t_descripcion', esp_imagen='$t_img_path', esp_capacidad='$t_capacidad', esp_latitud='$t_latitud', esp_longitud='$t_longitud' WHERE idEspacio=$nextId") or $rows["error"] =mysql_error();

			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "delete_espacio") {
			$rows = array();
			$idEspacio = $_REQUEST['idEspacio'];
			
			$res = mysql_query("DELETE FROM espacio WHERE idEspacio='$idEspacio'") or $rows["error"] =mysql_error();

			$rows["respuesta"] = "ok";
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
	}
	mysql_close($enlace);
	$enlace = false;

?>