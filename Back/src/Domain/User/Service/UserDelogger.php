<?php

namespace Src\Domain\User\Service;

use Src\Domain\User\Data\UserAuth;
use Src\Domain\User\Repository\UserDeloggerRepository;

final class UserDelogger
{
  private $delogger;
  
  public function __construct(UserDeloggerRepository $delogger) {
    $this->delogger = $delogger;
  }  
  
  public function DelogUser($UserAuth) {
    return $this->delogger->delog($UserAuth);
  }
}
