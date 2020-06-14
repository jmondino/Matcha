<?php

namespace Src\Domain\User\Service;

use Src\Domain\User\Data\UserData;
use Src\Domain\User\Repository\UserAccEditorRepository;

final class UserDataAccEditor
{
    private $repository;

    public function __construct(UserAccEditorRepository $repository) {
        $this->repository = $repository;
    }


    public function checkInterest($interest, $id) { 
        return $this->repository->insertInterest($interest, $id);
    }


    public function modifyData(UserData $user, $id) {
        if ($error = $this->repository->UserExist($user, $id))
          return ['status' => 0, 'error' => $error];
        else 
          return $this->repository->insertData($user, $id);
    }
}
