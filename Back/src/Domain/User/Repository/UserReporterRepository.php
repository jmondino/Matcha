<?php

namespace Src\Domain\User\Repository;

use PDO;

class UserReporterRepository
{
    private $connection;


    public function __construct(PDO $connection) {
        $this->connection = $connection;
    }


    public function report($id, $loginToReport) {
      $email = "m.ondino@hotmail.fr";

      $sql = "SELECT * FROM users WHERE
      id = '$id'";
      $reporter = $this->connection->query($sql)->fetch(PDO::FETCH_ASSOC);
  
      $sql = "SELECT * FROM users WHERE
      login = '$loginToReport'";
      $reported = $this->connection->query($sql)->fetch(PDO::FETCH_ASSOC);

      $to  = $email;
      $subject = "REPORT";
      $message = '
        <html>
         <head>
         </head>
         <body>
           <p>ADMIN REPORT</p><br>
           <p>L\'utilisateur <b>' . $reporter['login'] . '</b> suspect le compte <b>' . $reported['login'] . '</b>
            d\'être un faux compte, une investigation doit être faite.</p><br><br>
         </body>
        </html>
        ';
        $headers[] = 'MIME-Version: 1.0';
        $headers[] = 'Content-Type: text/html; charset=utf-8';
        $headers[] = "To: < $email >";
        $headers[] = "From: Matcha <noreply@localhost>";

        mail($to, $subject, $message, implode("\r\n", $headers));
        
        return ['status' => 1, 'success' => 'reported successfully'];
    }
    
}