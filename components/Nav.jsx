import { useState, useEffect } from "react";
import { userService } from "services";
import Link from "next/link";

export { Nav };

function Nav() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const subscription = userService.user.subscribe((x) => setUser(x));
    return () => subscription.unsubscribe();
  }, []);

  function openClose(e) {
    e.preventDefault();
    document.querySelector("#wrapper").classList.toggle("toggled");
  }

  // only show nav when logged in
  if (!user) return null;

  return (
    <div>
      <aside id="sidebar-wrapper">
        <div className="sidebar-brand">
          <h2>
            <i className="fa fa-user"></i>
            Ror Vansaj
          </h2>
        </div>

        <ul className="sidebar-nav">
          <li className="nav-item">
            <Link href="/">
              <i className="fa-fw fas fa-home nav-icon"></i>&nbsp; Home
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/users">
              <i className="fa-fw fas fa-list nav-icon"></i>&nbsp; Users
            </Link>
          </li>
          <li className="nav-item">
            <Link onClick={userService.logout} href="#">
              <i className="nav-icon fas fa-fw fa-sign-out-alt"></i>&nbsp;
              Logout
            </Link>
          </li>
        </ul>
      </aside>
    </div>
  );
}
