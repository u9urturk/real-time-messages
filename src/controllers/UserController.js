// controllers/UserController.js
const User = require('../models/User');

class UserController {
  constructor() {
    this.users = [];
  }

  createUser(username) {
    const user = new User(username);
    this.users.push(user);
    return user;
  }

  getUsers() {
    return this.users;
  }
}

module.exports = UserController;