// src/pages/coffeelog/shared/CoffeeLogFormShell.jsx
import { Box, Grid, Divider } from "@mui/material";
import DropdownGridItem from "../../../components/DropdownGridItem";
import TextFieldGridItem from "../../../components/TextFieldGridItem";
import DynamicDropdownList from "../../../components/DynamicDropdown";
import DateFieldGridItem from "../../../components/DateFieldGridItem";

export default function CoffeeLogFormShell({
  title,
  fields,
  formData,
  onFieldChange,
  flavorModel,
  onFlavorNotesChange,
  onSubmit,
}) {
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
      <h2>{title}</h2>

      <Box sx={{ width: "100%", maxWidth: 1400 }}>
        <Grid container spacing={3} columns={12}>
          {fields.map((field) =>
            field.type === "text" ? (
              <TextFieldGridItem
                key={field.name}
                item={field}
                value={formData[field.name] ?? ""}
                onChange={onFieldChange}
              />
            ) : field.type === "date" ?
            (
              <DateFieldGridItem 
                key={field.name}
                item={field}
                value={formData[field.name] ?? ""}
                onChange={onFieldChange}
              />
            ) : field.type === "divider" ?
            (
              <Box sx={{ width: "100%", my: 0.3 }}>
                <Divider sx={{ opacity: 0.2 }} />
              </Box>
            )
            : (
              <DropdownGridItem
                key={field.name}
                dropdown={field}
                value={formData[field.name] ?? ""}
                onChange={onFieldChange}
              />
            )
          )}

          {flavorModel && (
            <Grid item size={{ xs: 12, sm: 10, md: 10 }} offset={{ sm: 1, md: 1 }}>
              <DynamicDropdownList
                dropdownModel={flavorModel}
                onChange={onFlavorNotesChange}
              />
            </Grid>
          )}
        </Grid>

        <button onClick={onSubmit} style={{ marginTop: "1rem" }}>
          Save
        </button>
      </Box>
    </Box>
  );
}
