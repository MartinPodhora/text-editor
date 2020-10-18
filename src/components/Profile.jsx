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
import { AppCtx } from "../App";
import { useForm } from "react-hook-form";
import { HandleError as handleError } from "./ErrorAlert";
import _ from "lodash";

function Profile() {
  const { loggedUser, setLoggedUser } = useContext(AppCtx);
  const [openProfileEdit, setOpenProfileEdit] = useState(false);
  const [openPswEdit, setOpenPswEdit] = useState(false);
  const { handleSubmit, register, errors } = useForm();

  const onSubmit = (data) => {
    if (!_.isEmpty(data.oldPassword)) {
      if (data.oldPassword !== loggedUser.password) {
        return handleError("Wrong password", "ProfilePswChange");
      } else if (data.password !== data.newPassword) {
        return handleError("Wrong confirm password", "ProfilePswChange");
      } else if (data.password === loggedUser.password) {
        return handleError("Password is same as old", "ProfilePswChange");
      }
    }

    setLoggedUser({ ...loggedUser, ...data });
    handleCloseEdit();
    handleClosePsw();
  };

  const handleCloseEdit = () => {
    setOpenProfileEdit(false);
  };

  const handleClosePsw = () => {
    setOpenPswEdit(false);
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
                    <Avatar
                      src={"data:image/*;base64," + loggedUser.photo}
                      className="profileAvatar"
                      style={{ height: "150px", width: "150px" }}
                    />
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
                      value={loggedUser.password}
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
              error={errors.hasOwnProperty("username")}
              helperText={errors.username?.message}
              defaultValue={loggedUser.username}
              inputRef={register({
                required: "this field need to be filled",
              })}
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
    </Fragment>
  );
}

export default Profile;
