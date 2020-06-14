<?php

namespace Src\Action;

use Slim\Http\Response;
use Slim\Http\ServerRequest;
use Src\Domain\User\Data\UserAuth;
use Src\Domain\User\Repository\UserReporterRepository;
use Src\Domain\User\Repository\checkUserLoggedRepository;

final class ReportUserAction
{
    private $reporter;
    private $checkAuth;

    public function __construct(UserReporterRepository $reporter, checkUserLoggedRepository $checkAuth) {
        $this->reporter = $reporter;
        $this->checkAuth = $checkAuth;
    }

    public function __invoke(ServerRequest $request, Response $response): Response {
        $data = $request->getParsedBody();
        
        $userAuth = new UserAuth();
        $userAuth->id = $data['id'];
        $userAuth->token = $data['token'];
        
        $loginToReport = $data['login'];
        
        if ($status = $this->checkAuth->check($userAuth))
          $result = ['status' => 0, 'error' => $status];
        else
          $result = ['status' => 1, 'success' => $this->reporter->report($userAuth->id, $loginToReport)];
        
        return $response->withJson($result);
    }
}