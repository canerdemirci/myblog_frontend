import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"

interface Props {
    open: boolean
    title: string
    contentText: string
    onDecision: (decision: boolean) => void
    onClose: () => void
}

/**
 * Mui Dialog based component. There are yes and no buttons.
 */
export default function ConfirmationDialog({
    open, title, contentText, onDecision, onClose } : Props) {
        
    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">{contentText}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onDecision(true)}>Evet</Button>
                <Button onClick={() => onDecision(false)} autoFocus>Hayır</Button>
            </DialogActions>
        </Dialog>
    )
}