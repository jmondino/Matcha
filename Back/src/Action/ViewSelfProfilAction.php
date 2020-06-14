<?php

namespace Src\Action;

use Src\Domain\User\Service\SelfProfilDisplayer;
use Src\Domain\User\Data\UserAuth;
use Src\Domain\User\Repository\checkUserLoggedRepository;
use Slim\Http\Response;
use Slim\Http\ServerRequest;


final class ViewSelfProfilAction
{
    private $displayer;
    private $checkAuth;
    
    public function __construct(SelfProfilDisplayer $displayer, checkUserLoggedRepository $checkAuth) {
      $this->displayer = $displayer;
      $this->checkAuth = $checkAuth;
    }

    public function __invoke(ServerRequest $request, Response $response, $args): response {
        $data = $request->getQueryParams();
        
        
        $userAuth = new UserAuth();
        $userAuth->id = $data['id'];
        $userAuth->token = $data['token'];
        
        if ($status = $this->checkAuth->check($userAuth))
          $result = ['status' => 0, 'error' => $status];
        else 
          $result = $this->displayer->getProfil($userAuth->id);

        return $response->withJson($result);
    }
}
