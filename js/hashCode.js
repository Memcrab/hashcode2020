const fs = require("fs").promises;

function parseLibraries(list) {
  const libraries = [];

  for (let i = 0; i < list.length; i += 2) {
    const [booksAmount, process, perDay] = list[i].split(" ").map(Number);
    const books = [...new Set(list[i + 1].split(" ").map(Number))];

    libraries.push({
      id: i / 2,
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

async function loadData(path) {
  try {
    const file = await fs.readFile(path, "binary");

    return file;
  } catch (e) {
    throw e;
  }
}

async function main(path) {
  try {
    const file = await loadData(path);
    const initialData = parseFile(file);

    // await createFileResult([
    //   {
    //     libraryId: 1,
    //     booksScanned: 3,
    //     booksIds: [5, 2, 3]
    //   },
    //   {
    //     libraryId: 0,
    //     booksScanned: 5,
    //     booksIds: [0, 1, 2, 3, 4]
    //   }
    // ]);

    console.log("file", initialData);
  } catch (e) {
    console.error(e);
  }
}

main("../a_example.txt");
