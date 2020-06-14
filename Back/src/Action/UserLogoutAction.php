<?php

namespace Src\Action;

use Src\Domain\User\Service\UserDelogger;
use Src\Domain\User\Data\UserAuth;
use Slim\Http\Response;
use Slim\Http\ServerRequest;


final class UserLogoutAction
{
    private $userDelogger;

    public function __construct(UserDelogger $userDelogger) {
      $this->userDelogger = $userDelogger;
    }

    public function __invoke(ServerRequest $request, Response $response): Response {
        $data = $request->getQueryParams();
        
        $UserLog = new UserAuth();
        $UserLog->id = $data['id'];
        $UserLog->token = $data['token'];
        
        $status = $this->userDelogger->DelogUser($UserLog);

        $result = ['status' => $status];

        return $response->withJson($result);
    }
}
