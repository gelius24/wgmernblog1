const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HttpError = require("../models/errorModel");
const User = require("../models/userModel");
const { v4: uuid } = require("uuid");
// const { randomUUID } = require("crypto");

// POST : api/users/register
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, password2 } = req.body;
    if (!name || !email || !password)
      return next(new HttpError("Fill all fields", 422));

    const newMail = email.toLowerCase();
    const mailExists = await User.findOne({ email: newMail });

    if (mailExists) return next(new HttpError("This email already exist", 422));

    if (password.trim().length < 6)
      return next(
        new HttpError("The password need to be at least 6 chars", 422)
      );

    if (password !== password2)
      next(new HttpError("Passwords doesn't match", 422));

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email: newMail,
      password: hashedPass,
    });
    res.status(200).json(`${newUser.email} has registered`);
  } catch (error) {
    return next(new HttpError(`User registration failed: ${error}`, 422));
  }
};

// POST : api/users/login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return next(new HttpError("Fill all fields", 422));

    const newEmail = email.toLowerCase();

    const user = await User.findOne({ email: newEmail });

    if (!user) {
      return next(new HttpError(`Email not found`, 422));
    }

    const comparePass = await bcrypt.compare(password, user.password);
    if (!comparePass) return next(new HttpError(`Invalid password`, 422));

    const { _id: id, name } = user;
    const token = jwt.sign({ id, name }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).json({ token, id, name });
  } catch (error) {
    return new HttpError(`Login failed check your crendentials: ${error}`, 422);
  }
};

// GET : api/users/:id
// protected
const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) return next(new HttpError("No user found.", 404));
    res.status(200).json(user);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// POST : api/users/change-avatar
// protected
const changeAvatar = async (req, res, next) => {
  try {
    if (!req.files.avatar) return next(new HttpError("Choose an image", 422));

    const user = await User.findById(req.user.id);

    if (user.avatar) {
      fs.unlink(path.join(__dirname, "..", "uploads", user.avatar), (err) =>
        next(new HttpError(err))
      );
    }

    const { avatar } = req.files;
    if (avatar.size > 500000)
      return next(
        new HttpError("size of file need to be less than 500kb"),
        422
      );

    let fileName = avatar.name;
    let splittedFileName = fileName.split(".");
    let newFileName =
      splittedFileName[0] +
      uuid() +
      "." +
      splittedFileName[splittedFileName.length - 1];
    avatar.mv(
      path.join(__dirname, "..", "uploads", newFileName),
      async (err) => {
        if (err) return next(new HttpError(err));

        const updatedAvatar = await User.findByIdAndUpdate(
          req.user.id,
          { avatar: newFileName },
          { new: true }
        );
        if (!updatedAvatar)
          return next(new HttpError("couldn't change avatar"), 422);
        res.status(200).json(updatedAvatar);
      }
    );
  } catch (error) {
    return next(new HttpError(error));
  }
};

// POST : api/users/edit-user
// protected
const editUser = async (req, res, next) => {
  try {
    const { name, email, currentPassword, newPassword, confirmNewPassword } = req.body;
    if (!name || !email || !currentPassword || !newPassword || !confirmNewPassword) {
      return next(new HttpError("Fill all fields", 422));
    }

    const user = await User.findById(req.user.id);
    if (!user) return next(new HttpError("User not found", 403));

    const emailExist = await User.findOne({ email });
    if (emailExist && emailExist._id !== req.user.id)
      return next(
        new HttpError(
          "You can't choose this email somebody aleready use it !",
          422
        )
      );

    const validateUserPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!validateUserPassword)
      return next(new HttpError("Invalid current password", 422));

    if (newPassword !== confirmNewPassword)
      return next(new HttpError("New passwords don't match.", 422));

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newMdp, salt);

    const newInfo = await User.findByIdAndUpdate(req.user.id, {name, email, password: hash}, {new: true});
    res.status(200).json(newInfo)
  } catch (error) {
    return next(new HttpError(error));
  }
};


const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    return next(new HttpError(error));
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  changeAvatar,
  editUser,
  getUsers,
};
