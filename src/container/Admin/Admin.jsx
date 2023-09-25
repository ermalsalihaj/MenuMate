import "./Admin.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { MdArrowCircleLeft } from "react-icons/md";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [editedUser, setEditedUser] = useState({});
  const [deletedUserId, setDeletedUserId] = useState(null);
  const [name, setName] = useState("");
  const [tables, setTable] = useState();
  const [confirm, setConfirm] = useState();
  const [recentActivity, setRecentActivity] = useState([]);
  const [meals, setMeal] = useState([]);
  const [confirmations, setConfirmations] = useState([]);
  const [updatedTable, setUpdatedTable] = useState({});
  const [drinks, setDrinks] = useState([]);
  const [editedDrink, setEditedDrink] = useState({});
  const [deletedDrinkId, setDeletedDrinkId] = useState(null);
  const [pizzas, setPizzas] = useState([]);
  const [editedPizza, setEditedPizza] = useState({});
  const [booktime, setBooktime] = useState([]);
  const [newTime, setNewTime] = useState("");
  const [editedBooktime, setEditedBooktime] = useState({});
  const [deletedBooktimeId, setDeletedBooktimeId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const role = localStorage.getItem("role");
  const [auth, setAuth] = useState(false);
  ///////////////////////AUTH//////////////////////////////
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

  ///////////////////////USERS//////////////////////////////
  useEffect(() => {
    axios.get("http://localhost:3001/users").then((response) => {
      setUsers(response.data);
    });
  }, []);

  const handleEdit = (user) => {
    setEditedUser(user);
  };

  const handleSave = (user) => {
    const { password, ...editedUserData } = editedUser;
    const { id, email, username } = editedUserData;

    axios
      .put(`http://localhost:3001/update/${id}`, { email, username })
      .then((response) => {
        console.log(response.data);

        setUsers(
          users.map((user) => (user.id === editedUser.id ? editedUser : user))
        );

        setEditedUser({});
      })
      .catch((error) => {
        console.error(error);
      });

    addActivity(
      `User ${editedUser.username} with ID: ${editedUser.id} changed the username`
    );
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

  const handleDelete = (id, username) => {
    setDeletedUserId(id);
  };

  ////////////////////////////MENU/////////////////////////////////////////
  // Meals
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

  const handleDeleteMeal = async (id) => {
    try {
      await axios.delete("http://localhost:3001/menu/" + id);
      addActivity(`Meal with ID: ${id} is deleted`);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };
  // Drinks
  useEffect(() => {
    axios.get("http://localhost:3001/drinks").then((response) => {
      setDrinks(response.data);
    });
  }, []);

  const handleEditDrink = (drink) => {
    setEditedDrink(drink);
  };

  const handleSaveDrink = (drink) => {
    axios
      .put(`http://localhost:3001/drinks/${drink.id}`, drink)
      .then((response) => {
        console.log(response.data);

        setDrinks(drinks.map((d) => (d.id === drink.id ? drink : d)));

        setEditedDrink({});
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDeleteDrink = async (id) => {
    try {
      await axios.delete("http://localhost:3001/drinks/" + id);
      addActivity(`Drink with ID: ${id} is deleted`);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    axios.get("http://localhost:3001/pizza").then((response) => {
      setPizzas(response.data);
    });
  }, []);
  const handleEditPizza = (pizza) => {
    setEditedPizza(pizza);
  };
  const handlePizzaChange = (e) => {
    const { name, value } = e.target;
    setEditedPizza((prevPizza) => ({
      ...prevPizza,
      [name]: value,
    }));
  };

  const handleSavePizza = () => {
    axios
      .put(`http://localhost:3001/pizza/${editedPizza.idpizza}`, editedPizza)
      .then((response) => {
        console.log(response.data);

        setPizzas((prevPizzas) =>
          prevPizzas.map((p) =>
            p.idpizza === editedPizza.idpizza ? editedPizza : p
          )
        );

        setEditedPizza({});
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDeletePizza = (idpizza) => {
    axios
      .delete(`http://localhost:3001/pizza/${idpizza}`)
      .then((response) => {
        console.log(response.data);

        setPizzas((prevPizzas) =>
          prevPizzas.filter((p) => p.idpizza !== idpizza)
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };

  /////////////////////BookTable////////////////////////////////////////////////
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

  const handleDeleteTable = async (id) => {
    try {
      await axios.delete("http://localhost:3001/booktable/" + id);
      addActivity(`Table with ID: ${id} is deleted`);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };
  const handleTabChangee = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    // Fetch booktimes from the API
    axios
      .get("http://localhost:3001/booktime")
      .then((response) => {
        setBooktime(response.data.booktime);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleAddBooktime = () => {
    axios
      .post("http://localhost:3001/booktime", { time: newTime })
      .then((response) => {
        setBooktime([...booktime, response.data]);
        setNewTime("");
        setShowAddModal(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleEditBooktime = (booktime) => {
    setEditedBooktime(booktime);
  };

  const handleSaveBooktime = () => {
    axios
      .put(
        `http://localhost:3001/booktime/${editedBooktime.idbooktime}`,
        editedBooktime
      )
      .then(() => {
        setBooktime(
          booktime.map((booktime) =>
            booktime.idbooktime === editedBooktime.idbooktime
              ? editedBooktime
              : booktime
          )
        );
        setEditedBooktime({});
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDeleteBooktime = (id) => {
    setDeletedBooktimeId(id);
  };

  const handleConfirmDeleteTime = () => {
    axios
      .delete(`http://localhost:3001/booktime/${deletedBooktimeId}`)
      .then(() => {
        setBooktime(
          booktime.filter(
            (booktime) => booktime.idbooktime !== deletedBooktimeId
          )
        );
        setDeletedBooktimeId(null);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  ////////////////////////Reservations//////////////////////////////////

  useEffect(() => {
    const fetchConfirmations = async () => {
      try {
        const res = await axios.get("http://localhost:3001/reservations");
        setConfirmations(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchConfirmations();
  }, []);

  const handleDeleteReservation = async (id) => {
    try {
      await axios.delete("http://localhost:3001/reservations/" + id);
      addActivity(`Reservation with ID: ${id} is deleted`);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  /////////Activity//////////////////////
  const navigate = useNavigate();
  useEffect(() => {
    const storedActivities = localStorage.getItem("activities");
    if (storedActivities) {
      setRecentActivity(JSON.parse(storedActivities));
    }
  }, []);

  const saveActivityToLocalStorage = (activity) => {
    const existingActivities = localStorage.getItem("activities");
    const parsedActivities = existingActivities
      ? JSON.parse(existingActivities)
      : [];
    const updatedActivities = [activity, ...parsedActivities.slice(0, 2)];
    localStorage.setItem("activities", JSON.stringify(updatedActivities));
  };

  const addActivity = (activity) => {
    setRecentActivity((prevActivity) => [
      activity,
      ...prevActivity.slice(0, 2),
    ]);
    saveActivityToLocalStorage(activity);
  };
  const deleteActivity = (index) => {
    setRecentActivity((prevActivity) => {
      const updatedActivity = [...prevActivity];
      updatedActivity.splice(index, 1);
      return updatedActivity;
    });

    const storedActivities = localStorage.getItem("activities");
    if (storedActivities) {
      const parsedActivities = JSON.parse(storedActivities);
      parsedActivities.splice(index, 1);
      localStorage.setItem("activities", JSON.stringify(parsedActivities));
    }
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
            {auth && role === "admin" ? (
              <div className="content">
                <Link to={"/"}>
                  <MdArrowCircleLeft
                    fontSize={40}
                    cursor="pointer"
                    className="overlay__close"
                    id="arrow-left_booktable"
                    color="var(--color-golden)"
                  />
                  <span
                    style={{
                      marginLeft: "10px",
                      color: "var(--color-golden)",
                      verticalAlign: "top",
                      textDecoration: "underline",
                      fontSize: "20px",
                    }}
                  >
                    Back to main page
                  </span>
                </Link>

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
                    <h2>Drinks</h2>
                    <p>{drinks ? drinks.length : 0}</p>
                  </div>
                  <div className="home-box">
                    <h2>Pizzas</h2>
                    <p>{pizzas ? pizzas.length : 0}</p>
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
                      <div key={index}>
                        <li>{activity}</li>
                        <button onClick={() => deleteActivity(index)}>
                          DeleteActivity
                        </button>
                      </div>
                    ))}
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
      case "users":
        return (
          <div className="app__bg">
            {auth && role === "admin" ? (
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
                              <div className="btn">
                                <p
                                  className="update"
                                  style={{
                                    marginRight: "5px",
                                    marginTop: "-11px",
                                  }}
                                  onClick={() => handleEdit(user)}
                                >
                                  Edit
                                </p>
                                <p
                                  className="delete"
                                  onClick={() =>
                                    handleDelete(user.id, user.username)
                                  }
                                >
                                  Delete
                                </p>
                              </div>
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
            ) : (
              <div>
                <h1>You Do Not Have Access To This Page</h1>
              </div>
            )}
          </div>
        );
      case "meals":
        return (
          <div className="app__bg">
            {auth && role === "admin" ? (
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
            ) : (
              <div>
                <h1>You Do Not Have Access To This Page</h1>
              </div>
            )}
          </div>
        );
      case "drinks":
        return (
          <div className="app__bg">
            {auth && role === "admin" ? (
              <div className="app__bg">
                <Link
                  to={"/addDrink"}
                  className="app__specialMenu-menu_heading"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  Add new Drink
                </Link>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Ingredients</th>
                      <th>Price</th>
                      <th>Cover</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drinks.map((drink) => (
                      <tr key={drink.id}>
                        <td>{drink.name}</td>
                        <td>{drink.ingredients}</td>
                        <td>{drink.price}</td>
                        <img src={drink.cover} alt="" className="img" />
                        <td>
                          <Link
                            className="update-btn"
                            to={`/updateDrink/${drink.iddrinks}`}
                          >
                            <p
                              className="update"
                              style={{ marginBottom: "15px" }}
                              onClick={() => handleEditDrink(drink)}
                            >
                              Edit
                            </p>
                          </Link>

                          <div className="btn">
                            <p
                              className="delete"
                              onClick={() => handleDeleteDrink(drink.iddrinks)}
                            >
                              Delete
                            </p>
                          </div>
                        </td>
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
      case "booktime":
        return (
          <div className="app__bg">
            {auth && role === "admin" ? (
              <div className="app__bg">
                <div
                  className="app__specialMenu-menu_heading"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <button onClick={() => setShowAddModal(true)}>
                    Add Time
                  </button>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Time</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {booktime.map((booktime) => (
                      <tr key={booktime.idbooktime}>
                        <td>{booktime.idbooktime}</td>
                        <td>
                          {editedBooktime.idbooktime === booktime.idbooktime ? (
                            <input
                              type="text"
                              value={editedBooktime.time}
                              onChange={(e) =>
                                setEditedBooktime({
                                  ...editedBooktime,
                                  time: e.target.value,
                                })
                              }
                            />
                          ) : (
                            booktime.time
                          )}
                        </td>
                        <td>
                          {editedBooktime.idbooktime === booktime.idbooktime ? (
                            <>
                              <button onClick={handleSaveBooktime}>Save</button>
                              <button
                                onClick={() => setEditedBooktime({})}
                                style={{ background: "red" }}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <div className="btn">
                                <p
                                  className="update"
                                  style={{
                                    marginRight: "5px",
                                    marginTop: "-11px",
                                  }}
                                  onClick={() => handleEditBooktime(booktime)}
                                >
                                  Edit
                                </p>
                                <p
                                  className="delete"
                                  onClick={() =>
                                    handleDeleteBooktime(booktime.idbooktime)
                                  }
                                >
                                  Delete
                                </p>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {deletedBooktimeId && (
                  <div className="delete-confirmation">
                    <p>Are you sure you want to delete this booktime entry?</p>
                    <div className="buttons">
                      <button onClick={handleConfirmDeleteTime}>Yes</button>
                      <button onClick={() => setDeletedBooktimeId(null)}>
                        No
                      </button>
                    </div>
                  </div>
                )}

                {showAddModal && (
                  <div className="modal">
                    <div className="modal-content">
                      <h2>Add New Time</h2>
                      <input
                        type="text"
                        placeholder="Enter a new time"
                        style={{ width: "200px", marginLeft:"350px" }} 
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                      />
                      <div className="modal-buttons" style={{display:"flex",justifyContent:"center"}}>
                        <button onClick={handleAddBooktime}>Add</button>
                        <button onClick={() => setShowAddModal(false)}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h1>You Do Not Have Access To This Page</h1>
              </div>
            )}
          </div>
        );
      case "pizza":
        return (
          <div className="app__bg">
            {auth && role === "admin" ? (
              <div className="app__bg">
                <Link
                  to={"/addPizza"}
                  className="app__specialMenu-menu_heading"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  Add new pizza
                </Link>
                <div className="pizza-list">
                  <h2>Pizza List</h2>
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Cover</th>
                        <th>Name</th>
                        <th>Ingredients</th>
                        <th>Price</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pizzas.map((pizza) => (
                        <tr key={pizza.idpizza}>
                          <td>{pizza.idpizza}</td>
                          <td>
                            <img src={pizza.cover} alt="" className="img" />
                          </td>
                          <td>{pizza.name}</td>
                          <td>{pizza.ingredients}</td>
                          <td>{pizza.price}</td>

                          <td>
                            <Link
                              className="update-btn"
                              to={`/updatePizza/${pizza.idpizza}`}
                            >
                              <p
                                className="update"
                                style={{ marginBottom: "15px" }}
                                onClick={() => handleEditPizza(pizza)}
                              >
                                Edit
                              </p>
                            </Link>

                            <div className="btn">
                              <p
                                className="delete"
                                onClick={() => handleDeletePizza(pizza.idpizza)}
                              >
                                Delete
                              </p>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div>
                <h1>You Do Not Have Access To This Page</h1>
              </div>
            )}
          </div>
        );

      case "tables":
        return (
          <div className="app__bg">
            {auth && role === "admin" ? (
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
                          <Link
                            className="update-btn"
                            to={`/updateTable/${table.id}`}
                          >
                            <p
                              className="update"
                              style={{ marginBottom: "15px" }}
                              onClick={() => handleEditDrink(table)}
                            >
                              Edit
                            </p>
                          </Link>
                          <div className="btn">
                            <p
                              className="delete"
                              onClick={() => handleDeleteTable(table.id)}
                            >
                              Delete
                            </p>
                          </div>
                        </td>
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
      case "confirmations":
        return (
          <div className="app__bg">
            {auth && role === "admin" ? (
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
                      <th>Username</th>
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

                        <td>{confirmation.username}</td>
                        <td>
                          <button
                            onClick={() =>
                              handleDeleteReservation(
                                confirmation.idreservations
                              )
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
      {auth && role === "admin" ? (
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
                className={activeTab === "pizza" ? "active" : ""}
                onClick={() => handleTabChange("pizza")}
              >
                Pizza
              </li>
              <li
                className={activeTab === "drink" ? "active" : ""}
                onClick={() => handleTabChange("drinks")}
              >
                Drinks
              </li>
              <li
                className={activeTab === "tables" ? "active" : ""}
                onClick={() => handleTabChange("tables")}
              >
                Tables
              </li>
              <li
                className={activeTab === "booktime" ? "active" : ""}
                onClick={() => handleTabChange("booktime")}
              >
                Table Time
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
      ) : (
        <div>
          <h1>You Do Not Have Access To This Page</h1>
        </div>
      )}
    </div>
  );
};

export default Admin;
