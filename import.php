<?php

require 'inc.bootstrap.php';

$fh = fopen('words.txt', 'r');
$imported = 0;

$db->queries = false;

$db->begin();

while ($word = fgets($fh)) {
	$word = trim($word);

	if (!preg_match('#^[a-z]{4,9}$#i', $word)) {
		continue;
	}

	$imported++;
	$commit = $imported % 5000 == 0;

	$db->insert('words', [
		'word' => $word,
		'word_start' => substr($word, 0, 3),
	]);

	if ($commit) {
		$db->commit();

		echo $imported . ' - ' . round(memory_get_peak_usage() / 1e6, 1) . "\n";

		$db->begin();
	}

}

$db->commit();

echo $imported . ' - ' . round(memory_get_peak_usage() / 1e6, 1) . "\n";
