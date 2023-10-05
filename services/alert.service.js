import Swal from "sweetalert2";

export const alertService = {
  success,
  warning,
  error,
  confirm,
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

function confirm({ message, title, save }) {
  Swal.fire({
    title: title || "Are you sure?",
    text: message || "You will not be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      save();
    }
  });
}
