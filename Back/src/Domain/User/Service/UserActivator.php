<?php

namespace Src\Domain\User\Service;

use Src\Domain\User\Repository\UserActivatorRepository;

final class UserActivator
{
    private $repository;

    public function __construct(UserActivatorRepository $repository) {
        $this->repository = $repository;
    }


    public function getToken($token) {
      return $this->repository->activeAcc($token);
    }
}
