<?php

namespace Src\Action;

use Src\Domain\User\Data\UserData;
use Src\Domain\User\Service\UserLIker;
use Src\Domain\User\Data\UserAuth;
use Src\Domain\User\Repository\checkUserLoggedRepository;
use Slim\Http\Response;
use Slim\Http\ServerRequest;


final class UserLikeAction
{
    private $liker;
    private $checkAuth;

    public function __construct(UserLiker $liker, checkUserLoggedRepository $checkAuth) {
        $this->liker = $liker;
        $this->checkAuth = $checkAuth;
    }

    public function __invoke(ServerRequest $request, Response $response): Response {
      $data = $request->getParsedBody();

      $userAuth = new UserAuth();
      $userAuth->id = $data['id'];
      $userAuth->token = $data['token'];

      $user = new UserData;
      $user->login = $data['login'];
      
      if ($status = $this->checkAuth->check($userAuth))
        $result = ['status' => 0, 'error' => $status];
      else {
        $result = $this->liker->like($user, $userAuth->id);
      }
      
      return $response->withJson($result);
    }
}
