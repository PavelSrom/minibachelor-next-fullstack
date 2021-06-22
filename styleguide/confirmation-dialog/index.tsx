import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogProps,
} from '@material-ui/core'
import { Button } from '../button'

type Props = Omit<DialogProps, 'open' | 'onClose'> & {
  open: boolean
  onClose: () => void
  onConfirm: () => void | Promise<unknown>
  loading?: boolean
  title?: string
  description?: string
  confirmText?: string
}

export const ConfirmationDialog: React.FC<Props> = ({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action is irreversible!',
  loading = false,
  confirmText = 'Confirm',
  ...rest
}) => {
  return (
    <Dialog {...rest} open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle className="pb-0">{title}</DialogTitle>
      <DialogContent>
        <p>{description}</p>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          loading={loading}
          variant="contained"
          color="secondary"
          onClick={onConfirm}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
