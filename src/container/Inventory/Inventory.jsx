import axios from "axios";
import React, { useEffect, useState } from "react";
import { images } from "../../constants";
import "./Inventory.css";

const Inventory = () => {
  const [stock, setStock] = useState([]);
  const [wastage, setWastage] = useState([]);
  const [total, setTotal] = useState(0);
  const role = localStorage.getItem("role");
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        await axios.get("http://localhost:3001/", {
          withCredentials: true,
        });
        setAuth(true);
      } catch (err) {
        setAuth(false);
      }
    };
    verify();
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await axios.get("http://localhost:3001/stock");
        setStock(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAll();
  }, []);
  const handleDelete = async (id) => {
    try {
      await axios.delete("http://localhost:3001/stock/" + id);

      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await axios.get("http://localhost:3001/register");
        setWastage(res.data);
        calculateTotalCount(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAll();
  }, []);

  const calculateTotalCount = (data) => {
    let count = 0;
    data.forEach((item) => {
      count += item.cost * item.wastage_quantity;
    });
    setTotal(count);
  };

  const [activeTab, setActiveTab] = useState("stock");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "stock":
        return (
          <div className="app__bg">
            {auth && role === "staff" ? (
              <div className="app__bg">
                <table>
                  <thead>
                    <tr>
                      <th>Item Id</th>
                      <th>Item Name</th>
                      <th>Unit</th>
                      <th>Average Cost/Unit</th>
                      <th>Available</th>
                      <th>Alert</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {stock.map((item) => (
                      <tr key={item.id}>
                        <td>{item.itemid}</td>
                        <td>{item.itemname}</td>
                        <td>{item.unit}</td>
                        <td>{item.cost}</td>
                        <td>{item.available}</td>
                        <td>
                          {item.available < 10 ? (
                            <img id="img" src={images.alert} alt="alert" />
                          ) : (
                            ""
                          )}
                        </td>
                        <p
                          className="delete" style={{marginTop:"5px"}}
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </p>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div>
                <h1>You Do Not Have Access To This Page</h1>
              </div>
            )}
          </div>
        );
      case "wastage":
        return (
          <div className="app__bg table">
            {auth && role === "staff" ? (
              <div className="app__bg table">
                <table>
                  <thead>
                    <tr>
                      <th>Item Id</th>
                      <th>Item Name</th>
                      <th>Unit</th>
                      <th>Average Cost/Unit</th>
                      <th>Wastage Quantity</th>
                      <th>Wastage Cost</th>
                    </tr>
                  </thead>

                  <tbody>
                    {wastage.map((item) => (
                      <tr key={item.id}>
                        <td>{item.itemid}</td>
                        <td>{item.itemname}</td>
                        <td>{item.unit}</td>
                        <td>{item.cost}</td>
                        <td>{item.wastage_quantity}</td>
                        <td>{item.cost * item.wastage_quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="recent_activity">
                  <p>Total Wastage: {total}</p>
                </div>
              </div>
            ) : (
              <div>
                <h1>You Do Not Have Access To This Page</h1>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div className="admin">
      {auth && role === "staff" ? (
        <div className="admin">
          <div className="content">{renderContent()}</div>

          <div className="sidebar">
            <ul>
              <li
                className={activeTab === "stock" ? "active" : ""}
                onClick={() => handleTabChange("stock")}
              >
                Stock View
              </li>
              <li
                className={activeTab === "wastage" ? "active" : ""}
                onClick={() => handleTabChange("wastage")}
              >
                Wastage
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div>
          <h1>You Do Not Have Access To This Page</h1>
        </div>
      )}
    </div>
  );
};

export default Inventory;
