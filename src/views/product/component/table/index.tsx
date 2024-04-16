import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Thumbnail } from "@shopify/polaris";
import { ImageIcon } from "@shopify/polaris-icons";
import * as React from "react";

interface Data {
  id: string;
  url: string;
  name: string;
  quantity: number;
  price: number;
  note: string;
  category: string;
}

function createData(
  id: string,
  url: string,
  name: string,
  quantity: number,
  price: number,
  note: string,
  category: string
): Data {
  return { id, url, name, quantity, price, note, category };
}

const rows = [
  createData(
    "1",
    "../../../../../cache/image/product/p17 copy 4.png",
    "Áo 2",
    20,
    200000,
    "",
    "Áo"
  ),
  createData(
    "2",
    "cache/image/product/p17 copy 4.png",
    "Áo 1",
    10,
    100000,
    "",
    "Áo"
  ),
];

export default function TableProducts() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell align="right">Image</TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Quanity</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Description</TableCell>
            <TableCell align="right">Category</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              style={{ cursor: "pointer" }}
              onClick={() => (window.location.href = `product/${row.id}`)}
            >
              <TableCell align="left">{row.id}</TableCell>
              <TableCell align="right">
                <Thumbnail
                  source={row.url ? row.url : ImageIcon}
                  alt={row.name}
                />
              </TableCell>
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">{row.quantity}</TableCell>
              <TableCell align="right">{row.price}</TableCell>
              <TableCell align="right">{row.note}</TableCell>
              <TableCell align="right">{row.category}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
