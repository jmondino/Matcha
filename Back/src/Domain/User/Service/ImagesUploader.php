<?php

namespace Src\Domain\User\Service;

use Src\Domain\User\Repository\ImagesUploaderRepository;

final class ImagesUploader
{
    private $repository;

    public function __construct(ImagesUploaderRepository $repository) {
      $this->repository = $repository;
    }

    public function checkImages($uploadedFile, $id) {
      if ($uploadedFile['profil']) {
        if ($error = $this->repository->checkLegal($uploadedFile))
          return $error;
        return $this->repository->uploadProfil($uploadedFile, $id);
      }
      else {
        if ($error = $this->repository->maximum5($uploadedFile, $id))
          return $error;
        return $this->repository->uploadImages($uploadedFile, $id); 
      }
    }
}
