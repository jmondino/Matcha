<?php

namespace Src\Domain\User\Service;

use Src\Domain\User\Data\UserAuth;
use Src\Domain\User\Repository\ListSuggesterRepository;

final class ListSuggester
{
    private $repository;

    public function __construct(ListSuggesterRepository $repository) {
        $this->repository = $repository;
    }

    public function getList($id, $instruc) {
      if ($error = $this->repository->infoComplete($id))
        return $error;
      
      else
        return $this->repository->displayList($id, $instruc); 
    }
}
