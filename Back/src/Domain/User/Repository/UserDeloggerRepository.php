<?php

namespace Src\Domain\User\Repository;

use Src\Domain\User\Data\UserAuth;
use PDO;

class UserDeloggerRepository
{
    private $connection;

    public function __construct(PDO $connection) {
        $this->connection = $connection;
    }

    public function delog(UserAuth $UserLog) {
      $id = $UserLog->id;
      $token = $UserLog->token;

      $sql = "SELECT * FROM users WHERE
      id = '$id'";

      if (! $ret = $this->connection->query($sql)->fetch(PDO::FETCH_ASSOC)) {
        return [
          'status' => 0, 'error' => 'user no exist'
        ];
      }
      elseif ($token != $ret['token_log']) {
        if (! $ret['token_log']) {
          return [
            'status' => 0, 'error' => 'user already delogged'
          ];
        }
        return [
          'status' => 0, 'error' => 'token not good'
        ];
      }

      $sql = "UPDATE users SET
      token_log = NULL,
      last_log = CURRENT_TIMESTAMP
      WHERE
      id = '$id'
      AND
      token_log = '$token'";
      $this->connection->query($sql);

      return [
        'status' => 1, 'success' => 'user delogged'
      ];
    }
}
