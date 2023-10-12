import { BehaviorSubject } from "rxjs";
import Router from "next/router";

import { fetchWrapper } from "helpers";
import axios from "axios";

const baseUrl = `/api/users`;
const userSubject = new BehaviorSubject(
  typeof window !== "undefined" && JSON.parse(localStorage.getItem("user"))
);

export const userService = {
  user: userSubject.asObservable(),
  get userValue() {
    return userSubject.value;
  },
  get name() {
    return `${userSubject.value?.firstName} ${userSubject.value?.lastName}`;
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
  const res = await fetchWrapper.post(`${baseUrl}/authenticate`, {
    email,
    password,
  });

  // publish user to subscribers and store in local storage to stay logged in between page refreshes
  const user = res.data;
  userSubject.next(user);
  localStorage.setItem("user", JSON.stringify(user));
}

function logout() {
  // remove user from local storage, publish null to user subscribers and redirect to login page
  localStorage.removeItem("user");
  userSubject.next(null);
  Router.push({ pathname: "/login" });
}

async function register(user) {
  return await fetchWrapper.post(`${baseUrl}/register`, user);
}

async function sendRegMail(user) {
  let data = {
    service_id: "service_anfkdec",
    template_id: "template_px4i2lf",
    user_id: "m9YvzMj0HDLG1qHK_",
    template_params: {
      userMail: user.email,
      regLinkMail: user.regLinkMail,
      firstName: user.firstName,
    },
  };

  const options = {
    method: "post",
    url: "https://api.emailjs.com/api/v1.0/email/send",
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

async function getAll(params) {
  return await fetchWrapper.post(baseUrl, params);
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
