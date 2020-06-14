<?php

namespace Src\Domain\User\Service;

use Src\Domain\User\Repository\SelfProfilDisplayerRepository;

final class HistoricGetter
{
    private $repository;

    public function __construct(SelfProfilDisplayerRepository $repository) {
      $this->repository = $repository;
    }

    public function getHistoric($id) {
      return [
        'historicDay' => $this->repository->getTodayHistorique($id),
        'historicWeek' => $this->repository->getWeekHistorique($id),
        'historicLike' => $this->repository->getLike($id)
      ];
    }
}