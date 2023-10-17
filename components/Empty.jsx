import Link from "next/link";

export { Empty };

function Empty(props) {
  return (
    <div className="text-center p-4">
      <span className="align-center">{props.text || "No records found"}</span>
      <br />
      <br />
      {props?.action && <Link href={props?.action}>Add</Link>}
    </div>
  );
}
