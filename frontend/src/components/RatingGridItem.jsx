// src/components/RatingGridItem.jsx
import { Grid, FormControl, FormHelperText, Box, Rating, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import PropTypes from 'prop-types';

const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
    color: theme.palette.action.disabled,
  },
}));

export const ratingCustomIcons = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon color="error" />,
    label: 'Sad',
  },
  2: {
    icon: <SentimentDissatisfiedIcon color="error" />,
    label: 'Dissatisfied',
  },
  3: {
    icon: <SentimentSatisfiedIcon color="warning" />,
    label: 'OK',
  },
  4: {
    icon: <SentimentSatisfiedAltIcon color="success" />,
    label: 'Good',
  },
  5: {
    icon: <SentimentVerySatisfiedIcon color="success" />,
    label: 'Awesome',
  },
};

function IconContainer(props) {
  const { value, ...other } = props;
  return <span {...other}>{ratingCustomIcons[value].icon}</span>;
}

IconContainer.propTypes = {
  value: PropTypes.number.isRequired,
};

export default function RatingGridItem({ item, onChange, value, mode, error }) {
  return (
    <Grid size={item.size || { xs: 12 }}>
      <FormControl fullWidth component="fieldset">
        <Box sx={{ width: "100%" }}>
          <Typography component="legend">{item.label}</Typography>
          <StyledRating
            sx={{ pl: "10px", pt: "5px"}}
            name="highlight-selected-only"
            defaultValue={3}
            slotProps={{ 
              icon: { 
                component: 
                  IconContainer 
                } 
            }}
            getLabelText={(value) => ratingCustomIcons[value].label}
            highlightSelectedOnly
            onChange={(e) => onChange(item.name, parseInt(e.target.value))}
            // error={!!error}
            // helperText={error?.[0]}
            readOnly={mode === "view"}
          />
        </Box>
        {mode !== "view" && item.required && (error ? null : <FormHelperText>Required</FormHelperText>)}
      </FormControl>
    </Grid>
  );
}