<?php

namespace Src\Domain\User\Service;

use Src\Domain\User\Repository\UserPasswordRecovererRepository;

final class UserPasswordRecoverer
{
    private $repository;

    public function __construct(UserPasswordRecovererRepository $repository) {
        $this->repository = $repository;
    }

    public function prepareMail($email) {
        return $this->repository->sendMail($email);
    }
    public function getToken($token) {
        return $this->repository->confirmToken($token);
    }
    public function changePassword($password) {
        if ($error = $this->repository->verifyPassword($password))
          return $error;
        else
          return $this->repository->insertPassword($password);
    }
}
