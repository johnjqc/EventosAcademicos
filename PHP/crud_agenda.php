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
		
		if ($accion == "query_agendas") {
			$idEvento = $_GET['idEvento'];
			$sth = mysql_query("SELECT a.*, c.* from agenda a
								left join  espacio_has_agenda b on a.idAgenda = b.agenda_idAgenda
								left join  espacio c on b.espacio_idEspacio = c.idEspacio
								WHERE evento_idEvento= $idEvento order by a.age_fecha");
			$rows = array();
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "query_agenda" ) {
			$idAgenda = $_GET['idAgenda'];
			$sth = mysql_query("SELECT * from agenda WHERE idAgenda = '$idAgenda'");
			$rows = array();
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "new_agenda") {
			$rows = array();
			
			$t_fecha = $_REQUEST['t_fecha'];
			$t_hora_inicio = $_REQUEST['t_hora_inicio'];
			$t_hora_fin = $_REQUEST['t_hora_fin'];
			$t_actividad = $_REQUEST['t_actividad'];
			$t_descripcion = $_REQUEST['t_descripcion'];
			$idEvento = $_REQUEST['idEvento'];

			$result = mysql_query("SHOW TABLE STATUS LIKE 'agenda'");
			$row = mysql_fetch_array($result);
			$nextId = $row['Auto_increment'];
			
			$res = mysql_query("INSERT INTO agenda (age_fecha, age_hora_fin, age_hora_inicio, age_actividad, age_descripcion, evento_idEvento) VALUES ('$t_fecha', '$t_hora_fin', '$t_hora_inicio', '$t_actividad', '$t_descripcion', '$idEvento') ") or $rows["error"] =mysql_error();

			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "update_agenda") {
			$rows = array();
			
			$t_fecha = $_REQUEST['t_fecha'];
			$t_hora_inicio = $_REQUEST['t_hora_inicio'];
			$t_hora_fin = $_REQUEST['t_hora_fin'];
			$t_actividad = $_REQUEST['t_actividad'];
			$t_descripcion = $_REQUEST['t_descripcion'];
			$idAgenda = $_REQUEST['idAgenda']; 
			
			$res = mysql_query("UPDATE agenda SET age_fecha='$t_fecha', age_hora_inicio='$t_hora_inicio', age_hora_fin='$t_hora_fin', age_actividad='$t_actividad', age_descripcion='$t_descripcion' WHERE idAgenda=$idAgenda") or $rows["error"] =mysql_error();
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "delete_agenda") {
			$rows = array();
			$agendaId = $_REQUEST['id']; 
			
			$res = mysql_query("DELETE FROM agenda WHERE idAgenda=$agendaId") or $rows["error"] =mysql_error();
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
	}
	mysql_close($enlace);
	$enlace = false;

?>