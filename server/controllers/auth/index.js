const bcrypt = require('bcrypt');
const Users = require('./../../models/user');
const { validateEmail, validatePhone } = require('../../utils/index');
const { loginUser } = require('./service');

const authCtrl = {
  register: async (req, res) => {
    try {
      const {
        firstName,
        middleName,
        lastName,
        email,
        contact,
        region,
        province,
        city,
        barangay,
        password,
        role,
        image,
      } = req.body;

      const existingUser = await Users.findOne({
        email: email.toLowerCase(),
        contact,
      });

      if (existingUser)
        return res.status(400).json({ msg: 'User already registered' });

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = new Users({
        firstName,
        middleName,
        lastName,
        email: email.toLowerCase(),
        contact,
        password: passwordHash,
        region,
        province,
        city,
        barangay,
        image,
        role,
      });

      await newUser.save();

      res.status(201).json({ msg: 'Successfully Registered!' });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: error.message });
    }
  },
  udpateUser: async () => {
    try {
      const {
        firstName,
        middleName,
        lastName,
        email,
        contact,
        region,
        province,
        city,
        barangay,
        password,
        role,
        image,
      } = req.body;
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { account, password } = req.body;

      const convertedPhone =
        account.charAt(0) === '0'
          ? account.slice(1)
          : account.substring(0, 3) === '+63'
          ? account.slice(3)
          : account;

      if (!validateEmail(account) && !validatePhone(convertedPhone)) {
        return res.status(400).json({ msg: 'Invalid Phone or Email!' });
      }

      const user = await Users.findOne({
        $or: [{ email: account }, { contact: account }],
      })
        .select('+password')
        .lean();

      if (!user) return res.status(400).json({ msg: 'No account found!' });

      const isMatchPassWord = await bcrypt.compare(password, user.password);
      if (!isMatchPassWord)
        return res.status(400).json({ msg: 'Wrong Credentials/Password' });

      loginUser(user, res);
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: error.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie('token', {
        httpOnly: true,
      });

      return res.status(200).json({ msg: 'Logged Out' });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },
};

module.exports = authCtrl;
