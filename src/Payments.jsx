import React, { useState, useEffect } from "react";
import Header from "./Header.jsx";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Button, Grid2 } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
export default function Payments() {
  // Load rows from localStorage or set default if empty
  const savedRows = JSON.parse(localStorage.getItem("payments")) || [];
  const [rows, setRows] = useState(savedRows);

  const columns = [
    { field: "id", headerName: "Sr No", width: 80 },
    { field: "date", headerName: "Date", width: 150, editable: true },
    {
      field: "amount ",
      headerName: "Amount",
      width: 150,
      editable: true,
    },
    {
      field: "INVENTORYCELL",
      headerName: "INVENTORY CELL",
      width: 200,
      editable: true,
    },
    {
      field: "description",
      headerName: "Description",
      width: 500,
      editable: true,
    },
    {
      field: "PAIDTO",
      headerName: "PAID TO",
      width: 150,
      editable: true,
    },
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
    localStorage.setItem("payments", JSON.stringify(updatedRows)); // Update localStorage
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
    localStorage.setItem("payments", JSON.stringify(updatedRows)); // Save updated rows to localStorage
  };

  // Handle cell edits
  const handleCellEditCommit = (params) => {
    const updatedRows = rows.map((row) => (row.id == params.id ? params : row));
    console.log(updatedRows, "updatedRows");
    setRows(updatedRows);
    localStorage.setItem("payments", JSON.stringify(updatedRows)); // Save updated rows to localStorage
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
