<?php

namespace Src\Domain\User\Repository;

use PDO;

class UserPasswordRecovererRepository
{
    private $connection;


    public function __construct(PDO $connection) {
        $this->connection = $connection;
    }


    public function sendMail($data) {
      $email = $data['email'];
      $token = bin2hex(openssl_random_pseudo_bytes(4, $truc));

      $row = [
        'email' => $email
      ];

      $sql = "SELECT * FROM users WHERE
      email=:email;";

      $ret = $this->connection->prepare($sql);
      $ret->execute($row);
      if (!$ret = $ret->fetch(PDO::FETCH_ASSOC))
        return ['status' => 0, 'error' => 'Le mail n\'existe pas.'];

      $to  = $email;
      $subject = "Récupération du mot de passe";
      $message = '
        <html>
         <head>
         </head>
         <body>
           <p>Bonjour ' . $ret['firstname'] . ',</p><br>
           <p>Vous avez demandé à recevoir un nouveau mot de passe pour votre compte
           <b>' . $ret['login'] . '</b>.</p>
           <p>Il vous suffit de <b>copier le code ci-dessous
           puis de le renseigner sur la page de récupération correspondante.</b></p><br><br>
           <center><b style="font-size: 26px;">' . $token . '</b></center>
         </body>
        </html>
        ';
        $headers[] = 'MIME-Version: 1.0';
        $headers[] = 'Content-Type: text/html; charset=utf-8';
        $headers[] = "To: < $email >";
        $headers[] = "From: Matcha <noreply@localhost>";

        if (mail($to, $subject, $message, implode("\r\n", $headers))) {
          $row = [
            'token' => $token,
            'email' => $email
          ];

          $sql = "UPDATE users SET
          token=:token
          WHERE
          email=:email;";

          $this->connection->prepare($sql)->execute($row);

          return ['status' => 1, 'success' => 'Un email vient d\'être envoyé à ' . $email . '.'];
        }

        else
          return ['status' => 0, 'error' => 'L\'email n\'a pu être envoyé suit à une erreur inconnue.'];
    }


    public function confirmToken($data) {
      $email = $data['email'];
      $token = $data['token'];

      $row = [
        'token' => $token,
        'email' => $email
      ];

      $sql = "SELECT * FROM users WHERE
      token=:token
      AND
      email=:email;";

      $ret = $this->connection->prepare($sql);
      $ret->execute($row);
      if (!$ret = $ret->fetch(PDO::FETCH_ASSOC))
        return ['status' => 0, 'error' => 'Le token n\'est pas correct.'];
      else {
          file_put_contents($file, ';' . $token, FILE_APPEND);
          return ['status' => 1, 'success' => 'Le token est correct'];
      }
    }


    public function verifyPassword($data) {
      $email = $data['email'];
      $token = $data['token'];
      $password = hash('whirlpool', $data['password']);

      $row = [
        'email' => $email,
        'token' => $token,
      ];

      $sql = "SELECT * FROM users WHERE
      email=:email
      AND
      token=:token;";

      $ret = $this->connection->prepare($sql);
      $ret->execute($row);
      $ret = $ret->fetch(PDO::FETCH_ASSOC);
      if ($ret['password'] == $password)
        return ['status' => 0, 'error' => 'Le mot de passe ne peut être identique à l\'ancien'];

    }


    public function insertPassword($data) { 
      $row = [
        'email' => $data['email'],
        'token' => $data['token'],
        'password' => hash('whirlpool', $data['password'])
      ];

      $sql = "UPDATE users SET
      password=:password
      WHERE
      email=:email
      AND
      token=:token;";

      $this->connection->prepare($sql)->execute($row);
      unlink($file);
      return ['status' => 1, 'success' => 'Le mot de passe à été changé avec succès'];
    }
}
