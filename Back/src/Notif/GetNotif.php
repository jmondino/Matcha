<?php
namespace Src\Notif;

use Slim\Http\Response;
use Slim\Http\ServerRequest;
use Src\Domain\User\Data\UserAuth;
use Src\Domain\User\Repository\checkUserLoggedRepository;
use PDO;

final class GetNotif
{
    private $connection;
    private $checkAuth;

    public function __construct(PDO $connection, checkUserLoggedRepository $checkAuth) {
        $this->connection = $connection;
        $this->checkAuth = $checkAuth;
    }

    public function __invoke(ServerRequest $request, Response $response): Response {
      $data = $request->getParsedBody();
      $id = $data['id'];

      $userAuth = new UserAuth();
      $userAuth->id = $data['id'];
      $userAuth->token = $data['token'];

      if ($status = $this->checkAuth->check($userAuth))
        $result = ['status' => 0, 'error' => $status];
      else {
        $ret = $this->connection->query("SELECT login FROM users WHERE id = '$id'")->fetch(PDO::FETCH_ASSOC);

        $receiver = $ret['login'];

        $sql = "SELECT * FROM notif WHERE
        receiver=:receiver
        AND
        readen = 0
        ORDER BY id ASC LIMIT 15;";

        $row = [
          'receiver' => $receiver
        ];

        $ret = $this->connection->prepare($sql);
        $ret->execute($row);
        $ret = $ret->fetchAll(PDO::FETCH_ASSOC);

        $i = 0;
        foreach ($ret as $key => $value) {
          $time = explode(' ', $ret[$i]['reg_date']);
          $hour = explode(':', $time[1]);
          $date = explode('-', $time[0]);

          $ret[$i][date] = $date[2] . '/' . $date[1] . '/' . $date[0];
          $ret[$i][hour] = $hour[0] . ':' . $hour[1];
          $ret[$i]['readen'] = (int)$ret[$i]['readen'];
          $ret[$i]['id'] = (int)$ret[$i]['id'];
          unset($ret[$i]['reg_date']);
          unset($ret[$i]['receiver']);
          $i++;
        }

        $result = ['status' => 1, 'success' => $ret];
      }

      return $response->withJson($result);
    }
}
