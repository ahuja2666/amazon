import React, { useState, useEffect } from "react";
import Header from "./Header.jsx";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Button, Grid2 } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
export default function Inventory() {
  // Load rows from localStorage or set default if empty
  const savedRows = JSON.parse(localStorage.getItem("rows")) || [];
  const [rows, setRows] = useState(savedRows);

  const columns = [
    { field: "id", headerName: "Sr No", width: 80 },
    { field: "item", headerName: "Item", width: 200, editable: true },
    {
      field: "purchaseFrom",
      headerName: "Purchase From",
      width: 150,
      editable: true,
    },
    { field: "quantity", headerName: "Quantity", width: 80, editable: true },
    {
      field: "amount",
      headerName: "Amount in USD",
      width: 150,
      editable: true,
    },
    {
      field: "amountPerUnit",
      headerName: "Amount PER UNIT",
      width: 150,
      valueGetter: (value, row) =>
        row?.amount && row?.quantity
          ? (row.amount / row.quantity).toFixed(2)
          : "",
    },
    { field: "paidWith", headerName: "PAID WITH", width: 150, editable: true },
    { field: "ASIN", headerName: "ASIN", width: 200, editable: true },
    {
      field: "DeleteRow",
      headerName: "Delete Row",
      width: 100,
      renderCell: (params) => (
        <Button
          endIcon={<DeleteIcon color="error" />}
          onClick={() => handleDeleteRow(params.row.id)}
        ></Button>
      ),
    },
  ];

  const handleDeleteRow = (id) => {
    // Filter out the row with the given id
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);
    localStorage.setItem("rows", JSON.stringify(updatedRows)); // Update localStorage
  };

  const handleAddRow = () => {
    const nextSrNo = rows.length ? rows[rows.length - 1].id + 1 : 1; // Increment SR No
    const newRow = {
      id: nextSrNo,
      item: "",
      purchaseFrom: "",
      quantity: "",
      amount: "",
      amountPerUnit: "",
      paidWith: "",
      ASIN: "",
    };
    const updatedRows = [...rows, newRow];
    setRows(updatedRows);
    localStorage.setItem("rows", JSON.stringify(updatedRows)); // Save updated rows to localStorage
  };

  // Handle cell edits
  const handleCellEditCommit = (params) => {
    const updatedRows = rows.map((row) => (row.id == params.id ? params : row));
    console.log(updatedRows, "updatedRows");
    setRows(updatedRows);
    localStorage.setItem("rows", JSON.stringify(updatedRows)); // Save updated rows to localStorage
  };

  return (
    <div>
      <div>
        <Header />
      </div>
      <div style={{ padding: "5px" }}>
        <Grid2 container justifyContent="flex-end" alignItems="flex-end">
          <Grid2 item xs={2}>
            <Button variant="contained" color="primary" onClick={handleAddRow}>
              Add Row
            </Button>
          </Grid2>
        </Grid2>
      </div>
      <div
        style={{
          height: "calc(100vh - 130px)",
          width: "100%",
          padding: "10px",
        }}
      >
        <DataGrid
          getRowId={(row) => row.id}
          rows={rows}
          columns={columns}
          processRowUpdate={handleCellEditCommit}
          slots={{ toolbar: GridToolbar }}
        />
      </div>
    </div>
  );
}