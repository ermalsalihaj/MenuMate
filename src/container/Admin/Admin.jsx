import "./Admin.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [editedUser, setEditedUser] = useState({});
  const [deletedUserId, setDeletedUserId] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3001/users").then((response) => {
      setUsers(response.data);
    });
  }, []);

  const handleEdit = (user) => {
    setEditedUser(user);
  };

  const handleSave = () => {
    const { password, ...editedUserData } = editedUser;
    axios
      .put(`http://localhost:3001/update?id=${editedUser.id}`, {
        email: editedUser.email,
        username: editedUser.username,
      })
      .then((response) => {
        console.log(response.data);
        //update the users list with the edited user
        setUsers(
          users.map((user) => (user.id === editedUser.id ? editedUser : user))
        );
        //reset edited user
        setEditedUser({});
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDelete = (id) => {
    setDeletedUserId(id);
  };

  const handleConfirmDelete = () => {
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
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
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
                    editedUser.id === user.id ? editedUser.email : user.email
                  }
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, email: e.target.value })
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
                    setEditedUser({ ...editedUser, username: e.target.value })
                  }
                />
              </td><td>{user.role}</td>
              <td>
                {editedUser.id === user.id ? (
                  <>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => setEditedUser({})} style={{background:'red'}}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(user)}>Edit</button>
                    <button onClick={() => handleDelete(user.id)}style={{background:'red'}}>
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
        <div>
          <p>Are you sure you want to delete this user?</p>
          <button onClick={handleConfirmDelete}>Yes</button>
          <button onClick={() => setDeletedUserId(null)}style={{background:'red'}}>No</button>
        </div>
      )}
    </div>
  );
};

export default Admin;