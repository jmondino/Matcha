<?php

namespace Src\Action;

use PDO;
use Slim\Http\Response;
use Slim\Http\ServerRequest;

final class GetTagsAction
{
    private $connection;

    public function __construct(PDO $connection) {
      $this->connection = $connection;
    }

    public function __invoke(ServerRequest $request, Response $response): Response {
      $sql = "SELECT tag FROM tags";
      
      $ret = $this->connection->query($sql)->fetchAll(PDO::FETCH_ASSOC);
      
      $i = 0;
      foreach ($ret as $key => $value) {
        $tags[$i] = $value['tag'];
        $i++;
      }
      return $response->withJson($tags);
    }
}