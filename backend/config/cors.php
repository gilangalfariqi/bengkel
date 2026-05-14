<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
        'http://localhost:3001',
    ],

    // Allow additional dev origins without having to re-edit this file.
    'allowed_origins_patterns' => ['http://127.0.0.1:*', 'http://localhost:*'],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];

