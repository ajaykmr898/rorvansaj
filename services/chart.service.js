import { fetchWrapper } from "helpers";
import moment from "moment";

const baseUrl = `/api/chart`;

export const chartService = {
  create,
  getAll,
};

async function getAll() {
  let res = await fetchWrapper.get(baseUrl);
  let dataOC = [];
  let dataHL = [];
  (res?.data || []).map((v, i) => {
    /*dataOC.push({
      x: moment(v.curDate).valueOf(),
      high:
        parseFloat(v.open) > parseFloat(v.close)
          ? parseFloat(v.open)
          : parseFloat(v.close),
      low:
        parseFloat(v.close) < parseFloat(v.open)
          ? parseFloat(v.close)
          : parseFloat(v.open),
    });*/
    dataOC.push({
      x: moment(v.curDate).valueOf(),
      high: parseFloat(v.open),
      low: parseFloat(v.close),
    });
    dataHL.push({
      x: moment(v.curDate).valueOf(),
      high: parseFloat(v.high),
      low: parseFloat(v.low),
    });
  });
  return { dataOC, dataHL };
}

async function create(params) {
  return await fetchWrapper.post(baseUrl, params);
}
