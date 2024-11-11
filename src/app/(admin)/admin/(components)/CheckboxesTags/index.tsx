import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
const checkedIcon = <CheckBoxIcon fontSize="small" />

const filter = createFilterOptions<string>()

interface Props {
  tagOptions: string[]
  onChange: (value: string[]) => void
  defaultValue?: any[]
  disabled?: boolean
}

export default function CheckboxesTags({ tagOptions, onChange, defaultValue, disabled } : Props) {
  return (
    <Autocomplete
      id="checkboxes-tags-demo"
      fullWidth={true}
      freeSolo
      multiple
      disabled={disabled}
      defaultValue={defaultValue}
      options={tagOptions}
      disableCloseOnSelect
      onChange={(_, value) => onChange(value)}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option);
        if (inputValue !== '' && !isExisting) {
          filtered.push(inputValue)
        }

        return filtered
      }}
      getOptionLabel={(option) => option}
      renderOption={(props, option, { selected }) => {
        const { key, ...optionProps } = props
        return (
          <li key={key} {...optionProps}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option}
          </li>
        )
      }}
      renderInput={(params) => (
        <TextField {...params} label="Etiketler" placeholder="Seç/Ekle" />
      )}
    />
  )
}
