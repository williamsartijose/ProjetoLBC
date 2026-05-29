import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';

interface ConfirmDeleteDialogProps {
  open: boolean;
  employeeName: string | undefined;
  submitting: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteDialog({
  open,
  employeeName,
  submitting,
  errorMessage,
  onClose,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Remover Colaborador</DialogTitle>
      <DialogContent>
        {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
        <DialogContentText>
          Tem a certeza de que pretende remover <strong>{employeeName}</strong>? Esta ação não
          pode ser revertida.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={submitting}>
          Cancelar
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error" disabled={submitting}>
          Remover
        </Button>
      </DialogActions>
    </Dialog>
  );
}
