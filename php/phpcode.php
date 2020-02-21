<?php
ini_set('memory_limit', '-1');
$fileNames = [
	// "a_example.txt",
	// "b_read_on.txt",
	"c_incunabula.txt",
	// "d_tough_choices.txt",
	// "e_so_many_books.txt",
	// "f_libraries_of_the_world.txt",
];

foreach ($fileNames as $key => $fn) {
	scan($fn, $key);
}

function chooseLib($daysLeft, &$libs, &$books, &$Score) {

	foreach ($libs as $key => $lib) {
		if (isset($lib['used'])) {
			$libs[$key]['libScore'] = -1;
			continue;
		}

		$maxBooks = ($daysLeft - $lib['days']) * $lib['ship'];

		if ($maxBooks < $lib['books']) {
			$books[$key] = array_slice($books[$key], 0, $maxBooks);
		}

		$libs[$key]['libScore'] = 0;

		foreach ($books[$key] as $item => $book) {
			$libs[$key]['libScore'] += $Score[$book];
		}

		usort($libs, function ($item1, $item2) {
			return $item2['libScore'] <=> $item1['libScore'];
		});
	}

	return array_shift($libs);
}

function scan($fileName, $INDEX) {
	$file = file_get_contents("../" . $fileName);
	$lines = explode("\n", $file);

	list($Books, $Libs, $Days) = explode(" ", $lines[0]);
	$Score = explode(" ", $lines[1]);

	$libsBase = $booksBase = [];

	for ($i = 0; $i < $Libs; $i++) {
		$line = 2 * ($i + 1);

		list($libsBase[$i]['books'], $libsBase[$i]['days'], $libsBase[$i]['ship']) = explode(" ", $lines[$line]);
		$booksBase[$i] = explode(" ", $lines[$line + 1]);

		$libsBase[$i]['id'] = $i;

		usort($booksBase[$i], function ($item1, $item2) use (&$Score) {
			return $Score[$item2] <=> $Score[$item1];
		});
	}

	$time = $Days;
	$usedLibs = 0;
	$outLibs = [];
	while ($time > 0) {
		$outLibs[] = chooseLib($time, $libsBase, $booksBase, $Score);
		$time = $time - $lib['days'];

		$usedLibs++;
		if ($usedLibs >= $Libs) {
			$time = 0;
		}
	}

	$resfile = $fileName . "_res_";
	$file = fopen($resfile, 'w');

	fwrite($file, count($outLibs) . "\n");

	foreach ($outLibs as $key => $lib) {
		fwrite($file, $lib['id'] . " " . count($booksBase[$lib['id']]) . "\n" . implode(" ", $booksBase[$lib['id']]) . "\n");
	}

	fclose($file);
}