import React, { useCallback, useState, useEffect } from "react";
import {
  CircularProgress,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";

export default function EditRoomDialog({ isOpen, onConfirm, onClose, room }) {
  const { t } = useTranslation("translation");
  const [roomName, setRoomName] = useState(room.roomName || "");
  const [imageUrl, setImageUrl] = useState(room.imageUrl || "");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setRoomName(room.roomName || "");
    setImageUrl(room.imageUrl || "");
  }, [room.imageUrl, room.roomName, isOpen]);

  const handleConfirm = useCallback(async () => {
    setIsLoading(true);
    try {
      await onConfirm(roomName.trim(), imageUrl.trim());
    } catch (err) {
      console.log("error ", err);
    }
    setIsLoading(false);
  }, [imageUrl, onConfirm, roomName]);
  return (
    <Dialog open={isOpen} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        {t("Room settings title")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{t("Room settings text")}</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="roomName"
          label={t("Room Name")}
          value={roomName}
          onChange={(event) => setRoomName(event.target.value)}
          fullWidth
        />
        <TextField
          margin="dense"
          id="imageUrl"
          label={t("Room image url")}
          value={imageUrl}
          onChange={(event) => setImageUrl(event.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        {isLoading && <CircularProgress size={20} color={"primary"} />}
        <Button onClick={onClose} color="primary" disabled={isLoading}>
          {t("Cancel")}
        </Button>
        <Button onClick={handleConfirm} color="primary" disabled={isLoading}>
          {t("Confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
