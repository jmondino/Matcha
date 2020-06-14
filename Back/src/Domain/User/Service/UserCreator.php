<?php

namespace Src\Domain\User\Service;

use Src\Domain\User\Data\UserData;
use Src\Domain\User\Repository\UserCreatorRepository;

final class UserCreator
{
    private $repository;

    public function __construct(UserCreatorRepository $repository) {
        $this->repository = $repository;
    }
    public function createUser(UserData $user) {
        if ($error = $this->repository->UserExist($user))
          return $error;
        else
          return $this->repository->insertUser($user);
    }
}
