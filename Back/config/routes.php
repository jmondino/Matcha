<?php

use Slim\Http\Response;
use Slim\Http\ServerRequest;
use Slim\App;

header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header("Access-Control-Allow-Headers: Content-Type, Authorization");

return function (App $app) {
  $app->get('/api/active', \Src\Action\ActiveAction::class);
  $app->post('/api/create_user', \Src\Action\UserCreateAction::class);
  $app->post('/api/login', \Src\Action\UserLoginAction::class);
  $app->get('/api/logout', \Src\Action\UserLogoutAction::class);
  $app->post('/api/account_editor', \Src\Action\UserDataAccEditAction::class);
  $app->post('/api/recovery_password', \Src\Action\RecoveryPasswordAction::class);
  $app->post('/api/images', \Src\Action\UploadImagesAction::class);
  $app->get('/api/profil/{login}', \Src\Action\ViewProfilAction::class);
  $app->post('/api/suggest_list', \Src\Action\ListSuggestionAction::class);
  $app->post('/api/like', \Src\Action\UserLikeAction::class);
  $app->get('/api/my_account', \Src\Action\ViewSelfProfilAction::class);
  $app->get('/api/get_tags', \Src\Action\GetTagsAction::class);
  $app->post('/api/get_everyone', \Src\Action\GetEveryoneAction::class);
  $app->post('/api/delete_images', \Src\Action\DeleteImagesAction::class);
  $app->post('/api/get_historic', \Src\Action\GetHistoricAction::class);
  $app->post('/api/report', \Src\Action\ReportUserAction::class);
  $app->get('/api/get_cities', Src\Action\GetCitiesAction::class);
  $app->post('/api/send_message', Src\Chat\SendMessage::class);
  $app->post('/api/get_conv', Src\Chat\GetConv::class);
  $app->post('/api/get_notif', Src\Notif\GetNotif::class);
  $app->post('/api/delete_notif', Src\Notif\DeleteNotif::class);
  $app->post('/api/get_room', Src\Chat\GetRoom::class);
};
