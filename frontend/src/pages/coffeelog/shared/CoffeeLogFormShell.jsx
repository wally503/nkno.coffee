// src/pages/coffeelog/shared/CoffeeLogFormShell.jsx
import { Box, Grid, Divider,Button } from "@mui/material";
import DropdownGridItem from "../../../components/DropdownGridItem";
import TextFieldGridItem from "../../../components/TextFieldGridItem";
import DynamicDropdownList from "../../../components/DynamicDropdown";
import DateFieldGridItem from "../../../components/DateFieldGridItem";
import MultilineTextFieldGridItem from "../../../components/MultilineTextFieldGridItem";
import RatingGridItem from "../../../components/RatingGridItem";
import PageTitle from "../../../components/PageTitle";
import { useNavigate } from "react-router-dom";

export default function CoffeeLogFormShell({
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

  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        px: 4,
        py: 4,
        width: "100%",
      }}
    >
      
      <PageTitle title={title} hasBackButton={hasBackButton} backRoute={backRoute} />
      <Box sx={{ width: "90%", maxWidth: 1400 }}>
        <Grid container spacing={3} columns={12}>
          {fields.map((field, index) => {
            // console.log(field)
            switch(field.type) {
              case "text":              return buildTextField(field, formData, onFieldChange, mode, errors)
              case "date":              return buildDateField(field, formData, onFieldChange, mode, errors)
              case "long_text":         return buildMultilineTextField(field, formData, onFieldChange, mode, errors)
              case "rating":            return buildRatingField(field, formData, onFieldChange, mode, errors)
              case "dropdown":          return buildDropdownField(field, formData, onFieldChange, mode, errors)
              case "divider":           return buildDivider(index)
              case "dynamic_dropdown":  return buildDynamicMultiselectField(field, formData, onFieldChange, mode, errors)
            }
          })}
        </Grid>
      </Box>

      <Box sx={{ width: "100%", maxWidth: 1400 }}>
        <Grid container spacing={3} columns={12} my={3}>
          <Grid size={ {xs: 2 }}>
            {mode === "view"
              ? <Button variant="contained" onClick={onEdit}>Edit</Button>
              : <Button variant="contained" onClick={onSubmit}>Save</Button>
            }
          </Grid>
        </Grid>
    </Box>

      
    </Box>
  );
}

function buildTextField(field, formData, onFieldChange, mode, errors){
  return <TextFieldGridItem
            key={field.name}
            item={field}
            value={formData[field.name] ?? ""}
            onChange={onFieldChange}
            error={errors[field.name]}
            mode={mode}
          />
}

function buildDateField(field, formData, onFieldChange, mode, errors){
  return <DateFieldGridItem 
            key={field.name}
            item={field}
            value={formData[field.name] ?? ""}
            onChange={onFieldChange}
            error={errors[field.name]}
            mode={mode}
          />
}

function buildDivider(key){
  return ( 
    <Box key={key} sx={{ width: "100%", my: 0.3 }}>
      <Divider />
    </Box>
  )
}

function buildMultilineTextField(field, formData, onFieldChange, mode, errors){
  return  <MultilineTextFieldGridItem
            key={field.name}
            item={field}
            value={formData[field.name] ?? ""}
            onChange={onFieldChange}
            error={errors[field.name]}
            mode={mode}
          />
}

function buildRatingField(field, formData, onFieldChange, mode, errors){
  return  <RatingGridItem
            key={field.name}
            item={field}
            value={formData[field.name] ?? ""}
            onChange={onFieldChange}
            error={errors[field.name]}
            mode={mode}
            
          />
}

function buildDropdownField(field, formData, onFieldChange, mode, errors) {
  return  <DropdownGridItem
            key={field.name}
            dropdown={field}
            value={formData[field.name] ?? ""}
            onChange={onFieldChange}
            error={errors[field.name]}
            mode={mode}
            dependsOn={field.dependsOn}
            dependsOnFieldValue={formData[field.dependsOn] ?? null }
          />
}

function buildDynamicMultiselectField(field, formData, onFieldChange, mode, errors){
  return <Grid key={field.name} size={{ xs: 12, sm: 10, md: 10 }} offset={{ sm: 1, md: 1 }}>
          <DynamicDropdownList
            item={field}
            onChange={(val) => onFieldChange(field.name, val)}
            initialValues={formData[field.name]}
            error={errors[field.name]}
            mode={mode}
            dependsOn={field.dependsOn}
          />
        </Grid>
}