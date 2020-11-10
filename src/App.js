import React, {
  useState,
  useContext,
  createContext,
  useEffect,
  Fragment,
} from "react";
import "./App.css";
import LoginPage from "./components/LoginPage";
import Editor from "./components/Editor";
import Profile from "./components/Profile";
import AppMenu from "./components/AppMenu";
import Documents from "./components/Documents";
import { Route, Routes, useNavigate } from "react-router-dom";
import _ from "lodash";
import ErrorAlert, {
  HandleError as handleError,
} from "./components/ErrorAlert";
import axios from "axios";

export const AppCtx = createContext();
export const BaseUrl = "http://127.0.0.1:9080/texteditor";

function App() {
  const [loggedUser, setLoggedUser] = useState({});
  const [photo, setPhoto] = useState("");
  const [errors, setErrors] = useState([]);
  const [open, setOpen] = useState(false);
  const [docs, setDocs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (_.isEmpty(loggedUser)) {
      navigate("/login");
    } else {
      axios
        .get(BaseUrl + `/TeUser/photo/${loggedUser.username}`)
        .then((res) => {
          setPhoto(res.data);
        })
        .catch((error) => {
          handleError(error, "Application");
        });

      axios
        .get(BaseUrl + `/TeDocument/all/${loggedUser.username}`)
        .then((res) => {
          setDocs(res.data);
        })
        .catch((error) => {
          handleError(error, "Application");
        });
    }
  }, [loggedUser, navigate]);

  return (
    <AppCtx.Provider
      value={{
        loggedUser,
        setLoggedUser,
        errors,
        setErrors,
        open,
        setOpen,
        docs,
        setDocs,
        photo,
        setPhoto,
      }}
    >
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <CustomRoute path="editor" component={<Editor />} />
        <CustomRoute path="profile" component={<Profile />} />
        <CustomRoute path="documents" component={<Documents />} />
      </Routes>
      <ErrorAlert />
    </AppCtx.Provider>
  );
}

const CustomRoute = ({ path, component }) => {
  const { loggedUser } = useContext(AppCtx);

  return _.isEmpty(loggedUser) ? (
    <Fragment />
  ) : (
    <Fragment>
      <AppMenu />
      <Route path={path} element={component} />
    </Fragment>
  );
};

export default App;
