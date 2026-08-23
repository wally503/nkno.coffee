// src/pages/brew/shared/BrewLogFormShell.jsx
import { Box, Grid, Divider, Button } from "@mui/material";
import DropdownGridItem from "../../../components/DropdownGridItem";
import TextFieldGridItem from "../../../components/TextFieldGridItem";
import DateFieldGridItem from "../../../components/DateFieldGridItem";
import DateTimeFieldGridItem from "../../../components/DateTimeFieldGridItem";
import MultilineTextFieldGridItem from "../../../components/MultilineTextFieldGridItem";
import RatingGridItem from "../../../components/RatingGridItem";
import HoffmannEventList from "../../../components/HoffmannEventList";
import PouroverEventList from "../../../components/PouroverEventList";
import PageTitle from "../../../components/PageTitle";

// Same shape as CoffeeLogFormShell: title / back button / field switch / save-or-edit button.
// Kept as its own shell (not an extension of CoffeeLogFormShell) because brew forms need
// the event_list field type, which has no equivalent in the coffeelog field vocabulary.

export default function BrewLogFormShell({
  title,
  hasBackButton,
  backRoute,
  fields,
  formData,
  onFieldChange,
  onSubmit,
  onEdit,
  errors,
  mode
}) {

  return (
    <>
      <PageTitle title={title} hasBackButton={hasBackButton} backRoute={backRoute}/>
      <Box sx={{ width: "80%", maxWidth: 1400 }}>
        <Grid container spacing={3} columns={12}>
          {fields.map((field, index) => {
            switch (field.type) {
              case "text":         return buildTextField(field, formData, onFieldChange, mode, errors);
              case "text_numeric": return buildTextFieldNumeric(field, formData, onFieldChange, mode, errors);
              case "date":         return buildDateField(field, formData, onFieldChange, mode, errors);
              case "date_time":    return buildDateTimeField(field, formData, onFieldChange, mode, errors);
              case "long_text":    return buildMultilineTextField(field, formData, onFieldChange, mode, errors);
              case "rating":       return buildRatingField(field, formData, onFieldChange, mode, errors);
              case "dropdown":     return buildDropdownField(field, formData, onFieldChange, mode, errors);
              case "divider":      return buildDivider(index);
              case "spacer":       return buildSpacer(field, index);
              case "event_list":   return buildEventListField(field, formData, onFieldChange, mode, errors);
            }
          })}
        </Grid>
      </Box>

      <Box sx={{ width: "100%", maxWidth: 1400, mt: 5 }}>
        <Grid container spacing={3} columns={12} my={3}>
          <Grid size={{ xs: 2 }}>
            {mode === "view"
              ? <Button variant="contained" onClick={onEdit}>Edit</Button>
              : <Button variant="contained" onClick={onSubmit}>Save</Button>
            }
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

function buildTextField(field, formData, onFieldChange, mode, errors) {
  return <TextFieldGridItem
            key={field.name}
            item={field}
            value={formData[field.name] ?? ""}
            onChange={onFieldChange}
            error={errors[field.name]}
            mode={mode}
            inputStyle="default"
          />;
}

function buildTextFieldNumeric(field, formData, onFieldChange, mode, errors) {
  return <TextFieldGridItem
            key={field.name}
            item={field}
            value={formData[field.name] ?? ""}
            onChange={onFieldChange}
            error={errors[field.name]}
            mode={mode}
            inputStyle="numeric"
          />;
}

function buildDateField(field, formData, onFieldChange, mode, errors) {
  return <DateFieldGridItem
            key={field.name}
            item={field}
            value={formData[field.name] ?? ""}
            onChange={onFieldChange}
            error={errors[field.name]}
            mode={mode}
          />;
}

function buildDateTimeField(field, formData, onFieldChange, mode, errors) {
  return <DateTimeFieldGridItem
            key={field.name}
            item={field}
            value={formData[field.name] ?? ""}
            onChange={onFieldChange}
            error={errors[field.name]}
            mode={mode}
          />;
}

function buildDivider(key) {
  return (
    <Box key={key} sx={{ width: "100%", my: 0.3 }}>
      <Divider />
    </Box>
  );
}

// Fills a layout gap with a centered divider line instead of dead whitespace —
// e.g. 5 fields at md:4 leaves one dangling slot; this makes that slot feel
// intentional instead of like a missing field.
//
// { type: "spacer", size: { xs: 12, sm: 4, md: 4 } }                         — default divider
// { type: "spacer", size: {...}, color: "#somehex" }                        — just recolor
// { type: "spacer", size: {...}, sx: { borderColor: "#fff", opacity: 0.4,
//     borderWidth: 2, my: 2 } }                                             — full override
//
// `sx` wins over `color` if both are set. Neither is required — bare
// { type: "spacer" } falls back to the theme's divider token.
function buildSpacer(field, key) {
  if (field.orientation === "vertical") {
    return (
      <Grid
        key={key}
        size={field.size ?? { xs: 0, sm: 1, md: 1 }}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center", ...(field.gridSx ?? {}) }}
      >
        <Divider
          orientation="vertical"
          sx={{
            height: 36, // matches input height, not the full field block
            borderColor: field.color ?? "divider",
            ...(field.sx ?? {}),
          }}
        />
      </Grid>
    );
  }

  return (
    <Grid
      key={key}
      size={field.size ?? { xs: 12, sm: 4, md: 4 }}
      sx={{ display: "flex", alignItems: "center", ...(field.gridSx ?? {}) }}
    >
      <Divider
        sx={{
          width: "100%",
          borderColor: field.color ?? "divider",
          ...(field.sx ?? {}),
        }}
      />
    </Grid>
  );
}

function buildMultilineTextField(field, formData, onFieldChange, mode, errors) {
  return <MultilineTextFieldGridItem
            key={field.name}
            item={field}
            value={formData[field.name] ?? ""}
            onChange={onFieldChange}
            error={errors[field.name]}
            mode={mode}
          />;
}

function buildRatingField(field, formData, onFieldChange, mode, errors) {
  return <RatingGridItem
            key={field.name}
            item={field}
            value={formData[field.name] ?? ""}
            onChange={onFieldChange}
            error={errors[field.name]}
            mode={mode}
          />;
}

function buildDropdownField(field, formData, onFieldChange, mode, errors) {
  return <DropdownGridItem
            key={field.name}
            dropdown={field}
            value={formData[field.name] ?? ""}
            onChange={onFieldChange}
            error={errors[field.name]}
            mode={mode}
            dependsOn={field.dependsOn}
            dependsOnFieldValue={formData[field.dependsOn] ?? null}
          />;
}

// event_list fields carry a `component` key (per-style: HoffmannEventList, PouroverEventList, ...)
// since each style's event row shape is different and shouldn't be forced through one generic component.
function buildEventListField(field, formData, onFieldChange, mode, errors) {
  const ListComponent = field.component === 'pourover' ? PouroverEventList : HoffmannEventList;
  return (
    <Grid key={field.name} size={{ xs: 12, sm: 10, md: 10 }} offset={{ sm: 1, md: 1 }}>
      <ListComponent
        item={field}
        onChange={(val) => onFieldChange(field.name, val)}
        initialValues={formData[field.name]}
        error={errors[field.name]}
        mode={mode}
      />
    </Grid>
  );
}