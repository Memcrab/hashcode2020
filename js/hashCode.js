const fs = require("fs").promises;

function parseLibraries(list) {
  const libraries = [];

  for (let i = 0; i < list.length; i += 2) {
    const [booksAmount, process, perDay] = list[i].split(" ").map(Number);
    const books = [...new Set(list[i + 1].split(" ").map(Number))];

    libraries.push({
      booksAmount,
      process,
      perDay,
      books
    });
  }

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

async function main(path) {
  const file = await loadData(path);
  const initialData = parseFile(file);

  console.log("file", initialData);
}

main(__dirname + "/a_example.txt");
