const { createToken } = require('../../utils');
const jwtDecode = require('jwt-decode');

exports.loginUser = async (user, res) => {
	// const accessToken = generateAccessToken({ id: user._id });
	// const refreshToken = generateRefreshToken({ id: user._id });

	const token = createToken(user);

	const decodedToken = jwtDecode(token);
	const expiresAt = decodedToken.exp;

	res.cookie('token', token, {
		httpOnly: true,
		maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
	});

	const { password, ...rest } = user;
	const userInfo = Object.assign({}, { ...rest });

	res.status(200).json({
		msg: 'Login Success',
		userInfo,
		expiresAt,
	});
};
