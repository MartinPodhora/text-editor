import React, { useState, useContext } from "react";
import {
  Dialog,
  DialogContent,
  Fab,
  Grid,
  Typography,
  Tooltip,
  IconButton,
  Button,
  TextField,
} from "@material-ui/core";
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import CKEditor from "@ckeditor/ckeditor5-react";
import _ from "lodash";
import AddIcon from "@material-ui/icons/Add";
import SaveIcon from "@material-ui/icons/Save";
import { AppCtx, BaseUrl } from "../App";
import moment from "moment";
import CloseIcon from "@material-ui/icons/Close";
import { HandleError as handleError } from "./ErrorAlert";
import axios from "axios";

function Editor({ data }) {
  const edit = !_.isEmpty(data?.content);
  const [text, setText] = useState(edit ? data.content : "");
  const { docs, setDocs, loggedUser } = useContext(AppCtx);
  const [nameDialog, setNameDialog] = useState(false);
  const [docName, setDocName] = useState("");

  const handleNewFile = (event) => {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      var content = reader.result;
      setText(content);
    };
    reader.readAsText(file);
  };

  const handleSave = () => {
    if (!edit) {
      if (_.isEmpty(docName)) {
        return handleError("Document name canot be empty", "Editor");
      } else if (_.isEmpty(text)) {
        return handleError("You didnt put any text into document", "Editor");
      }

      const newDoc = {
        name: docName,
        dateCreated: moment().toISOString(),
        id: 0,
        content: text,
        user: loggedUser,
      };

      axios
        .post(BaseUrl + "/TeDocument/create", newDoc)
        .then((res) => {
          setDocs([...docs, newDoc]);
          setDocName("");
          setText("");
          handleCloseNameDialog();
        })
        .catch((error) => {
          handleError(error, "Editor");
        });
    } else {
      if (_.isEmpty(text)) {
        return handleError("You didnt put any text into document", "Editor");
      }

      const editedDoc = {
        name: data.name,
        dateCreated: moment().toISOString(),
        id: data.id,
        content: text,
        user: data.user,
      };

      axios
        .put(BaseUrl + "/TeDocument/update", editedDoc)
        .then((res) => {
          const newDocs = _.difference(docs, [data]);
          setDocs([...newDocs, editedDoc]);
        })
        .catch((error) => {
          handleError(error, "Editor");
        });
    }
  };

  const handleCloseNameDialog = () => {
    setNameDialog(false);
  };

  return (
    <Grid container spacing={3} justify="center">
      <Grid item xs={11} sm={10}>
        <CKEditor
          onInit={(editor) => {
            editor.ui
              .getEditableElement()
              .parentElement.insertBefore(
                editor.ui.view.toolbar.element,
                editor.ui.getEditableElement()
              );
          }}
          onChange={(event, editor) => setText(editor.getData())}
          editor={DecoupledEditor}
          data={text}
          //config={}
        />
      </Grid>
      <Grid item xs={11} sm={10} container justify="space-between">
        <Grid item xs={6}>
          <label htmlFor="upload-file">
            <Fab color="primary" component="span" variant="extended">
              <input
                style={{ display: "none" }}
                id="upload-file"
                type="file"
                onChange={handleNewFile}
                accept="text/*"
              />
              <AddIcon style={{ marginRight: "20px" }} /> Upload File
            </Fab>
          </label>
        </Grid>
        <Grid item xs={4} sm={2} lg={1}>
          <Fab
            color="primary"
            component="span"
            variant="extended"
            onClick={() => (edit ? handleSave() : setNameDialog(true))}
          >
            <SaveIcon style={{ marginRight: "20px" }} /> Save
          </Fab>
        </Grid>
      </Grid>
      <Dialog open={nameDialog} onClose={handleCloseNameDialog} fullWidth>
        <DialogContent>
          <Grid container justify="space-between">
            <Grid item>
              <Typography variant="h6">Set document name</Typography>
            </Grid>
            <Grid item>
              <Tooltip title="Close">
                <IconButton
                  onClick={handleCloseNameDialog}
                  style={{ padding: "5px" }}
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
          <TextField
            variant="outlined"
            fullWidth
            label="File name"
            margin="normal"
            value={docName}
            onChange={(event) => setDocName(event.target.value)}
          />
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            style={{ marginTop: "10px" }}
          >
            Set
          </Button>
        </DialogContent>
      </Dialog>
    </Grid>
  );
}

export default Editor;
