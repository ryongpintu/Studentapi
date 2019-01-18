<?php
	// Account details
	$apiKey = urlencode('1GtMsArndh8-4Y3kC9b0irR5rSAY14WiBQTgKYCFic');
	
	// Message details
	$numbers = array($_REQUEST['mobile_no']);
	$sender = urlencode('LRNCAB');
	$message = rawurlencode($_REQUEST['message']);
 
	$numbers = implode(',', $numbers);
 
	// Prepare data for POST request
	$data = array('apikey' => $apiKey, 'numbers' => $numbers, "sender" => $sender, "message" => $message);
 
	// Send the POST request with cURL
	$ch = curl_init('https://api.textlocal.in/send/');
	curl_setopt($ch, CURLOPT_POST, true);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$response = curl_exec($ch);
	curl_close($ch);
	
	// Process your response here
	echo $response;
?>