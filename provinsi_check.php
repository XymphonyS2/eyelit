<?php
require __DIR__.'/vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

foreach (\DB::table('provinsi')->get() as $p) {
    echo $p->id . '. ' . $p->nama_provinsi . PHP_EOL;
}
