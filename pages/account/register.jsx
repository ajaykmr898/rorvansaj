import { useRouter } from "next/router";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { Layout } from "components/account";
import { userService, alertService } from "services";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";

export default Register;

function Register() {
  const router = useRouter();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");

  // form validation rules
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Email not valid").required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  function onSubmit(user) {
    if (user.firstName.trim().length > 0 && user.lastName.trim().length > 0) {
      setButtonDisabled(true);
      setIsLoading(true);
      user.firstName = user.firstName.trim();
      user.lastName = user.lastName.trim();
      user.regLink = uuidv4();
      user.regLinkMail =
        "https://" + window.location.host + "/account/reglink/" + user.regLink;
      return userService
        .register(user)
        .then((res) => {
          userService
            .sendRegMail(user)
            .then(() => {
              alertService.success(
                "User registered successfully, please follow the instructions received by email"
              );
              router.push("login");
            })
            .catch((err) => {
              // @todo manage user delete without login
              // userService.delete(res.id).catch();
              alertService.error(
                "An error occurred. Please recreate your account."
              );
            });
        })
        .catch((err) => {
          setIsError(true);
          setError(err);
        })
        .finally(() => {
          setButtonDisabled(false);
          setIsLoading(false);
        });
    } else {
      setIsError(true);
      setError("Firstname and Lastname are required");
    }
  }

  return (
    <div>
      <div className="row">
        <div className="col-sm-6 offset-sm-3">
          <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex-row">
              <input
                placeholder="First Name"
                name="firstName"
                type="text"
                {...register("firstName")}
                className={`lf--input form-control ${
                  errors.firstName ? "is-invalid" : ""
                }`}
              />
            </div>
            <div className="invalid-feedback">{errors.firstName?.message}</div>

            <div className="flex-row">
              <input
                placeholder="Last Name"
                name="lastName"
                type="text"
                {...register("lastName")}
                className={`lf--input form-control ${
                  errors.lastName ? "is-invalid" : ""
                }`}
              />
            </div>
            <div className="invalid-feedback">{errors.lastName?.message}</div>
            <div className="flex-row">
              <input
                placeholder="Email"
                name="email"
                type="text"
                {...register("email")}
                className={`lf--input form-control ${
                  errors.email ? "is-invalid" : ""
                }`}
              />
            </div>
            <div className="invalid-feedback">{errors.email?.message}</div>
            <div className="flex-row">
              <input
                placeholder="Password"
                name="password"
                type="password"
                {...register("password")}
                className={`lf--input form-control ${
                  errors.password ? "is-invalid" : ""
                }`}
              />
            </div>
            <div className="invalid-feedback">{errors.password?.message}</div>
            <span className="is-invalid text-center">
              {" "}
              {isError ? error : ""}
            </span>
            <input
              className="lf--submit"
              type="submit"
              disabled={buttonDisabled}
              value={isLoading ? "Signing Up..." : "Sign up"}
            />
            <br />
            <Link href="/account/login" className="btn btn-link lf--link">
              Login
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
