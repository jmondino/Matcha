<?php

namespace Src\Action;

use PDO;
use Slim\Http\Response;
use Slim\Http\ServerRequest;

final class GetCitiesAction
{
    private $connection;

    public function __construct(PDO $connection) {
      $this->connection = $connection;
    }

    public function __invoke(ServerRequest $request, Response $response): Response {
      $sql = "SELECT * FROM cities";
      
      $ret = $this->connection->query($sql)->fetchAll(PDO::FETCH_ASSOC);
      
      return $response->withJson($ret);
    }
}