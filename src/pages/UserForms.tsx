import { Box, Container, Grid, Card, CardContent, CardActions, Typography, Button, IconButton, Modal, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Paper, Switch, FormControlLabel, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Share as ShareIcon, Twitter as TwitterIcon, Facebook as FacebookIcon, LinkedIn as LinkedInIcon, Email as EmailIcon, Sms as SmsIcon, ContentCopy as ContentCopyIcon } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FormData {
  id: string;
  title: string;
  createdAt: string;
  submissionCount: number;
  type: 'template' | 'customize' | 'new';
  apartmentName?: string;
  apartmentAddress?: string;
  isActive: boolean;
  expirationDays?: number;
  submissionCap?: number;
  currentSubmissions: number;
}

// Mock data - Replace with actual API call
const mockForms: FormData[] = [
  {
    id: '1',
    title: 'Basic KYC Form',
    createdAt: '2024-01-15',
    submissionCount: 25,
    type: 'template',
    isActive: true,
    currentSubmissions: 25
  },
  {
    id: '2',
    title: 'Corporate Client Form',
    createdAt: '2024-01-16',
    submissionCount: 15,
    type: 'customize',
    isActive: false,
    expirationDays: 7,
    currentSubmissions: 15
  },
  {
    id: '3',
    title: 'Property Manager KYC',
    createdAt: '2024-01-17',
    submissionCount: 8,
    type: 'new',
    isActive: true,
    submissionCap: 10,
    currentSubmissions: 8
  }
];

