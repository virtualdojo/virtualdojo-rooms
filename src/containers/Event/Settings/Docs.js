import React, { useContext } from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Tooltip,
} from "@material-ui/core";

import {
  InsertDriveFile as InsertDriveFileIcon,
  Delete as DeleteIcon,
} from "@material-ui/icons";
import { store } from "../../../store.js";

function Docs() {
  const { docs, deleteDoc } = useContext(store);

  return (
    <List>
      <Typography variant="h5" align="center" style={{ marginBottom: "20px" }}>
        Docs:
      </Typography>
      {docs.map((d) => (
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <InsertDriveFileIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={d.docName} />
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => deleteDoc(d.docId)}
            >
              <Tooltip title="Delete doc" placement="bottom">
                <DeleteIcon />
              </Tooltip>
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
}

export default Docs;
