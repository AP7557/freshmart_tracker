import React, { useEffect, useState } from "react";
import {
  TextField,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

const FilterComponent = ({ setFilteredTransactions, sortedTransactions }) => {
  const [filterText, setFilterText] = useState({
    company: "",
    type: "",
    dateFilterType: "equal", // or "range"
    date: "",
    dateStart: "",
    dateEnd: "",
  });

  useEffect(() => {
    // Apply filtering logic when any filter text or sorted transactions change
    const applyFilters = () => {
      const { company, type } = filterText;
      const filtered = sortedTransactions.filter((transaction) => {
        const matchesCompany = transaction.company
          .toLowerCase()
          .includes(company.toLowerCase());
        const matchesType = transaction.type
          .toLowerCase()
          .includes(type.toLowerCase());

        // Filter by date logic
        const matchesDate = applyDateFilter(transaction);

        return matchesCompany && matchesType && matchesDate;
      });

      setFilteredTransactions(filtered); // Set the filtered transactions here
    };

    applyFilters();
  }, [filterText, sortedTransactions]);

  const getDateInLocaleString = (dateToChange) =>
    new Date(dateToChange).toLocaleDateString("en-US", { timeZone: "UTC" });

  // Function to apply date filters
  const applyDateFilter = (transaction) => {
    const { dateFilterType, dateStart, dateEnd, date } = filterText;

    if (dateFilterType === "equal" && date) {
      return transaction.date === getDateInLocaleString(date);
    }

    if (dateFilterType === "range") {
      if (dateStart && !dateEnd) {
        return transaction.date >= getDateInLocaleString(dateStart);
      }
      if (!dateStart && dateEnd) {
        return transaction.date <= getDateInLocaleString(dateEnd);
      }
      if (dateStart && dateEnd) {
        const transactionDate = transaction.date;
        return (
          transactionDate >= getDateInLocaleString(dateStart) &&
          transactionDate <= getDateInLocaleString(dateEnd)
        );
      }
    }

    return true;
  };

  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterText((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        paddingBottom: "2rem",
      }}
    >
      {/* Date Filter Type */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <FormControl fullWidth size="small">
          <InputLabel>Date Filter Type</InputLabel>
          <Select
            value={filterText.dateFilterType}
            onChange={(e) =>
              setFilterText({ ...filterText, dateFilterType: e.target.value })
            }
          >
            <MenuItem value="equal">Equal to</MenuItem>
            <MenuItem value="range">Range</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Filter Inputs */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          label="Company"
          variant="outlined"
          size="small"
          value={filterText.company}
          onChange={(e) =>
            setFilterText({ ...filterText, company: e.target.value })
          }
        />
        <TextField
          label="Type"
          variant="outlined"
          size="small"
          value={filterText.type}
          onChange={(e) =>
            setFilterText({ ...filterText, type: e.target.value })
          }
        />
      </Box>

      {/* Date Filters */}
      {filterText.dateFilterType === "equal" && (
        <TextField
          label="Date (m/d/yyyy)"
          variant="outlined"
          size="small"
          value={filterText.date}
          onChange={handleDateFilterChange}
          fullWidth
          name="date"
          type="date"
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />
      )}

      {filterText.dateFilterType === "range" && (
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Start Date"
            variant="outlined"
            size="small"
            value={filterText.dateStart}
            onChange={handleDateFilterChange}
            fullWidth
            name="dateStart"
            type="date"
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />
          <TextField
            label="End Date"
            variant="outlined"
            size="small"
            value={filterText.dateEnd}
            onChange={handleDateFilterChange}
            fullWidth
            name="dateEnd"
            type="date"
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default FilterComponent;
