const fs = require("fs").promises;

async function createFileResult(list, fileName = "result.txt") {
  try {
    const data = list.reduce((acc, item) => {
      const library = `${item.libraryId} ${
        item.booksForScanning
      }\n${item.booksIds.join(" ")}`;

      return `${acc}\n${library}`;
    }, `${list.length}`);

    await fs.writeFile(fileName, data);

    console.log("Done!");
  } catch (e) {
    throw e;
  }
}

function parseLibraries(list) {
  const libraries = [];

  for (let i = 0; i < list.length; i += 2) {
    const [booksAmount, process, perDay] = list[i].split(" ").map(Number);
    const books = [...new Set(list[i + 1].split(" ").map(Number))];

    libraries.push({
      libraryId: i / 2,
      booksAmount,
      process,
      perDay,
      books
    });
  }

  console.log("libraries", libraries);

  return libraries;
}

function parseFile(data) {
  const [info, booksScores, ...librariesList] = data.trim().split(/\n/g);
  const [books, libraries, days] = info.split(" ").map(Number);

  return {
    main: {
      books,
      libraries,
      days
    },
    scores: booksScores.split(" ").map(Number),
    libraries: parseLibraries(librariesList)
  };
}

async function loadData(path) {
  try {
    const file = await fs.readFile(path, "binary");

    return file;
  } catch (e) {
    throw e;
  }
}

function getPosibleSkore(librari, scores, haveDays, bookKoef, coefLibraries) {
  const { booksAmount, process, perDay, books, libraryId } = librari;
  const l = Math.floor(haveDays - process) * perDay;
  const posibleBook = l > booksAmount ? booksAmount : l;
  const c_books = [].concat(books).sort((a, b) => {
    return scores[a] - scores[b];
  });
  let sum = 0;
  for (let i = 0; i < posibleBook; i++) {
    sum = sum + scores[c_books[i]];
  }
  return {
    sum,
    libraryId,
    booksScanned: posibleBook,
    booksIds: c_books.slice(0, posibleBook)
  };
}

function getBestLib(libraries, scores, haveDays, bookKoef, coefLibraries) {
  const libStores = libraries.map(librari => {
    const score = getPosibleSkore(
      librari,
      scores,
      haveDays,
      bookKoef,
      coefLibraries
    );
    return score;
  });
  console.log("libStores =>", libStores);
  let maxIndex = 0;
  for (let i = 1; i < libraries.length; i++) {
    if (libStores[maxIndex].sum < libStores[i].sum) {
      maxIndex = i;
    }
  }

  return libStores[maxIndex];
}

async function main(path, fileName) {
  const file = await loadData(path);
  const initialData = parseFile(file);
  const { main, scores, libraries } = initialData;
  const { books, libraries: count_libraries, days } = main;
  let arrayBook = [];
  for (let b = 0; b < books; b++) {
    arrayBook[b] = 0;
  }
  let coefLibraries = [];
  for (let l = 0; l < count_libraries; l++) {
    coefLibraries[l] = (days - libraries[l].process) / days;
    for (let b = 0; b < books; b++) {
      console.log("libraries[l] =>", libraries[l]);
      if (libraries[l].books.includes(b)) {
        arrayBook[b]++;
      }
    }
  }

  const booksCoef = arrayBook.map(i => i / books);

  let maxLibData = getBestLib(
    libraries,
    scores,
    days,
    booksCoef,
    coefLibraries
  );

  let res = [];
  res.push(maxLibData);
  let currentDay = libraries[maxLibData.libraryId].process;
  let countLib = 1;
  while (currentDay <= days || countLib < libraries.length) {
    const newLib = libraries.filter(item => {});

    currentDay = libraries[maxLibData.libraryId].process;
    countLib++;
  }

  console.log("booksCoef =>", booksCoef);
  // console.log('coefLibraries =>', coefLibraries);
  // console.log("file", initialData);
  // console.log('aa =>', aa);
}

async function createResults() {
  const pathList = [
    { path: "../a_example.txt", fileName: "a_example_result.txt" },
    { path: "../b_read_on.txt", fileName: "b_read_on_result.txt" }
    // { path: '../c_incunabula.txt', fileName: 'c_incunabula_result.txt' },
    // { path: '../e_so_many_books.txt', fileName: 'e_so_many_books_result.txt' },
    // { path: '../f_libraries_of_the_world.txt', fileName: 'f_libraries_of_the_world_result.txt' },
  ];

  async function calc(path, fileName) {
    const result = await main(path);
    await createResults(result, pathList);
  }

  await Promise.all(pathList.map(item => calc(item.path, item.fileName)));
}

createResults();
