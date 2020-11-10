import React, { useContext } from "react";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import { AppCtx } from "../App";

const context = {
  errors: [],
  setErrors: null,
  setOpen: false,
};

export function HandleError(err, comp) {
  if (err instanceof Error) {
    if (err.response) {
      if (err.response.status === 404) {
        context.setErrors([
          ...context.errors,
          "error 404 page not found " +
            comp +
            " " +
            Date(Date.now()).toString(),
        ]);
      } else if (err.response.status === 500) {
        context.setErrors([
          ...context.errors,
          "500 Internal Server Error \n" +
            err.response.headers[
              "com.ibm.ws.opentracing.opentracingjaxrsemcallbackimpl.exception"
            ] +
            " " +
            comp +
            " " +
            Date(Date.now()).toString(),
        ]);
      } else {
        context.setErrors([
          ...context.errors,
          err.response.headers.reason +
            " " +
            comp +
            " " +
            Date(Date.now()).toString(),
        ]);
      }
    } else if (err.request) {
      context.setErrors([
        ...context.errors,
        "Not respond from server " + comp + " " + Date(Date.now()).toString(),
      ]);
    } else {
      context.setErrors([
        ...context.errors,
        err.message + " " + comp + " " + Date(Date.now()).toString(),
      ]);
    }
  } else {
    context.setErrors([
      ...context.errors,
      err,
      //err + " " + Date(Date.now()).toString(),
    ]);
  }
  context.setOpen(true);
}

function ErrorAlert() {
  const { errors, setErrors, open, setOpen } = useContext(AppCtx);
  const msg = errors[errors.length - 1];
  context.setErrors = setErrors;
  context.errors = errors;
  context.setOpen = setOpen;

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={() => setOpen(false)}
          variant="filled"
          severity="error"
        >
          {msg}
        </MuiAlert>
      </Snackbar>
    </>
  );
}

export default ErrorAlert;
