<?php
namespace Src\Chat;

use Slim\Http\Response;
use Slim\Http\ServerRequest;
use Src\Domain\User\Data\UserAuth;
use Src\Domain\User\Repository\checkUserLoggedRepository;
use PDO;

final class GetConv
{
    private $connection;
    private $checkAuth;
    
    public function __construct(PDO $connection, checkUserLoggedRepository $checkAuth) {
        $this->connection = $connection;
        $this->checkAuth = $checkAuth;
    }

    public function __invoke(ServerRequest $request, Response $response): Response {
      $data = $request->getParsedBody();
      $from = $data['id'];
      $to = $data['to'];
      
      $userAuth = new UserAuth();
      $userAuth->id = $data['id'];
      $userAuth->token = $data['token'];
      
      if ($status = $this->checkAuth->check($userAuth))
        $result = ['status' => 0, 'error' => $status];
      else {
        $ret = $this->connection->query("SELECT login FROM users WHERE id = '$from'")->fetch(PDO::FETCH_ASSOC);

        $sender = $ret['login'];
        
        $sql = "SELECT * FROM chat WHERE
        sender = '$sender'
        AND
        receiver = '$to'
        OR
        sender = '$to'
        AND
        receiver = '$sender'";
        
        $ret = $this->connection->query($sql)->fetchAll(PDO::FETCH_ASSOC);
        
        $i = 0;
        foreach ($ret as $key => $value) {
          $time = explode(' ', $ret[$i]['reg_date']);
          $hour = explode(':', $time[1]);
          $date = explode('-', $time[0]);
          
          $ret[$i][date] = $date[2] . '/' . $date[1] . '/' . $date[0];
          $ret[$i][hour] = $hour[0] . ':' . $hour[1];
          unset($ret[$i]['reg_date']);
          unset($ret[$i]['receiver']);
          $i++;
        }
        $result = ['status' => 1, 'success' => $ret];
      }
      
      return $response->withJson($result);
    }
}