<?php
namespace Src\Notif;

use Slim\Http\Response;
use Slim\Http\ServerRequest;
use Src\Domain\User\Data\UserAuth;
use Src\Domain\User\Repository\checkUserLoggedRepository;
use PDO;

final class DeleteNotif
{
    private $connection;
    private $checkAuth;

    public function __construct(PDO $connection, checkUserLoggedRepository $checkAuth) {
        $this->connection = $connection;
        $this->checkAuth = $checkAuth;
    }

    public function __invoke(ServerRequest $request, Response $response): Response {
      $data = $request->getParsedBody();
      $notif = $data['notif'];

      $userAuth = new UserAuth();
      $userAuth->id = $data['id'];
      $userAuth->token = $data['token'];

      if ($status = $this->checkAuth->check($userAuth))
        $result = ['status' => 0, 'error' => $status];
      else {
        foreach ($notif as $key => $value) {
          $sql = "UPDATE notif SET
          readen = 1
          WHERE
          id = '$value'";
          $this->connection->query($sql);

          $result = ['status' => 1, 'success' => 'Notif deleted'];
        }
      }

      return $response->withjson($result);
    }
}
