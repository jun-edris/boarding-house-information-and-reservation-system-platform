import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormHelperText,
  Grid,
  Stack,
  TextField,
  Typography,
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
import axios from 'axios';

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
  const [fileUrls, setFileUrls] = useState([]);
  const [preview, setPreview] = useState();
  const [image, setImage] = useState();
  const [fileNames, setFileNames] = useState({
    nbi: '',
    accreBIR: '',
    bp: '',
    fireCert: '',
    mp: '',
    certReg: '',
    sp: '',
  });

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

  const handleFileUpload = async (event, setFieldValue, fieldName) => {
    const file = event.target.files[0];

    const formData = new FormData();

    const fileType = file.type.split('/')[1];

    if (['pdf', 'docx', 'jpg', 'jpeg', 'png'].includes(fileType)) {
      formData.append('file', file);
      formData.append('upload_preset', 'boardingHouse');
      formData.append('folder', 'Certificates');

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/auto/upload`,
          formData
        );

        setFileUrls((prevFileUrls) => [
          ...prevFileUrls,
          response.data.secure_url,
        ]);
        setFileNames((prevFileNames) => ({
          ...prevFileNames,
          [fieldName]: file.name,
        }));
        setFieldValue(fieldName, file);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log(`File type ${fileType} not accepted.`);
    }
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
          nbi: house ? house.nbi : null,
          accreBIR: house ? house.accreBIR : null,
          bp: house ? house.bp : null,
          fireCert: house ? house.fireCert : null,
          mp: house ? house.mp : null,
          certReg: house ? house.certReg : null,
          sp: house ? house.sp : null,
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
          nbi: Yup.mixed().required('Required'),
          accreBIR: Yup.mixed().required('Required'),
          bp: Yup.mixed().required('Required'),
          fireCert: Yup.mixed().required('Required'),
          mp: Yup.mixed().required('Required'),
          certReg: Yup.mixed().required('Required'),
          sp: Yup.mixed().required('Required'),
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
              nbi: fileUrls[0],
              accreBIR: fileUrls[1],
              bp: fileUrls[2],
              fireCert: fileUrls[3],
              mp: fileUrls[4],
              certReg: fileUrls[5],
              sp: fileUrls[6],
            };

            if (house) {
              const updateData = {
                ...values,
                image,
                nbi: house.nbi,
                accreBIR: house.accreBIR,
                bp: house.bp,
                fireCert: house.fireCert,
                mp: house.mp,
                certReg: house.certReg,
                sp: house.sp,
              };
              updateBH(updateData);

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
          setFieldValue,
        }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              direction={{ xs: 'column-reverse', lg: 'row' }}
            >
              <Grid item xs={12} lg={8} xl={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      error={Boolean(touched.houseName && errors.houseName)}
                      fullWidth
                      margin="dense"
                      helperText={touched.houseName && errors.houseName}
                      label={'Boarding House Name'}
                      name="houseName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.houseName}
                      variant="filled"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      error={Boolean(touched.landmark && errors.landmark)}
                      fullWidth
                      margin="dense"
                      helperText={touched.landmark && errors.landmark}
                      label={'Landmark'}
                      name="landmark"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.landmark}
                      variant="filled"
                      multiline
                      minRows={3}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      error={Boolean(touched.description && errors.description)}
                      fullWidth
                      margin="dense"
                      helperText={touched.description && errors.description}
                      label={'Property Description'}
                      name="description"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.description}
                      variant="filled"
                      multiline
                      minRows={10}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} lg={4} justifyContent="center">
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                >
                  <Box sx={{ position: 'relative' }}>
                    {house && preview === undefined && (
                      <Avatar
                        variant="rounded"
                        sx={{ width: 150, height: 150, borderRadius: 5 }}
                      >
                        <img
                          src={house?.image}
                          alt="To upload"
                          width="150"
                          height="150"
                          aspectRatio={1 / 1}
                        />
                      </Avatar>
                    )}
                    {!house && (
                      <Avatar
                        variant="rounded"
                        sx={{ width: 150, height: 150, borderRadius: 5 }}
                      >
                        {preview ? (
                          <img
                            src={preview}
                            alt="To upload"
                            width="150"
                            height="150"
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
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={(e) => {
                          handleChange(e);
                          onSelectFile(e);
                        }}
                      />
                      <label htmlFor="image">
                        <Button
                          variant="contained"
                          sx={{ borderRadius: '100%', py: 2.1 }}
                          component="span"
                        >
                          <CloudUploadTwoToneIcon sx={{ fontSize: 28 }} />
                        </Button>
                      </label>
                    </ButtonUploadWrapper>
                  </Box>
                </Box>
              </Grid>
            </Grid>
            <Box mt={10} mb={5}>
              <Typography variant="h6" component="h2" gutterBottom mb={5}>
                Files
              </Typography>
              <Stack
                spacing={2}
                direction="row"
                useFlexGap
                flexWrap="wrap"
                justifyContent="center"
              >
                {!house && !house?.nbi && (
                  <Box>
                    <input
                      id="nbi"
                      type="file"
                      name="nbi"
                      onChange={(e) =>
                        handleFileUpload(e, setFieldValue, 'nbi')
                      }
                      style={{ display: 'none' }}
                      accept=".pdf,.docx,.jpg,.jpeg,.png, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      required
                    />
                    <label htmlFor="nbi">
                      <Button variant="contained" component="span">
                        {fileNames.nbi || 'Upload NBI Clearance'}
                      </Button>
                    </label>
                    {Boolean(touched.nbi && errors.nbi) && (
                      <FormHelperText error>{errors.nbi}</FormHelperText>
                    )}
                  </Box>
                )}
                {!house && !house?.nbi && (
                  <Box>
                    <input
                      id="accreBIR"
                      type="file"
                      name="accreBIR"
                      onChange={(e) =>
                        handleFileUpload(e, setFieldValue, 'accreBIR')
                      }
                      style={{ display: 'none' }}
                      accept=".pdf,.docx,.jpg,.jpeg,.png, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      required
                    />
                    <label htmlFor="accreBIR">
                      <Button variant="contained" component="span">
                        {fileNames.accreBIR ||
                          'Upload License Accreditation from BIR'}
                      </Button>
                    </label>
                    {Boolean(touched.accreBIR && errors.accreBIR) && (
                      <FormHelperText error>{errors.accreBIR}</FormHelperText>
                    )}
                  </Box>
                )}
                {!house && !house?.nbi && (
                  <Box>
                    <input
                      id="bp"
                      type="file"
                      name="bp"
                      onChange={(e) => handleFileUpload(e, setFieldValue, 'bp')}
                      style={{ display: 'none' }}
                      accept=".pdf,.docx,.jpg,.jpeg,.png, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      required
                    />
                    <label htmlFor="bp">
                      <Button variant="contained" component="span">
                        {fileNames.bp || 'Upload Business Permit'}
                      </Button>
                    </label>
                    {Boolean(touched.bp && errors.bp) && (
                      <FormHelperText error>{errors.bp}</FormHelperText>
                    )}
                  </Box>
                )}
                {!house && !house?.nbi && (
                  <Box>
                    <input
                      id="fireCert"
                      type="file"
                      name="fireCert"
                      onChange={(e) =>
                        handleFileUpload(e, setFieldValue, 'fireCert')
                      }
                      style={{ display: 'none' }}
                      accept=".pdf,.docx,.jpg,.jpeg,.png, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      required
                    />
                    <label htmlFor="fireCert">
                      <Button variant="contained" component="span">
                        {fileNames.fireCert ||
                          'Fire Safety Inspection Certificate'}
                      </Button>
                    </label>
                    {Boolean(touched.fireCert && errors.fireCert) && (
                      <FormHelperText error>{errors.fireCert}</FormHelperText>
                    )}
                  </Box>
                )}
                {!house && !house?.nbi && (
                  <Box>
                    <input
                      id="mp"
                      type="file"
                      name="mp"
                      onChange={(e) => handleFileUpload(e, setFieldValue, 'mp')}
                      style={{ display: 'none' }}
                      accept=".pdf,.docx,.jpg,.jpeg,.png, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      required
                    />
                    <label htmlFor="mp">
                      <Button variant="contained" component="span">
                        {fileNames.mp || 'Upload Mayor’s Permit'}
                      </Button>
                    </label>
                    {Boolean(touched.mp && errors.mp) && (
                      <FormHelperText error>{errors.mp}</FormHelperText>
                    )}
                  </Box>
                )}
                {!house && !house?.nbi && (
                  <Box>
                    <input
                      id="certReg"
                      type="file"
                      name="certReg"
                      onChange={(e) =>
                        handleFileUpload(e, setFieldValue, 'certReg')
                      }
                      style={{ display: 'none' }}
                      accept=".pdf,.docx,.jpg,.jpeg,.png, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      required
                    />
                    <label htmlFor="certReg">
                      <Button variant="contained" component="span">
                        {fileNames.certReg ||
                          'Upload Certificate of Registration'}
                      </Button>
                    </label>
                    {Boolean(touched.certReg && errors.certReg) && (
                      <FormHelperText error>{errors.certReg}</FormHelperText>
                    )}
                  </Box>
                )}
                {!house && !house?.nbi && (
                  <Box>
                    <input
                      id="sp"
                      type="file"
                      name="sp"
                      onChange={(e) => handleFileUpload(e, setFieldValue, 'sp')}
                      style={{ display: 'none' }}
                      accept=".pdf,.docx,.jpg,.jpeg,.png, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      required
                    />
                    <label htmlFor="sp">
                      <Button variant="contained" component="span">
                        {fileNames.sp || 'Upload Sanitary Permit'}
                      </Button>
                    </label>
                    {Boolean(touched.sp && errors.sp) && (
                      <FormHelperText error>{errors.sp}</FormHelperText>
                    )}
                  </Box>
                )}
              </Stack>
            </Box>
            <Divider />
            <Button
              sx={{
                mt: 3,
              }}
              color="primary"
              startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
              disabled={isSubmitting}
              type="submit"
              fullWidth
              size="large"
              variant="contained"
            >
              {house ? 'Update your house' : 'Create your house'}
            </Button>
          </form>
        )}
      </Formik>
      <ToastContainer
        position="top-right"
        autoClose={100}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="colored"
      />
    </>
  );
};

export default BHForm;
