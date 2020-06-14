<?php

namespace Src\Domain\User\Service;

use Src\Domain\User\Data\UserData;
use Src\Domain\User\Repository\UserloggerRepository;

final class UserLogger
{
  private $repository;

  public function __construct(UserLoggerRepository $repository) {
      $this->repository = $repository;
  }

  public function LoginUser(UserData $user) {
    return $this->repository->indentifyUser($user);
  }
}
