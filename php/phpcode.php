<?php

$fileName = "a_example.txt";
$file = file_get_contents("../" . $fileName);
$lines = explode("\n", $file);

list($Books, $Libs, $Days) = explode(" ", $lines[0]);
$Score = explode(" ", $lines[1]);
$libsBase = $booksBase = [];

for ($i = 0; $i < $Libs; $i++) {
	$line = 2 * ($i + 1);
	list($libsBase[$i]['books'], $libsBase[$i]['days'], $libsBase[$i]['ship']) = explode(" ", $lines[$line]);
	$booksBase[$i] = explode(" ", $lines[$line + 1]);
}

var_dump($libsBase, $booksBase);