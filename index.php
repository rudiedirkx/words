<?php

require 'inc.bootstrap.php';

header('Content-type: text/plain; charset=utf-8');

$letters = trim(@$_GET['letters']);

if (!$letters) {
	$range = range('a', 'z');

	$letters = '';
	while (strlen($letters) < 9) {
		$letters .= $range[array_rand($range)];
	}
}

$letters = str_split($letters);
echo strtoupper(implode(' ', $letters)) . "\n\n";

$starts = [];
foreach ($letters as $l1) {
	foreach ($letters as $l2) {
		foreach ($letters as $l3) {
			$starts[$l1 . $l2 . $l3] = '';
		}
	}
}

// print_r($starts);

$words = $db->select('words', ['word_start' => array_keys($starts)])->fields('word');

$available = array_count_values($letters);

$matches = [];
foreach ($words as $word) {
	$wls = str_split($word);
	$ls = $available;

	foreach ($wls as $wl) {
		if (empty($ls[$wl])) {
			continue 2;
		}

		$ls[$wl]--;
	}

	$matches[strlen($word)][] = $word;
}

krsort($matches);
// usort($matches, function($a, $b) {
// 	$len = strlen($b) - strlen($a);
// 	return $len ?: strcmp($a, $b);
// });

print_r($matches);
