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
    onClose: () => void
}

/** A Mui Dialog based component */
export default function AlertModal({ open, title, contentText, onClose } : Props) {
    return (
        <Dialog
            open={open}
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" sx={{whiteSpace: 'pre-line'}}>
                    {contentText}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Kapat</Button>
            </DialogActions>
        </Dialog>
    )
}