<?php

namespace Src\Action;

use Slim\Http\Response;
use Slim\Http\ServerRequest;
use Src\Domain\User\Data\UserAuth;
use Src\Domain\User\Service\ListSuggester;
use Src\Domain\User\Data\SortInstruc;
use Src\Domain\User\Repository\checkUserLoggedRepository;

final class ListSuggestionAction
{
    private $suggester;
    private $checkAuth;

    public function __construct(ListSuggester $suggester, checkUserLoggedRepository $checkAuth) {
        $this->suggester = $suggester;
        $this->checkAuth = $checkAuth;
    }

    public function __invoke(ServerRequest $request, Response $response): Response {
        $data = $request->getParsedBody();
        
        $userAuth = new UserAuth();
        $userAuth->id = $data['id'];
        $userAuth->token = $data['token'];
        
        $instruc = new SortInstruc();
        $instruc->age = $data['age'];
        $instruc->score = $data['score'];
        $instruc->dst = $data['dst'];
        $instruc->tsyn = $data['tsyn'];
        
        if ($status = $this->checkAuth->check($userAuth))
          $result = ['status' => 0, 'error' => $status];
        else
          $result = $this->suggester->getList($userAuth->id, $instruc);
        
        return $response->withJson($result);
    }
}
