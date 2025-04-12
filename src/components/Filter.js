import React, { useEffect, useState } from "react";
import {
  TextField,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { FiSearch, FiX } from "react-icons/fi";

const FilterComponent = ({
  setFilteredTransactions,
  sortedTransactions,
  setHasActiveFilters,
}) => {
  const [filterText, setFilterText] = useState({
    company: "",
    type: "",
    dateFilterType: "equal",
    date: "",
    dateStart: "",
    dateEnd: "",
  });

  useEffect(() => {
    const applyFilters = () => {
      const { company, type, dateFilterType, date, dateStart, dateEnd } =
        filterText;

      // Check if any filters are active
      const filtersActive =
        company !== "" ||
        type !== "" ||
        (dateFilterType === "equal" && date !== "") ||
        (dateFilterType === "range" && (dateStart !== "" || dateEnd !== ""));

      setHasActiveFilters(filtersActive);

      const filtered = sortedTransactions.filter((transaction) => {
        if (!filtersActive) return true;

        const matchesCompany =
          company === "" ||
          transaction.company.toLowerCase().includes(company.toLowerCase());
        const matchesType =
          type === "" || transaction.type.toLowerCase() === type.toLowerCase();
        const matchesDate = applyDateFilter(transaction);

        return matchesCompany && matchesType && matchesDate;
      });

      setFilteredTransactions(filtered);
    };
    applyFilters();
  }, [filterText, sortedTransactions]);

  const parseDate = (dateString) => {
    if (!dateString) return null;
    // Handle both MM/DD/YYYY (transaction dates) and YYYY-MM-DD (input dates)
    const parts = dateString.includes("/")
      ? dateString.split("/") // MM/DD/YYYY format
      : dateString.split("-"); // YYYY-MM-DD format

    if (parts.length === 3) {
      // If format is YYYY-MM-DD (from date inputs)
      if (parts[0].length === 4) {
        return new Date(parts[0], parts[1] - 1, parts[2]);
      }
      // If format is MM/DD/YYYY (from transaction data)
      return new Date(parts[2], parts[0] - 1, parts[1]);
    }
    return null;
  };

  const applyDateFilter = (transaction) => {
    const { dateFilterType, dateStart, dateEnd, date } = filterText;

    const transactionDate = parseDate(transaction.date);
    if (!transactionDate) return false;

    if (dateFilterType === "equal") {
      if (!date) return true;
      const filterDate = parseDate(date);
      return (
        filterDate &&
        transactionDate.toDateString() === filterDate.toDateString()
      );
    }

    if (dateFilterType === "range") {
      const startDate = parseDate(dateStart);
      const endDate = parseDate(dateEnd);

      // If no dates are selected, show all
      if (!startDate && !endDate) return true;

      // Check if transaction is after start date (if specified)
      const afterStart = startDate ? transactionDate >= startDate : true;

      // Check if transaction is before end date (if specified)
      const beforeEnd = endDate
        ? transactionDate <= new Date(endDate.setHours(23, 59, 59, 999))
        : true;

      return afterStart && beforeEnd;
    }

    return true;
  };

  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterText((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilterText({
      company: "",
      type: "",
      dateFilterType: "equal",
      date: "",
      dateStart: "",
      dateEnd: "",
    });
  };

  return (
    <Box className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Company Search */}
        <TextField
          label="Search Company"
          variant="outlined"
          size="small"
          fullWidth
          value={filterText.company}
          onChange={(e) =>
            setFilterText({ ...filterText, company: e.target.value })
          }
          slotProps={{
            root: { className: "w-full" },
            input: {
              className: "py-2 px-2",
              startAdornment: (
                <InputAdornment position="start">
                  <FiSearch className="text-gray-400" />
                </InputAdornment>
              ),
              endAdornment: filterText.company && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() =>
                      setFilterText({ ...filterText, company: "" })
                    }
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX size={16} />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        {/* Type Filter */}
        <FormControl fullWidth size="small">
          <InputLabel>Transaction Type</InputLabel>
          <Select
            label="Transaction Type"
            value={filterText.type}
            onChange={(e) =>
              setFilterText({ ...filterText, type: e.target.value })
            }
            slotProps={{
              root: { className: "w-full" },
            }}
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="Invoice">Invoice</MenuItem>
            <MenuItem value="Payment">Payment</MenuItem>
          </Select>
        </FormControl>

        {/* Date Filter Type */}
        <FormControl fullWidth size="small">
          <InputLabel>Date Filter</InputLabel>
          <Select
            label="Date Filter"
            value={filterText.dateFilterType}
            onChange={(e) =>
              setFilterText({ ...filterText, dateFilterType: e.target.value })
            }
            slotProps={{
              root: { className: "w-full" },
            }}
          >
            <MenuItem value="equal">Specific Date</MenuItem>
            <MenuItem value="range">Date Range</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Date Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {filterText.dateFilterType === "equal" ? (
          <TextField
            label="Select Date"
            type="date"
            size="small"
            fullWidth
            value={filterText.date}
            onChange={handleDateFilterChange}
            name="date"
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                className: "py-2",
                endAdornment: filterText.date && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setFilterText({ ...filterText, date: "" })}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FiX size={16} />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        ) : (
          <>
            <TextField
              label="Start Date"
              type="date"
              size="small"
              fullWidth
              value={filterText.dateStart}
              onChange={handleDateFilterChange}
              name="dateStart"
              slotProps={{
                inputLabel: { shrink: true },
                input: { className: "py-2" },
              }}
            />
            <TextField
              label="End Date"
              type="date"
              size="small"
              fullWidth
              value={filterText.dateEnd}
              onChange={handleDateFilterChange}
              name="dateEnd"
              slotProps={{
                inputLabel: { shrink: true },
                input: { className: "py-2" },
              }}
            />
          </>
        )}
      </div>

      {/* Clear All Button */}
      {(filterText.company ||
        filterText.type ||
        filterText.date ||
        filterText.dateStart ||
        filterText.dateEnd) && (
        <div className="flex justify-end mt-2">
          <button
            onClick={clearFilters}
            className="text-sm text-primary-600 hover:text-primary-800 font-medium flex items-center"
          >
            <FiX size={14} className="mr-1" />
            Clear all filters
          </button>
        </div>
      )}
    </Box>
  );
};

export default FilterComponent;
