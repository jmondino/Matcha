<?php

namespace Src\Action;

use Src\Domain\User\Data\UserData;
use Src\Domain\User\Service\ProfilDisplayer;
use Src\Domain\User\Data\UserAuth;
use Src\Domain\User\Repository\checkUserLoggedRepository;
use Slim\Http\Response;
use Slim\Http\ServerRequest;


final class ViewProfilAction
{
    private $displayer;
    private $checkAuth;

    public function __construct(ProfilDisplayer $displayer, checkUserLoggedRepository $checkAuth) {
      $this->displayer = $displayer;
      $this->checkAuth = $checkAuth;
    }

    public function __invoke(ServerRequest $request, Response $response, $args): response {
      $log = $request->getQueryParams();
      
      $user = new UserData();
      $user->login = $args['login'];
      
      $userAuth = new UserAuth();
      $userAuth->id = $log['id'];
      $userAuth->token = $log['token'];
      
      if ($status = $this->checkAuth->check($userAuth))
        $result = ['status' => 0, 'error' => $status];
      else 
        $result = $this->displayer->getInfo($user, $userAuth->id);

      return $response->withJson($result);
    }
}
