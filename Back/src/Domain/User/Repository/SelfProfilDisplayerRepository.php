<?php

namespace Src\Domain\User\Repository;

use SlimSession\Helper;
use PDO;

class SelfProfilDisplayerRepository
{
    private $connection;

    public function __construct(PDO $connection, Helper $session) {
      $this->connection = $connection;
    }


    public function displayer($id) {
      $sql = "SELECT * FROM users WHERE
      id = '$id'";
      if (! $user = $this->connection->query($sql)->fetch(PDO::FETCH_ASSOC))
        return NULL;
      $size = strlen($user['password']);
      $crypted = str_repeat("*", $size);


      $gender = $user['gender'];
      $sql = "SELECT link FROM images WHERE
      userid = '$id'
      AND
      profil = '1'";
      if (! $profilPic = $this->connection->query($sql)->fetch(PDO::FETCH_ASSOC))
        $profilPic['link'] = "/img/default.jpg";

      $sql = "SELECT link FROM images WHERE
      userid = '$id'
      AND
      profil = '0'";
      if (! $images = $this->connection->query($sql)->fetchAll(PDO::FETCH_ASSOC))
        $images = [];


      $sql = "SELECT tag FROM tags WHERE
      userids REGEXP '(,|^)$id(,|$)'";
      $tags_db = $this->connection->query($sql)->fetchAll(PDO::FETCH_ASSOC);
      $j = count($tags_db);
      while ($j-- != 0)
        $tags = !$tags ? $tags_db[$j]['tag'] : $tags . "," . $tags_db[$j]['tag'];
      if ($tags)
        $tags = explode(',', $tags);
      else
        $tags = [];

      return [
        'status' => 1,
        'success' => [
          'firstname' => $user['firstname'],
          'lastname' => $user['lastname'],
          'email' => $user['email'],
          'birth' => $user['birth'],
          'age' => (int)$user['age'],
          'gender' => $user['gender'],
          'orientation' => $user['orientation'],
          'login' => $user['login'],
          'password' => $crypted,
          'bio' => $user['bio'] ? $user['bio'] : "",
          'city' => $user['city'],
          'arr' => $user['arr'],
          'dept' => $user['dept'],
          'region' => $user['region'],
          'reg_date' => $user['reg_date'],
          'score' => (int)$user['score'],
          'profilePic' => $profilPic['link'],
          'images' => $images,
          'tags' => $tags
        ]
      ];
    }

    public function getTodayHistorique($id) {
      $sql = "SELECT * FROM viewers WHERE
      host = '$id'";

      if (! $views = $this->connection->query($sql)->fetchAll(PDO::FETCH_ASSOC))
        return NULL;
      else {
        $viewsCount = count($views) - 1;
        $i = -1;
        $index = 0;
        $curr_stamp = time();

        while ($i++ !=  $viewsCount) {
          $id = $views[$i]['visitor'];

          if (!in_array($id, $checked)) {
            $j = $i - 1;
            $k = 0;

            while ($j++ != $viewsCount) {
              $day = strtotime($views[$j]['visit_date']) + 86400;

              if ($views[$j]['visitor'] == $id && $day > $curr_stamp)
                  $k++;
            }
            if (! $k)
              continue;

            $hour = explode(' ', $views[$i]['visit_date']);

            $sql = "SELECT firstname, lastname, login, age, city, gender FROM users WHERE
            id = '$id'";
            $ret = $this->connection->query($sql)->fetch(PDO::FETCH_ASSOC);
            $gender = $ret['gender'];

            $sql = "SELECT link FROM images WHERE
            userid = '$id'
            AND
            profil = '1'";
            if (! $profilPic = $this->connection->query($sql)->fetch(PDO::FETCH_ASSOC))  {
                if ($gender == 'Male')
                  $profilPic = "/img/male.jpg";
                elseif ($gender == 'Female')
                  $profilPic = "/img/female.jpg";
            }

            $today[$index][id] = $id;
            $today[$index][login] = $ret['login'];
            $today[$index][firstname] = $ret['firstname'];
            $today[$index][lastname] = $ret['lastname'];
            $today[$index][age] = $ret['age'];
            $today[$index][city] = $ret['city'];
            $today[$index][count] = $k;
            $today[$index][hour] = $hour[1];
            $today[$index][profilePic] = $profilPic;

            $checked[$index] = $id;
            $index++;
          }
        }
        return $today;
      }
    }


