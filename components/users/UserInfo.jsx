import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

export { UserInfo };

const UserInfo = ({ current }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>{current.firstName + " " + current.lastName}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Date of birth</TableCell>
            <TableCell>{current?.dob}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Gender</TableCell>
            <TableCell>{current?.gender}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Phone</TableCell>
            <TableCell>{current?.phone}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>{current?.email}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Birth Place</TableCell>
            <TableCell>{current?.pob?.formattedAddress}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Residence</TableCell>
            <TableCell>{current?.por?.formattedAddress}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Level</TableCell>
            <TableCell>{current?.level}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Signed Up</TableCell>
            <TableCell>
              {current?.isSignedUp === "true" ? "Yes" : "No"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
