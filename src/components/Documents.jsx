import {
  TableContainer,
  Paper,
  Table,
  TableCell,
  TableBody,
  TableRow,
  TableHead,
  Grid,
  Tooltip,
  IconButton,
  Checkbox,
  TablePagination,
  Toolbar,
  Typography,
  TableSortLabel,
  Button,
} from "@material-ui/core";
import { lighten, makeStyles } from "@material-ui/core/styles";
import React, { useContext, useState, Fragment } from "react";
import { AppCtx, BaseUrl } from "../App";
import moment from "moment";
import DeleteIcon from "@material-ui/icons/Delete";
import clsx from "clsx";
import _ from "lodash";
import Editor from "./Editor";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import axios from "axios";
import { HandleError as handleError } from "./ErrorAlert";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

function Documents() {
  const { docs, setDocs } = useContext(AppCtx);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const classes = useStyles();
  const [openView, setOpenView] = useState(false);

  const handleDelete = () => {
    const deleted = selected.map((item) =>
      docs.find((doc) => doc.name === item)
    );

    deleted.forEach((doc) => {
      axios
        .delete(BaseUrl + `/TeDocument/delete/${doc.id}`)
        .then((res) => {
          setPage(0);
        })
        .catch((error) => {
          return handleError(error, "Deleting documents");
        });
    });

    setDocs(_.difference(docs, deleted));
    setSelected([]);
  };

  const handleOpen = () => {
    setOpenView(true);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    setSelected(event.target.checked ? docs.map((doc) => doc.name) : []);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    switch (selectedIndex) {
      case -1:
        newSelected = newSelected.concat(selected, name);
        break;
      case 0:
        newSelected = newSelected.concat(selected.slice(1));
        break;
      case selected.length - 1:
        newSelected = newSelected.concat(selected.slice(0, -1));
        break;
      default:
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        );
        break;
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, docs.length - page * rowsPerPage);

  return openView ? (
    <Fragment>
      <Grid container justify="center">
        <Grid item xs={11} sm={10}>
          <Button
            onClick={() => setOpenView(false)}
            variant="contained"
            style={{ marginBottom: "30px" }}
          >
            Back
          </Button>
        </Grid>
      </Grid>
      <Editor data={docs.find((doc) => doc.name === selected[0])} />
    </Fragment>
  ) : (
    <Grid container justify="center">
      <Grid item xs={11} sm={10} md={9}>
        <Paper className={classes.paper}>
          <CustomTableToolbar
            numSelected={selected.length}
            handleDelete={handleDelete}
            handleOpen={handleOpen}
          />
          <TableContainer>
            <Table>
              <CustomTableHead
                classes={classes}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={docs.length}
              />
              <TableBody>
                {stableSort(docs, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.name);

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.name)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          {row.name}
                        </TableCell>
                        <TableCell align="left">
                          {moment(row.dateCreated.substring(0, 20)).format(
                            "DD.MM.YYYY"
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={docs.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
}));

const CustomTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected, handleDelete, handleOpen } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Documents
        </Typography>
      )}
      {numSelected === 1 && (
        <Tooltip title="Open view">
          <IconButton aria-label="open view" onClick={handleOpen}>
            <OpenInNewIcon />
          </IconButton>
        </Tooltip>
      )}

      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton aria-label="delete" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

function CustomTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: "name", label: "Document name" },
  { id: "created", label: "Created" },
];

export default Documents;
