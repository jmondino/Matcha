<?php

namespace Src\Domain\User\Repository;

use PDO;
use Src\Domain\User\Repository\SortListRepository;

class ListSuggesterRepository
{
    private $connection;
    private $sortList;

    public function __construct(PDO $connection, SortListRepository $sortList) {
        $this->connection = $connection;
        $this->sortList = $sortList;
    }

    public function infoComplete($id) {
        $sql = "SELECT * FROM users WHERE
        id = '$id';";
        $userData = $this->connection->query($sql)->fetch(PDO::FETCH_ASSOC);

        $sql = "SELECT link FROM images WHERE
        userid = '$id'
        AND
        profil = '1'";
        if (! $profilPic = $this->connection->query($sql)->fetch(PDO::FETCH_ASSOC)) {
          return [
            'status' => 0,
            'error' => 'Vous devez completer votre profile avant d\'avoir accès à la liste de suggestion.'
          ];
        }

        foreach ($userData as $key => $value) {
          if (! $value && $key == 'firstname' ||
              ! $value && $key == 'lastname' ||
              ! $value && $key == 'email' ||
              ! $value && $key == 'birth' ||
              ! $value && $key == 'gender' ||
              ! $value && $key == 'orientation' ||
              ! $value && $key == 'login' ||
              ! $value && $key == 'password' ||
              ! $value && $key == 'bio')
              return [
                  'status' => 0,
                  'error' => 'Vous devez completer votre profile avant d\'avoir accès à la liste de suggestion.'
              ];
        }
        $sql = "UPDATE users SET
        complete = 1
        WHERE
        id = $id";
        $this->connection->query($sql);
    }


    public function displayList($mainId, $instruc) {
        $sql = "SELECT * FROM users WHERE
        id = '$mainId'
        AND
        complete = 1";
        $user = $this->connection->query($sql)->fetch(PDO::FETCH_ASSOC);

        $sql = "SELECT * FROM tags WHERE
        userids REGEXP '(,|^)$mainId(,|$)'";
        $MyTags_db = $this->connection->query($sql)->fetchAll(PDO::FETCH_ASSOC);
        $i = count($MyTags_db);
        while ($i-- != 0)
        {
          $MyTags = !$MyTags ? $MyTags_db[$i]['tag'] :
                               $MyTags . "," . $MyTags_db[$i]['tag'];
        }
        $MyTags = explode(',', $MyTags);

        $latFrom = $user['latitude'];
        $lonFrom = $user['longitude'];

        $select = "firstname,
                  age,
                  gender,
                  orientation,
                  city,
                  id,
                  login,
                  score,
                  latitude,
                  longitude,
                  token_log";
        if ($user['orientation'] != 'Bisexuel') {
          $gender = $this->getGender($user['orientation'], $user['gender']);
          $orientation = $user['orientation'];
          $orientationOr = 'Bisexuel';

          $sql = "SELECT $select FROM users WHERE
          id != '$mainId'
          AND
          gender = '$gender'
          AND
          orientation = '$orientation'
          UNION
          SELECT $select FROM users WHERE
          id != '$mainId'
          AND
          gender = '$gender'
          AND
          orientation = '$orientationOr';";

        }
        else {
          $gender = 'Male';
          $genderOr = 'Female';
          $orientationBase = 'Bisexuel';
          $orientation = $user['gender'] == 'male' ? 'Homosexuel' : 'Hétérosexuel';
          $orientationOr = $user['gender'] == 'male' ? 'Hétérosexuel' : 'Homosexuel';
          $city = $user['city'];

          $sql = "SELECT $select FROM users WHERE
          id != '$mainId'
          AND
          gender = '$gender'
          AND
          orientation = '$orientation'
          UNION
          SELECT $select FROM users WHERE
          id != $mainId
          AND
          gender = '$genderOr'
          AND
          orientation = '$orientationOr'
          UNION
          SELECT $select FROM users WHERE
          id != '$mainId'
          AND
          orientation = '$orientationBase';";

        }

        $ret = $this->connection->query($sql)->fetchAll(PDO::FETCH_ASSOC);
        $i = 0;
        foreach ($ret as $key => $value) {
          $userid = $ret[$i]['id'];
          $gender = $ret[$i]['gender'];
          $latTo = $ret[$i]['latitude'];
          $lonTo = $ret[$i]['longitude'];

          $sql = "SELECT tag FROM tags WHERE
          userids REGEXP '(,|^)$userid(,|$)'";
          $userTags = $this->connection->query($sql)->fetchAll(PDO::FETCH_ASSOC);
          $j = count($userTags);
          $sameTag = 0;
          $tags = NULL;
          while ($j-- != 0) {
            if (in_array($userTags[$j]['tag'], $MyTags))
              $sameTag++;
            $tags = !$tags ? $userTags[$j]['tag'] : $tags . "," . $userTags[$j]['tag'];
          }

          $sql = "SELECT link FROM images WHERE
          userid = '$userid'
          AND
          profil = '1'";
          $profilPic = $this->connection->query($sql)->fetch(PDO::FETCH_ASSOC);

          $sql = "SELECT * FROM likes WHERE
          liker = '$mainId'
          AND
          liked = '$userid'";
          $myLikeTo = $this->connection->query($sql)->fetch(PDO::FETCH_ASSOC);

          $sql = "SELECT * FROM likes WHERE
          liker = '$userid'
          AND
          liked = '$mainId'";
          $likedBy = $this->connection->query($sql)->fetch(PDO::FETCH_ASSOC);

          if ($likedBy && $myLikeTo)
            $match = 1;

          $ret[$i]['age'] = (int)$ret[$i]['age'];
          $ret[$i]['score'] = (int)$ret[$i]['score'];
          $ret[$i][likedBy] = $likedBy ? 1 : 0;
          $ret[$i][myLikeTo] = $myLikeTo ? 1 : 0;
          $ret[$i][match] = $match ? 1 : 0;
          $ret[$i][log] = $ret[$i]['token_log'] ? 1 : 0;
          $ret[$i][dst] = $this->getDistance($latFrom, $lonFrom, $latTo, $lonTo);
          $ret[$i][sameTag] = $sameTag;
          $ret[$i][profilePic] = $profilPic['link'];
          $ret[$i][tags] = $tags;
          unset($ret[$i]['longitude']);
          unset($ret[$i]['latitude']);
          unset($ret[$i]['token_log']);
          $i++;
          $tags = NULL;
          $match = 0;
        }

        $sorted = $this->sortList->sort($ret, $instruc);

        return [
          'status' => 1,
          'success' => $sorted
        ];
    }


    private function getDistance($latFrom, $lonFrom, $latTo, $lonTo) {
        $degrees = rad2deg(acos((sin(deg2rad($latFrom))*sin(deg2rad($latTo))) + (cos(deg2rad($latFrom))*cos(deg2rad($latTo))*cos(deg2rad($lonFrom-$lonTo)))));
        $distance = $degrees * 111.13384;

        return round($distance, $decimals);
    }


    private function getGender($orientation, $gender) {
      if ($orientation == 'Homosexuel') {
        if ($gender == 'Male')
          return 'Male';
        else
          return 'Female';
      }
      elseif ($orientation == 'Hétérosexuel') {
        if ($gender == 'Male')
          return 'Female';
        else
          return 'Male';
      }
    }
}
