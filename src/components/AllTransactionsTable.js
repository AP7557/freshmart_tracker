import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import FilterComponent from "./Filter";

const AllTransactionsTable = ({
  allTransactionsForEachStore,
  storeSelected,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("date");
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [sortedTransactions, setSortedTransactions] = useState([]);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  // Get the base transactions for the selected store
  const getBaseTransactions = () => {
    const storeData = allTransactionsForEachStore.find(
      (store) => store.store === storeSelected
    );
    return storeData
      ? storeData.transactions.map((t, i) => ({
          ...t,
          id: `${storeSelected}-${i}`,
        }))
      : [];
  };

  // Sort transactions based on current order/orderBy
  const sortTransactions = (transactions) => {
    return [...transactions].sort((a, b) => {
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
  };

  // Update transactions when store, filters, or sort changes
  useEffect(() => {
    const baseTransactions = getBaseTransactions();
    const transactionsToSort = hasActiveFilters
      ? filteredTransactions
      : baseTransactions;
    const sorted = sortTransactions(transactionsToSort);
    setSortedTransactions(sorted);

    // If no filters are active, update filteredTransactions to match sorted
    if (!hasActiveFilters) {
      setFilteredTransactions(sorted);
    }
  }, [storeSelected, order, orderBy, hasActiveFilters]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800">
          Transaction History
        </h3>
      </div>

      <div className="p-4">
        <FilterComponent
          setFilteredTransactions={setFilteredTransactions}
          sortedTransactions={sortedTransactions}
          setHasActiveFilters={setHasActiveFilters}
        />
      </div>

      {/* Desktop Table View */}
      {!isMobile && (
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow className="bg-gray-50">
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "company"}
                    direction={orderBy === "company" ? order : "asc"}
                    onClick={() => handleRequestSort("company")}
                  >
                    <span className="font-semibold">Company</span>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "amount"}
                    direction={orderBy === "amount" ? order : "asc"}
                    onClick={() => handleRequestSort("amount")}
                  >
                    <span className="font-semibold">Amount</span>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <span className="font-semibold">Type</span>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "date"}
                    direction={orderBy === "date" ? order : "asc"}
                    onClick={() => handleRequestSort("date")}
                  >
                    <span className="font-semibold">Date</span>
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions
                .slice(page * 5, page * 5 + 5)
                .map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    hover
                    className="hover:bg-gray-50"
                  >
                    <TableCell>{transaction.company}</TableCell>
                    <TableCell>
                      $
                      {transaction.amount
                        .toFixed(2)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.type === "Invoice"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(transaction.date).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Mobile Card View */}
      {isMobile && (
        <div className="space-y-3 p-4">
          {filteredTransactions
            .slice(page * 5, page * 5 + 5)
            .map((transaction) => (
              <div
                key={transaction.id}
                className="border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-gray-800">
                    {transaction.company}
                  </span>
                  <span className="font-bold">
                    ${transaction.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.type === "Invoice"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {transaction.type}
                  </span>
                  <span>{new Date(transaction.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
        </div>
      )}

      <TablePagination
        rowsPerPageOptions={[5]}
        component="div"
        count={filteredTransactions.length}
        rowsPerPage={5}
        page={page}
        onPageChange={handleChangePage}
        className="border-t border-gray-200"
      />
    </div>
  );
};

export default AllTransactionsTable;
