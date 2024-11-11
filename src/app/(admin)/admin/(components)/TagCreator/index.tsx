import InputAdornment from "@mui/material/InputAdornment"
import TextField from "@mui/material/TextField"
import TagIcon from "@mui/icons-material/Tag"
import { ChangeEvent } from "react"

interface Props {
    value: string
    error: 'validation' | 'server' | null
    disabled: boolean
    onSubmit: () => void
    onChange?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export default function TagCreator({ value, error, disabled, onSubmit, onChange }: Props) {
    let errorDescription = ''

    if (error === 'server') {
        errorDescription = 'Etiket oluşturulamadı. Sistem Hatası!'
    } else if (error === 'validation') {
        errorDescription = 'Etiket adı boş bırakılamaz'
    }
    
    return (
        <TextField
            value={value}
            helperText={`Yeni Etiket Oluştur - ENTER tuşla. ${errorDescription}`}
            slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment position="start">
                            <TagIcon />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="start">
                            <span>Enter</span>
                        </InputAdornment>
                    ),
                },
            }}
            label="Etiket adı girin"
            variant="outlined"
            onKeyUp={(e) => {
                if (e.key === 'Enter') {
                    onSubmit()
                }
            }}
            onChange={onChange}
            error={error !== null}
            disabled={disabled}
            required
        />
    )
}