import Swal from "sweetalert2";

export const alertService = {
  success,
  error,
};

function success(message, title) {
  Swal.fire({
    icon: "success",
    title: title || "Success",
    text: message,
  });
}

function error(message, title) {
  Swal.fire({
    icon: "error",
    title: title || "Error",
    text: message,
  });
}
