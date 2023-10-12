import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "styles/globals.css";
import { userService } from "services";
import { Nav } from "components";

export default App;

function App({ Component, pageProps }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const title = "Ror Vanshaj BO";
  const userD = userService?.userValue;
  const isLoggedIn = userD?.token;
  const publicPaths = ["/login", "/register"];
  const paths = ["/account", "/users"];
  useEffect(() => {
    // on initial load - run auth check
    authCheck(router.asPath);

    const path = router.asPath.split("?")[0];
    if (isLoggedIn && publicPaths.includes(path)) {
      router.push("/");
      return;
    }

    if (!isLoggedIn && !publicPaths.includes("path")) {
      router.push("/login");
    }

    // on route change start - hide page content by setting authorized to false
    const hideContent = () => setAuthorized(false);
    router.events.on("routeChangeStart", hideContent);

    // on route change complete - run auth check
    router.events.on("routeChangeComplete", authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off("routeChangeStart", hideContent);
      router.events.off("routeChangeComplete", authCheck);
    };
  }, []);

  function authCheck(url) {
    // redirect to login page if accessing a private page and not logged in
    setUser(userService.userValue);

    const path = url.split("?")[0];
    if (!userService.userValue && !publicPaths.includes(path)) {
      // sign up
      let spath = path.split("/account/reglink/");
      if (
        path.includes("reglink") &&
        spath.length === 2 &&
        !spath[1].includes("/")
      ) {
        setAuthorized(true);
      } else {
        // pass change
        let spath = path.split("/resetpasslink/");
        if (
          path.includes("resetpasslink") &&
          spath.length === 2 &&
          !spath[1].includes("/")
        ) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
          router.push({
            pathname: "/login",
            //query: { returnUrl: router.asPath },
          });
        }
      }
    } else {
      setAuthorized(true);
    }
  }

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <div className={`app-container ${user ? "bg-light" : ""}`}>
        <div id="wrapper">
          <Nav />
          <section id="content-wrapper">
            <div className="col-lg-12">
              {authorized && <Component {...pageProps} />}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
