import InputAdornment from "@mui/material/InputAdornment"
import TextField from "@mui/material/TextField"
import TagIcon from "@mui/icons-material/Tag"
import { ChangeEvent } from "react"

interface Props {
    value: string
    serverError: boolean
    validationError: string
    disabled: boolean
    onSubmit: () => void
    onChange?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

/**
 * Component for creating new tags
 */
export default function TagCreator({
    value, serverError, validationError, disabled, onSubmit, onChange }: Props)
{
    let errorDescription = ''

    if (serverError) {
        errorDescription = 'Etiket oluşturulamadı. Sistem Hatası!'
    } else if (validationError) {
        errorDescription = validationError
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
            error={validationError !== '' || serverError}
            disabled={disabled}
            required
        />
    )
}