<?php

namespace Src\Action;

use Src\Domain\User\Service\UserPasswordRecoverer;
use Slim\Http\Response;
use Slim\Http\ServerRequest;


final class RecoveryPasswordAction
{
    private $recoverer;

    public function __construct(UserPasswordRecoverer $recoverer) {
        $this->recoverer = $recoverer;
    }

    public function __invoke(ServerRequest $request, Response $response): Response {
        $data = $request->getParsedBody();

        if ($data['step'] == 1)
          $result = $this->recoverer->prepareMail($data);

        else if ($data['step'] == 2)
          $result = $this->recoverer->getToken($data);

        else if ($data['step'] == 3)
          $result = $this->recoverer->changePassword($data);

        return $response->withJson($result);
    }
}
