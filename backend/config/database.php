<?php

$host = getenv('DB_HOST') ?: 'mysql.railway.internal';
$port = getenv('DB_PORT') ?: '3306';
$database = getenv('DB_DATABASE') ?: 'railway';
$username = getenv('DB_USERNAME') ?: 'root';
$password = getenv('DB_PASSWORD') ?: '';

return [
    'default' => 'mysql',

    'connections' => [
        'mysql' => [
            'driver'      => 'mysql',
            'host'        => $host,
            'port'        => $port,
            'database'    => $database,
            'username'    => $username,
            'password'    => $password,
            'charset'     => 'utf8mb4',
            'collation'   => 'utf8mb4_unicode_ci',
            'prefix'      => '',
            'strict'      => true,
            'engine'      => null,
        ],
    ],

    'migrations' => [
        'table' => 'migrations',
        'update_date_on_publish' => true,
    ],
];
