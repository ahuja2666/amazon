import React from "react";
import { AppBar, Box, Toolbar, IconButton, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <img
              src={require("./seller-central_logo-white.svg")}
              alt="logo"
              style={{ height: "auto", width: "220px" }}
            />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />

          <Link to="/" style={{ textDecoration: "none" }}>
            <Button color="inherit">Back</Button>
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
