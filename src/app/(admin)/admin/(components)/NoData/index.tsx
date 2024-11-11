import StorageIcon from "@mui/icons-material/Storage"

export default function NoData() {
    return (
        <div className="flex flex-col items-center justify-center gap-4 h-72">
            <StorageIcon sx={{ fontSize: 56 }} color="error" />
            <p className="text-xl">Sistemde hiç veri yok.</p>
        </div>
    )
}