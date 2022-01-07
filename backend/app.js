const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

//this line is required to parse the request body
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  return res.send('Api working');
});

/* Create - POST method */
app.post('/user/add', (req, res) => {
  console.log(req.body);
  //get the existing user data
  const existUsers = getUserData();

  //get the new user data from post request
  const userData = req.body;

  //check if the userData fields are missing
  if (userData.name == null || userData.email == null || userData.age == null) {
    return res.status(401).send({ error: true, msg: 'User data missing' });
  }

  //check if the username exist already
  const findExist = existUsers.find((user) => user.email === userData.email);
  if (findExist) {
    return res.status(409).send({
      error: true,
      msg: `User already exist with this email! `,
    });
  }

  //append the user data
  existUsers.push(userData);

  //save the new user data
  saveUserData(existUsers);
  res.send({ success: true, msg: 'User data added successfully' });
});

/* Read - GET method */
app.get('/user/list', (req, res) => {
  const users = getUserData();
  res.send(users);
});

/* Update - Patch method */
app.patch('/user/update/:email', (req, res) => {
  //get the username from url
  const email = req.params.email;

  //get the update data
  const userData = req.body;

  //get the existing user data
  const existUsers = getUserData();

  //check if the username exist or not
  const findExist = existUsers.find((user) => user.email === email);

  if (!findExist) {
    return res.status(409).send({ error: true, msg: 'email not exist' });
  }

  //filter the userdata
  const updateUser = existUsers.filter((user) => user.email !== email);

  //push the updated data
  updateUser.push(userData);

  //finally save it
  saveUserData(updateUser);

  res.send({ success: true, msg: 'User data updated successfully' });
});

/* Delete - Delete method */
app.delete('/user/delete/:email', (req, res) => {
  const email = req.params.email;

  //get the existing userdata
  const existUsers = getUserData();

  //filter the userdata to remove it
  const filterUser = existUsers.filter((user) => user.email !== email);

  if (existUsers.length === filterUser.length) {
    return res.status(409).send({ error: true, msg: 'email does not exist' });
  }

  //save the filtered data
  saveUserData(filterUser);

  res.send({ success: true, msg: 'User removed successfully' });
});

/* util functions */

//read the user data from json file
const saveUserData = (data) => {
  const stringifyData = JSON.stringify(data);
  fs.writeFileSync('users.json', stringifyData);
};

//get the user data from json file
const getUserData = () => {
  const jsonData = fs.readFileSync('users.json');
  return JSON.parse(jsonData);
};

/* util functions ends */

//configure the server port
app.listen(8080, () => {
  console.log('Server runs on port 8080');
});