export default function UserForms() {
  const navigate = useNavigate();
  const [selectedForm, setSelectedForm] = useState<FormData | null>(null);
  const [formDetailsOpen, setFormDetailsOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'title' | 'submissionCount'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [formDetails, setFormDetails] = useState({
    apartmentName: '',
    apartmentAddress: '',
    isActive: true,
    expirationDays: undefined as number | undefined,
    submissionCap: undefined as number | undefined
  });
  const [shareMessage, setShareMessage] = useState('');

  // Filter and sort forms
  const filteredAndSortedForms = mockForms
    .filter(form => 
      form.title.toLowerCase().includes(searchText.toLowerCase()) ||
      (form.apartmentName && form.apartmentName.toLowerCase().includes(searchText.toLowerCase())) ||
      (form.apartmentAddress && form.apartmentAddress.toLowerCase().includes(searchText.toLowerCase()))
    )
    .sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1;
      switch (sortBy) {
        case 'title':
          return order * a.title.localeCompare(b.title);
        case 'submissionCount':
          return order * (a.submissionCount - b.submissionCount);
        default:
          return order * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      }
    });

  const handleEditClick = (form: FormData) => {
    setSelectedForm(form);
    setFormDetails({
      apartmentName: form.apartmentName || '',
      apartmentAddress: form.apartmentAddress || '',
      isActive: form.isActive,
      expirationDays: form.expirationDays,
      submissionCap: form.submissionCap
    });
    setFormDetailsOpen(true);
  };

  const handleFormDetailsSave = () => {
    if (selectedForm) {
      // Here you would typically update the form in your backend
      console.log('Saving form details:', { ...selectedForm, ...formDetails });
      setFormDetailsOpen(false);
      // Navigate to form builder with the form ID
      navigate(`/editor/${selectedForm.type}/${selectedForm.id}`);
    }
  };

  const handleShareClick = (form: FormData) => {
    setSelectedForm(form);
    setShareMessage(`Please complete the KYC form for ${form.apartmentName || ''}`);
    setShareDialogOpen(true);
  };

  const handleShare = (method: 'email' | 'sms' | 'copy' | 'social', platform?: 'twitter' | 'facebook' | 'linkedin') => {
    if (!selectedForm?.isActive) {
      console.log('Form is not active');
      return;
    }

    const formUrl = `${window.location.origin}/form/${selectedForm?.id}`;
    const shareText = shareMessage || `Please complete the KYC form for ${selectedForm?.title}`;
    
    switch (method) {
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(`KYC Form - ${selectedForm?.title}`)}&body=${encodeURIComponent(`${shareText}\n\n${formUrl}`)}`;
        break;
      case 'sms':
        window.location.href = `sms:?body=${encodeURIComponent(`${shareText}\n${formUrl}`)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(`${shareText}\n${formUrl}`);
        // TODO: Add a toast notification here
        break;
      case 'social':
        if (platform === 'twitter') {
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(formUrl)}`);
        } else if (platform === 'facebook') {
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(formUrl)}`);
        } else if (platform === 'linkedin') {
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(formUrl)}`);
        }
        break;
    }
  };

  const isFormLinkActive = (form: FormData) => {
    if (!form.isActive) return false;
    if (form.expirationDays) {
      const expirationDate = new Date(form.createdAt);
      expirationDate.setDate(expirationDate.getDate() + form.expirationDays);
      if (new Date() > expirationDate) return false;
    }
    if (form.submissionCap && form.currentSubmissions >= form.submissionCap) return false;
    return true;
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
          My Forms
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search forms..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                background: 'rgba(19, 47, 76, 0.3)',
                backdropFilter: 'blur(10px)',
              }
            }}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <Select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                setSortBy(newSortBy as typeof sortBy);
                setSortOrder(newSortOrder as typeof sortOrder);
              }}
              sx={{
                background: 'rgba(19, 47, 76, 0.3)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <MenuItem value="createdAt-desc">Newest First</MenuItem>
              <MenuItem value="createdAt-asc">Oldest First</MenuItem>
              <MenuItem value="title-asc">Title A-Z</MenuItem>
              <MenuItem value="title-desc">Title Z-A</MenuItem>
              <MenuItem value="submissionCount-desc">Most Submissions</MenuItem>
              <MenuItem value="submissionCount-asc">Least Submissions</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={3}>
          {filteredAndSortedForms.map((form) => (
            <Grid item xs={12} sm={6} md={4} key={form.id}>
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
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {form.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Created on {new Date(form.createdAt).toLocaleDateString()}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mt: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 1,
                      padding: '4px 12px',
                      width: 'fit-content'
                    }}
                    onClick={() => navigate(`/submissions/${form.id}`)}
// Merge with existing sx prop above
                  >
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      {form.submissionCount}
                    </Typography>
                    <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                      Submissions
                    </Typography>
                  </Box>
                  {form.submissionCap && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {form.currentSubmissions}/{form.submissionCap} submissions used
                    </Typography>
                  )}
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      color: isFormLinkActive(form) ? 'success.main' : 'error.main'
                    }}
                  >
                    {isFormLinkActive(form) ? 'Active' : 'Inactive'}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Box>
                    <IconButton
                      size="small"
                      sx={{ mr: 1 }}
                      onClick={() => handleEditClick(form)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{ mr: 1 }}
                      onClick={() => handleShareClick(form)}
                      disabled={!isFormLinkActive(form)}
                    >
                      <ShareIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => console.log('Delete form:', form.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => navigate(`/submissions/${form.id}`)}
                    sx={{
                      background: 'linear-gradient(45deg, #9C27B0 30%, #00BFA5 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #7B1FA2 30%, #00897B 90%)'
                      }
                    }}
                  >
                    View Submissions
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Form Details Modal */}
        <Dialog open={formDetailsOpen} onClose={() => setFormDetailsOpen(false)}>
          <DialogTitle>Form Details</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Apartment Name"
              value={formDetails.apartmentName}
              onChange={(e) => setFormDetails(prev => ({ ...prev, apartmentName: e.target.value }))}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Apartment Address"
              value={formDetails.apartmentAddress}
              onChange={(e) => setFormDetails(prev => ({ ...prev, apartmentAddress: e.target.value }))}
              margin="normal"
              multiline
              rows={3}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formDetails.isActive}
                  onChange={(e) => setFormDetails(prev => ({ ...prev, isActive: e.target.checked }))}
                  color="primary"
                />
              }
              label="Form Active"
              sx={{ mt: 2 }}
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Auto-expiration</InputLabel>
              <Select
                value={formDetails.expirationDays || ''}
                label="Auto-expiration"
                onChange={(e) => setFormDetails(prev => ({ ...prev, expirationDays: e.target.value ? Number(e.target.value) : undefined }))}
              >
                <MenuItem value="">No expiration</MenuItem>
                <MenuItem value={7}>7 days</MenuItem>
                <MenuItem value={14}>14 days</MenuItem>
                <MenuItem value={30}>30 days</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              type="number"
              label="Submission Cap"
              value={formDetails.submissionCap || ''}
              onChange={(e) => setFormDetails(prev => ({ ...prev, submissionCap: e.target.value ? Number(e.target.value) : undefined }))}
              margin="normal"
              helperText="Leave empty for unlimited submissions"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFormDetailsOpen(false)}>Cancel</Button>
            <Button onClick={handleFormDetailsSave} variant="contained" color="primary">
              Save & Continue
            </Button>
            <Button 
              onClick={() => {
                if (selectedForm) {
                  console.log('Saving form details:', { ...selectedForm, ...formDetails });
                  setFormDetailsOpen(false);
                  setShareMessage(`Please complete the KYC form for ${formDetails.apartmentName || selectedForm.title}`);
                  setShareDialogOpen(true);
                }
              }} 
              variant="contained" 
              sx={{
                background: 'linear-gradient(45deg, #9C27B0 30%, #00BFA5 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #7B1FA2 30%, #00897B 90%)'
                }
              }}
            >
              Save & Share
            </Button>
          </DialogActions>
        </Dialog>

        {/* Share Dialog */}
        <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Share Form</DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Form Preview
              </Typography>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  background: 'rgba(19, 47, 76, 0.5)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  mb: 3
                }}
              >
                <Typography variant="h6" gutterBottom>{selectedForm?.title}</Typography>
                {formDetails.apartmentName && (
                  <Typography variant="body1" gutterBottom>
                    <strong>Apartment:</strong> {formDetails.apartmentName}
                  </Typography>
                )}
                {formDetails.apartmentAddress && (
                  <Typography variant="body1" gutterBottom>
                    <strong>Address:</strong> {formDetails.apartmentAddress}
                  </Typography>
                )}
                {selectedForm?.submissionCap && (
                  <Typography variant="body2" color="text.secondary">
                    {selectedForm.currentSubmissions}/{selectedForm.submissionCap} submissions used
                  </Typography>
                )}
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    color: selectedForm && isFormLinkActive(selectedForm) ? 'success.main' : 'error.main'
                  }}
                >
                  {selectedForm && isFormLinkActive(selectedForm) ? 'Link Active' : 'Link Inactive'}
                </Typography>
              </Paper>

              <TextField
                fullWidth
                label="Personalized Message"
                value={shareMessage}
                onChange={(e) => setShareMessage(e.target.value)}
                multiline
                rows={2}
                placeholder="Add a personal message to include when sharing"
                sx={{ mb: 3 }}
              />
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
                Share via
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<ContentCopyIcon />}
                    onClick={() => handleShare('copy')}
                    sx={{
                      background: 'linear-gradient(45deg, #9C27B0 30%, #00BFA5 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #7B1FA2 30%, #00897B 90%)'
                      }
                    }}
                  >
                    Copy Link
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<EmailIcon />}
                    onClick={() => handleShare('email')}
                  >
                    Email
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<SmsIcon />}
                    onClick={() => handleShare('sms')}
                  >
                    SMS
                  </Button>
                </Grid>
              </Grid>

              <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
                Social Media
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <IconButton
                    onClick={() => handleShare('social', 'twitter')}
                    sx={{
                      color: '#1DA1F2',
                      '&:hover': { bgcolor: 'rgba(29, 161, 242, 0.1)' }
                    }}
                  >
                    <TwitterIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={4}>
                  <IconButton
                    onClick={() => handleShare('social', 'facebook')}
                    sx={{
                      color: '#4267B2',
                      '&:hover': { bgcolor: 'rgba(66, 103, 178, 0.1)' }
                    }}
                  >
                    <FacebookIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={4}>
                  <IconButton
                    onClick={() => handleShare('social', 'linkedin')}
                    sx={{
                      color: '#0077B5',
                      '&:hover': { bgcolor: 'rgba(0, 119, 181, 0.1)' }
                    }}
                  >
                    <LinkedInIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShareDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}
