<?php

namespace Src\Action;

use Slim\Http\Response;
use Slim\Http\ServerRequest;
use Src\Domain\User\service\UserDataAccEditor;
use Src\Domain\User\Data\UserData;
use Src\Domain\User\Data\UserAuth;
use Src\Domain\User\Repository\checkUserLoggedRepository;

final class UserDataAccEditAction
{
    private $userDataAccEditor;
    private $checkAuth;

    public function __construct(UserDataAccEditor $userDataAccEditor, checkUserLoggedRepository $checkAuth) {
      $this->userDataAccEditor = $userDataAccEditor;
      $this->checkAuth = $checkAuth;
    }

    public function __invoke(ServerRequest $request, Response $response): Response {
        $data = $request->getParsedBody();

        $userAuth = new UserAuth();
        $userAuth->id = $data['id'];
        $userAuth->token = $data['token'];

        $user = $this->fillUser($data);

        if ($status = $this->checkAuth->check($userAuth))
          $result = ['status' => 0, 'error' => $status];
        else {
          if (isset($data['interest']))
            $this->userDataAccEditor->checkInterest($data['interest'], $userAuth->id);
          $result = $this->userDataAccEditor->modifyData($user, $userAuth->id);
        }

        return $response->withJson($result);
    }


    private function fillUser($data): UserData {
      $user = new UserData();
      foreach ($data as $key => $value) {
        if ($key == 'password')
          $user->$key = hash('whirlpool', $value);
        elseif ($key != 'id' && $key != 'token')
          $user->$key = $value;
      }
      return $user;
    }
}
