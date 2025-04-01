import React, { useEffect, useState } from "react";
import {
  TextField,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
} from "@mui/material";
import FilterComponent from "./Filter";

const AllTransactionsTable = ({
  allTransactionsForEachStore,
  storeSelected,
}) => {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("date");
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [sortedTransactions, setSortedTransactions] = useState([]);

  useEffect(() => {
    // Find the selected store's transactions
    const storeData = allTransactionsForEachStore.find(
      (store) => store.store === storeSelected
    );
    const transactions = storeData ? storeData.transactions : [];

    // Add an id to each transaction
    const transactionsWithId = transactions.map((transaction, index) => ({
      ...transaction,
      id: `${storeSelected}-${index}`,
    }));

    // Sort transactions based on order and orderBy
    const sorted = [...transactionsWithId].sort((a, b) => {
      if (orderBy === "company") {
        return order === "asc"
          ? a.company.localeCompare(b.company)
          : b.company.localeCompare(a.company);
      }
      if (orderBy === "amount") {
        return order === "asc" ? a.amount - b.amount : b.amount - a.amount;
      }
      if (orderBy === "date") {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return order === "asc" ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });
    setSortedTransactions(sorted);
  }, [storeSelected, order, orderBy]);

  useEffect(() => {
    setFilteredTransactions(sortedTransactions); // Set filtered transactions
  }, [sortedTransactions]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Transactions</h3>
      <ul className="space-y-4">
        <FilterComponent
          setFilteredTransactions={setFilteredTransactions}
          sortedTransactions={sortedTransactions}
        />

        {/* Table Layout for Larger Screens */}
        <TableContainer
          sx={{ maxHeight: 400, display: { xs: "none", sm: "block" } }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "company"}
                    direction={orderBy === "company" ? order : "asc"}
                    onClick={() => handleRequestSort("company")}
                  >
                    Company
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "amount"}
                    direction={orderBy === "amount" ? order : "asc"}
                    onClick={() => handleRequestSort("amount")}
                  >
                    Amount
                  </TableSortLabel>
                </TableCell>
                <TableCell>Type</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "date"}
                    direction={orderBy === "date" ? order : "asc"}
                    onClick={() => handleRequestSort("date")}
                  >
                    Date
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions
                .slice(page * 5, page * 5 + 5)
                .map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.company}</TableCell>
                    <TableCell>${transaction.amount}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Mobile Stacked Layout */}
        <Box sx={{ display: { xs: "block", sm: "none" } }}>
          {filteredTransactions
            .slice(page * 5, page * 5 + 5)
            .map((transaction) => (
              <Box
                key={transaction.id}
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: 2,
                  padding: 2,
                  marginBottom: 2,
                  boxShadow: 2,
                }}
              >
                <Box sx={{ fontWeight: "bold" }}>
                  Company: {transaction.company}
                </Box>
                <Box>Amount: ${transaction.amount}</Box>
                <Box>Type: {transaction.type}</Box>
                <Box>Date: {transaction.date}</Box>
              </Box>
            ))}
        </Box>

        <TablePagination
          component="div"
          rowsPerPageOptions={[5]}
          count={filteredTransactions.length}
          rowsPerPage={5}
          page={page}
          onPageChange={handleChangePage}
        />
      </ul>
    </div>
  );
};

export default AllTransactionsTable;
