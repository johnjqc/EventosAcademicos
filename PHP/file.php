<?php

header('Content-type: application/json');
header('Access-Control-Allow-Origin: *'); 

$enlace =  mysql_connect('localhost', 'root', 'root','eventos');
	if (!$enlace) {
		die('No pudo conectarse: ');
	}else {
		mysql_select_db('eventos', $enlace) or die('Could not select database.');
		
		$data = array();
		$rows = array();
		
		if(isset($_GET['files'])) {  
			$error = false;
			$files = array();
			
			$result = mysql_query("SHOW TABLE STATUS LIKE 'eventos'");
			$row = mysql_fetch_array($result);
			$nextId = $row['Auto_increment'];
			
			if(!file_exists('./eventos/'.$nextId)) {
				mkdir ('./eventos/'.$nextId, 0777);
			} 
						
			$uploaddir = './eventos/'.$nextId.'/';
			foreach($_FILES as $file) {
				if(move_uploaded_file($file['tmp_name'], $uploaddir .basename($file['name']))) {
					$files[] = '/eventos/'.$nextId.'/'.$file['name'];
				} else {
					$error = true;
				}
			}
			$data = ($error) ? array('error' => 'There was an error uploading your files') : array('files' => $files);
			echo json_encode($data);
		} else {
			$data = array('success' => 'Form was submitted', 'formData' => $_POST);
			
			$t_nombre = $_REQUEST['t_nombre'];
			$t_fecha_inicio = $_REQUEST['t_fecha_inicio']; 
			$t_fecha_fin = $_REQUEST['t_fecha_fin']; 
			$t_descripcion = $_REQUEST['t_descripcion'];
			$t_titulo_img = $_REQUEST['t_titulo_img'];
			$t_img_path = $_REQUEST['t_img_path'];
			$img_name = $_REQUEST['img_name'];
			$is_active = $_REQUEST['is_active']; 
			if ($is_active == ""){
				$is_active = 0;
			} else {
				$is_active = 1;
			}
			
			$resultadosJson= json_encode($data);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		$data["result"] = "".$t_nombre;
		
		
	}
	mysql_close($enlace);
	$enlace = false;

?>