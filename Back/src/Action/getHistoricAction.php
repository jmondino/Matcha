<?php

namespace Src\Action;

use Slim\Http\Response;
use Slim\Http\ServerRequest;
use Src\Domain\User\Data\UserAuth;
use Src\Domain\User\Service\HistoricGetter;
use Src\Domain\User\Repository\checkUserLoggedRepository;

final class GetHistoricAction
{
    private $historic;
    private $checkAuth;
    
    public function __construct(HistoricGetter $historic, checkUserLoggedRepository $checkAuth) {
        $this->historic = $historic;
        $this->checkAuth = $checkAuth;
    }

    public function __invoke(ServerRequest $request, Response $response): Response {
      $data = $request->getParsedBody();
      
      $userAuth = new UserAuth();
      $userAuth->id = $data['id'];
      $userAuth->token = $data['token'];
      
      if ($status = $this->checkAuth->check($userAuth))
        $result = ['status' => 0, 'error' => $status];
      else
        $result = ['status' => 1, 'success' => $this->historic->getHistoric($userAuth->id)];
      
      return $response->withJson($result);
    }
}