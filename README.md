# MATCHA

Matcha is a dating website like meetic.  
  
The back works as an API REST developed with Slim4 micro-framework.  
The front is developped with ReactJs.

## How to launch it

Install [mamp](https://www.mamp.info/en/downloads/)  
Edit the path of `DocumentRoot` and `<Directory>` to `(.../)Matcha/code/Back/public`  in files :  
`(.../)mamp/apache2/conf/bitnami/bitnami.conf`  
`(.../)mamp/apache2/conf/httpd.conf`

  
Edit variables `$user`, `$paswd` to your own phpmyadmin configuration in :  
`Matcha/back/config/database.php`

  
Install [composer](https://getcomposer.org/)  
Create an alias for the `composer.phar` to be just `composer`  
Run `composer update` in the back folder.  
  
  
Install [npm](https://nodejs.org/en/download/)  
Run `npm install` in the front folder  
You might want to run `npm audit fix`  
Run `npm start`