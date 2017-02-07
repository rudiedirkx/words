<?php

require 'env.php';

require WHERE_DB_AT . '/db_sqlite.php';

$db = db_sqlite::open(['database' => __DIR__ . '/db/words.sqlite3']);

$schema = require 'inc.schema.php';
$db->schema($schema);
