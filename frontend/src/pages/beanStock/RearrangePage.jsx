import * as React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Box, Paper, Typography, Button, Checkbox, FormControlLabel,
  TextField, Autocomplete, Select, MenuItem, IconButton, Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PageHeaderTitle from "../../components/PageTitle";
import DefaultBodyLayout from "../../components/DefaultBodyLayout";
import { titleCase } from "../../components/table/tableCells";
import { getBeanStock, getFreeVessels, rearrangeLots } from "../../api/rearrangeApi";

const BAG_OPTION = { id: "bag", label: "Original bag", freezable: true };

export default function RearrangePage() {
  const { beanShortId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [bean, setBean] = React.useState(null);
  const [loaded, setLoaded] = React.useState(false);
  const [freeVessels, setFreeVessels] = React.useState([]);
  const [sourceIds, setSourceIds] = React.useState([]);
  const [picked, setPicked] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [errors, setErrors] = React.useState([]);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    const load = async () => {
      const data = await getBeanStock(beanShortId);
      const vessels = await getFreeVessels();
      setBean(data);
      setFreeVessels(vessels);
      const preselect = Number(searchParams.get("source"));
      if (data && preselect) {
        const lot = data.lots.find((l) => l.id === preselect);
        if (lot && lot.state !== "frozen") setSourceIds([lot.id]);
      }
      setLoaded(true);
    };
    load();
  }, [beanShortId]);

  if (!loaded) return <DefaultBodyLayout><PageHeaderTitle title="Rearrange" hasBackButton={true} backRoute="/bean-stock" /></DefaultBodyLayout>;
  if (!bean) {
    return (
      <DefaultBodyLayout>
        <PageHeaderTitle title="Rearrange" hasBackButton={true} backRoute="/bean-stock" />
        <Typography sx={{ textAlign: "center", mt: 4 }}>This bean has no unclosed lots.</Typography>
      </DefaultBodyLayout>
    );
  }

  // ---- derived values ----
  const sourceLots = bean.lots.filter((lot) => sourceIds.includes(lot.id));

  const allowedFor = (ids) => {
    const lots = bean.lots.filter((lot) => ids.includes(lot.id));
    if (lots.length >= 2) return ["open"];
    if (lots.some((lot) => lot.state === "open")) return ["open"];
    return ["open", "frozen"];
  };
  const allowedStates = allowedFor(sourceIds);

  const options = [...freeVessels];
  for (const lot of sourceLots) {
    if (lot.vessel !== null && !options.some((v) => v.id === lot.vessel)) {
      options.push({ id: lot.vessel, label: lot.vessel_label, freezable: true });
    }
  }
  const bagTaken = bean.lots.some((lot) => lot.vessel === null && !sourceIds.includes(lot.id));
  if (!bagTaken) options.push(BAG_OPTION);
  for (const option of picked) {
    if (!options.some((v) => v.id === option.id)) options.push(option);
  }

  const sourceTotal = sourceLots.reduce((sum, lot) => sum + Number(lot.remaining_weight), 0);
  const targetTotal = rows.reduce((sum, row) => sum + (Number(row.weight) || 0), 0);
  const gap = sourceTotal - targetTotal;
  const tolerance = 0.2 * rows.length;
  const withinTolerance = Math.abs(gap) <= tolerance + 1e-9;

  const mode = sourceLots.length === 1 ? "Transfer" : sourceLots.length >= 2 ? "Merge" : "-";
  const shapeOk =
    (sourceLots.length === 1 && rows.length >= 1) ||
    (sourceLots.length >= 2 && rows.length === 1);

  // ---- handlers ----
  const toggleSource = (lotId) => {
    const next = sourceIds.includes(lotId)
      ? sourceIds.filter((id) => id !== lotId)
      : [...sourceIds, lotId];
    setSourceIds(next);
    const allowed = allowedFor(next);
    setRows((current) =>
      current.map((row) => (allowed.includes(row.state) ? row : { ...row, state: "open" }))
    );
  };

  const handlePick = (event, newPicked) => {
    setPicked(newPicked);
    setRows((current) => {
      const next = [];
      for (const option of newPicked) {
        const existing = current.find((row) => row.vesselId === option.id);
        if (existing) {
          next.push(existing);
        } else {
          const wantsFrozen = allowedStates.includes("frozen") && next.length > 0 && option.freezable;
          next.push({
            vesselId: option.id,
            label: option.label,
            freezable: option.freezable,
            weight: "",
            state: wantsFrozen ? "frozen" : "open",
          });
        }
      }
      return next;
    });
  };

  const updateRow = (index, changes) => {
    setRows((current) => current.map((row, i) => (i === index ? { ...row, ...changes } : row)));
  };

  const removeRow = (index) => {
    const removed = rows[index];
    setRows(rows.filter((row, i) => i !== index));
    setPicked(picked.filter((option) => option.id !== removed.vesselId));
  };

  const splitEvenly = () => {
    if (rows.length === 0) return;
    const cents = Math.round(sourceTotal * 100);
    const base = Math.floor(cents / rows.length);
    setRows(rows.map((row, i) => {
      const amount = i === rows.length - 1 ? cents - base * (rows.length - 1) : base;
      return { ...row, weight: (amount / 100).toFixed(2) };
    }));
  };

  const fillRemainder = (index) => {
    const others = rows.reduce(
      (sum, row, i) => (i === index ? sum : sum + (Number(row.weight) || 0)), 0
    );
    updateRow(index, { weight: Math.max(0, sourceTotal - others).toFixed(2) });
  };

  const submit = async () => {
    setErrors([]);
    setSubmitting(true);
    const payload = {
      sources: sourceIds,
      targets: rows.map((row) => ({
        vessel: row.vesselId === "bag" ? null : row.vesselId,
        weight: row.weight,
        state: row.state,
      })),
    };
    const result = await rearrangeLots(payload);
    setSubmitting(false);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    navigate("/bean-stock");
  };

  // ---- render ----
  return (
    <DefaultBodyLayout>
      <PageHeaderTitle title={`Rearrange - ${bean.name}`} hasBackButton={true} backRoute="/bean-stock" />
      <Box sx={{ width: "90%", maxWidth: 1000, mx: "auto", display: "grid", gap: 2 }}>

        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>1. Source lots</Typography>
          {bean.lots.map((lot) => (
            <Box key={lot.id}>
              <FormControlLabel
                disabled={lot.state === "frozen"}
                control={
                  <Checkbox
                    size="small"
                    checked={sourceIds.includes(lot.id)}
                    onChange={() => toggleSource(lot.id)}
                  />
                }
                label={`${lot.vessel_label} · ${titleCase(lot.state)} · ${lot.remaining_weight}g${lot.state === "frozen" ? " (thaw first)" : ""}`}
              />
            </Box>
          ))}
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.7 }}>
            {mode} · {sourceTotal.toFixed(2)}g selected
          </Typography>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>2. Target vessels</Typography>
          <Autocomplete
            multiple
            disableCloseOnSelect
            options={options}
            value={picked}
            onChange={handlePick}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(a, b) => a.id === b.id}
            renderOption={(props, option, { selected }) => {
              const { key, ...optionProps } = props;
              return (
                <li key={option.id} {...optionProps}>
                  <Checkbox size="small" checked={selected} sx={{ mr: 1 }} />
                  {option.label}
                </li>
              );
            }}
            renderInput={(params) => (
              <TextField {...params} size="small" label="Pick vessels" placeholder="Search by type or marker" />
            )}
          />

          {rows.map((row, index) => (
            <Box key={row.vesselId} sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.5 }}>
              <Typography sx={{ flex: 1, minWidth: 0 }}>{row.label}</Typography>
              <TextField
                size="small"
                label="Weight (g)"
                value={row.weight}
                onChange={(event) => updateRow(index, { weight: event.target.value })}
                sx={{ width: 120 }}
                slotProps={{ htmlInput: { inputMode: "decimal" } }}
              />
              <Select
                size="small"
                value={row.state}
                onChange={(event) => updateRow(index, { state: event.target.value })}
                sx={{ width: 110 }}
              >
                {allowedStates.map((state) => (
                  <MenuItem key={state} value={state} disabled={state === "frozen" && !row.freezable}>
                    {titleCase(state)}
                  </MenuItem>
                ))}
              </Select>
              <Button size="small" onClick={() => fillRemainder(index)} sx={{ textTransform: "none" }}>
                Remainder
              </Button>
              <IconButton size="small" onClick={() => removeRow(index)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}

          {rows.length > 1 && (
            <Button size="small" onClick={splitEvenly} sx={{ mt: 1.5, textTransform: "none" }}>
              Split evenly
            </Button>
          )}
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography
            sx={{ color: rows.length > 0 && !withinTolerance ? "#c97a6a" : "inherit" }}
          >
            Placed {targetTotal.toFixed(2)}g of {sourceTotal.toFixed(2)}g
            {rows.length > 0 && ` · ${gap >= 0 ? gap.toFixed(2) : `${(-gap).toFixed(2)} over`}${gap >= 0 ? "g left" : "g"}`}
            {rows.length > 0 && ` (tolerance ${tolerance.toFixed(1)}g)`}
          </Typography>

          {errors.length > 0 && (
            <Alert severity="error" sx={{ mt: 1.5 }}>
              {errors.map((message) => <div key={message}>{message}</div>)}
            </Alert>
          )}

          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
            <Button
              variant="outlined"
              disabled={!shapeOk || submitting}
              onClick={submit}
              sx={{ textTransform: "none" }}
            >
              {mode === "Merge" ? "Merge lots" : "Transfer lot"}
            </Button>
            <Button onClick={() => navigate("/bean-stock")} sx={{ textTransform: "none" }}>
              Cancel
            </Button>
          </Box>
          {sourceLots.length >= 2 && rows.length > 1 && (
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.7 }}>
              A merge takes exactly one target vessel.
            </Typography>
          )}
        </Paper>
      </Box>
    </DefaultBodyLayout>
  );
}