<?php

namespace Src\Action;

use Slim\Http\Response;
use Slim\Http\ServerRequest;
use Src\Domain\User\Data\UserAuth;
use Src\Domain\User\Service\ImagesUploader;
use Src\Domain\User\Repository\checkUserLoggedRepository;

final class UploadImagesAction
{
    private $imagesUploader;
    private $checkAuth;
    
    public function __construct(ImagesUploader $imagesUploader, checkUserLoggedRepository $checkAuth) {
        $this->imagesUploader = $imagesUploader;
        $this->checkAuth = $checkAuth;
    }

    public function __invoke(ServerRequest $request, Response $response): Response {
        $uploadedFile = $request->getUploadedFiles();
        $log = $request->getQueryParams();
        
        $userAuth = new UserAuth();
        $userAuth->id = $log['id'];
        $userAuth->token = $log['token'];
        
        if ($status = $this->checkAuth->check($userAuth))
          $result = ['status' => 0, 'error' => $status];
        else
          $result = $this->imagesUploader->checkImages($uploadedFile, $userAuth->id);
        
        return $response->withJson($result);
    }
}
