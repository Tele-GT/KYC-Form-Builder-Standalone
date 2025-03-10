import { Box, Button, Container, Grid, Typography, Modal, Card, CardContent, Paper, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, FileCopy as FileCopyIcon, CheckCircle as CheckCircleIcon, Update as UpdateIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    // Check if user came from successful sign in
    if (location.state?.signedIn) {
      setIsSignedIn(true);
    }
  }, [location]);

  const handleActionClick = (action: string) => {
    if (isSignedIn) {
      // If signed in, navigate directly to the appropriate editor
      switch(action) {
        case 'use-existing':
          navigate('/editor/template');
          break;
        case 'customize':
          navigate('/editor/customize');
          break;
        case 'create-new':
          navigate('/editor/new');
          break;
        default:
          break;
      }
    } else {
      // If not signed in, show sign in modal
      setSelectedAction(action);
      setPreviewOpen(true);
    }
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
          onClick={() => isSignedIn ? navigate('/editor/new') : navigate('/signup')}
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

      <Box sx={{ mt: 8, mb: 6 }}>
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => `0 6px 20px ${theme.palette.primary.main}40`
                }
              }}
              onClick={() => handleActionClick('use-existing')}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                <FileCopyIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Use Existing Template
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Choose from our collection of pre-built KYC form templates
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => `0 6px 20px ${theme.palette.primary.main}40`
                }
              }}
              onClick={() => handleActionClick('customize')}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                <EditIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Customize Template
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Modify existing templates to match your specific requirements
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => `0 6px 20px ${theme.palette.primary.main}40`
                }
              }}
              onClick={() => handleActionClick('create-new')}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                <AddIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Create New Form
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Build a custom KYC form from scratch with our form builder
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
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
                { id: 'property', title: 'Property Manager KYC', gif: '/gifs/property-kyc.gif' }
              ].map((template) => (
                <Grid item xs={12} sm={6} key={template.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'rgba(19, 47, 76, 0.5)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 2,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: (theme) => `0 6px 20px ${theme.palette.primary.main}40`
                      }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                      <Typography variant="h6" gutterBottom>
                        {template.title}
                      </Typography>
                      <Box
                        component="img"
                        src={template.gif}
                        alt={template.title}
                        sx={{
                          width: '100%',
                          height: 'auto',
                          borderRadius: 1,
                          mb: 2
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                background: 'rgba(19, 47, 76, 0.5)',
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                mb: 4
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  background: 'linear-gradient(45deg, #9C27B0 30%, #00BFA5 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold',
                  mb: 3
                }}
              >
                Why This KYC Solution Stands Out
              </Typography>
              <List>
                {[
                  'Quick and simple for tenants to complete.',
                  'Cost-effective for agents and landlords',
                  'Saves prospects time by auto-filling info from past submissions.',
                  'Smooth reporting for landlords with multiple submissions exported into one clear, readable format',
                  'Stores KYC records for future legal use.'
                ].map((benefit, index) => (
                  <ListItem key={index} sx={{ py: 1 }}>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: '#00BFA5' }} />
                    </ListItemIcon>
                    <ListItemText primary={benefit} />
                  </ListItem>
                ))}
              </List>
            </Paper>
            
            <Paper
              sx={{
                p: 3,
                background: 'rgba(19, 47, 76, 0.5)',
                backdropFilter: 'blur(10px)',
                borderRadius: 2
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  background: 'linear-gradient(45deg, #9C27B0 30%, #00BFA5 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold',
                  mb: 3
                }}
              >
                Coming Soon
              </Typography>
              <List>
                {[
                  'Identifying reliable prospects with easy verification.',
                  'Ranking prospects based on income-to-rent ratio, work email, and guarantor details.'
                ].map((feature, index) => (
                  <ListItem key={index} sx={{ py: 1 }}>
                    <ListItemIcon>
                      <UpdateIcon sx={{ color: '#9C27B0' }} />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
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
