import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, IconButton } from '@mui/material';
import { Delete as DeleteIcon, DragIndicator as DragIndicatorIcon } from '@mui/icons-material';
import { useState } from 'react';

export interface FormFieldProps {
  id: string;
  type: 'text' | 'number' | 'date' | 'email' | 'tel' | 'file' | 'select' | 'checkbox' | 'radio';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  onDelete: (id: string) => void;
  onUpdate: (id: string, field: Partial<FormFieldProps>) => void;
}

export default function FormField({
  id,
  type,
  label,
  placeholder,
  required = false,
  options = [],
  validation = {},
  onDelete,
  onUpdate
}: FormFieldProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const handleChange = (field: string, value: any) => {
    onUpdate(id, { [field]: value });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 1,
        background: 'rgba(19, 47, 76, 0.3)',
        '&:hover': {
          background: 'rgba(19, 47, 76, 0.5)'
        }
      }}
    >
      <IconButton
        sx={{
          cursor: 'grab',
          '&:active': { cursor: 'grabbing' }
        }}
      >
        <DragIndicatorIcon />
      </IconButton>

      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Field Label"
            value={label}
            onChange={(e) => handleChange('label', e.target.value)}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Field Type</InputLabel>
            <Select
              value={type}
              label="Field Type"
              onChange={(e) => handleChange('type', e.target.value)}
            >
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="number">Number</MenuItem>
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="tel">Phone</MenuItem>
              <MenuItem value="file">File Upload</MenuItem>
              <MenuItem value="select">Dropdown</MenuItem>
              <MenuItem value="checkbox">Checkbox</MenuItem>
              <MenuItem value="radio">Radio</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            label="Placeholder"
            value={placeholder}
            onChange={(e) => handleChange('placeholder', e.target.value)}
          />
          <FormControlLabel
            control={
              <Switch
                checked={required}
                onChange={(e) => handleChange('required', e.target.checked)}
              />
            }
            label="Required"
          />
        </Box>

        {(type === 'select' || type === 'radio') && (
          <TextField
            fullWidth
            label="Options (comma-separated)"
            value={options.join(', ')}
            onChange={(e) => handleChange('options', e.target.value.split(',').map(opt => opt.trim()))}
            sx={{ mt: 2 }}
          />
        )}
      </Box>

      <IconButton onClick={() => onDelete(id)} color="error">
        <DeleteIcon />
      </IconButton>
    </Box>
  );
}