<?php

namespace Src\Domain\User\Service;

use Src\Domain\User\Repository\SelfProfilDisplayerRepository;

final class SelfProfilDisplayer
{
    private $repository;

    public function __construct(SelfProfilDisplayerRepository $repository) {
        $this->repository = $repository;
    }

    public function getProfil($id) {
      return $this->repository->displayer($id);
    }
}
