import StorageIcon from "@mui/icons-material/Storage"
import { clsx } from 'clsx'

export default function NoData() {
    return (
        <div
            className={clsx([
                "flex", "flex-col", "items-center", "justify-center", "gap-4", "h-72"
            ])}
        >
            <StorageIcon sx={{ fontSize: 56 }} color="error" />
            <p className={clsx("text-xl")}>
                Sistemde hiç veri yok.
            </p>
        </div>
    )
}