//src/components/TagsGridItem.jsx
import { useCallback } from "react";
import { Grid, FormHelperText } from "@mui/material";
import TagPicker from "./TagPicker";
import { getTags } from "../api/tagsApi";

export default function TagsGridItem({ item, value = [], onChange, error, mode }) {
  const fetchTags = useCallback(() => getTags(item.method), [item.method]);
  return (
    <Grid size={item.size ?? { xs: 12, sm: 10, md: 10 }} offset={item.offset}>
      <TagPicker
        fetchTags={fetchTags}
        label={item.label}
        value={value}
        onChange={(slugs) => onChange(item.name, slugs)}
        readOnly={mode === "view"}
      />
      {error && <FormHelperText error>{String(error)}</FormHelperText>}
    </Grid>
  );
}