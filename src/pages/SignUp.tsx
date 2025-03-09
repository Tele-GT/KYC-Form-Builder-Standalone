import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Alert,
} from '@mui/material';

type UserRole = 'agent' | 'landlord' | 'propertyManager';

export default function SignUp() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'agent' as UserRole,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle form submission
      console.log('Form submitted:', formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
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
          Create Your Account
        </Typography>

        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 2,
            background: 'rgba(19, 47, 76, 0.5)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <FormLabel
                sx={{
                  color: 'primary.light',
                  mb: 2,
                  '&.Mui-focused': { color: 'primary.light' },
                }}
              >
                Select your role
              </FormLabel>
              <RadioGroup
                row
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="agent"
                  control={<Radio />}
                  label="Agent"
                />
                <FormControlLabel
                  value="landlord"
                  control={<Radio />}
                  label="Landlord"
                />
                <FormControlLabel
                  value="propertyManager"
                  control={<Radio />}
                  label="Property Manager"
                />
              </RadioGroup>
            </FormControl>

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              sx={{ mb: 3 }}
            />

            <Alert severity="info" sx={{ mb: 3 }}>
              Start with a 14-day free trial. No credit card required.
            </Alert>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                background: 'linear-gradient(45deg, #9C27B0 30%, #00BFA5 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #7B1FA2 30%, #00897B 90%)',
                },
              }}
            >
              Sign Up
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}