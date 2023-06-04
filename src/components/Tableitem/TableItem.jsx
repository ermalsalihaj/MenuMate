import React from "react";

import "./TableItem.css";

const TableItem = ({ date, time, location, tablesize }) => (
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Time</th>
        <th>Location</th>
        <th>TableSize</th>
      </tr>
    </thead>
    <tbody>

        <tr >
          <td>{date}</td>
          <td>{time}</td>
          <td>{location}</td>
          <td>{tablesize}</td>
        </tr>

    </tbody>
  </table>
);

export default TableItem;
