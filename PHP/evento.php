<?php
	header('Content-type: application/json');
	
	$enlace =  mysql_connect('localhost', 'root', 'root','eventos');
	if (!$enlace) {
		die('No pudo conectarse: ');
	}else {
		mysql_select_db('eventos', $enlace) or die('Could not select database.');
		
		$accion = $_GET['accion'];
		$evento = $_GET['evento'];
		
		if ($accion == "queryEvento" ) {
			$sth = mysql_query("SELECT * from eventos where id = '$evento'");
			$rows = array();
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
	}
	mysql_close($enlace);
	$enlace = false;
?>
