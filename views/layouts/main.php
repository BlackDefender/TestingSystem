<?php
/* @var $this \yii\web\View */
/* @var $content string */

use yii\helpers\Html;
use yii\bootstrap\Nav;
use yii\bootstrap\NavBar;
use yii\widgets\Breadcrumbs;
use app\assets\AppAsset;

AppAsset::register($this);
?>
<?php $this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>">
    <head>
        <meta charset="<?= Yii::$app->charset ?>">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <?= Html::csrfMetaTags() ?>
        <title><?= Html::encode($this->title) ?></title>
        <link href="image/dataart16x16.png" rel="shortcut icon" type="image/png">

        <?php
        // подключаем файлы с шаблонами
        require_once dirname(__FILE__).'/../templates/client.php';
        $this->head();

        ?>
    </head>
    <body style="background: gray">
        <?php $this->beginBody() ?>

        <div class="wrap">
            <header>
                <a id="header-logo" href="/"></a>
                <a id="header-mail" href="mailto:info@dataart.com"></a>
            </header>
            <main>
                <?= $content ?>
            </main>
            <footer>
                <img src="img/image/synergy_inc_blue.png" alt="Логотип Синергия">
            </footer>
        </div>
        <?php
        // подключаем файлы с шаблонами
        require_once dirname(__FILE__).'/../templates/helpers.php';
        $this->endBody();
        ?>
    </body>
</html>
<?php $this->endPage() ?>
