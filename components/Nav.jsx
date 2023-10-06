import * as React from "react";
import { useState, useEffect } from "react";
import { userService } from "services";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import UserIcon from "@mui/icons-material/People";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ListItemIcon from "@mui/material/ListItemIcon";
import Avatar from "@mui/material/Avatar";
import { Menu, MenuItem } from "@mui/material";
export { Nav };

const drawerWidth = 240;
const navItems = [
  { name: "Home", icon: <HomeIcon />, href: "/" },
  { name: "Rors", icon: <UserIcon />, href: "/users" },
];
const navItemsMenu = [
  {
    name: "Log out",
    icon: <ExitToAppIcon />,
    href: "",
    click: () => {
      userService.logout();
    },
  },
];

function Nav(props) {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("Logged User");
  const title = "Ror Vanshaj BO";
  const userAvatarUrl = "/logo.jpg";
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  const [openMenu, setOpenMenu] = useState(null);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(1);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenMenu(0);
  };

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{
        background: "linear-gradient(135deg, #96a4ce, #bdbdbd) !important",
        textAlign: "center",
        height: "100vh",
      }}
    >
      <div>
        <Typography
          variant="h6"
          sx={{
            my: 2,
            backgroundColor: "#212529",
            padding: "16px",
            marginTop: "0",
            color: "#fff",
          }}
        >
          {name}
        </Typography>
      </div>
      <List>
        {[...navItems, ...navItemsMenu].map((item, k) => (
          <ListItem key={k} disablePadding>
            <ListItemButton
              onClick={item.click}
              href={item.href}
              sx={{ textAlign: "center", color: "#212529" }}
            >
              <ListItemIcon sx={{ color: "#212529" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  useEffect(() => {
    const subscription = userService.user.subscribe((x) => {
      setUser(x);
      let n = `${x?.firstName} ${x?.lastName}`;
      setName(n);
    });
    return () => subscription.unsubscribe();
  }, []);

  // only show nav when logged in
  if (!user) return null;
  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar component="nav" sx={{ backgroundColor: "#212529" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography sx={{ flexGrow: 1, display: { sm: "none" } }}>
            {title}
          </Typography>
          <Typography
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            {title}
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item, k) => (
              <Link
                className="menuItems"
                onClick={item.click}
                href={item.href}
                key={k}
                sx={{ color: "#fff" }}
              >
                {item.name}
              </Link>
            ))}
          </Box>
          <Box sx={{ display: { xs: "none", sm: "flex" }, marginLeft: "12px" }}>
            <Avatar
              alt="User Avatar"
              src={userAvatarUrl}
              sx={{ cursor: "pointer", marginRight: 1 }}
              onClick={handleAvatarClick}
            />
            <Menu
              open={openMenu ? openMenu === 1 : false}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              {navItemsMenu.map((item, k) => (
                <MenuItem
                  className="menuItems"
                  onClick={item.click}
                  href={item.href}
                  key={k}
                >
                  <ListItemIcon> {item.icon} </ListItemIcon>
                  {item.name}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}
