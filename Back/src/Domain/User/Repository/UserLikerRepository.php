<?php

namespace Src\Domain\User\Repository;

use Src\Domain\User\Data\UserData;
use PDO;

class UserLikerRepository
{
  private $connection;

  public function __construct(PDO $connection) {
    $this->connection = $connection;
  }

    public function addLike(UserData $user, $id) {
      $login = $user->login;

      $sql = "SELECT * FROM users WHERE
      login = '$login'";
      $to = $this->connection->query($sql)->fetch(PDO::FETCH_ASSOC);
      $idToLike = $to['id'];
      $to_name = $to['firstname'] . ' ' . $to['lastname'];

      $sql_from = "SELECT * FROM users WHERE
      id = '$id'";
      $from = $this->connection->query($sql_from)->fetch(PDO::FETCH_ASSOC);
      $from_login = $from['login'];
      $from_name = $from['firstname'] . ' ' . $from['lastname'];

      $row = [
        'liker' => $id,
        'liked' => $idToLike
      ];
      $sql = "SELECT * FROM likes WHERE
      liker=:liker
      AND
      liked=:liked;";
      $ret = $this->connection->prepare($sql);
      $ret->execute($row);

      if ($ret = $ret->fetch(PDO::FETCH_ASSOC)) {
        $sql = "DELETE FROM likes WHERE
        liker=:liker
        AND
        liked=:liked;";
        $this->connection->prepare($sql)->execute($row);

        $result = [
          'status' => 1,
          'success' => 'Unliked.'
        ];

        $sql_del = "DELETE FROM chat WHERE
        sender = '$from_login'
        AND
        receiver = '$user->login'
        OR
        sender = '$user->login'
        AND
        receiver = '$from_login'";
        $this->connection->query($sql_del);

        $sql_notif = "INSERT INTO notif SET
        sender = '$from_login',
        msg = \"$from_name ne s'interesse plus à vous.\",
        receiver = '$user->login'";
      }
      else {
        $sql = "UPDATE users SET
        score = score - 2
        WHERE
        id = '$id'
        AND
        score > 1";
        $this->connection->query($sql);

        $sql = "INSERT INTO likes SET
        liker=:liker,
        liked=:liked;";
        $result = [
          'status' => 1,
          'success' => 'liked'
        ];
        $liked = 1;

        $sql_notif = "INSERT INTO notif SET
        sender = '$from_login',
        msg = \"$from_name vous a aimé.\",
        receiver = '$user->login'";
      }
      $this->connection->prepare($sql)->execute($row);

      if ($liked) {
        $sql = "SELECT score FROM users WHERE
        id = '$id'";
        $ret = $this->connection->query($sql)->fetch(PDO::FETCH_ASSOC);

        if ((int)$ret['score'] < 94)
          $increase = 7;
        else if ((int)$ret['score'] <= 100){
          $increase = 100 - (int)$ret['score'];
        }
        else if ((int)$ret['score'] < 100)
          $increase = 0;
        $sql = "UPDATE users SET
        score = score + '$increase'
        WHERE
        id = '$id'";
        $this->connection->query($sql);

        $sql = "SELECT score FROM users WHERE
        id = '$idToLike'";
        $ret = $this->connection->query($sql)->fetch(PDO::FETCH_ASSOC);

        if ((int)$ret['score'] < 94)
          $increase = 7;
        else if ((int)$ret['score'] <= 100){
          $increase = 100 - (int)$ret['score'];
        }
        else if ((int)$ret['score'] < 100)
          $increase = 0;
        $sql = "UPDATE users SET
        score = score + '$increase'
        WHERE
        id = '$idToLike'";
        $this->connection->query($sql);

        $row = [
          'liked' => $id,
          'liker' => $idToLike
        ];
        $sql = "SELECT * FROM likes WHERE
        liked=:liked
        AND
        liker=:liker;";
        $ret = $this->connection->prepare($sql);
        $ret->execute($row);

        if ($ret->fetch(PDO::FETCH_ASSOC)) {
            $result = [
              'status' => 1,
              'success' => 'MATCH'
            ];

            $sql_notif = "INSERT INTO notif SET
            sender = '$from_login',
            msg = \"Vous venez de MATCH avec $from_name.\",
            receiver = '$user->login'";

            $i = rand(0, 11);
            $j = -1;
            $file = fopen("../config/seed/DRAGUE.CSV", "r");
            while ($j != $i) {
              $msg = fgets($file);
              $j++;
            }
            fclose($file);
            $sql = "INSERT INTO chat SET
            sender = '$from_login',
            msg = '$msg',
            receiver = '$user->login'";
            $this->connection->query($sql);

            $sql = "INSERT INTO notif SET
            sender = '$from_login',
            msg = \"$from_name vous a envoyé un message.\",
            receiver = '$user->login'";
            $this->connection->query($sql);

        }
      }
      $this->connection->query($sql_notif);
      return $result;
    }
}
