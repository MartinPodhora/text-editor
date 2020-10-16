import React, { Fragment, useState } from "react";
import {
  Button,
  Grid,
  Paper,
  TextField,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
  Box,
} from "@material-ui/core";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@material-ui/icons";

function LoginPage() {
  const { handleSubmit, register, errors } = useForm();
  const [showPsw, setShowPsw] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log(data);
    navigate("/editor");
  };

  return (
    <Box className="loginBackground">
      <Paper className="LoginPaper" elevation={3}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Username"
                id="username"
                name="username"
                error={errors.hasOwnProperty("username")}
                helperText={errors.username?.message}
                inputRef={register({ required: "fill username field" })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Password</InputLabel>
                <OutlinedInput
                  id="password"
                  name="password"
                  type={showPsw ? "text" : "password"}
                  error={errors.hasOwnProperty("password")}
                  helperText={errors.password?.message}
                  inputRef={register({ required: "fill password field" })}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPsw(!showPsw)}
                        edge="end"
                      >
                        {showPsw ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                color="primary"
                fullWidth
                size="large"
                variant="contained"
                type="submit"
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}

export default LoginPage;
