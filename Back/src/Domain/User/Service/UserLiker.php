<?php

namespace Src\Domain\User\Service;

use Src\Domain\User\Data\UserData;
use Src\Domain\User\Repository\UserLikerRepository;

final class UserLiker
{
    private $repository;

    public function __construct(UserLikerRepository $repository) {
        $this->repository = $repository;
    }


    public function like($user, $id) {
      return $this->repository->addLike($user, $id);
    }
}
