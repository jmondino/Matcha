<?php

namespace Src\Action;

use Src\Domain\User\Service\UserActivator;
use Slim\Http\Response;
use Slim\Http\ServerRequest;

final class ActiveAction
{
    private $userActivator;

    public function __construct(UserActivator $userActivator) {
      $this->userActivator = $userActivator;
    }

    public function __invoke(ServerRequest $request, Response $response): Response {
        $data = $request->getQueryParams();

        $result = $this->userActivator->getToken($data['token']);

        return $response->withJson($result);;
    }
}
