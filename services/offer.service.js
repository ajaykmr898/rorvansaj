import { fetchWrapper } from "helpers";

const baseUrl = `/api/offers`;

export const offersService = {
  getAll,
  create,
  delete: _delete,
};

async function getAll() {
  //return await fetchWrapper.get(baseUrl);
  return { data: { offers: [{ idd: "1", firstName: "a", lastName: "s" }] } };
}

async function getByUserId(userId) {}

async function deleteByUserId(userId) {}

async function create(params) {}

async function _delete(id) {}
