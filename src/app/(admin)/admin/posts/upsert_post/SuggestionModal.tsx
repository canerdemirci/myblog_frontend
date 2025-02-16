import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import clsx from "clsx"

interface Props {
    open: boolean
    title: string
    suggestions: string[]
    onClose: () => void
    onSelect: (suggestion: string) => void
}

/** A Mui Dialog based component */
export default function SuggestionModal({ open, title, suggestions, onClose, onSelect } : Props) {
    return (
        <Dialog
            open={open}
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" sx={{whiteSpace: 'pre-line'}}>
                    {suggestions.map((s, i) => (
                        <div
                            key={i}
                            className={clsx([
                                "p-4", "my-2", "cursor-pointer", "border", "border-gray-300",
                                "hover:bg-gray-200", "w-full", "h-full"
                            ])}
                            onClick={() => {
                                onSelect(s)
                            }}
                        >
                            {s}
                        </div>
                    ))}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Kapat</Button>
            </DialogActions>
        </Dialog>
    )
}