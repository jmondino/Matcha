<?php

namespace Src\Domain\User\Repository;

use PDO;

class UserActivatorRepository
{
    private $connection;

    public function __construct(PDO $connection) {
        $this->connection = $connection;
    }

    public function activeAcc($token) {
      $row = [
        'active' => '1',
        'token' => $token
      ];

      $sql = "UPDATE users SET
      active=:active
      WHERE
      token=:token;";

      $this->connection->prepare($sql)->execute($row);
    }
}
