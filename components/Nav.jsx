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
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" href="/">
          Ror
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" href="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/users">
                Users
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="#" onClick={userService.logout}>
                Log out
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
