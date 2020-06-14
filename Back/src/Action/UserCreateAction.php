<?php

namespace Src\Action;

use Src\Domain\User\Data\UserData;
use Src\Domain\User\Service\UserCreator;
use Slim\Http\Response;
use Slim\Http\ServerRequest;

final class UserCreateAction
{
    private $userCreator;

    public function __construct(UserCreator $userCreator) {
        $this->userCreator = $userCreator;
    }

    public function __invoke(ServerRequest $request, Response $response): Response {
        $data = (array)$request->getParsedBody();

        $user = $this->fillUser($data);

        $status = $this->userCreator->createUser($user);

        $result = $status;

        return $response->withJson($result);
    }

    private function fillUser($data): UserData {
      $user = new UserData();
      foreach ($data as $key => $value) {
        if ($key == 'password')
          $user->$key = hash('whirlpool', $value);
        else
          $user->$key = $value;
      }
      return $user;
    }
}
