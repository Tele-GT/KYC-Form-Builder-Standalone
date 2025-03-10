import { Box, Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, IconButton, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Share as ShareIcon, Sort as SortIcon, Archive as ArchiveIcon } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

interface SubmissionData {
  id: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  data: Record<string, any>;
  recommendation?: {
    note: string;
    recommendedAt: string;
  };
  landlordPhone?: string;
  landlordEmail?: string;
}

// Mock data - Replace with actual API call
const mockSubmissions: SubmissionData[] = [
  {
    id: '1',
    submittedAt: '2024-01-20T10:30:00Z',
    status: 'approved',
    data: {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890'
    }
  },
  {
    id: '2',
    submittedAt: '2024-01-19T15:45:00Z',
    status: 'pending',
    data: {
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+0987654321'
    }
  }
];

type SortField = 'date' | 'name' | 'status';
type DateFilter = 'all' | '7days' | '30days' | '90days';

export default function Submissions() {
  const { formId } = useParams<{ formId: string }>();
  const [submissions] = useState<SubmissionData[]>(mockSubmissions);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionData | null>(null);
  const [recommendationOpen, setRecommendationOpen] = useState(false);
  const [recommendationNote, setRecommendationNote] = useState('');
  const [shareReportOpen, setShareReportOpen] = useState(false);
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);

  // New state for filtering and sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isArchiveView, setIsArchiveView] = useState(false);
  const [archivedSubmissions, setArchivedSubmissions] = useState<SubmissionData[]>([]);

  const filterByDate = (submission: SubmissionData) => {
    if (dateFilter === 'all') return true;
    
    const submissionDate = new Date(submission.submittedAt);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - submissionDate.getTime()) / (1000 * 60 * 60 * 24));
    
    switch (dateFilter) {
      case '7days':
        return daysDiff <= 7;
      case '30days':
        return daysDiff <= 30;
      case '90days':
        return daysDiff <= 90;
      default:
        return true;
    }
  };

  const filterBySearch = (submission: SubmissionData) => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    const fullName = submission.data.fullName?.toLowerCase() || '';
    const address = submission.data.address?.toLowerCase() || '';
    
    return fullName.includes(searchLower) || address.includes(searchLower);
  };

  const sortSubmissions = (a: SubmissionData, b: SubmissionData) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortField) {
      case 'date':
        return direction * (new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
      case 'name':
        return direction * ((a.data.fullName || '').localeCompare(b.data.fullName || ''));
      case 'status':
        return direction * (a.status.localeCompare(b.status));
      default:
        return 0;
    }
  };

  const handleArchive = () => {
    const toArchive = submissions.filter(submission => selectedSubmissions.includes(submission.id));
    setArchivedSubmissions([...archivedSubmissions, ...toArchive]);
    {/*setSubmissions(submissions.filter(submission => !selectedSubmissions.includes(submission.id)));*/}
    setSelectedSubmissions([]);
  };

  const filteredSubmissions = (isArchiveView ? archivedSubmissions : submissions)
    .filter(filterByDate)
    .filter(filterBySearch)
    .sort(sortSubmissions);

  const handleRecommend = (submission: SubmissionData) => {
    setSelectedSubmission(submission);
    setRecommendationNote(submission.recommendation?.note || '');
    setRecommendationOpen(true);
  };

  const handleSaveRecommendation = () => {
    if (selectedSubmission) {
      // Here you would typically update the submission in your backend
      console.log('Saving recommendation:', {
        submissionId: selectedSubmission.id,
        note: recommendationNote,
        recommendedAt: new Date().toISOString()
      });
    }
    setRecommendationOpen(false);
  };

  const handleShareReport = () => {
    setShareReportOpen(true);
  };

  const handleSendReport = () => {
    const reportData = submissions
      .filter(submission => selectedSubmissions.includes(submission.id))
      .map(submission => ({
        ...submission,
        data: {
          ...submission.data,
          recommendation: submission.recommendation
        }
      }));

    if (reportData.length === 0) return;

    // Export as CSV
    const csvContent = generateCSV(reportData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `submissions_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    // Share options
    const shareText = `KYC Submissions Report\n\nTotal Submissions: ${reportData.length}\nDate: ${new Date().toLocaleDateString()}`;
    
    // WhatsApp sharing
    if (reportData[0].landlordPhone) {
      const whatsappUrl = `https://wa.me/${reportData[0].landlordPhone.replace(/\D/g, '')}?text=${encodeURIComponent(shareText)}`;
      window.open(whatsappUrl, '_blank');
    }

    // Email sharing
    if (reportData[0].landlordEmail) {
      const emailSubject = 'KYC Submissions Report';
      const emailBody = `${shareText}\n\nPlease find the attached CSV report.`;
      window.location.href = `mailto:${reportData[0].landlordEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    }

    // Native Web Share API
    if (navigator.share) {
      navigator.share({
        title: 'KYC Submissions Report',
        text: shareText,
        files: [new File([blob], link.download, { type: 'text/csv' })]
      }).catch(console.error);
    }

    setShareReportOpen(false);
  };

  const generateCSV = (data: SubmissionData[]) => {
    const headers = ['Submission ID', 'Date', 'Status', 'Full Name', 'Email', 'Phone', 'Recommendation', 'Recommendation Date'];
    const rows = data.map(submission => [
      submission.id,
      new Date(submission.submittedAt).toLocaleString(),
      submission.status,
      submission.data.fullName || '',
      submission.data.email || '',
      submission.data.phone || '',
      submission.recommendation?.note || '',
      submission.recommendation ? new Date(submission.recommendation.recommendedAt).toLocaleString() : ''
    ]);

    return [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    ].join('\n');
  };

  const getStatusColor = (status: SubmissionData['status']) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'warning';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              background: 'linear-gradient(45deg, #9C27B0 30%, #00BFA5 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}
          >
            Form Submissions
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<ArchiveIcon />}
              onClick={handleArchive}
              disabled={selectedSubmissions.length === 0 || isArchiveView}
            >
              Archive
            </Button>
            <Button
              variant="contained"
              startIcon={<ShareIcon />}
              onClick={handleShareReport}
              disabled={selectedSubmissions.length === 0}
              sx={{
                background: 'linear-gradient(45deg, #9C27B0 30%, #00BFA5 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #7B1FA2 30%, #00897B 90%)'
                }
              }}
            >
              Share Report
            </Button>
          </Box>
        </Box>

        <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search by name or address"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{ flexGrow: 1 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Date Range</InputLabel>
            <Select
              value={dateFilter}
              label="Date Range"
              onChange={(e) => setDateFilter(e.target.value as DateFilter)}
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="7days">Last 7 Days</MenuItem>
              <MenuItem value="30days">Last 30 Days</MenuItem>
              <MenuItem value="90days">Last 90 Days</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortField}
              label="Sort By"
              onChange={(e) => setSortField(e.target.value as SortField)}
            >
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="status">Status</MenuItem>
            </Select>
          </FormControl>
          <IconButton
            onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
            sx={{
              transform: `rotate(${sortDirection === 'asc' ? 0 : 180}deg)`,
              transition: 'transform 0.2s'
            }}
          >
            <SortIcon />
          </IconButton>
        </Box>

        <Paper
          sx={{
            background: 'rgba(19, 47, 76, 0.5)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Chip label="Select" size="small" />
                  </TableCell>
                  <TableCell>Submission ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Submitted Data</TableCell>
                  <TableCell>Recommendation</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell padding="checkbox">
                      <Chip
                        label={selectedSubmissions.includes(submission.id) ? "Selected" : "Select"}
                        onClick={() => {
                          setSelectedSubmissions(prev =>
                            prev.includes(submission.id)
                              ? prev.filter(id => id !== submission.id)
                              : [...prev, submission.id]
                          );
                        }}
                        color={selectedSubmissions.includes(submission.id) ? "primary" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{submission.id}</TableCell>
                    <TableCell>
                      {new Date(submission.submittedAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                        color={getStatusColor(submission.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box component="pre" sx={{ m: 0, whiteSpace: 'pre-wrap' }}>
                        {JSON.stringify(submission.data, null, 2)}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {submission.recommendation ? (
                        <Box>
                          <Typography variant="body2">{submission.recommendation.note}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(submission.recommendation.recommendedAt).toLocaleString()}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">No recommendation</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleRecommend(submission)}
                        sx={{ mr: 1 }}
                      >
                        {submission.recommendation ? 'Edit Recommendation' : 'Recommend'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Dialog open={recommendationOpen} onClose={() => setRecommendationOpen(false)}>
          <DialogTitle>Add Recommendation</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Recommendation Note"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={recommendationNote}
              onChange={(e) => setRecommendationNote(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRecommendationOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveRecommendation} variant="contained">
              Save Recommendation
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={shareReportOpen} onClose={() => setShareReportOpen(false)}>
          <DialogTitle>Share Prospects Report</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Selected {selectedSubmissions.length} submission(s) to share
            </Typography>
            <TextField
              label="Recipient Email"
              type="email"
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Message"
              multiline
              rows={4}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShareReportOpen(false)}>Cancel</Button>
            <Button onClick={handleSendReport} variant="contained">
              Share
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}