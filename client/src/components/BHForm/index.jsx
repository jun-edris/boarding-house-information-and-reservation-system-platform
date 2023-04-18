import {
	Avatar,
	Box,
	Button,
	CircularProgress,
	Container,
	Grid,
	InputAdornment,
	TextField,
	styled,
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { FetchContext } from '../../context/FetchContext';
import useRefMounted from '../../hooks/useRefMounted';
import HomeIcon from '@mui/icons-material/Home';
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

const BHForm = ({ onClose, house }) => {
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

	const updateBH = async (sendData) => {
		try {
			const { data } = await fetchContext.authAxios.patch(
				`/boardinghouse/${house._id}`,
				sendData
			);

			toast.success(data.msg);
		} catch (error) {
			toast.error(error.message);
		}
	};

	return (
		<>
			<Formik
				initialValues={{
					houseName: house ? house.houseName : '',
					description: house ? house.description : '',
					landmark: house ? house.landmark : '',
					image: house ? house.image : '',
				}}
				validationSchema={Yup.object().shape({
					houseName: Yup.string()
						.max(255)
						.required('The house name field is required'),
					landmark: Yup.string()
						.max(255)
						.required('The landmark field is required'),
					description: Yup.string().required(
						'The description field is required'
					),
				})}
				onSubmit={async (
					values,
					{ setErrors, setStatus, setSubmitting, resetForm }
				) => {
					try {
						setSubmitting(true);

						const sendData = {
							...values,
							image,
						};
						if (house) {
							updateBH(sendData);

							if (isMountedRef.current) {
								setStatus({ success: true });
								setSubmitting(false);
							}

							setTimeout(() => {
								setPreview(null);
								fetchContext.setRefreshKey(fetchContext.refreshKey + 1);
								onClose(true);
							}, 900);
						}

						if (!house) {
							const { data } = await fetchContext.authAxios.post(
								`/boardinghouse`,
								sendData
							);
							if (isMountedRef.current) {
								setStatus({ success: true });
								setSubmitting(false);
							}

							toast.success(data.msg);
							setTimeout(() => {
								setPreview(null);
								fetchContext.setRefreshKey(fetchContext.refreshKey + 1);
								resetForm(true);
								onClose(true);
							}, 900);
						}
					} catch (error) {
						toast.error(error.message);
						if (isMountedRef.current) {
							setStatus({ success: false });
							setErrors({ submit: error.message });
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
										<TextField
											error={Boolean(touched.houseName && errors.houseName)}
											fullWidth
											margin='dense'
											helperText={touched.houseName && errors.houseName}
											label={'Boarding House Name'}
											name='houseName'
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.houseName}
											variant='filled'
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											error={Boolean(touched.landmark && errors.landmark)}
											fullWidth
											margin='dense'
											helperText={touched.landmark && errors.landmark}
											label={'Landmark'}
											name='landmark'
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.landmark}
											variant='filled'
											multiline
											minRows={3}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											error={Boolean(touched.description && errors.description)}
											fullWidth
											margin='dense'
											helperText={touched.description && errors.description}
											label={'Property Description'}
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
										{house && preview === undefined && (
											<Avatar
												variant='rounded'
												sx={{ width: 150, height: 150, borderRadius: 5 }}
											>
												<img
													src={house?.image}
													alt='To upload'
													width='150'
													height='150'
													aspectRatio={1 / 1}
												/>
											</Avatar>
										)}
										{!house && (
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
													<HomeIcon sx={{ width: 125, height: 125 }} />
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
							startIcon={isSubmitting ? <CircularProgress size='1rem' /> : null}
							disabled={isSubmitting}
							type='submit'
							fullWidth
							size='large'
							variant='contained'
						>
							{house ? 'Update your house' : 'Create your house'}
						</Button>
					</form>
				)}
			</Formik>
			<ToastContainer theme='colored' />
		</>
	);
};

export default BHForm;
