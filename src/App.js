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
import { USERS, DOCUMENTS } from "./components/testData";
import ErrorAlert from "./components/ErrorAlert";

export const AppCtx = createContext();

function App() {
  const [loggedUser, setLoggedUser] = useState({});
  const [errors, setErrors] = useState([]);
  const [open, setOpen] = useState(false);
  const [docs, setDocs] = useState(DOCUMENTS);
  const navigate = useNavigate();
  const users = USERS;

  useEffect(() => {
    if (_.isEmpty(loggedUser)) {
      navigate("/login");
    }
  }, [loggedUser, navigate]);

  return (
    <AppCtx.Provider
      value={{
        loggedUser,
        setLoggedUser,
        users,
        errors,
        setErrors,
        open,
        setOpen,
        docs,
        setDocs,
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
