import { Box, Button, Container, Grid, Typography, Modal, Card, CardContent } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, FileCopy as FileCopyIcon } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignIn from './SignIn';

const templateExamples = [
  {
    id: 1,
    title: 'Basic KYC Form',
    description: 'Simple tenant KYC form with essential details',
    imageUrl: '/images/basic-kyc.svg',
    features: ['Personal Information', 'Contact Details', 'Basic ID Verification'],
  },
  {
    id: 2,
    title: 'Comprehensive KYC',
    description: 'Detailed verification form with additional documentation',
    imageUrl: '/images/comprehensive-kyc.svg',
    features: ['Enhanced Due Diligence', 'Document Upload', 'Background Check'],
  },
  {
    id: 3,
    title: 'Property Manager Special',
    description: 'Customized form for property management companies',
    imageUrl: '/images/property-kyc.svg',
    features: ['Tenant History', 'Income Verification', 'Property Preferences'],
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');

  const handleActionClick = (action: string) => {
    setSelectedAction(action);
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setSelectedAction('');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{
            background: 'linear-gradient(45deg, #9C27B0 30%, #00BFA5 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold',
            mb: 3
          }}
        >
          Create and share tenant KYC forms in minutes!
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Streamline your tenant screening process with our easy-to-use KYC solution
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => navigate('/signup')}
          sx={{ 
            mt: 2,
            px: 4,
            py: 1.5,
            fontSize: '1.1rem'
          }}
        >
          Get Started
        </Button>
        <Button
          variant="outlined"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => handleActionClick('create-new')}
          sx={{ 
            mt: 2,
            ml: 2,
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2
            }
          }}
        >
          Create New Template
        </Button>
      </Box>

      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom
          sx={{
            textAlign: 'center',
            background: 'linear-gradient(45deg, #9C27B0 30%, #00BFA5 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold',
            mb: 4
          }}
        >
          Template Gallery
        </Typography>
        <Grid container spacing={3}>
          {[
            { id: 'basic', title: 'Basic KYC Form', gif: '/gifs/basic-kyc.gif' },
            { id: 'corporate', title: 'Corporate KYC', gif: '/gifs/corporate-kyc.gif' },
            { id: 'enhanced', title: 'Enhanced Due Diligence', gif: '/gifs/enhanced-kyc.gif' },
            { id: 'property', title: 'Property Manager KYC', gif: '/gifs/property-kyc.gif' },
            { id: 'investor', title: 'Investor Verification', gif: '/gifs/investor-kyc.gif' },
            { id: 'international', title: 'International KYC', gif: '/gifs/international-kyc.gif' }
          ].map((template) => (
            <Grid item key={template.id} xs={12} sm={6} md={4}>
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: 3,
                  overflow: 'hidden',
                  backgroundColor: 'background.paper',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: (theme) => `
                      0 16px 32px ${theme.palette.primary.dark}40,
                      0 0 60px ${theme.palette.primary.main}20
                    `,
                    '& .template-title': {
                      opacity: 1,
                      transform: 'translateY(0)'
                    },
                    '& .template-actions': {
                      opacity: 1,
                      transform: 'translateY(0)'
                    }
                  }
                }}
              >
                <Box
                  component="img"
                  src={template.gif}
                  alt={template.title}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    aspectRatio: '16/9',
                    display: 'block',
                    objectFit: 'cover'
                  }}
                />
                <Box
                  className="template-title"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: 2,
                    background: 'linear-gradient(to top, rgba(19, 47, 76, 0.95), rgba(19, 47, 76, 0.5))',
                    opacity: 0.8,
                    transform: 'translateY(10px)',
                    transition: 'all 0.3s ease-in-out'
                  }}
                >
                  <Typography variant="h6" sx={{ color: 'common.white', fontWeight: 500 }}>
                    {template.title}
                  </Typography>
                  <Box
                    className="template-actions"
                    sx={{
                      display: 'flex',
                      gap: 1,
                      mt: 2,
                      opacity: 0,
                      transform: 'translateY(10px)',
                      transition: 'all 0.3s ease-in-out'
                    }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<FileCopyIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleActionClick('use-existing');
                      }}
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(4px)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.2)'
                        }
                      }}
                    >
                      Use Template
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleActionClick('customize');
                      }}
                      sx={{
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        color: 'common.white',
                        '&:hover': {
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }
                      }}
                    >
                      Customize
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Grid container spacing={4} sx={{ position: 'relative', py: 2 }}>
        {templateExamples.map((template) => (
          <Grid item key={template.id} xs={12} sm={6} md={4} sx={{
            display: 'flex',
            perspective: '1000px'
          }}>
            <Box
              sx={{
                p: 3,
                width: '100%',
                backgroundColor: 'background.paper',
                borderRadius: 3,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(8px)',
                background: (theme) => `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.dark}15 100%)`,
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02) rotateX(2deg)',
                  boxShadow: (theme) => `
                    0 16px 32px ${theme.palette.primary.dark}40,
                    0 0 60px ${theme.palette.primary.main}20,
                    inset 0 0 15px ${theme.palette.primary.light}10
                  `,
                  '& .template-overlay': {
                    opacity: 1
                  }
                },
              }}
            >
              <Box
                className="template-overlay"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, rgba(156, 39, 176, 0.15) 0%, rgba(0, 191, 165, 0.15) 100%)',
                  opacity: 0,
                  transition: 'opacity 0.4s ease-in-out',
                  zIndex: 1,
                  backdropFilter: 'blur(2px)'
                }}
              />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, position: 'relative', zIndex: 2, mb: 3 }}>
                {template.title}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3, position: 'relative', zIndex: 2 }}>
                {template.description}
              </Typography>
              <Box sx={{ mt: 2, position: 'relative', zIndex: 2 }}>
                {template.features.map((feature, index) => (
                  <Typography
                    key={index}
                    variant="body2"
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      backgroundColor: (theme) => `${theme.palette.primary.main}15`,
                      color: 'primary.light',
                      borderRadius: 6,
                      px: 2,
                      py: 0.75,
                      mr: 1,
                      mb: 1,
                      border: '1px solid',
                      borderColor: 'primary.main',
                      borderOpacity: 0.1,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: (theme) => `${theme.palette.primary.main}25`,
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    {feature}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Modal
        open={previewOpen}
        onClose={handleClosePreview}
        aria-labelledby="preview-modal-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Card sx={{ 
          maxWidth: 600, 
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative'
        }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              {selectedAction === 'use-existing' && 'Preview Template'}
              {selectedAction === 'customize' && 'Customize Template Preview'}
              {selectedAction === 'create-new' && 'New Form Preview'}
            </Typography>
            <Box sx={{ 
              p: 3, 
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              borderRadius: 1,
              mb: 3
            }}>
              {/* Sample form preview content */}
              <Typography variant="body1" gutterBottom>Sample form fields will appear here</Typography>
            </Box>
            <SignIn
              onSuccess={handleClosePreview}
              redirectPath="/signup"
            />
          </CardContent>
        </Card>
      </Modal>
    </Container>
  );
}
