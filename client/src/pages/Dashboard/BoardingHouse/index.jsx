import { useContext, useEffect, useState } from 'react';
import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Chip,
	CircularProgress,
	Grid,
	Paper,
	Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { AuthContext } from '../../../context/AuthContext';
import { FetchContext } from '../../../context/FetchContext';
import DialogContainer from '../../../components/common/DialogContainer';
import BHForm from '../../../components/BHForm';
import RoomForm from '../../../components/RoomForm';
import { ToastContainer, toast } from 'react-toastify';

const BoardingHouse = () => {
	const authContext = useContext(AuthContext);
	const fetchContext = useContext(FetchContext);
	const [boardingHouse, setBoardingHouse] = useState({} || null);
	const [selectedMenu, setSelectedMenu] = useState('');
	const [openPopup, setOpenPopup] = useState(false);
	const [openRoomPopup, setRoomPopup] = useState(false);
	const [openDeletePopup, setOpenDeletePopup] = useState(false);
	const [newRoom, setNewRoom] = useState(false);
	const [loading, setLoading] = useState(false);
	const [room, setRoom] = useState({} || null);
	const [roomToDelete, setToDelete] = useState('');

	const handleModalClose = () => {
		setOpenPopup(false);
		setRoomPopup(false);
		setOpenDeletePopup(false);
	};

	const getUserHouse = async () => {
		fetchContext.authAxios
			.get(`/boardinghouse`)
			.then(({ data }) => {
				setBoardingHouse(data.boardingHouse);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const removeRoomToBH = async (id) => {
		try {
			await fetchContext.authAxios.patch(`/boardingHouse/remove-room/${id}`);
		} catch (error) {
			console.log(error);
		}
	};

	const deleteRoom = async (id, handleModalClose) => {
		try {
			const data = await fetchContext.authAxios.delete(`/boardinghouse/room/${id}`);

			if (data.response.status === 400) {
				toast.error(data.response.data.msg);
			}

			if (data.response.status === 200) {
				toast.success(data.data.msg);
			}

			setTimeout(() => {
				fetchContext.setRefreshKey(fetchContext.refreshKey + 1);
				handleModalClose();
			}, 1200);
		} catch (error) {
			console.log(error);
			toast.error(error.msg);
		}
	};

	useEffect(() => {
		const controller = new AbortController();
		getUserHouse();

		return () => controller.abort();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetchContext.refreshKey]);

	return (
		<>
			<Grid container justifyContent='flex-end' alignItems='center' spacing={2}>
				<Grid item>
					{boardingHouse === null || Object.keys(authContext.authState.userInfo).length === 0 ? (
						<Button
							variant='contained'
							startIcon={<AddCircleOutlineIcon />}
							onClick={() => {
								setOpenPopup(true);
								setSelectedMenu('Add Listing');
							}}
						>
							Add Listing
						</Button>
					) : (
						<Box>
							{boardingHouse && boardingHouse?.approved && (
								<Grid container spacing={2}>
									<Grid item>
										<Button
											variant='contained'
											startIcon={<AddCircleOutlineIcon />}
											onClick={() => {
												setRoomPopup(true);
												setNewRoom(true);
												setSelectedMenu('Add Room');
											}}
										>
											Add Rooms
										</Button>
									</Grid>
									<Grid item>
										<Button
											variant='contained'
											startIcon={<EditIcon />}
											onClick={() => {
												setOpenPopup(true);
												setSelectedMenu('Update Boarding House');
											}}
										>
											Update Boarding House
										</Button>
									</Grid>
								</Grid>
							)}
						</Box>
					)}
				</Grid>
			</Grid>
			{boardingHouse ? (
				<Grid container spacing={2} sx={{ mt: 2 }}>
					<Grid item xs={12} lg={3}>
						<Paper variant='outlined' sx={{ py: 4, px: 2 }}>
							<img src={boardingHouse?.image} alt={boardingHouse?.houseName} width='100%' />
						</Paper>
					</Grid>
					<Grid item xs={12} lg={9}>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}
						>
							<Typography variant='h3' component='p' sx={{ fontWeight: 'bold' }}>
								{boardingHouse?.houseName}
							</Typography>
							<Chip
								label={boardingHouse?.approved ? 'Approved' : 'Waiting for Approval'}
								color={boardingHouse?.approved ? 'success' : 'warning'}
							/>
						</Box>

						<Typography component='pre' sx={{ mt: 3 }}>
							{boardingHouse?.description}
						</Typography>
					</Grid>

					{boardingHouse?.rooms?.length === 0 ? (
						<Grid item xs={12} mt={3}>
							<Typography>No rooms added yet.</Typography>
						</Grid>
					) : (
						<Grid item xs={12} mt={3}>
							<Typography variant='h5' component='p'>
								Rooms
							</Typography>
							<Grid container spacing={2} mt={1} alignItems='stretch'>
								{boardingHouse?.rooms?.map((room, index) => {
									return (
										<Grid item xs={12} md={3} lg={3} key={index}>
											<Card
												sx={{
													height: '100%',
												}}
											>
												<CardMedia sx={{ height: 200 }} image={room.image} title={room.type} />
												<CardContent>
													<Box mb={2}>
														<Typography gutterBottom variant='h6' component='h6' sx={{ textTransform: 'capitalize' }}>
															{room.roomName}
														</Typography>
														<Typography
															gutterBottom
															variant='body2'
															component='span'
															sx={{ textTransform: 'capitalize' }}
														>
															{room.roomType}
														</Typography>
													</Box>

													<Typography
														variant='body1'
														component='pre'
														sx={{
															whiteSpace: 'pre-wrap',
															textOverflow: 'ellipsis',
														}}
													>
														{room.description}
													</Typography>
													<Box mt={2}>
														<Typography
															variant='body2'
															color='text.secondary'
															component='span'
															sx={{ display: 'block' }}
														>
															Allowed Tenants: {room.allowedTenants}
														</Typography>
														<Typography variant='body2' color='text.secondary' component='span'>
															Price: ₱{room.prize}
														</Typography>
													</Box>
												</CardContent>
												<CardActions sx={{ verticalAlign: 'end' }}>
													<Button
														variant='contained'
														startIcon={<EditIcon />}
														onClick={() => {
															setRoomPopup(true);
															setRoom(room);
															setNewRoom(false);
															setSelectedMenu('Update Room');
														}}
													>
														Update Room
													</Button>
													<Button
														variant='outlined'
														color='error'
														startIcon={<DeleteIcon />}
														onClick={() => {
															setOpenDeletePopup(true);
															setToDelete(room?._id);
															setSelectedMenu('Delete Room');
														}}
													>
														Delete Room
													</Button>
												</CardActions>
											</Card>
										</Grid>
									);
								})}
							</Grid>
						</Grid>
					)}
				</Grid>
			) : (
				<>
					<Typography sx={{ mt: 3 }}>Nothing to display yet...</Typography>
				</>
			)}

			<DialogContainer title={selectedMenu} open={openPopup} onClose={handleModalClose}>
				<BHForm onClose={handleModalClose} house={boardingHouse} />
			</DialogContainer>
			<DialogContainer title={selectedMenu} open={openRoomPopup} onClose={handleModalClose}>
				<RoomForm onClose={handleModalClose} room={!newRoom && room} boardingHouseId={boardingHouse?._id} />
			</DialogContainer>
			<DialogContainer title={selectedMenu} open={openDeletePopup} onClose={handleModalClose}>
				<Box pb={4}>
					<Typography>Are you sure you're going to delete this room?</Typography>
				</Box>

				<Box style={{ display: 'flex', gap: 10 }}>
					<Button disabled={loading} onClick={handleModalClose} variant='outlined'>
						Cancel
					</Button>
					<Button
						disabled={loading}
						startIcon={loading && <CircularProgress />}
						onClick={() => {
							setLoading(true);
							deleteRoom(roomToDelete, handleModalClose);
							removeRoomToBH(roomToDelete);
							setLoading(false);
						}}
						variant='contained'
						color='error'
					>
						Delete
					</Button>
				</Box>
			</DialogContainer>
			<ToastContainer theme='colored' />
		</>
	);
};

export default BoardingHouse;
