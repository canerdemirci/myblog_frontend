import IconButton from "@mui/material/IconButton"
import RefreshIcon from "@mui/icons-material/Refresh"
import { clsx } from "clsx"

/**
 * Informs the user when an error occurs and user can refresh page.
 */
export default function ErrorElement() {
    return (
        <div>
            <p className={clsx(["text-center", "text-red"])}>
                Sistem hatası! Sayfayı yenilemeyi deneyin.
            </p>
            <div className={clsx(["text-center", "mt-4"])}>
                <IconButton
                    color="success"
                    aria-label="Refresh page"
                    onClick={() => location.reload()}
                    className={clsx(["text-center", "m-4"])}
                >
                    <RefreshIcon fontSize="large" />
                </IconButton>
            </div>
        </div>
    )
}