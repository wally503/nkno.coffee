// src/pages/coffeelog/shared/CoffeeLogFormShell.jsx
import { Box, Grid, Divider,Button } from "@mui/material";
import DropdownGridItem from "../../../components/DropdownGridItem";
import TextFieldGridItem from "../../../components/TextFieldGridItem";
import DynamicDropdownList from "../../../components/DynamicDropdown";
import DateFieldGridItem from "../../../components/DateFieldGridItem";
import MultilineTextFieldGridItem from "../../../components/MultilineTextFieldGridItem";
import RatingGridItem from "../../../components/RatingGridItem";
import PageTitle from "../../../components/PageTitle";

export default function CoffeeLogFormShell({
  title,
  hasBackButton,
  backRoute,
  fields,
  formData,
  onFieldChange,
  onSubmit,
  errors
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
      
      <PageTitle title={title} hasBackButton={hasBackButton} backRoute={backRoute}  />
      <Box sx={{ width: "90%", maxWidth: 1400 }}>
        <Grid container spacing={3} columns={12}>
          {fields.map((field) => {
            // console.log(field)
            switch(field.type) {
              case "text":              return buildTextField(field, formData, onFieldChange, errors)
              case "date":              return buildDateField(field, formData, onFieldChange, errors)
              case "long_text":         return buildMultilineTextField(field, formData, onFieldChange, errors)
              case "rating":            return buildRatingField(field, formData, onFieldChange, errors)
              case "dropdown":          return buildDropdownField(field, formData, onFieldChange, errors)
              case "divider":           return buildDivider()
              case "dynamic_dropdown":  return buildDynamicMultiselectField(field, formData, onFieldChange, errors)
            }
          })}
        </Grid>
      </Box>

      <Box sx={{ width: "100%", maxWidth: 1400 }}>
        <Grid container spacing={3} columns={12}>
          <Grid size={ {xs: 2 }}>
            <Button variant="contained" onClick={onSubmit} style={{ marginTop: "1rem" }}>
              Save
            </Button>
          </Grid>
        </Grid>
    </Box>

      
    </Box>
  );
}

function buildTextField(field, formData, onFieldChange, errors){
  return <TextFieldGridItem
            key={field.name}
            item={field}
            value={formData[field.name] ?? ""}
            onChange={onFieldChange}
            error={errors[field.name]}
          />
}

function buildDateField(field, formData, onFieldChange, errors){
  return <DateFieldGridItem 
            key={field.name}
            item={field}
            value={formData[field.name] ?? ""}
            onChange={onFieldChange}
            error={errors[field.name]}
          />
}

function buildDivider(){
  return <Box sx={{ width: "100%", my: 0.3 }}>
            <Divider />
          </Box>
}

function buildMultilineTextField(field, formData, onFieldChange, errors){
  return  <MultilineTextFieldGridItem
            key={field.name}
            item={field}
            value={formData[field.name] ?? ""}
            onChange={onFieldChange}
            error={errors[field.name]}
          />
}

function buildRatingField(field, formData, onFieldChange, errors){
  return  <RatingGridItem
            key={field.name}
            item={field}
            value={formData[field.name] ?? ""}
            onChange={onFieldChange}
            error={errors[field.name]}
          />
}

function buildDropdownField(field, formData, onFieldChange, errors) {
  return  <DropdownGridItem
            key={field.name}
            dropdown={field}
            value={formData[field.name] ?? ""}
            onChange={onFieldChange}
            error={errors[field.name]}
          />
}

function buildDynamicMultiselectField(field, formData, onFieldChange, errors){
  return <Grid item size={{ xs: 12, sm: 10, md: 10 }} offset={{ sm: 1, md: 1 }}>
          <DynamicDropdownList
            item={field}
            onChange={(val) => onFieldChange(field.name, val)}
            initialValues={formData[field.name]}
            error={errors[field.name]}
          />
        </Grid>
}