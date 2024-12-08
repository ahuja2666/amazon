import React, { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Box,
  Grid2,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import apiClient from "./axios";
import dayjs from "dayjs";
import Header from "./Header.jsx";

const rows = [
  {
    AmazonOrderId: "114-0102139-8411438",
    PurchaseDate: "2024-12-04T00:03:22Z",
    DefaultShipFromLocationAddress: { Name: "V M Enterprises" },
    OrderTotal: {
      Amount: "29.15",
    },
    NumberOfItemsShipped: 1,
    OrderStatus: "Shipped",
    ShipServiceLevel: "Std US D2D Dom",
    LatestShipDate: "2024-12-04T00:03:22Z",
  },
  {
    AmazonOrderId: "114-0102139-8411439",
    PurchaseDate: "2024-12-05T00:03:22Z",
    DefaultShipFromLocationAddress: { Name: "B Enterprises" },
    OrderTotal: {
      Amount: "21.15",
    },
    NumberOfItemsShipped: 2,
    OrderStatus: "Pending",
    ShipServiceLevel: "Std US D2D Dom",
    LatestShipDate: "2024-12-05T00:03:22Z",
  },
];

export default function Profits() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(
    dayjs(dayjs().subtract(6, "days").toISOString())
  );
  const [currentDate, setCurrentDate] = useState(dayjs(dayjs().toISOString()));
  const [nextToken, setNextToken] = useState("");
  const [amazonOrderId, setAmazonOrderId] = useState("");
  const [OrderStatus, setOrderStatus] = useState("All");

  const handleChange = (event) => {
    setOrderStatus(event.target.value);
  };

  console.log(startDate.toISOString(), "startDate");
  const fetchOrders = async (isNext = false) => {
    setLoading(true);
    setOrders([]);
    try {
      let params = {
        MarketplaceIds:
          "A2EUQ1WTGCTBG2,ATVPDKIKX0DER,A1AM78C64UM0Y8,A2Q3Y263D00KWC",
        CreatedAfter: startDate.format("YYYY-MM-DD[T]00:00:00"),
        CreatedBefore: currentDate.subtract(3, "minute").toISOString(),
      };
      if (isNext) {
        params.NextToken = nextToken;
      }
      if (OrderStatus && OrderStatus !== "All") {
        params.OrderStatuses = OrderStatus;
      }
      const response = await apiClient.get("/orders/v0/orders", {
        params: params,
      });
      setOrders(response?.data?.payload?.Orders || []);
      setNextToken(response?.data?.payload?.NextToken || "");
      console.log(response.data);
    } catch (error) {
      alert(
        `Error: ${
          error?.response?.data?.errors[0]?.message || "Something went wrong"
        }`
      );
      console.error("Error fetching orders:", error);
    }
    setLoading(false);
  };

  const fetchOrderItems = async (id) => {
    if (!id) return;
    setAmazonOrderId(id);
    try {
      const response = await apiClient.get(
        `/orders/v0/orders/${id}/orderItems`
      );

      let od = orders.map((order) => {
        if (order.AmazonOrderId === id) {
          const savedRows = JSON.parse(localStorage.getItem("rows")) || [];
          const updatedOrder = savedRows.find(
            (row) => row.ASIN === response?.data?.payload?.OrderItems[0]?.ASIN
          );

          if (updatedOrder) {
            return {
              ...order,
              ...response?.data?.payload?.OrderItems[0],
              ...updatedOrder,
            };
          } else {
            alert("ASIN not found in inventory, Profit can not be calulated");
          }
          return {
            ...order,
            ...response?.data?.payload?.OrderItems[0],
          };
        }
        return order;
      });

      setOrders(od);
      console.log(response.data);
    } catch (error) {
      alert(
        `Error: ${
          error?.response?.data?.errors[0]?.message || "Something went wrong"
        }`
      );
      console.error("Error fetching order items:", error);
    }
    setAmazonOrderId("");
  };

  const columns = [
    {
      field: "PurchaseDate",
      headerName: "Date",
      width: 150,
      valueGetter: (value, row) =>
        row?.PurchaseDate ? dayjs(row.PurchaseDate).format("MM-DD-YYYY") : "",
    },
    {
      field: "BuyerName",
      headerName: "Buyer Name",
      width: 150,
      valueGetter: (value, row) =>
        row?.DefaultShipFromLocationAddress?.Name == "null" ||
        !row?.DefaultShipFromLocationAddress?.Name
          ? ""
          : row.DefaultShipFromLocationAddress.Name,
    },
    {
      field: "ASIN",
      headerName: "ASIN",
      width: 150,
      renderCell: (params) =>
        params?.row?.ASIN ? (
          params.row.ASIN
        ) : (
          <LoadingButton
            loading={params.row.AmazonOrderId === amazonOrderId}
            onClick={() => {
              fetchOrderItems(params.row.AmazonOrderId);
            }}
          >
            Get ASIN
          </LoadingButton>
        ),
    },
    {
      field: "SellerSKU",
      headerName: "SKU",
      width: 150,
    },
    {
      field: "Title",
      headerName: "Title",
      width: 150,
    },
    {
      field: "AmazonOrderId",
      headerName: "Amazon Order ID",
      width: 200,
    },
    {
      field: "AmazonPrice",
      headerName: "Amazon Price",
      width: 120,
      valueGetter: (value, row) =>
        row?.OrderTotal?.Amount
          ? `${row.OrderTotal.CurrencyCode} ${row?.OrderTotal?.Amount}`
          : "",
    },
    {
      field: "NumberOfItemsShipped",
      headerName: "Quantity",
      width: 80,
    },
    {
      field: "Source Price",
      headerName: "Source Price",
      width: 100,
      valueGetter: (value, row) =>
        row?.amount && row?.quantity
          ? ((row.amount / row.quantity) * row.NumberOfItemsShipped).toFixed(2)
          : "",
    },
    {
      field: "ShipmentServiceLevelCategory",
      headerName: "Shipping",
      width: 100,
    },
    {
      field: "ItemTax.CurrencyCode.Amount",
      headerName: "Tax",
      width: 100,
      valueGetter: (value, row) =>
        row?.ItemTax?.Amount
          ? `${row.ItemTax.CurrencyCode} ${row.ItemTax.Amount}`
          : "",
    },
    {
      field: "EarliestShipDate",
      headerName: "Expedited Shipping",
      width: 100,
      valueGetter: (value, row) =>
        row?.EarliestShipDate
          ? dayjs(row.EarliestShipDate).format("MM-DD-YYYY")
          : "",
    },
    {
      field: "Profit",
      headerName: "Profit",
      width: 100,
      valueGetter: (value, row) =>
        row?.OrderTotal?.Amount && row?.amount && row?.quantity
          ? (
              row.OrderTotal.Amount -
              (row.amount / row.quantity) * row.NumberOfItemsShipped
            ).toFixed(2)
          : "",
    },
    {
      field: "Profit%",
      headerName: "Profit %",
      width: 80,
      valueGetter: (value, row) =>
        row?.OrderTotal?.Amount && row?.amount && row?.quantity
          ? (
              ((row.OrderTotal.Amount -
                (row.amount / row.quantity) * row.NumberOfItemsShipped) /
                row.amount) *
              100
            ).toFixed(2) + "%"
          : "",
    },
    {
      field: "ShipServiceLevel",
      headerName: "Carrier",
      width: 150,
    },
    {
      field: "OrderStatus",
      headerName: "Tracking Status",
      width: 100,
    },
    {
      field: "LatestShipDate",
      headerName: "Shipped Date",
      width: 150,
      valueGetter: (value, row) =>
        row?.LatestShipDate
          ? dayjs(row.LatestShipDate).format("MM-DD-YYYY")
          : "",
    },
  ];

  const handleRowEdit = (updatedRow) => {
    console.log(updatedRow);
    const updatedRows = orders.map((row) =>
      row.AmazonOrderId == updatedRow.AmazonOrderId ? updatedRow : row
    );
    setOrders(updatedRows);
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  return (
    <div className="min-h-screen max-h-full ">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="App">
          <Header />
          <Grid2
            container
            spacing={2}
            sx={{ padding: "10px" }}
            alignItems="stretch"
          >
            <Grid2 item xs={2}>
              <DatePicker
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                label="From Date"
                fullWidth
              />
            </Grid2>
            <Grid2 item xs={3}>
              <DatePicker
                value={currentDate}
                onChange={(newValue) => setCurrentDate(newValue)}
                label="To Date"
                fullWidth
              />
            </Grid2>
            <Grid2 fullWidth item xs={2}>
              <Box minWidth={150}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Order Status
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={OrderStatus}
                    label="Order Status"
                    onChange={handleChange}
                  >
                    <MenuItem value={"All"}>All</MenuItem>
                    <MenuItem value={"Unfulfillable"}>Unfulfillable</MenuItem>
                    <MenuItem value={"Canceled"}>Canceled</MenuItem>
                    <MenuItem value={"InvoiceUnconfirmed"}>
                      Invoice Unconfirmed
                    </MenuItem>
                    <MenuItem value={"Shipped"}>Shipped</MenuItem>
                    <MenuItem value={"PartiallyShipped"}>
                      Partially Shipped
                    </MenuItem>
                    <MenuItem value={"Unshipped"}>Unshipped</MenuItem>
                    <MenuItem value={"Pending"}>Pending</MenuItem>
                    <MenuItem value={"PendingAvailability"}>
                      Pending Availability
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid2>
            <Grid2 item xs={3} sx={{ display: "flex" }}>
              <LoadingButton
                size="large"
                variant="contained"
                sx={{ height: "100%", width: "100%" }}
                loading={loading}
                onClick={() => fetchOrders()}
              >
                Submit
              </LoadingButton>
            </Grid2>
            {nextToken && (
              <Grid2 item xs={3} sx={{ display: "flex" }}>
                <LoadingButton
                  size="large"
                  variant="contained"
                  sx={{ height: "100%", width: "100%" }}
                  loading={loading}
                  onClick={() => fetchOrders(true)}
                >
                  Next page
                </LoadingButton>
              </Grid2>
            )}
          </Grid2>
          <div
            style={{
              height: "calc(100vh - 155px)",
              width: "98.5%",
              padding: "10px",
            }}
          >
            <DataGrid
              getRowId={(row) => row.AmazonOrderId}
              rows={orders}
              columns={columns}
              loading={loading}
              initialState={{
                density: "compact", // Set the default density
              }}
              slots={{ toolbar: GridToolbar }}
              processRowUpdate={handleRowEdit}
            />
          </div>
        </div>
      </LocalizationProvider>
    </div>
  );
}
