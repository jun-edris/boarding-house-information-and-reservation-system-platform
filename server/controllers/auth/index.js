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
        parent,
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

      if (existingUser) {
        return res.status(400).json({ msg: 'User already registered' });
      } else {
        const passwordHash = await bcrypt.hash(password, 12);

        const newUser = new Users({
          firstName,
          middleName,
          lastName,
          email: email.toLowerCase(),
          contact,
          parent,
          password: passwordHash,
          region,
          province,
          city,
          barangay,
          image,
          role,
        });

        await newUser.save();

        return res.status(201).json({ msg: 'Successfully Registered!' });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: error.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      const {
        firstName,
        middleName,
        lastName,
        email,
        contact,
        parent,
        region,
        province,
        city,
        barangay,
        role,
        image,
      } = req.body;

      const updatedUser = await Users.findByIdAndUpdate(
        req.params.id,
        {
          firstName,
          middleName,
          lastName,
          email,
          contact,
          parent,
          region,
          province,
          city,
          barangay,
          role,
          image,
        },
        {
          new: true,
          select:
            'firstName middleName lastName email contact parent region province city barangay role active noBH reviewed status image',
        }
      );
      console.log(updatedUser);
      res.status(200).send({
        message: 'A user is successfully updated!',
        updatedUser,
      });
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
  changePassword: async (req, res) => {
    try {
      const { email, password, confirmPass } = req.body;

      if (password !== confirmPass) {
        return res.status(400).json({ msg: 'Password does not match!' });
      }

      const existingEmail = Users.findOne({ email: email });

      if (!existingEmail) {
        return res.status(400).json({ msg: 'Email does not exist!' });
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const changedPass = await Users.findOneAndUpdate(
        { email },
        {
          password: passwordHash,
        }
      );

      if (!changedPass) {
        return res.status(400).json({ msg: 'Password not changed!' });
      }

      return res
        .status(200)
        .json({ success: true, msg: 'Password change success' });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: error.message });
    }
  },
};

module.exports = authCtrl;
