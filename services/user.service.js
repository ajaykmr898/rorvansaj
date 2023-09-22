import { BehaviorSubject } from "rxjs";
import Router from "next/router";

import { fetchWrapper } from "helpers";
import { alertService } from "./alert.service";
import axios from "axios";
//import nodemailer from "nodemailer";

const baseUrl = `/api/users`;
const userSubject = new BehaviorSubject(
  typeof window !== "undefined" && JSON.parse(localStorage.getItem("user"))
);

export const userService = {
  user: userSubject.asObservable(),
  get userValue() {
    return userSubject.value;
  },
  login,
  logout,
  register,
  getAll,
  getById,
  getByRegLink,
  update,
  delete: _delete,
  sendRegMail: sendRegMail,
  updateUser: updateUser,
};

async function login(email, password) {
  const user = await fetchWrapper.post(`${baseUrl}/authenticate`, {
    email,
    password,
  });

  // publish user to subscribers and store in local storage to stay logged in between page refreshes
  userSubject.next(user);
  localStorage.setItem("user", JSON.stringify(user));
}

function logout() {
  alertService.clear();
  // remove user from local storage, publish null to user subscribers and redirect to login page
  localStorage.removeItem("user");
  userSubject.next(null);
  Router.push("/account/login");
}

async function register(user) {
  await fetchWrapper.post(`${baseUrl}/register`, user);
}

async function sendRegMail(user) {
  let data = {
    service_id: "service_anfkdec",
    template_id: "template_px4i2lf",
    user_id: "m9YvzMj0HDLG1qHK_",
    template_params: {
      emailOrPhone: "1",
      depFrom: "",
      arrTo: "",
      depArrDate: "",
      adultNum: "",
      childNum: "",
      infantNum: "",
      stopType: "",
      classType: "",
      oneWayRound: "",
    },
  };

  const options = {
    method: "post",
    url: "https://api.e1mailjs.com/api/v1.0/email/send",
    data: data,
    contentType: "application/json",
  };

  // send the request
  return axios(options)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
}

async function getAll() {
  return await fetchWrapper.get(baseUrl);
}

async function getById(id) {
  return await fetchWrapper.get(`${baseUrl}/${id}`);
}

async function getByRegLink(regLink) {
  return await fetchWrapper.post(`${baseUrl}/signup`, { regLink });
}

async function updateUser(params) {
  await fetchWrapper.put(`${baseUrl}/signup`, params);
}

async function update(id, params) {
  await fetchWrapper.put(`${baseUrl}/${id}`, params);

  // update stored user if the logged in user updated their own record
  if (id === userSubject.value.id) {
    // update local storage
    const user = { ...userSubject.value, ...params };
    localStorage.setItem("user", JSON.stringify(user));

    // publish updated user to subscribers
    userSubject.next(user);
  }
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete(id) {
  await fetchWrapper.delete(`${baseUrl}/${id}`);

  // auto logout if the logged in user deleted their own record
  if (id === userSubject.value.id) {
    logout();
  }
}
