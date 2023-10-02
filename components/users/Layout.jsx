export { Layout };

function Layout({ children }) {
  return (
    <div id="content-layout">
      <div className="container">{children}</div>
    </div>
  );
}
