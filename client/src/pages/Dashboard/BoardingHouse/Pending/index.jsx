import {
	Box,
	Button,
	CircularProgress,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { FetchContext } from '../../../../context/FetchContext';
import AddTaskIcon from '@mui/icons-material/AddTask';
import { ToastContainer, toast } from 'react-toastify';

export const BHDetails = [
	{ id: 'name', label: 'House Name' },
	{ id: 'description', label: 'Description' },
	{ id: 'owner', label: 'Owner' },
	{ id: 'action', label: 'Action' },
];
const PendingHouse = () => {
	const fetchContext = useContext(FetchContext);
	const [bHouses, setBHouses] = useState([]);
	const [loading, setLoading] = useState(false);

	const getPendingBH = async () => {
		fetchContext.authAxios
			.get(`/admin/boardinghouse/not/approved`)
			.then(({ data }) => {
				setBHouses(data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const approveBH = async (id) => {
		setLoading(true);
		try {
			const data = { id };
			await fetchContext.authAxios.patch(`/admin/boardinghouse`, data);
			setLoading(false);
			toast.success('Boarding House approved!');
			fetchContext.setRefreshKey(1);
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};

	useEffect(() => {
		const controller = new AbortController();
		getPendingBH();

		return () => controller.abort();
	}, [fetchContext.refreshKey]);

	return (
		<>
			<Box>
				<Typography variant='h4'>List of All Pending Boarding House</Typography>

				<TableContainer component={Paper} sx={{ mt: 3 }}>
					<Table>
						<TableHead>
							<TableRow>
								{BHDetails.map((req, index) => (
									<TableCell key={index}>{req.label}</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{bHouses?.map((house, index) => {
								return (
									<TableRow key={index}>
										<TableCell>{house?.houseName}</TableCell>
										<TableCell sx={{ overflowWrap: 'break-word' }}>
											<Typography component='pre'>
												{house?.description}
											</Typography>
										</TableCell>
										<TableCell>
											{house?.owner.firstName} {house?.owner.lastName}
										</TableCell>

										<TableCell>
											<Button
												variant='contained'
												color='success'
												disabled={loading === true}
												startIcon={
													loading === true ? (
														<CircularProgress size={20} color='primary' />
													) : (
														<AddTaskIcon />
													)
												}
												onClick={() => {
													approveBH(house?._id);
												}}
											>
												Approve
											</Button>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
			<ToastContainer theme='colored' />
		</>
	);
};

export default PendingHouse;
