import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import PageHeaderTitle from "../../../components/PageTitle";
import { useNavigate } from "react-router-dom";

import {
  Grid,
  FormControl,
  FormHelperText,
  Box,
  Rating,
  Typography,
} from "@mui/material";

const columns = [
  { id: "name", label: "Bean Name", minWidth: 100 },
  { id: "roaster", label: "Roaster", minWidth: 100 },
  {
    id: "origin",
    label: "Roast Origin",
    minWidth: 70,
  },
  {
    id: "organic",
    label: "Organic",
    minWidth: 70,
  },
  {
    id: "washed",
    label: "Washed",
    minWidth: 70,
  },
  {
    id: "elevation",
    label: "Elevation",
    minWidth: 100,
  },
  {
    id: "notes",
    label: "Notes",
    minWidth: 180,
  },
];

function createData(
  bName,
  roaster,
  bOrigin,
  bRoast,
  bOrganic,
  bWashed,
  bElevationMin,
  bElevationMax,
  bNotes,
) {
  //const density = population / size;
  const elevation = formatElevation(bElevationMin, bElevationMax);
  return {
    bName,
    roaster,
    bOrigin,
    bRoast,
    bOrganic,
    bWashed,
    elevation,
    bNotes,
  };
}

function formatElevation(min, max) {
  const hasMin = Number.isFinite(min);
  const hasMax = Number.isFinite(max);

  if (!hasMin && !hasMax) {
    return "—";
  }

  if (hasMin && !hasMax) {
    return `${min} MASL`;
  }

  if (!hasMin && hasMax) {
    return `${max} MASL`;
  }

  return `${min}-${max} MASL`;
}

const rows = [
  {
    name: "Ethiopia Sidamo Natural",
    roaster: "nkno",
    origin: "Ethiopia – Sidamo",
    organic: false,
    washed: false,
    elevation: formatElevation(1900, 2200),
    notes: "berry, cocoa, floral",
  },
  {
    name: "Guatemala Antigua Washed",
    roaster: "nkno",
    origin: "Guatemala – Antigua",
    organic: false,
    washed: true,
    elevation: formatElevation(1500, null),
    notes: "chocolate, orange, almond",
  },
  {
    name: "Colombia Huila",
    roaster: "Counter Culture",
    origin: "Colombia – Huila",
    organic: true,
    washed: true,
    elevation: formatElevation(null, null),
    notes: "caramel, apple, clean",
  },
];

export default function ListBeansPage() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const navigate = useNavigate();
  

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        height: "calc(100vh - 69px)",
        px: 4,
        py: 4,
        width: "100%",
      }}
    >
      <PageHeaderTitle title={"List Beans"} hasBackButton={true} backRoute={"/"}  />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "95%",
          mx: "auto",
        }}
      >
        <Paper>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                {/* <TableRow>
                <TableCell align="center" colSpan={2}>
                  Country
                </TableCell>
                <TableCell align="center" colSpan={3}>
                  Details
                </TableCell>
              </TableRow> */}
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ top: 0, minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.code}
                      >
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </Box>
  );
}
