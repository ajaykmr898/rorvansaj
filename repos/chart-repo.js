import { db } from "helpers/api";

const Charts = db.Charts;
export const chartsRepo = {
  getAll,
  create,
};

async function getAll() {
  const cursor = Charts.find({});
  cursor.sort("curDate"); // ASC order
  return cursor;
}

async function create(params) {
  if (await Charts.findOne({ name: params.name })) {
    throw 'Chart "' + params.name + '" is not available';
  }
  const chart = new Charts(params);
  try {
    return await chart.save();
  } catch (err) {
    throw "An error occurred while saving chart, retry" + err;
  }
}
