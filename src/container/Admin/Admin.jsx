import "./Admin.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const Admin = () => {
  const [users, setUsers] = useState([]);
  const [editedUser, setEditedUser] = useState({});
  const [deletedUserId, setDeletedUserId] = useState(null);
  const [auth, setAuth] = useState(false);
  const [name, setName] = useState("");
  const [tables, setTable] = useState();
  const [confirm, setConfirm] = useState();

  const [deletedtableId, setDeletedTableId] = useState(null);
  const [deletedConfId, setDeletedConfId] = useState(null);

  const [recentActivity, setRecentActivity] = useState([]);
  const [meals, setMeal] = useState([]);
  const [confirmations, setConfirmations] = useState([]);

  useEffect(() => {
    const fetchConfirmations = async () => {
      try {
        const res = await axios.get("http://localhost:3001/reservations");
        setConfirmations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchConfirmations();
  }, []);
  const handleCondDelete = async (id) => {
    const confDelete = confirmations.find((confirm) => confirmations.idreservations === deletedConfId);
    if (confDelete) {
      addActivity(`Reservation with ID: ${confDelete.idreservations} is deleted`);

      try {
        await axios.delete(`http://localhost:3001/reservations/${id}`);
        setConfirm(confirmations.filter((confirm) => confirmations.idreservations !== id));
      } catch (error) {
        console.error(error);
      }
    }
  };
  const handleDeleteConf= (id) => {
    setDeletedConfId(id);
  };
  

  useEffect(() => {
    const fetchAllMeals = async () => {
      try {
        const res = await axios.get("http://localhost:3001/menu");
        setMeal(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllMeals();
  }, []);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3001/users").then((response) => {
      setUsers(response.data);
    });
  }, []);
  const handleEdit = (user) => {
    setEditedUser(user);
  };
  useEffect(() => {
    const fetchAllTables = async () => {
      try {
        const res = await axios.get("http://localhost:3001/booktable");
        setTable(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllTables();
  }, []);

  const handleSave = (user) => {
    const { password, ...editedUserData } = editedUser;
    axios
      .put(`http://localhost:3001/update?id=${editedUser.id}`, {})
      .then((response) => {
        console.log(response.data);

        setUsers(
          users.map((user) => (user.id === editedUser.id ? editedUser : user))
        );
        //reset edited user

        setEditedUser({});
      })
      .catch((error) => {
        console.error(error);
      });
    addActivity(
      `User ${editedUser.username} with ID: ${editedUser.id} changed the username`
    );
  };
  const addActivity = (activity) => {
    setRecentActivity((prevActivity) => [
      activity,
      ...prevActivity.slice(0, 2),
    ]);
  };

  const handleDelete = (id, username) => {
    setDeletedUserId(id);
  };
  const handleDeleteMeal = async (id) => {
    try {
      await axios.delete("http://localhost:3001/menu/" + id);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };
  const handleDeleteTab = (id) => {
    setDeletedTableId(id);
  };
  const handleDeleteTable = async (id) => {
    const tableToDelete = tables.find((table) => table.id === deletedtableId);
    if (tableToDelete) {
      addActivity(`Table with ID: ${tableToDelete.id} is deleted`);

      try {
        await axios.delete(`http://localhost:3001/booktable/${id}`);
        setTable(tables.filter((table) => table.id !== id));
      } catch (error) {
        console.error(error);
      }
    }
  };
  const handleConfirmDelete = () => {
    const userToDelete = users.find((user) => user.id === deletedUserId);
    if (userToDelete) {
      addActivity(
        `User ${userToDelete.username} with ID: ${userToDelete.id} is deleted`
      );

      axios
        .delete(`http://localhost:3001/delete/${deletedUserId}`)
        .then((response) => {
          console.log(response.data);
          setUsers(users.filter((user) => user.id !== deletedUserId));
          setDeletedUserId(null);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
  const handleTabChangee = (tab) => {
    setActiveTab(tab);
  };

  const [activeTab, setActiveTab] = useState("adminhome");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "adminhome":
        return (
          <div className="app__bg">
            <div className="content">
              <div className="home-page">
                <div className="home-box">
                  <h2>Users</h2>
                  <p>{users.length}</p>
                </div>
                <div className="home-box">
                  <h2>Meals</h2>
                  <p>{meals ? meals.length : 0}</p>
                </div>
                <div className="home-box">
                  <h2>Tables</h2>
                  <p>{tables ? tables.length : 0}</p>
                </div>
                <div className="home-box">
                  <h2>Reservations</h2>
                  <p>{confirmations ? confirmations.length : 0}</p>
                </div>
              </div>

              <div className="recent-activity">
                <h2>Recent Activity</h2>
                <ul>
                  {recentActivity.map((activity, index) => (
                    <li key={index}>{activity}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      case "users":
        return (
          <div className="app__bg">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>
                      <input
                        type="email"
                        value={
                          editedUser.id === user.id
                            ? editedUser.email
                            : user.email
                        }
                        onChange={(e) =>
                          setEditedUser({
                            ...editedUser,
                            email: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={
                          editedUser.id === user.id
                            ? editedUser.username
                            : user.username
                        }
                        onChange={(e) =>
                          setEditedUser({
                            ...editedUser,
                            username: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td>{user.role}</td>
                    <td>
                      {editedUser.id === user.id ? (
                        <>
                          <button onClick={handleSave}>Save</button>
                          <button
                            onClick={() => setEditedUser({})}
                            style={{ background: "red" }}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEdit(user)}>Edit</button>
                          <button
                            onClick={() => handleDelete(user.id, user.username)}
                            style={{ background: "red" }}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {deletedUserId && (
              <div className="delete-confirmation">
                <p>Are you sure you want to delete this user?</p>
                <div className="buttons">
                  <button onClick={handleConfirmDelete}>Yes</button>
                  <button onClick={() => setDeletedUserId(null)}>No</button>
                </div>
              </div>
            )}
          </div>
        );
      case "meals":
        return (
          <div className="app__bg">
            <Link
              to={"/addMeal"}
              className="app__specialMenu-menu_heading"
              style={{ display: "flex", justifyContent: "center" }}
            >
              Add new meal
            </Link>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cover</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Desc</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {meals.map((meal) => (
                  <tr key={meal.idmenu}>
                    {" "}
                    <td>{meal.idmenu}</td>
                    <td>
                      <img src={meal.cover} alt="" className="img" />
                    </td>
                    <td>{meal.title}</td>
                    <td>{meal.price}</td>
                    <td>{meal.desc}</td>
                    <td>
                      <div className="btn">
                        <p
                          className="delete"
                          onClick={() => handleDeleteMeal(meal.idmenu)}
                        >
                          Delete
                        </p>
                        <Link
                          className="update-btn"
                          to={`/update/${meal.idmenu}`}
                        >
                          <p className="update">Update</p>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "tables":
        return (
          <div className="app__bg">
            <Link
              to={"/addTable"}
              className="app__specialMenu-menu_heading"
              style={{ display: "flex", justifyContent: "center" }}
            >
              Add new Table
            </Link>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Location</th>
                  <th>TableSize</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tables.map((table) => (
                  <tr key={table.id}>
                    <td>{table.id}</td>
                    <td>{table.date}</td>
                    <td>{table.time}</td>
                    <td>{table.location}</td>
                    <td>{table.tablesize}</td>
                    <td>
                      <div className="btn">
                        <p
                          className="delete"
                          onClick={() => handleDeleteTab(table.id)}
                        >
                          Delete
                        </p>
                        {/* <Link
                          className="update-btn"
                          to={`/update/${}`}
                        >
                          <p className="update">Update</p>
                        </Link> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "confirmations":
        return (
          <div className="app__bg">
            <h2>Confirmations</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Phone Number</th>
                  <th>Email</th>
                  <th>Table Number</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {confirmations.map((confirmation) => (
                  <tr key={confirmation.idreservations}>
                    <td>{confirmation.idreservations}</td>
                    <td>{confirmation.name}</td>
                    <td>{confirmation.phonenumber}</td>
                    <td>{confirmation.email}</td>
                    <td>{confirmation.idtable}</td>
                    <td>
                      <button
                        onClick={() =>
                          handleDeleteConf(confirmation.idreservations)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return null;
    }
  };
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3001/logout", null, {
        withCredentials: true,
      });
      setAuth(false);
      setName("");
      window.location.href = "/";
    } catch (err) {
      console.log(err.response.data);
    }
  };
  return (
    <div className="admin">
      <div className="content">{renderContent()}</div>

      <div className="sidebar">
        <ul>
          <li
            className={activeTab === "adminhome" ? "active" : ""}
            onClick={() => handleTabChange("adminhome")}
          >
            Home
          </li>
          <li
            className={activeTab === "users" ? "active" : ""}
            onClick={() => handleTabChange("users")}
          >
            Users
          </li>
          <li
            className={activeTab === "meals" ? "active" : ""}
            onClick={() => handleTabChange("meals")}
          >
            Meals
          </li>
          <li
            className={activeTab === "tables" ? "active" : ""}
            onClick={() => handleTabChange("tables")}
          >
            Tables
          </li>
          <li
            className={activeTab === "confirmations" ? "active" : ""}
            onClick={() => handleTabChangee("confirmations")}
          >
            Reservations
          </li>
          <li className="logout" onClick={handleLogout}>
            Logout
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Admin;
