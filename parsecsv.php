<?php

error_reporting(E_ALL);

$db_host = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "robinhood";
$db_port = "3306";
$db = new mysqli($db_host, $db_user, $db_pass, $db_name);


$rhdata = file_get_contents('rh.csv');
$fe = explode("\n", $rhdata);

$data = array();

foreach($fe as $line) {
	$le = str_getcsv($line, ",");
	$query = "insert into transactions (datestamp, type, status, stockticker, buyamount, sellamount, deposit, withdrawal, dividend, goldfee, goldinterest, regulatoryfee, buyshares, sellshares) values (";
	$query.= '"' . $le[0] . '", ';
	$query.= '"' . $le[1] . '", ';
	$query.= '"' . $le[2] . '", ';
	$query.= '"' . $le[3] . '", ';
	$query.= $le[4] . ', ';
	$query.= $le[5] . ', ';
	$query.= $le[6] . ', ';
	$query.= $le[7] . ', ';
	$query.= $le[8] . ', ';
	$query.= $le[9] . ', ';
	$query.= $le[10] . ', ';
	$query.= $le[11] . ', ';
	$query.= $le[12] . ', ';
	$query.= $le[13] . ') ';
	$query.= "on duplicate key update id=id";
	$db->query($query);
	echo $db->error;
	print_r($le);
}
