<?php
namespace Src\Chat;

use Slim\Http\Response;
use Slim\Http\ServerRequest;
use Src\Domain\User\Data\UserAuth;
use Src\Domain\User\Repository\checkUserLoggedRepository;
use PDO;

final class GetRoom
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

      $userAuth = new UserAuth();
      $userAuth->id = $data['id'];
      $userAuth->token = $data['token'];

      if ($status = $this->checkAuth->check($userAuth))
        $result = ['status' => 0, 'error' => $status];
      else {
        $me = $this->connection->query("SELECT login FROM users WHERE id = '$from'")->fetch(PDO::FETCH_ASSOC);

        $login = $me['login'];

        $sql = "SELECT * FROM chat WHERE
        sender = '$login'
        OR
        receiver = '$login'";
        $ret = $this->connection->query($sql)->fetchAll(PDO::FETCH_ASSOC);

        $i = 0;
        $j = 0;
        $check[] = $login;
        foreach ($ret as $key => $value) {
            if (!in_array($ret[$i]['receiver'], $check)) {
              $check[] = $ret[$i]['receiver'];
              $login_to = $ret[$i]['receiver'];
              $them = $this->connection->query("SELECT firstname, lastname FROM users WHERE login = '$login_to'")->fetch(PDO::FETCH_ASSOC);
              $myConv[$j][login] = $login_to;
              $myConv[$j][firstname] = $them['firstname'];
              $myConv[$j][lastname] = $them['lastname'];
              $j++;
            }
            elseif (!in_array($ret[$i]['sender'], $check)) {
              $check[] = $ret[$i]['sender'];
              $login_to = $ret[$i]['sender'];
              $them = $this->connection->query("SELECT firstname, lastname FROM users WHERE login = '$login_to'")->fetch(PDO::FETCH_ASSOC);
              $myConv[$j][login] = $login_to;
              $myConv[$j][firstname] = $them['firstname'];
              $myConv[$j][lastname] = $them['lastname'];
              $j++;
          }
          $i++;
        }

        $result = ['status' => 1, 'success' => $myConv];
      }

      return $response->withJson($result);
    }
}
