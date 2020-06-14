<?php

require 'database.php';

try {
  $db = new db();
  $db->create();
  $db = NULL;
}
catch (PDOException $e) {
  echo "Error : " . $e->getMessage();
}

?>
