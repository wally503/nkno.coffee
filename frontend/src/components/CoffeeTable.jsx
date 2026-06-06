// src/components/CoffeeTable.jsx

import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import PageHeaderTitle from "./PageTitle";
import { useNavigate } from "react-router-dom";
import { Grid, FormControl, FormHelperText, Box, Rating, Typography } from "@mui/material";
import { ratingCustomIcons } from "./RatingGridItem";

export default function CoffeeTable({columns, rows, totalCount, onPageChange, onRowsPerPageChange, rowsPerPageDefault, viewRoute}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPageDefault);
  const navigate = useNavigate();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    onRowsPerPageChange(+event.target.value);
    onPageChange(0);
  };

  if (!columns?.length) return null;
  return (
    <Box
        sx={{
          width: "90%", 
          maxWidth: 1400, 
          mx: "auto" 
        }}
      >
        <Paper  >
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
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
                {!rows || rows.length === 0 ?
                <TableRow
                  tabIndex={-1}
                  key={0}>
                    <TableCell colSpan={columns.length} align="center" sx={{ fontStyle: 'italic' }}>- No data found -</TableCell>
                </TableRow>
                :
                rows
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                        onClick={() => navigate(`${viewRoute}/${row.short_id}`)}
                      >
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {renderCell(column, value)}
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
            rowsPerPageOptions={[5, 10, 25, 100]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
  );

  function renderCell(column, value) {
    if (column.id === "rating") 
      return ratingCustomIcons[value]?.icon ?? <span style={{ opacity: 0.3 }}>{ratingCustomIcons[3].icon}</span>;
    if (column.render) 
      return column.render(value);
    if (column.format && typeof value === "number") 
      return column.format(value);
    return value || "-";
  }
}