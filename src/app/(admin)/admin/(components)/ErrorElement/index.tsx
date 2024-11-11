import IconButton from "@mui/material/IconButton"
import RefreshIcon from "@mui/icons-material/Refresh"

export default function ErrorElement() {
    return (
        <div>
            <p className="text-center text-red">Sistem hatası! Sayfayı yenilemeyi deneyin.</p>
            <br />
            <p className="text-center">
                <IconButton
                    color="success"
                    aria-label="Refresh page"
                    onClick={() => location.reload()}
                    className="text-center m-4"
                >
                    <RefreshIcon fontSize="large" />
                </IconButton>
            </p>
        </div>
    )
}