<?php

header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require '../config/setup.php';
(require __DIR__ . '/../config/bootstrap.php')->run();
