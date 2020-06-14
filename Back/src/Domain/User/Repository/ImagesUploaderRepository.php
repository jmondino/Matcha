<?php

namespace Src\Domain\User\Repository;

use Slim\Http\UploadedFile;
use PDO;

class ImagesUploaderRepository
{
    private $connection;

    public function __construct(PDO $connection) {
      $this->connection = $connection;
    }

    public function maximum5($image, $id) {
      $sql = "SELECT * FROM images WHERE
      userid = '$id'
      AND
      profil = 0";
      $ret = $this->connection->query($sql)->fetchAll(PDO::FETCH_ASSOC);
      if (count($ret) == 4)
        return [
          'status' => 0,
          'error' => 'Vous ne pouvez, qu\'envoyer un maximum de 4 images.'
        ];

      return $this->checkLegal($image);
    }


    public function checkLegal($image) {
      foreach ($image as $key => $value) {
        $image = $value;
      }
      $legalExtensions = array("jpg", "png", "jpeg", "JPG", "PNG", "JPEG");
      $legalSize = "10000000"; // 1 mo
      $extension = pathinfo($image->getClientFilename(), PATHINFO_EXTENSION);
      $size = $image->getSize();
      if (! in_array($extension, $legalExtensions)) {
        return [
        'status' => 0,
        'error' => 'Seulement les images de type : JPG, PNG, JPEG sont tolérées'
        ];
      }
      if ($size > $legalSize) {
        return [
        'status' => 0,
        'error' => 'Seulement les images de moins de 10mo sont tolérées'
        ];
      }
    }


    public function uploadProfil($image, $id) {
      $directory = "img/";
      foreach ($image as $key => $value) {
        $image = $value;
      }
      if ($image->getError() === UPLOAD_ERR_OK && $key == 'profil') {
        $filepath = $this->moveUploadedFile($directory, $image);
        $sql = "SELECT link FROM images WHERE
        userid = '$id'
        AND
        profil = 1";
        if ($ret = $this->connection->query($sql)->fetch(PDO::FETCH_ASSOC)) {
          $row = [
            'profil' => 1,
            'userid' => $id,
            'link' => $filepath
          ];

          $sql = "UPDATE images SET
          link=:link
          WHERE
          userid=:userid
          AND
          profil=:profil";

          unlink($ret['link']);
          $this->connection->prepare($sql)->execute($row);
          return [
            'status' => 1,
            'success' => $filepath
          ];
        }
        else {
          $row = [
            'profil' => 1,
            'userid' => $id,
            'link' => $filepath
          ];

          $sql = "INSERT INTO images SET
          link=:link,
          userid=:userid,
          profil=:profil;";

          $this->connection->prepare($sql)->execute($row);
          return [
            'status' => 1,
            'success' => $filepath
          ];
        }
      }
    }

    public function uploadImages($image, $id) {
      $directory = "img/";
      foreach ($image as $key => $value) {
        $image = $value;
      }
      if ($image->getError() === UPLOAD_ERR_OK && $key != 'profil') {
        $filepath = $this->moveUploadedFile($directory, $image);
        $row = [
          'profil' => 0,
          'link' => $filepath,
          'userid' => $id
        ];

        $sql = "INSERT INTO images SET
        profil=:profil,
        link=:link,
        userid=:userid;";

        $this->connection->prepare($sql)->execute($row);
      }
      return [
        'status' => 1,
        'success' => 'images saved'
      ];
    }

    private function moveUploadedFile($directory, $uploadedFile) {
    $extension = pathinfo($uploadedFile->getClientFilename(), PATHINFO_EXTENSION);
    $basename = bin2hex(random_bytes(8));
    $filename = sprintf('%s.%0.8s', $basename, $extension);
    $filepath = $directory . DIRECTORY_SEPARATOR . $filename;

    $uploadedFile->moveTo($filepath);

    return $filepath;
  }
}
