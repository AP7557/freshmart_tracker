import { Box, FormControl, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

export const SingleDate = ({ item, applyValue }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Box sx={{ display: 'flex' }}>
        <DatePicker
          label='Date'
          value={item.value || null}
          onChange={(value) => {
            applyValue({
              ...item,
              value,
            });
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};

export const InBetweenDates = ({ item, applyValue }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
        <FormControl>
          <DatePicker
            label='Start Date'
            value={item.value?.[0] ?? null}
            onChange={(value) => {
              applyValue({
                ...item,
                value: [value, item.value?.[1]],
              });
            }}
          />
        </FormControl>
        <FormControl>
          <DatePicker
            label='End Date'
            value={item.value?.[1] ?? null}
            onChange={(value) => {
              applyValue({
                ...item,
                value: [item.value?.[0], value],
              });
            }}
          />
        </FormControl>
      </Box>
    </LocalizationProvider>
  );
};

export const SingleAmount = ({ item, applyValue }) => (
  <TextField
    type='number'
    label='Value'
    value={item.value || ''}
    onChange={(e) => {
      applyValue({ ...item, value: e.target.value });
    }}
    slotProps={{
      inputLabel: {
        shrink: true,
      },
    }}
  />
);

export const InBetweenAmounts = ({ item, applyValue }) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
      <TextField
        label='Min'
        type='number'
        value={item.value?.[0] || ''}
        onChange={(e) => {
          applyValue({
            ...item,
            value: [e.target.value, item.value?.[1]],
          });
        }}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
      />
      <TextField
        label='Max'
        type='number'
        value={item.value?.[1] || ''}
        onChange={(e) => {
          applyValue({
            ...item,
            value: [item.value?.[0], e.target.value],
          });
        }}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
      />
    </Box>
  );
};
