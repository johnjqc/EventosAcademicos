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
								WHERE evento_idEvento= $idEvento order by a.age_fecha DESC");
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
		
		if ($accion == "query_r_espacios" ) {
			$idEvento = $_GET['idEvento'];
			$idAgenda = $_GET['idAgenda'];
			
			$sth = mysql_query("SELECT * FROM espacio a 
				join espacio_has_agenda b on a.idEspacio = b.espacio_idEspacio
				and b.agenda_evento_idEvento = '$idEvento' and b.agenda_idAgenda = '$idAgenda'")or $rows["error"] =mysql_error();
			$rows = array();
			while($r = mysql_fetch_assoc($sth)) {
				$rows[] = $r;
			}
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
		
		if ($accion == "query_espacios_to_add") {
			$rows = array();
			$idAgenda = $_GET['idAgenda'];
			$idEvento = $_GET['idEvento'];
			
			$sth = mysql_query("select * from (
				select * from espacio where lugar_idLugar in (
							SELECT idLugar FROM lugar a 
							join lugar_has_evento b on a.idLugar = b.lugar_idLugar
							join evento c on c.idEvento = b.evento_idEvento
							WHERE c.idEvento = '$idEvento'
						)
				) espacios where idEspacio not in (
				select espacio_idEspacio from espacio_has_agenda where agenda_idAgenda= '$idAgenda' and agenda_evento_idEvento= '$idEvento'
				)") or $rows["error"] =mysql_error();
			
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
		
		if ($accion == "new_espacio_agenda") {
			$rows = array();
			
			$idAgenda = $_GET['idAgenda'];
			$idEspacio = $_GET['idEspacio'];
			$idEvento = $_REQUEST['idEvento'];
			
			$res = mysql_query("INSERT INTO espacio_has_agenda (espacio_idEspacio, agenda_idAgenda, agenda_evento_idEvento) VALUES ('$idEspacio','$idAgenda', '$idEvento') ") or $rows["error"] =mysql_error();

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
		
		if ($accion == "delete_r_espacio") {
			$rows = array();
			$idAgenda = $_REQUEST['idAgenda']; 
			$idEspacio = $_REQUEST['idEspacio']; 
			$idEvento = $_REQUEST['idEvento']; 
			
			$res = mysql_query("DELETE FROM espacio_has_agenda WHERE espacio_idEspacio='$idEspacio' and agenda_idAgenda='$idAgenda' and agenda_evento_idEvento = '$idEvento'") or $rows["error"] =mysql_error();
			
			$resultadosJson= json_encode($rows);
			echo $_GET['jsoncallback'] . '(' . $resultadosJson . ');';
		}
	}
	mysql_close($enlace);
	$enlace = false;

?>