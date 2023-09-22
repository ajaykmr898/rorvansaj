import { useRouter } from "next/router";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { Layout } from "components/account";
import { userService, alertService } from "services";

export default Login;

function Login() {
  const router = useRouter();

  // form validation rules
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Email not valid").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  function onSubmit({ email, password }) {
    alertService.clear();
    return userService
      .login(email, password)
      .then(() => {
        // get return url from query parameters or default to '/'
        const returnUrl = router.query.returnUrl || "/";
        router.push(returnUrl);
      })
      .catch(alertService.error);
  }

  return (
    <div>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
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
            <input className="lf--submit" type="submit" value="Login" />
            <br />
            <Link href="/account/register" className="btn btn-link lf--forgot">
              Register
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
