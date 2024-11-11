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

export default function ConfirmationDialog({
    open, title, contentText, onDecision, onClose } : Props) {
        
    function handleDecision(decision: boolean) {
        onDecision(decision)
    }
        
    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {contentText}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleDecision(true)}>Evet</Button>
                <Button onClick={() => handleDecision(false)} autoFocus>Hayır</Button>
            </DialogActions>
        </Dialog>
    )
}