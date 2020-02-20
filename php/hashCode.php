<?php

$fileName = "/d_quite_big.in";
$path = realpath(dirname(__FILE__)) . $fileName;
$string = file_get_contents($path);
$lines = explode("\n", $string);

$slicesNumbersANDpizzaNumbers = explode(" ", $lines[0]);

$allPizzaCount = $slicesNumbersANDpizzaNumbers[1];
$maxSlices = $slicesNumbersANDpizzaNumbers[0];
$pizzaList = explode(" ", $lines[1]);

$countPizza = count($pizzaList);

$listOfVariants[array_sum($pizzaList)] = $pizzaList;
$done = false;
$count = 0;

while (!$done) {
    foreach ($listOfVariants as $summ => $case) {
        if (count($case) == 1) {
            $done = true;
            break;
        }
        foreach ($case as $number => $slices) {
            $newCase = $case;
            unset($newCase[$number]);
            $summInside = array_sum($newCase);
            if (!($summInside > $maxSlices) && !($summInside < ($maxSlices * 0.90)) && !($summInside > ($maxSlices * 1.1))) {
                echo ($summInside);
                $listOfVariants[$summInside] = $newCase;
            }
        }
    }
}

$keys = array_keys($listOfVariants);

$resultPizza = array_keys($listOfVariants[max($keys)]);
$resultPizzaCount = count($resultPizza);

$stringResult = $resultPizzaCount . "\n" . implode(" ", $resultPizza);

file_put_contents("./result.in", $stringResult);