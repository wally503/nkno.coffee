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
import Collapse from "@mui/material/Collapse";
import PageHeaderTitle from "./PageTitle";
import TextField from "@mui/material/TextField";
import { useLocation, useNavigate } from "react-router-dom";
import { Grid, FormControl, FormHelperText, Box, Rating, Typography, TableSortLabel } from "@mui/material";
import { ratingCustomIcons } from "./RatingGridItem";
import { cellFor } from "./table/tableCells";

export default function CoffeeTable({
  columns, rows, totalCount, tableState, viewRoute,
  cellPx, cellPy,
  width = "90%", maxWidth = 2000,
  renderDetail,
  lotCellFor,
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(tableState.pageSize);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    tableState.setPage(newPage);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  }

  const handleOrderingChange = (event) => {
    setOrdering(event.target.value);
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    tableState.setPageSize(+event.target.value);
    tableState.setPage(0);
  };

  // Padding resolution: column setting > table-wide prop > MUI default
  const cellSxFor = (column) => {
    const px = column.px ?? cellPx;
    const py = column.py ?? cellPy;
    return {
      ...(px !== undefined && { px }),
      ...(py !== undefined && { py }),
      ...(column.cellSx ?? {}),      // full escape hatch: pl, pr, whiteSpace, etc.
    };
  };

  if (!columns?.length) return null;
  return (
      <Box sx={{ width, maxWidth, mx: "auto" }}>
        <Paper>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
            <TextField placeholder="Search..." onChange={(e) => tableState.setSearch(e.target.value)} size="small" />
          </Box>
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table stickyHeader aria-label="sticky table" sx={{ tableLayout: 'fixed' }}>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ top: 0, minWidth: column.minWidth, width: column.minWidth }}
                      onClick={() => column.orderingField !== null && tableState.handleOrderingChange(column.orderingField ?? column.id)}
                      sx={{ cursor: column.orderingField === null ? 'default' : 'pointer', ...cellSxFor(column) }}
                    >
                      <TableSortLabel
                        active={column.orderingField !== null && (column.orderingField ?? column.id) === tableState.orderField}
                        direction={tableState.orderDir}
                        hideSortIcon={column.orderingField === null}
                        disabled={column.orderingField === null}
                      >
                          {column.label}
                      </TableSortLabel>
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
                rows.map((row) => (
                  <CoffeeTableRow
                    key={row.short_id}
                    row={row}
                    columns={columns}
                    cellSxFor={cellSxFor}
                    renderCell={renderCell}
                    renderDetail={renderDetail}
                    lotCellFor={lotCellFor}
                    onRowClick={() => {
                      const path = typeof viewRoute === 'function'
                        ? viewRoute(row)
                        : `${viewRoute}/${row.short_id}`;
                      if (!path) return;
                      navigate(path, { state: { backRoute: location.pathname } });
                    }}
                  />
                ))}
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

  // Order: rating-by-id, then render, then type, then format, then the plain default
  function renderCell(column, value, row, ctx) {
    if (column.id === "rating")
      return ratingCustomIcons[value]?.icon ?? <span style={{ opacity: 0.3 }}>{ratingCustomIcons[3].icon}</span>;
    if (column.render)
      return column.render(value, row, ctx);
    if (column.type) {
      const Cell = cellFor(column.type);
      return <Cell value={value} row={row} column={column} ctx={ctx} />;
    }
    if (column.format && typeof value === "number")
      return column.format(value);
    return value ?? "-";
  }
}

function CoffeeTableRow({ row, columns, cellSxFor, renderCell, renderDetail, lotCellFor, onRowClick }) {
  const [open, setOpen] = React.useState(false);
  const ctx = { open, toggle: () => setOpen((current) => !current) };

  return (
    <React.Fragment>
      <TableRow
        hover
        role="checkbox"
        tabIndex={-1}
        sx={{ ...row.rowSx, "& td": { borderTop: "2px solid rgba(166, 124, 82, 0.45)" } }}
        onClick={onRowClick}
      >
        {columns.map((column) => {
          const value = row[column.id];
          return (
            <TableCell
              key={column.id}
              align={column.align}
              sx={{
                ...cellSxFor(column),
                ...(row.rowSx?.color ? { color: row.rowSx.color } : {}),
              }}
            >
              {renderCell(column, value, row, ctx)}
            </TableCell>
          );
        })}
      </TableRow>
      {open && renderDetail && renderDetail(row).map((lot) => (
        <TableRow
          key={`lot-${lot.id}`}
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.18)",
            "& td": { borderBottom: "1px dashed rgba(255, 252, 238, 0.12)" },
          }}
        >
          {columns.map((column, index) => (
            <TableCell
              key={column.id}
              align={column.align}
              sx={{ ...cellSxFor(column), ...(index === 1 ? { pl: 5 } : {}), fontSize: "0.85rem", opacity: 0.9 }}
            >
              {lotCellFor(column, lot)}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </React.Fragment>
  );
}