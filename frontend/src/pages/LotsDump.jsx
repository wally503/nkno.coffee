import { useEffect, useState } from "react";
import {
  Box, Typography, Paper, Table, TableContainer,
  TableHead, TableBody, TableRow, TableCell,
} from "@mui/material";
import { getLots, getLifecycleEvents } from "../api/lotsApi";

const fmt = (v) => (v ? new Date(v).toLocaleString() : "");

const LOT_COLUMNS = [
  { label: "ID", get: (r) => r.id },
  { label: "Bean", get: (r) => r.bean_name },
  { label: "Vessel", get: (r) => r.vessel_label },
  { label: "State", get: (r) => r.state },
  { label: "Stored", get: (r) => r.stored_weight },
  { label: "Remaining", get: (r) => r.remaining_weight },
  { label: "Leftover", get: (r) => r.leftover_weight },
  { label: "Frozen", get: (r) => fmt(r.frozen_at) },
  { label: "Thawed", get: (r) => fmt(r.thawed_at) },
  { label: "Opened", get: (r) => fmt(r.opened_at) },
  { label: "Closed", get: (r) => fmt(r.closed_at) },
  { label: "Reason", get: (r) => r.close_reason_name },
];

const EVENT_COLUMNS = [
  { label: "ID", get: (r) => r.id },
  { label: "Date", get: (r) => fmt(r.date) },
  { label: "Bean", get: (r) => r.bean_name },
  { label: "Type", get: (r) => r.event_type },
  { label: "Tier", get: (r) => r.granularity },
  { label: "Parent", get: (r) => r.parent },
  { label: "Lot", get: (r) => r.lot_label },
  { label: "Summary", get: (r) => r.summary },
  { label: "Notes", get: (r) => r.notes },
];

function DumpTable({ title, columns, rows }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {title} ({rows.length})
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((c) => (
                <TableCell key={c.label}>{c.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                {columns.map((c) => (
                  <TableCell key={c.label}>{c.get(r)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default function LotsDump() {
    const [lots, setLots] = useState([]);
    const [events, setEvents] = useState([]);

    useEffect(() => {
    getLots().then(setLots);
    getLifecycleEvents().then(setEvents);
    }, []);

    return (
        <Box sx={{ p: 2 }}>
        <DumpTable title="Lots" columns={LOT_COLUMNS} rows={lots} />
        <DumpTable title="Lifecycle events" columns={EVENT_COLUMNS} rows={events} />
        </Box>
    );
}