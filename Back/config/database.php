<?php

class db {
  private $host   = "localhost";
  private $dbname = "matcha_db";
  private $user   = "root";
  private $paswd  = "123456";
  private $driver = "mysql";

  public function create() {
    $mysql_conn = "$this->driver:host=$this->host";
    $conn = new PDO($mysql_conn, $this->user, $this->paswd, array(PDO::MYSQL_ATTR_LOCAL_INFILE => true));
    $conn->query("CREATE DATABASE IF NOT EXISTS $this->dbname");
    $conn->query("use $this->dbname");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    try {
      $conn->query("SELECT * FROM users LIMIT 1");
    }
    catch(PDOException $e) {
      $this->table_users($conn);
      $this->fill_table_users($conn);
    }

    try {
      $conn->query("SELECT * FROM cities LIMIT 1");
    }
    catch(PDOException $e) {
      $this->table_cities($conn);
      $this->fill_table_cities($conn);
    }

    try {
      $conn->query("SELECT * FROM tags LIMIT 1");
    }
    catch(PDOException $e) {
      $this->table_tags($conn);
      $this->fill_table_tags($conn);
    }

    try {
      $conn->query("SELECT * FROM images LIMIT 1");
    }
    catch(PDOException $e) {
      $this->table_images($conn);
      $this->fill_table_images($conn);
    }

    try {
      $conn->query("SELECT * FROM viewers LIMIT 1");
    }
    catch(PDOException $e) {
      $this->table_viewers($conn);
    }

    try {
      $conn->query("SELECT * FROM likes LIMIT 1");
    }
    catch(PDOException $e) {
      $this->table_likes($conn);
    }

    try {
      $conn->query("SELECT * FROM chat LIMIT 1");
    }
    catch(PDOException $e) {
      $this->table_chat($conn);
    }

    try {
      $conn->query("SELECT * FROM notif LIMIT 1");
    }
    catch(PDOException $e) {
      $this->table_notif($conn);
    }

    return $conn;
  }

