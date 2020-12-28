<?php

error_reporting(E_ALL);

$db_host = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "robinhood";
$db_port = "3306";
$db = new mysqli($db_host, $db_user, $db_pass, $db_name);

$query = "select * from transactions order by datestamp";
$t = $db->query($query);

$port = array();

while($row = $t->fetch_assoc()) {
	if($row['buyshares'] > 0) {
		if(empty($port[$row['stockticker']])) {
			$port[$row['stockticker']] = array('shares' => 0, 'pps' => 0);
		}
		$port[$row['stockticker']]['pps'] = ($row['buyamount'] / $row['buyshares']);
		$port[$row['stockticker']]['shares'] += $row['buyshares'];
	}
	if($row['sellshares'] > 0) {
		$port[$row['stockticker']]['pps'] = ($row['sellamount'] / $row['sellshares']);
		$port[$row['stockticker']]['shares'] -= $row['sellshares'];
	}
	print_r($row);
}
