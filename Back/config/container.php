<?php

use Psr\Container\ContainerInterface;
use Selective\Config\Configuration;
use \Slim\Middleware\Session;
use Slim\App;
use Slim\Factory\AppFactory;
use \SlimSession\Helper;

return [
    Configuration::class => function () {
        return new Configuration(require __DIR__ . '/settings.php');
    },

    App::class => function (ContainerInterface $container) {
        AppFactory::setContainer($container);
        $app = AppFactory::create();

        $app->add(new Session([
          'name' => 'user_session',
          'autorefresh' => true,
          'lifetime' => '1 hour'
        ]));
        // Optional: Set the base path to run the app in a sub-directory
        // The public directory must not be part of the base path
        //$app->setBasePath('/slim4-tutorial');

        return $app;
    },

    PDO::class => function (ContainerInterface $container) {
    $config = $container->get(Configuration::class);

    $host = $config->getString('db.host');
    $dbname =  $config->getString('db.database');
    $username = $config->getString('db.username');
    $password = $config->getString('db.password');
    $charset = $config->getString('db.charset');
    $flags = $config->getArray('db.flags');
    $dsn = "mysql:host=$host;dbname=$dbname;charset=$charset";

    return new PDO($dsn, $username, $password, $flags);
},

];