  private function table_users($db) {
  try {
    $db->query("CREATE TABLE IF NOT EXISTS users (
                id INT UNIQUE AUTO_INCREMENT PRIMARY KEY,
                active INT DEFAULT 0,
                complete INT DEFAULT 0,
                firstname VARCHAR(30) NOT NULL,
                lastname VARCHAR(30) NOT NULL,
                email VARCHAR(50) UNIQUE NOT NULL,
                birth VARCHAR(30) DEFAULT NULL,
                age INT DEFAULT 0,
                gender VARCHAR(30) DEFAULT 'Male',
                orientation VARCHAR(30) DEFAULT 'Bisexuel',
                login VARCHAR(30) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                token VARCHAR(255) DEFAULT NULL,
                token_log VARCHAR(255) DEFAULT NULL,
                last_log TIMESTAMP DEFAULT NULL,
                bio VARCHAR(255) DEFAULT NULL,
                score INT DEFAULT 50,
                views VARCHAR(255) DEFAULT NULL,
                city VARCHAR(255) DEFAULT NULL,
                arr CHAR(2) DEFAULT NULL,
                dept CHAR(2) DEFAULT NULL,
                ZIP VARCHAR(5) DEFAULT NULL,
                region VARCHAR(255) DEFAULT NULL,
                latitude VARCHAR(255) DEFAULT NULL,
                longitude VARCHAR(255) DEFAULT NULL,
                reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
      }
      catch(PDOException $e) {
        echo "user_table failed: " . $e->getMessage();
      }
  }


  private function table_tags($db) {
  try {
    $db->query("CREATE TABLE IF NOT EXISTS tags (
                id INT UNIQUE AUTO_INCREMENT PRIMARY KEY,
                tag VARCHAR(50) NOT NULL UNIQUE,
                userids VARCHAR(1024) NOT NULL,
                reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
      }
      catch(PDOException $e) {
        echo "tags_table failed: " . $e->getMessage();
      }
  }


  private function table_images($db) {
  try {
    $db->query("CREATE TABLE IF NOT EXISTS images (
                id INT UNIQUE AUTO_INCREMENT PRIMARY KEY,
                link VARCHAR(255) NOT NULL,
                userid INT NOT NULL,
                profil INT DEFAULT 0,
                reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
      }
      catch(PDOException $e) {
        echo "images_table failed: " . $e->getMessage();
      }
  }


  private function table_viewers($db) {
    try {
      $db->query("CREATE TABLE IF NOT EXISTS viewers (
                  id INT UNIQUE AUTO_INCREMENT PRIMARY KEY,
                  visitor INT NOT NULL,
                  host INT NOT NULL,
                  visit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
        }
        catch(PDOException $e) {
          echo "viewers_table failed: " . $e->getMessage();
        }
  }


  private function table_likes($db) {
    try {
      $db->query("CREATE TABLE IF NOT EXISTS likes (
                  id INT UNIQUE AUTO_INCREMENT PRIMARY KEY,
                  liker INT NOT NULL,
                  action VARCHAR(20) DEFAULT 'liked =>',
                  liked INT NOT NULL,
                  visit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
        }
        catch(PDOException $e) {
          echo "likes_table failed: " . $e->getMessage();
        }
  }


  private function table_cities($db) {
  try {
    $db->query("CREATE TABLE IF NOT EXISTS cities (
                id INT UNIQUE AUTO_INCREMENT PRIMARY KEY,
                city VARCHAR(50) NOT NULL,
                arr CHAR(2) DEFAULT NULL,
                dep CHAR(2) NOT NULL,
                ZIP CHAR(5) NOT NULL,
                region VARCHAR(20) DEFAULT NULL,
                latitude VARCHAR(255) DEFAULT NULL,
                longitude VARCHAR(255) DEFAULT NULL,
                reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
      }
      catch(PDOException $e) {
        echo "cities_table failed: " . $e->getMessage();
      }
  }


  private function table_chat($db) {
  try {
    $db->query("CREATE TABLE IF NOT EXISTS chat (
                id INT UNIQUE AUTO_INCREMENT PRIMARY KEY,
                sender VARCHAR(50) NOT NULL,
                msg VARCHAR(1024) DEFAULT NULL,
                receiver VARCHAR(50) NOT NULL,
                reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
      }
      catch(PDOException $e) {
        echo "chat_table failed: " . $e->getMessage();
      }
  }


  private function table_notif($db) {
  try {
    $db->query("CREATE TABLE IF NOT EXISTS notif (
                id INT UNIQUE AUTO_INCREMENT PRIMARY KEY,
                sender VARCHAR(50) NOT NULL,
                msg VARCHAR(100) NOT NULL,
                readen INT DEFAULT 0,
                receiver VARCHAR(50) NOT NULL,
                reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
      }
      catch(PDOException $e) {
        echo "notif_table failed: " . $e->getMessage();
      }
  }


  private function fill_table_users($db) {
    $fileUsers = fopen("../config/seed/USERS.CSV", "r");
    $filesIdf = fopen("../config/seed/CITIES.CSV", "r");
    $fileParis = fopen("../config/seed/PARIS.CSV", "r");
    $fileScore = fopen("../config/seed/SCORE.CSV", "r");
    $i = 0;
    $j = 0;


    $sql = "INSERT INTO users SET
    active=:active,
    complete=:complete,
    firstname=:firstname,
    lastname=:lastname,
    email=:email,
    birth=:birth,
    age=:age,
    gender=:gender,
    orientation=:orientation,
    last_log=:last_log,
    login=:login,
    password=:password,
    token_log=:token_log,
    score=:score,
    bio=:bio,
    city=:city,
    arr=:arr,
    dept=:dept,
    ZIP=:ZIP,
    region=:region,
    latitude=:latitude,
    longitude=:longitude;";

    while (! feof($fileUsers))
    {
      if (feof($fileParis)) {
        fclose($fileParis);
        $fileParis = fopen("../config/seed/PARIS.CSV", "r");
      }

      $score = fgets($fileScore);
      $ligne = explode(",", fgets($fileUsers));
      if ($i >= 400)
        $idf = explode(",", fgets($filesIdf));
      else
        $paris = explode(",", fgets($fileParis));

      if ($ligne[0]) {
        $birth = trim($ligne[3], '"');
        $birth = explode('/', $birth);
        $age = (date("md", date("U", mktime(0, 0, 0, $birth[0], $birth[1], $birth[2])))
        > date("md") ?
        ((date("Y") - $birth[2]) - 1) : (date("Y") - $birth[2]));

        $orientation = [
          '0' => 'Hétérosexuel',
          '1' => 'Homosexuel',
          '2' => 'Bisexuel'
        ];

        if ($j > 2)
          $j = 0;

        $today = time();
        $ago = time() - 604800;
        $time = rand($ago, $today);
        $date = date('Y/m/d H:i:s', $time);

        $row = [
          'active' => 1,
          'complete' => 1,
          'firstname' => $ligne[0],
          'lastname' => $ligne[1],
          'email' => $ligne[2],
          'birth' => $ligne[3],
          'age' => $age,
          'gender' => $ligne[4],
          'orientation' => $orientation[$j],
          'login' => $ligne[5],
          'password' => hash('whirlpool', $ligne[6]),
          'token_log' => $j == 2 ? 'bonsoir' : NULL,
          'score' => $score,
          'last_log' => $date,
          'bio' => str_replace(["\n","\r"], "", $ligne[7]),
          'city' => $i < 400 ? $paris[0] . ' ' . $paris[1] : $idf[0],
          'arr' => $i < 400 ? $paris[1] : NULL,
          'dept' => $i < 400 ? $paris[2] : $idf[1],
          'ZIP' => $i < 400 ? $paris[3] : $idf[2],
          'region' => "Île-de-France",
          'latitude' => $i < 400 ? $paris[4] : $idf[3],
          'longitude' => $i < 400 ? $paris[5] : $idf[4]
        ];

        $db->prepare($sql)->execute($row);
        $i++;
        $j++;
      }
    }
    fclose($fileUsers);
    fclose($filesIdf);
    fclose($fileParis);
  }


  private function fill_table_tags($db) {
      $file = fopen("../config/seed/TAGS.CSV", "r");
      $sql = "SELECT count(*) FROM users";
      $ret = $db->query($sql)->fetchAll(PDO::FETCH_ASSOC);

      $max = $ret[0]['count(*)'];
      $i = 0;
      while ($i++ != $max) {
        if (feof($file)) {
          fclose($file);
          $file = fopen("../config/seed/TAGS.CSV", "r");
        }
        $ligne = explode(',', fgets($file));
        if ($ligne[0]) {
          $j = 0;
          while ($j++ < 3) {
            $rand = rand(0, 50);
            $value = $ligne[$rand];
            $sql = "SELECT * FROM tags WHERE
            tag = '$value'";

            if ($ret = $db->query($sql)->fetch(PDO::FETCH_ASSOC)) {
              $userids = $ret['userids'];
              $regex = "/(,|^)$i(,|$)/";
              if (! preg_match($regex, $userids, $match)) {
                $row = [
                  'userids' => $ret['userids'] . ',' . $i,
                  'tag' => $value
                ];

                $sql = "UPDATE tags SET
                userids=:userids
                WHERE
                tag=:tag;";

                $db->prepare($sql)->execute($row);
              }
              else
                $j--;
            }
            else {
              $row = [
                'tag' => $value,
                'userids' => $i
              ];

              $sql = "INSERT INTO tags SET
              tag=:tag,
              userids=:userids;";

              $db->prepare($sql)->execute($row);
            }
          }
        }
      }
      fclose($file);
  }


  private function fill_table_cities($db) {
    $fileParis = fopen("../config/seed/PARIS.CSV", "r");
    $fileCities = fopen("../config/seed/CITIES.CSV", "r");

    while (! feof($fileParis)) {
      $ligne = explode(",", fgets($fileParis));
      if ($ligne[0]) {

        $row = [
          'city' => $ligne[0] . ' ' . $ligne[1],
          'arr' => $ligne[1],
          'dep' => $ligne[2],
          'ZIP' => $ligne[3],
          'region' => "Île-de-France",
          'latitude' => $ligne[4],
          'longitude' => $ligne[5]
        ];

        $sql = "INSERT INTO cities SET
        city=:city,
        arr=:arr,
        dep=:dep,
        ZIP=:ZIP,
        region=:region,
        latitude=:latitude,
        longitude=:longitude;";

        $db->prepare($sql)->execute($row);
      }
    }
    fclose($fileParis);

    while (! feof($fileCities)) {
      $ligne = explode(",", fgets($fileCities));
      if ($ligne[0]) {

        $row = [
          'city' => $ligne[0],
          'dep' => $ligne[1],
          'ZIP' => $ligne[2],
          'region' => "Île-de-France",
          'latitude' => $ligne[3],
          'longitude' => $ligne[4]
        ];

        $sql = "INSERT INTO cities SET
        city=:city,
        dep=:dep,
        ZIP=:ZIP,
        region=:region,
        latitude=:latitude,
        longitude=:longitude;";

        $db->prepare($sql)->execute($row);
      }
    }
    fclose($fileCities);
  }


  private function fill_table_images($db) {
    $profileJeremie = "img/" . DIRECTORY_SEPARATOR . "d107245412ae9542.jpg";
    $profileLucas = "img/" . DIRECTORY_SEPARATOR . "13474786e5c3314f.JPG";
    $profileMale = "img/" . DIRECTORY_SEPARATOR . "male.jpg";
    $profileFemale = "img/" . DIRECTORY_SEPARATOR . "female.jpg";


    $sql = "INSERT INTO images SET
    link = '$profileJeremie',
    profil = 1,
    userid = 1";

    $sql2 = "INSERT INTO images SET
    link = '$profileLucas',
    profil = 1,
    userid = 2";

    $db->query($sql);
    $db->query($sql2);

    $sql = "SELECT id, gender FROM users WHERE
    id != 1
    AND
    id != 2";
    $ret = $db->query($sql)->fetchAll(PDO::FETCH_ASSOC);

    $max = count($ret);
    $i = 0;
    while ($i != $max) {
      $row = [
        'userid' => $ret[$i]['id'],
        'profil' => 1
      ];

      if ($ret[$i]['gender'] == 'Male') {
        $sql = "INSERT INTO images SET
        link = '$profileMale',
        userid=:userid,
        profil=:profil";

      }
      elseif ($ret[$i]['gender'] == 'Female') {
        $sql = "INSERT INTO images SET
        link = '$profileFemale',
        userid=:userid,
        profil=:profil";
      }
      $db->prepare($sql)->execute($row);
      $i++;
    }
  }

}


?>
