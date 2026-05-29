import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

interface RejectDialogProps {
  open: boolean;
  submitting: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onConfirm: (rejectionReason: string) => void;
}

export default function RejectDialog({
  open,
  submitting,
  errorMessage,
  onClose,
  onConfirm,
}: RejectDialogProps) {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (open) {
      setReason('');
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Rejeitar Pedido</DialogTitle>
      <DialogContent>
        {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
        <TextField
          label="Motivo da Rejeição"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          fullWidth
          required
          multiline
          minRows={3}
          autoFocus
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={submitting}>
          Cancelar
        </Button>
        <Button
          onClick={() => onConfirm(reason.trim())}
          variant="contained"
          color="error"
          disabled={submitting || reason.trim().length === 0}
        >
          Rejeitar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
