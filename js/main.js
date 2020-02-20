const fs = require("fs").promises;

function parseInputData(data) {
  const _data = data
    .trim()
    .split(/\s/g)
    .map(Number);
  const [amount, typesAmount, ...types] = _data;

  return {
    amount,
    typesAmount,
    types
  };
}

async function loadData(path) {
  try {
    const data = await fs.readFile(path, "binary");
    const result = parseInputData(data);

    return result;
  } catch (e) {
    throw e;
  }
}

async function createFile(data) {
  try {
    const types = data.join(" ");
    const body = `${data.length}\n${types}`;

    await fs.writeFile("result.txt", body);
  } catch (err) {
    console.log(err);
  }
}

function findMaxIndex(types, added) {
  return types.reduce(
    (acc, item, index) => {
      if (added.includes(item)) return acc;

      if (item > acc.max) {
        return {
          isFind: true,
          max: item,
          index
        };
      }

      return acc;
    },
    { index: 0, max: 0, isFind: false }
  );
}

function naiveСheck(amount, typesAmount, types) {
  let sum = 0;
  const _types = [...types];
  const added = [];
  const list = [];

  for (let i = 0; i < typesAmount; i++) {
    const { max, index, isFind } = findMaxIndex(_types, added);
    const isPush = isFind && sum + max <= amount;

    if (isPush) {
      list.push(index);
      sum += max;
    }

    if (!added.includes(_types[index])) {
      added.push(_types[index]);
    }
  }

  return list.reverse();
}

async function calcPizza(path) {
  const data = await loadData(path);
  const result = naiveСheck(data.amount, data.typesAmount, data.types);

  await createFile(result);
  console.log("Done!");
}

calcPizza(__dirname + "/a_example.in");
