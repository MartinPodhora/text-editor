import {
  Card,
  Grid,
  Typography,
  CardContent,
  TextField,
  Avatar,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React, { useContext, useState, Fragment } from "react";
import { Paper } from "@material-ui/core";
import { AppCtx, BaseUrl } from "../App";
import { useForm } from "react-hook-form";
import { HandleError as handleError } from "./ErrorAlert";
import _ from "lodash";
import axios from "axios";
import { Autocomplete } from "@material-ui/lab";

function Profile() {
  const {
    loggedUser,
    setLoggedUser,
    photo,
    setPhoto,
    style,
    allStyles,
  } = useContext(AppCtx);
  const [openProfileEdit, setOpenProfileEdit] = useState(false);
  const [openPswEdit, setOpenPswEdit] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [tmpStyle, setTmpStyle] = useState(
    allStyles.find((item) => style.title === item.title)
  );
  const { handleSubmit, register, errors } = useForm();

  const onSubmit = (data) => {
    if (!_.isEmpty(data.oldPassword)) {
      if (data.password !== data.newPassword) {
        return handleError("Wrong confirm password", "ProfilePswChange");
      } else {
        return handleNewPassword(data.oldPassword, data.newPassword);
      }
    }

    let updatedUser = { ...loggedUser, ...data };
    axios
      .put(BaseUrl + "/TeUser/update", updatedUser)
      .then((res) => {
        setLoggedUser(res.data);
        handleCloseEdit();
      })
      .catch((error) => {
        handleError(error, "Profile page");
      });
  };

  const handleCloseEdit = () => {
    setOpenProfileEdit(false);
  };

  const handleClosePsw = () => {
    setOpenPswEdit(false);
  };

  const handleNewPassword = (oldPass, newPass) => {
    axios
      .put(
        BaseUrl + `/TeUser/changePassword/${loggedUser.username}`,
        oldPass + "," + newPass,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        handleClosePsw();
      })
      .catch((error) => {
        handleError(error, "ProfilePswChange");
      });
  };

  const handleNewPhoto = (event) => {
    var file = event.target.files[0];

    if (file.size / 1024 / 1024 > 1) {
      return handleError(
        "1 MB max file size. Select a new file and try again.",
        "Profile"
      );
    }

    var reader = new FileReader();
    reader.onload = function (e) {
      var newPhoto = reader.result;
      axios
        .put(BaseUrl + `/TeUser/updatePhoto/${loggedUser.username}`, newPhoto, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setPhoto(newPhoto);
        })
        .catch((error) => {
          handleError(error, "Profile page");
        });
    };
    reader.readAsDataURL(file);
  };

  const handleNewStyle = () => {
    axios
      .put(BaseUrl + `/TeUser/updateStyle/${loggedUser.username}`, tmpStyle)
      .then((res) => {
        setLoggedUser(res.data);
        setOpenSettings(false);
      })
      .catch((error) => {
        handleError(error, "Profile page");
      });
  };

  return (
    <Fragment>
      <Grid container justify="center">
        <Grid item xs={12} sm={10} md={9} lg={8} lx={7}>
          <Paper elevation={3} className="profilePaper">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h5">User preferences</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Card className="profileCard">
                  <CardContent>
                    <Typography variant="h6">Basic info</Typography>
                    <TextField
                      variant="outlined"
                      disabled
                      fullWidth
                      label="Username"
                      margin="normal"
                      value={loggedUser.username}
                    />
                    <TextField
                      variant="outlined"
                      disabled
                      fullWidth
                      label="Firstname"
                      margin="normal"
                      value={loggedUser.firstName}
                    />
                    <TextField
                      variant="outlined"
                      disabled
                      fullWidth
                      label="Lastname"
                      margin="normal"
                      value={loggedUser.lastName}
                    />
                    <TextField
                      variant="outlined"
                      disabled
                      fullWidth
                      label="Email"
                      margin="normal"
                      value={loggedUser.email}
                    />
                    <Button
                      onClick={() => setOpenProfileEdit(true)}
                      variant="contained"
                      color="primary"
                      style={{ marginTop: "10px" }}
                    >
                      Edit
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card className="profileCard">
                  <CardContent>
                    <Typography variant="h6">Photo</Typography>
                    <label htmlFor="upload-photo">
                      <input
                        style={{ display: "none" }}
                        id="upload-photo"
                        type="file"
                        onChange={handleNewPhoto}
                      />
                      <Avatar
                        src={photo}
                        className="profileAvatar"
                        style={{ height: "150px", width: "150px" }}
                      />
                    </label>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">My Password</Typography>
                    <TextField
                      variant="outlined"
                      disabled
                      fullWidth
                      label="password"
                      margin="normal"
                      type="password"
                      value={loggedUser.username}
                    />
                    <Button
                      onClick={() => setOpenPswEdit(true)}
                      variant="contained"
                      color="primary"
                      style={{ marginTop: "10px" }}
                    >
                      Change password
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">My Settings</Typography>
                    <TextField
                      variant="outlined"
                      disabled
                      fullWidth
                      label="style"
                      margin="normal"
                      value={style.title}
                    />
                    <Button
                      onClick={() => setOpenSettings(true)}
                      variant="contained"
                      color="primary"
                      style={{ marginTop: "10px" }}
                    >
                      Edit
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Dialog open={openProfileEdit} onClose={handleCloseEdit} fullWidth>
        <DialogContent>
          <Grid container justify="space-between">
            <Grid item>
              <Typography variant="h6">Edit Profile</Typography>
            </Grid>
            <Grid item>
              <Tooltip title="Close">
                <IconButton
                  onClick={handleCloseEdit}
                  style={{ padding: "5px" }}
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              variant="outlined"
              fullWidth
              label="Username"
              name="username"
              margin="normal"
              disabled
              defaultValue={loggedUser.username}
            />
            <TextField
              variant="outlined"
              fullWidth
              label="Firstname"
              name="firstName"
              margin="normal"
              error={errors.hasOwnProperty("firstname")}
              helperText={errors.firstname?.message}
              defaultValue={loggedUser.firstName}
              inputRef={register({
                required: "this field need to be filled",
              })}
            />
            <TextField
              variant="outlined"
              fullWidth
              label="Lastname"
              name="lastName"
              margin="normal"
              error={errors.hasOwnProperty("lastname")}
              helperText={errors.lastname?.message}
              defaultValue={loggedUser.lastName}
              inputRef={register({
                required: "this field need to be filled",
              })}
            />
            <TextField
              variant="outlined"
              fullWidth
              label="Email"
              name="email"
              margin="normal"
              type="email"
              defaultValue={loggedUser.email}
              error={errors.hasOwnProperty("email")}
              helperText={errors.email?.message}
              inputRef={register({
                required: "this field need to be filled",
              })}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ margin: "10px" }}
            >
              Save
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={openPswEdit} onClose={handleClosePsw} fullWidth>
        <DialogContent>
          <Grid container justify="space-between">
            <Grid item>
              <Typography variant="h6">Change password</Typography>
            </Grid>
            <Grid item>
              <Tooltip title="Close">
                <IconButton onClick={handleClosePsw} style={{ padding: "5px" }}>
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              variant="outlined"
              fullWidth
              label="Old password"
              name="oldPassword"
              margin="normal"
              type="password"
              error={errors.hasOwnProperty("oldPassoword")}
              helperText={errors.oldPassoword?.message}
              inputRef={register({
                required: "this field need to be filled",
              })}
            />
            <TextField
              variant="outlined"
              fullWidth
              label="New password"
              name="newPassword"
              margin="normal"
              type="password"
              error={errors.hasOwnProperty("newPassword")}
              helperText={errors.newPassword?.message}
              inputRef={register({
                required: "this field need to be filled",
              })}
            />
            <TextField
              variant="outlined"
              fullWidth
              label="Confirm password"
              name="password"
              margin="normal"
              type="password"
              error={errors.hasOwnProperty("confirmPassword")}
              helperText={errors.confirmPassword?.message}
              inputRef={register({
                required: "this field need to be filled",
              })}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ margin: "10px" }}
            >
              Change
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openSettings}
        onClose={() => setOpenSettings(false)}
        fullWidth
      >
        <DialogContent>
          <Grid container justify="space-between">
            <Grid item>
              <Typography variant="h6">Settings</Typography>
            </Grid>
            <Grid item>
              <Tooltip title="Close">
                <IconButton
                  onClick={() => setOpenSettings(false)}
                  style={{ padding: "5px" }}
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
          <Autocomplete
            style={{ marginTop: "20px", marginBottom: "20px" }}
            value={tmpStyle}
            options={allStyles}
            filterSelectedOptions
            getOptionLabel={(option) => option.title}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder=""
                label="users"
              />
            )}
            renderOption={(option) => (
              <Fragment>
                <Avatar
                  style={{
                    backgroundColor: option.primaryM,
                    color: option.primaryM,
                    marginLeft: "-8px",
                    marginRight: "16px",
                  }}
                />
                <Typography>{option.title}</Typography>
              </Fragment>
            )}
            onChange={(event, value) => setTmpStyle(value)}
          />
          <Button
            onClick={() => handleNewStyle()}
            variant="contained"
            color="primary"
            style={{ margin: "10px" }}
          >
            Save
          </Button>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}

export default Profile;
