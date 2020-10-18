import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
  Hidden,
  Avatar,
  Tooltip,
} from "@material-ui/core";
import React, { useState, Fragment, useContext, useEffect } from "react";
import MenuIcon from "@material-ui/icons/Menu";
import { useNavigate } from "react-router-dom";
import { AppCtx } from "../App";

function AppMenu() {
  const { loggedUser, setLoggedUser } = useContext(AppCtx);
  const [anchorProfileMenu, setAnchorProfileMenu] = useState(null);
  const [expandLeftPanel, setExpandLeftPanel] = useState(false);
  const [userAvatar, setUserAvatar] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();
  const openProfile = Boolean(anchorProfileMenu);

  useEffect(() => {
    const userAvatar = () => {
      loggedUser.hasOwnProperty("photo") &&
        setUserAvatar("data:image/*;base64," + loggedUser.photo);
    };
    userAvatar();
  }, [loggedUser]);

  return (
    <Fragment>
      <AppBar position="sticky" className="appBar">
        <Toolbar>
          <Hidden mdUp>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => {
                setExpandLeftPanel(true);
              }}
            >
              <MenuIcon />
            </IconButton>
            <div className="title tabs">Text editor</div>
          </Hidden>
          <Hidden smDown>
            <div className="title">Text editor</div>
            <Tabs
              value={tabValue}
              onChange={(event, newTab) => setTabValue(newTab)}
              indicatorColor="secondary"
              className="tabs"
            >
              <Tab onClick={() => navigate("/editor")} label="Editor" />
              <Tab onClick={() => navigate("/documents")} label="Documents" />
            </Tabs>
          </Hidden>
          <Fragment>
            <IconButton
              onClick={(event) => {
                setAnchorProfileMenu(event.currentTarget);
              }}
              color="inherit"
            >
              <Tooltip title="Profile">
                <Avatar src={userAvatar} />
              </Tooltip>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorProfileMenu}
              getContentAnchorEl={null}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              transformOrigin={{ vertical: "top", horizontal: "center" }}
              open={openProfile}
              onClose={() => setAnchorProfileMenu(null)}
            >
              <MenuItem
                onClick={() => {
                  setLoggedUser({});
                  navigate("/login");
                }}
              >
                Logout
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setAnchorProfileMenu(null);
                  navigate("/profile");
                }}
              >
                Profile
              </MenuItem>
            </Menu>
          </Fragment>
        </Toolbar>
      </AppBar>
      {expandLeftPanel && (
        <Fragment key="left">
          <Drawer
            anchor="left"
            open={expandLeftPanel}
            onClose={() => setExpandLeftPanel(false)}
          >
            <List component="nav" className="sideDrawer">
              <ListItem
                selected={tabValue === 0}
                button
                onClick={() => {
                  navigate("/editor");
                  setTabValue(0);
                  setExpandLeftPanel(false);
                }}
              >
                <ListItemText primary="Dashboard" />
              </ListItem>
              <ListItem
                selected={tabValue === 1}
                button
                onClick={() => {
                  navigate("/documents");
                  setTabValue(1);
                  setExpandLeftPanel(false);
                }}
              >
                <ListItemText primary="Documents" />
              </ListItem>
            </List>
          </Drawer>
        </Fragment>
      )}
    </Fragment>
  );
}

export default AppMenu;
