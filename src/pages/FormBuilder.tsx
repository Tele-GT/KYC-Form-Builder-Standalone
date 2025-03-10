import { Box, Container, Typography, Button, Fab } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import FormField, { FormFieldProps } from '../components/form-builder/FormField';

type EditorType = 'template' | 'customize' | 'new';

interface FormField extends Omit<FormFieldProps, 'onDelete' | 'onUpdate'> {}

const generateId = () => Math.random().toString(36).substr(2, 9);

export default function FormBuilder() {
  const { type } = useParams<{ type: EditorType }>();
  const [fields, setFields] = useState<FormField[]>([]);

  const getEditorTitle = () => {
    switch(type) {
      case 'template':
        return 'Use Existing Template';
      case 'customize':
        return 'Customize Template';
      case 'new':
        return 'Create New Form';
      default:
        return 'Form Builder';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            background: 'linear-gradient(45deg, #9C27B0 30%, #00BFA5 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold',
            mb: 4,
          }}
        >
          {getEditorTitle()}
        </Typography>
        <Box sx={{ mb: 4 }}>
          {fields.map((field, index) => (
            <Box key={field.id} sx={{ mb: 2 }}>
              <FormField
                {...field}
                onDelete={(id) => {
                  setFields(fields.filter(f => f.id !== id));
                }}
                onUpdate={(id, updatedField) => {
                  setFields(fields.map(f => 
                    f.id === id ? { ...f, ...updatedField } : f
                  ));
                }}
              />
            </Box>
          ))}
        </Box>

        <Fab
          color="primary"
          onClick={() => {
            setFields([...fields, {
              id: generateId(),
              type: 'text',
              label: 'New Field',
              placeholder: '',
              required: false,
              options: []
            }]);
          }}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            background: 'linear-gradient(45deg, #9C27B0 30%, #00BFA5 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #7B1FA2 30%, #00897B 90%)'
            }
          }}
        >
          <AddIcon />
        </Fab>
      </Box>
    </Container>
  );
}