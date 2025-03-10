import { Box, Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, IconButton } from '@mui/material';
import { Share as ShareIcon } from '@mui/icons-material';
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

export default function Submissions() {
  const { formId } = useParams<{ formId: string }>();
  const [submissions] = useState<SubmissionData[]>(mockSubmissions);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionData | null>(null);
  const [recommendationOpen, setRecommendationOpen] = useState(false);
  const [recommendationNote, setRecommendationNote] = useState('');
  const [shareReportOpen, setShareReportOpen] = useState(false);
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);

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
    
    // Here you would typically generate and send the report
    console.log('Sending report:', reportData);
    setShareReportOpen(false);
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
                {submissions.map((submission) => (
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
              Send Report
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}