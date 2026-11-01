import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

const day = (value) => (value ? new Date(value).toLocaleDateString("en-CA") : "-");

export default function LotRows({ lots }) {
  return (
    <Table size="small" sx={{ backgroundColor: "rgba(0, 0, 0, 0.15)" }}>
      <TableHead>
        <TableRow>
          <TableCell sx={{ pl: 7 }}>Vessel</TableCell>
          <TableCell>State</TableCell>
          <TableCell>Remaining</TableCell>
          <TableCell>Frozen</TableCell>
          <TableCell>Thawed</TableCell>
          <TableCell>Opened</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {lots.map((lot) => (
          <TableRow key={lot.id}>
            <TableCell sx={{ pl: 7 }}>{lot.vessel_label}</TableCell>
            <TableCell>{lot.state}</TableCell>
            <TableCell>{lot.remaining_weight} / {lot.stored_weight} g</TableCell>
            <TableCell>{day(lot.frozen_at)}</TableCell>
            <TableCell>{day(lot.thawed_at)}</TableCell>
            <TableCell>{day(lot.opened_at)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}