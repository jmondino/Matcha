<?php

namespace Src\Domain\User\Repository;

use PDO;

class checkUserLoggedRepository
{
    private $connection;

    public function __construct(PDO $connection) {
        $this->connection = $connection;
    }
  
    public function check($UserLog) {
      $id = $UserLog->id;
      $token = $UserLog->token;
      
      $sql = "SELECT token_log FROM users WHERE
      id = '$id'";
      if (! $ret = $this->connection->query($sql)->fetch(PDO::FETCH_ASSOC))
        return "user no exist";
      
      if (! $ret['token_log'])
          return "Vous n'êtes pas connecté, veuillez vous reconnecter.";
        
      if ($token != $ret['token_log'])
        return "token not good";
    }
}