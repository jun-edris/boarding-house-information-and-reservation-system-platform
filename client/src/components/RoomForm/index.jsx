import {
	Avatar,
	Box,
	Button,
	CircularProgress,
	Container,
	FormControl,
	FormHelperText,
	Grid,
	InputAdornment,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	styled,
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { FetchContext } from '../../context/FetchContext';
import useRefMounted from '../../hooks/useRefMounted';
import DoorFrontIcon from '@mui/icons-material/DoorFront';
import GroupsIcon from '@mui/icons-material/Groups';
import CloudUploadTwoToneIcon from '@mui/icons-material/CloudUploadTwoTone';
import { ToastContainer, toast } from 'react-toastify';

const ButtonUploadWrapper = styled(Box)(
	({ theme }) => `
	position: absolute;
	width: ${theme.spacing(6)};
	height: ${theme.spacing(6)};
	bottom: -${theme.spacing(1)};
	right: -${theme.spacing(1)};
  `
);

const RoomForm = ({ onClose, room, boardingHouseId }) => {
	const isMountedRef = useRefMounted();
	const fetchContext = useContext(FetchContext);

	const [selectedFile, setSelectedFile] = useState();
	const [preview, setPreview] = useState();
	const [image, setImage] = useState();

	useEffect(() => {
		if (!selectedFile) {
			setPreview(undefined);
			return;
		}

		const objectUrl = URL.createObjectURL(selectedFile);
		setPreview(objectUrl);

		// free memory when ever this component is unmounted
		return () => URL.revokeObjectURL(objectUrl);
	}, [selectedFile]);

	const onSelectFile = (e) => {
		if (!e.target.files || e.target.files.length === 0) {
			setSelectedFile(undefined);
			return;
		}

		if (e.target.files[0] === undefined) {
			console.log('Please add a Profile Picture');
			return;
		}
		const data = new FormData();
		data.append('file', e.target.files[0]);
		data.append('upload_preset', 'boardingHouse');
		data.append('cloud_name', process.env.REACT_APP_CLOUDINARY_NAME);
		fetch(
			`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`,
			{
				method: 'post',
				body: data,
			}
		)
			.then((res) => res.json())
			.then((data) => {
				setImage(data.url.toString());
			})
			.catch((err) => {
				console.log(err);
			});

		setSelectedFile(e.target.files[0]);
	};

	const insertRoomToBH = async (roomId) => {
		try {
			const { data } = await fetchContext.authAxios.patch(
				`/boardinghouse/room/${roomId}`
			);

			toast.success(data.msg);
			setTimeout(() => {
				fetchContext.setRefreshKey(fetchContext.refreshKey + 1);
				onClose(true);
			}, 1200);
		} catch (error) {
			toast.error(error.message);
		}
	};

	const updateRoom = async (sendData) => {
		try {
			const { data } = await fetchContext.authAxios.patch(
				`/room/${room._id}`,
				sendData
			);
			toast.success(data.msg);
		} catch (error) {
			toast.error(error.message);
		}
	};

	return (
		<>
			<Container maxWidth='xl'>
				<Formik
					initialValues={{
						roomType: room ? room.roomType : '',
						roomName: room ? room.roomName : '',
						description: room ? room.description : '',
						allowedTenants: room ? room.allowedTenants : '',
						prize: room ? room.prize : '',
						image: room ? room.image : '',
					}}
					validationSchema={Yup.object().shape({
						roomType: Yup.string()
							.oneOf(['private', 'bedspacer'], 'Invalid room type')
							.required('Please choose a room type'),
						roomName: Yup.string().required('The name of the room is required'),
						description: Yup.string().required(
							'The description of the room is required'
						),
						allowedTenants: Yup.string().required(
							'Please fill the how many tenants are allowed'
						),
						prize: Yup.string().required('Please fill the prize field'),
					})}
					onSubmit={async (
						values,
						{ setErrors, setStatus, setSubmitting, resetForm }
					) => {
						try {
							setSubmitting(true);

							const sendData = {
								...values,
								image: image ? image : room.image,
								boardingHouseId,
							};
							if (room) {
								updateRoom(sendData);
								if (isMountedRef.current) {
									setStatus({ success: true });
									setSubmitting(false);
								}
								fetchContext.setRefreshKey(fetchContext.refreshKey + 1);
								setTimeout(() => {
									onClose(true);
								}, 1200);
							} else {
								const { data } = await fetchContext.authAxios.post(
									`/room`,
									sendData
								);
								if (isMountedRef.current) {
									setStatus({ success: true });
									setSubmitting(false);
								}
								setPreview(null);
								toast.info(data.msg);
								insertRoomToBH(data.roomId);
								resetForm(true);
							}
						} catch (error) {
							toast.error(error.msg);
							if (isMountedRef.current) {
								setStatus({ success: false });
								setErrors({ submit: error.msg });
								setSubmitting(false);
							}
						}
					}}
				>
					{({
						errors,
						handleBlur,
						handleChange,
						handleSubmit,
						isSubmitting,
						touched,
						values,
					}) => (
						<form noValidate onSubmit={handleSubmit}>
							<Grid
								container
								spacing={2}
								alignItems='center'
								direction={{ xs: 'column-reverse', lg: 'row' }}
							>
								<Grid item xs={12} lg={8} xl={8}>
									<Grid container spacing={2}>
										<Grid item xs={12}>
											<FormControl fullWidth variant='filled'>
												<InputLabel id='roomType'>Room Type</InputLabel>
												<Select
													error={Boolean(touched.roomType && errors.roomType)}
													labelId='roomType'
													id='roomType'
													value={values.roomType}
													label='Room Type'
													onChange={handleChange}
													name='roomType'
												>
													<MenuItem value=''>&nbsp;</MenuItem>
													<MenuItem value='private'>Private</MenuItem>
													<MenuItem value='bedspacer'>Bedspacer</MenuItem>
												</Select>
											</FormControl>
											{Boolean(touched.roomType && errors.roomType) && (
												<FormHelperText error>{errors.roomType}</FormHelperText>
											)}
										</Grid>
										<Grid item xs={12}>
											<TextField
												error={Boolean(touched.roomName && errors.roomName)}
												fullWidth
												margin='dense'
												helperText={touched.roomName && errors.roomName}
												label={'Room Name'}
												name='roomName'
												onBlur={handleBlur}
												onChange={handleChange}
												value={values.roomName}
												variant='filled'
											/>
										</Grid>
										<Grid item xs={12} md={6}>
											<TextField
												error={Boolean(touched.prize && errors.prize)}
												fullWidth
												margin='dense'
												helperText={touched.prize && errors.prize}
												label={'Prize'}
												name='prize'
												onBlur={handleBlur}
												onChange={handleChange}
												type='number'
												value={values.prize}
												variant='filled'
												onKeyPress={(evt) => {
													['e', 'E', '+', '-', '.'].includes(evt.key) &&
														evt.preventDefault();
												}}
												onInput={(e) => {
													e.target.value = Math.max(0, parseInt(e.target.value))
														.toString()
														.slice(0, 10);
												}}
												onWheel={(e) => e.target.blur()}
												InputProps={{
													startAdornment: (
														<InputAdornment position='start'>₱</InputAdornment>
													),
												}}
											/>
										</Grid>
										<Grid item xs={12} md={6}>
											<TextField
												error={Boolean(
													touched.allowedTenants && errors.allowedTenants
												)}
												fullWidth
												margin='dense'
												helperText={
													touched.allowedTenants && errors.allowedTenants
												}
												label={'Number of allowed Tenants'}
												name='allowedTenants'
												onBlur={handleBlur}
												onChange={handleChange}
												type='number'
												value={values.allowedTenants}
												variant='filled'
												onKeyPress={(evt) => {
													['e', 'E', '+', '-', '.'].includes(evt.key) &&
														evt.preventDefault();
												}}
												onInput={(e) => {
													e.target.value = Math.max(0, parseInt(e.target.value))
														.toString()
														.slice(0, 10);
												}}
												onWheel={(e) => e.target.blur()}
												InputProps={{
													startAdornment: (
														<InputAdornment position='start'>
															<GroupsIcon />
														</InputAdornment>
													),
												}}
											/>
										</Grid>
										<Grid item xs={12}>
											<TextField
												error={Boolean(
													touched.description && errors.description
												)}
												fullWidth
												margin='dense'
												helperText={touched.description && errors.description}
												label={'Room Description'}
												name='description'
												onBlur={handleBlur}
												onChange={handleChange}
												value={values.description}
												variant='filled'
												multiline
												minRows={10}
											/>
										</Grid>
									</Grid>
								</Grid>

								<Grid item xs={12} lg={4} justifyContent='center'>
									<Box
										display='flex'
										alignItems='center'
										justifyContent='center'
										flexDirection='column'
									>
										<Box sx={{ position: 'relative' }}>
											{room && preview === undefined && (
												<Avatar
													variant='rounded'
													sx={{ width: 150, height: 150, borderRadius: 5 }}
												>
													<img
														src={room?.image}
														alt='To upload'
														width='150'
														height='150'
														aspectRatio={1 / 1}
													/>
												</Avatar>
											)}
											{!room && (
												<Avatar
													variant='rounded'
													sx={{ width: 150, height: 150, borderRadius: 5 }}
												>
													{preview ? (
														<img
															src={preview}
															alt='To upload'
															width='150'
															height='150'
															aspectRatio={1 / 1}
														/>
													) : (
														<DoorFrontIcon sx={{ width: 125, height: 125 }} />
													)}
												</Avatar>
											)}
											<ButtonUploadWrapper>
												<input
													style={{ display: 'none' }}
													type='file'
													id='image'
													name='image'
													accept='image/*'
													onChange={(e) => {
														handleChange(e);
														onSelectFile(e);
													}}
												/>
												<label htmlFor='image'>
													<Button
														variant='contained'
														sx={{ borderRadius: '100%', py: 2.1 }}
														component='span'
													>
														<CloudUploadTwoToneIcon sx={{ fontSize: 28 }} />
													</Button>
												</label>
											</ButtonUploadWrapper>
										</Box>
									</Box>
								</Grid>
							</Grid>
							<Button
								sx={{
									mt: 3,
								}}
								color='primary'
								startIcon={
									isSubmitting ? <CircularProgress size='1rem' /> : null
								}
								disabled={isSubmitting}
								type='submit'
								fullWidth
								size='large'
								variant='contained'
							>
								{room ? 'Update Room' : 'Add Room'}
							</Button>
						</form>
					)}
				</Formik>
			</Container>
			<ToastContainer theme='colored' />
		</>
	);
};

export default RoomForm;
