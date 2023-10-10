export { Empty };

function Empty(props) {
  return (
    <div className="text-center p-4">
      <span className="align-center">{props.text || "No records found"}</span>
    </div>
  );
}
