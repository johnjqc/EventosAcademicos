<?php
	header('Content-type: application/json');
	
	$enlace =  mysql_connect('localhost', 'root', 'root','eventos');
	if (!$enlace) {
		die('No pudo conectarse: ');
	}else {
		mysql_select_db('eventos', $enlace) or die('Could not select database.');
		
		$accion = $_GET['accion'];
		
		if ($accion == "queryHomeEvento" || $accion == "queryCrudEvento") {
			$sth = mysql_query("SELECT * from eventos ");
			$rows = array();
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "new_evento") {
			$rows = array();
			
			$t_nombre = $_REQUEST['t_nombre'];
			$t_fecha_inicio = $_REQUEST['t_fecha_inicio']; 
			$t_fecha_fin = $_REQUEST['t_fecha_fin']; 
			$t_descripcion = $_REQUEST['t_descripcion'];
			$t_titulo_img = $_REQUEST['t_titulo_img'];
			$t_img_path = $_REQUEST['t_img_path'];
			$is_active = $_REQUEST['is_active']; 
			
			if ($is_active == ""){
				$is_active = 0;
			} else {
				$is_active = 1;
			}
			//mysql_query("INSERT INTO eventos ( nombre) VALUES ('11')");
			
			
			$res = mysql_query("INSERT INTO eventos (id, nombre, fecha_inicio, fecha_fin, is_active, descripcion, titulo_imagen, imagen)
				VALUES ('', '$t_nombre', '$t_fecha_inicio', '$t_fecha_fin', '$is_active', '$t_descripcion', '$t_titulo_img', '$t_img_path') ") or $rows["respuesta"] =mysql_error();
			
			
			$rows["respuesta"] = "ok";
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
	}
	mysql_close($enlace);
	$enlace = false;
?>