    public function getWeekHistorique($id) {
      $sql = "SELECT * FROM viewers WHERE
      host = '$id'";

      if (! $views = $this->connection->query($sql)->fetchAll(PDO::FETCH_ASSOC))
        return NULL;
      else {
        $viewsCount = count($views) - 1;
        $i = -1;
        $index = 0;
        $curr_stamp = time();

        while ($i++ !=  $viewsCount) {
          $id = $views[$i]['visitor'];

          if (!in_array($id, $checked)) {
            $j = $i - 1;
            $k = 0;

            while ($j++ != $viewsCount) {
              $day = strtotime($views[$j]['visit_date']) + 86400;
              $week = strtotime($views[$j]['visit_date']) + 604800;

              if ($views[$j]['visitor'] == $id && $day < $curr_stamp && $week > $curr_stamp)
                  $k++;
            }
            if (!$k)
              continue;

            $hour = explode(' ', $views[$i]['visit_date']);

            $sql = "SELECT firstname, lastname, login, age, city, gender FROM users WHERE
            id = '$id'";
            $ret = $this->connection->query($sql)->fetch(PDO::FETCH_ASSOC);
            $gender = $ret['gender'];

            $sql = "SELECT link FROM images WHERE
            userid = '$id'
            AND
            profil = '1'";
            if (! $profilPic = $this->connection->query($sql)->fetch(PDO::FETCH_ASSOC))  {
                if ($gender == 'Male')
                  $profilPic = "/img/male.jpg";
                elseif ($gender == 'Female')
                  $profilPic = "/img/female.jpg";
            }

            $thisWeek[$index][id] = $id;
            $thisWeek[$index][login] = $ret['login'];
            $thisWeek[$index][firstname] = $ret['firstname'];
            $thisWeek[$index][lastname] = $ret['lastname'];
            $thisWeek[$index][age] = (int)$ret['age'];
            $thisWeek[$index][city] = $ret['city'];
            $thisWeek[$index][count] = $k;
            $thisWeek[$index][hour] = $hour[1];
            $thisWeek[$index][profilePic] = $profilPic;

            $checked[$index] = $id;
            $index++;
          }
        }
        return $thisWeek;
      }
    }


    public function getLike($id) {
      $sql = "SELECT liker FROM likes WHERE
      liked = '$id'";
      $likes = $this->connection->query($sql)->fetchAll(PDO::FETCH_ASSOC);

      $likesCount = count($likes) - 1;
      $i = -1;

      while ($i++ != $likesCount) {
        $id = $likes[$i]['liker'];

        $sql = "SELECT firstname, lastname, login, age, city, gender FROM users WHERE
        id = '$id'";
        $ret = $this->connection->query($sql)->fetch(PDO::FETCH_ASSOC);
        $gender = $ret['gender'];

        $sql = "SELECT link FROM images WHERE
        userid = '$id'
        AND
        profil = '1'";

        if (! $profilPic = $this->connection->query($sql)->fetch(PDO::FETCH_ASSOC))  {
            if ($gender == 'Male')
              $profilPic = "/img/male.jpg";
            elseif ($gender == 'Female')
              $profilPic = "/img/female.jpg";
        }

        $likedBy[$i][id] = $id;
        $likedBy[$i][login] = $ret['login'];
        $likedBy[$i][firstname] = $ret['firstname'];
        $likedBy[$i][lastname] = $ret['lastname'];
        $likedBy[$i][age] = $ret['age'];
        $likedBy[$i][city] = $ret['city'];
        $likedBy[$i][since] = $ret['like_date'];
        $likedBy[$i][profilePic] = $profilPic;
      }
      return $likedBy;
    }
}
