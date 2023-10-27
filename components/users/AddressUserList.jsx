import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import LensIcon from "@mui/icons-material/SearchOutlined";

export { AddressUserList };
function AddressUserList({ users, setSelectedPersonMap }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card>
      <div className="cardToggle">
        <Typography variant="h6" component="div">
          Users Found
        </Typography>
        <IconButton onClick={handleToggleExpand}>
          {isExpanded ? <CloseIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </div>
      {isExpanded && (
        <CardContent>
          {users.map((u, i) => (
            <div
              key={i}
              onClick={() => {
                setSelectedPersonMap(u);
              }}
            >
              {u.firstName} {u.lastName} - {u?.phone} - {u.email}
              <LensIcon />
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
}
