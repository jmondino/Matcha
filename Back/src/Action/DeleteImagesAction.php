<?php

namespace Src\Action;

use Slim\Http\Response;
use Slim\Http\ServerRequest;
use Src\Domain\User\Data\UserAuth;
use Src\Domain\User\Repository\checkUserLoggedRepository;
use Src\Domain\User\Repository\ImagesDeleterRepository;

final class DeleteImagesAction
{
    private $imagesDeleter;
    private $checkAuth;

    public function __construct(ImagesDeleterRepository $imagesDeleter, checkUserLoggedRepository $checkAuth) {
        $this->imagesDeleter = $imagesDeleter;
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
          $result = $this->imagesDeleter->delete($data['images'], $userAuth->id);
        
        return $response->withJson($result);
    }
}
