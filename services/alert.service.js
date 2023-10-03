import Swal from "sweetalert2";

export const alertService = {
  success,
  warning,
  error,
};

function success(message, title) {
  Swal.fire({
    icon: "success",
    title: title || "Success",
    text: message,
  });
}

function warning(message, title) {
  Swal.fire({
    icon: "warning",
    title: title || "Warning",
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
