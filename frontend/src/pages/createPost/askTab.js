import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import LoadingButton from "@mui/lab/LoadingButton";

import CreateRoundedIcon from "@mui/icons-material/CreateRounded";

import { createAxios } from "../../createInstance";
import { BaseApi, toastTheme } from "../../constants/constant";
import LoadingCircularIndeterminate from "../../components/Loading";
import { FlexCenterBox } from "./styles";

export default function AskTab() {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState();
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.login?.currentUser);
  const accessToken = user?.accessToken;
  let axiosJWT = createAxios(user, dispatch);

  useEffect(() => {
    const getCategory = async () => {
      try {
        const response = await axios.get(BaseApi + "/category");
        setCategory(response.data.result.docs);
        setLoading(false);
      } catch (error) {
        toast.error(error.message, toastTheme);
      }
    };
    getCategory();
  }, []);

  const validationSchema = Yup.object({
    category: Yup.string().required("Category is required!"),
    title: Yup.string()
      .required("Title is required!")
      .max(280, "Title must be under 280 characters!"),
    content: Yup.string().max(1500, "Content must be under 1500 characters!"),
  });

  const formik = useFormik({
    initialValues: { category: "", title: "", content: "" },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setFetching(true);
        const askData = {
          ...values,
          author: user?._id,
          type: 1
        };

        const response = await axiosJWT.post(
          BaseApi + '/post/create',
          askData,
          {
            headers: { token: `Bearer ${accessToken}` },
          }
        );
        toast.success(response.data.message, toastTheme);
        navigate("/");
      } catch (error) {
        toast.error(error.message, toastTheme);
      } finally {
        setFetching(false);
      }
    },
  });

  return loading ? (
    <LoadingCircularIndeterminate />
  ) : (
    <Box
      component="form"
      noValidate
      method="POST"
      display="flex"
      onSubmit={formik.handleSubmit}
      justifyContent="center"
      flexDirection="column"
    >
      <Typography variant="caption">
        Note: After creating your post, please allow 1 moment for us to upload
        your file!
      </Typography>
      <TextField
        required
        margin="normal"
        id="category"
        select
        label="Category"
        name="category"
        fullWidth
        value={formik.values.category}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.category && Boolean(formik.errors.category)}
        helperText={formik.touched.category && formik.errors.category}
      >
        {category &&
          category.map((item) => (
            <MenuItem key={item._id} value={item._id}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  variant="square"
                  alt={item.media?.description}
                  src={item.media?.url}
                  sx={{ width: 32, height: 32 }}
                />
                <Typography variant="body1">{item.name}</Typography>
              </Box>
            </MenuItem>
          ))}
      </TextField>
      <TextField
        margin="normal"
        required
        id="title"
        label="Title"
        type="text"
        value={formik.values.title}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.title && Boolean(formik.errors.title)}
        helperText={formik.touched.title && formik.errors.title}
      />
      <TextField
        multiline
        rows={4}
        margin="normal"
        id="content"
        label="Content"
        type="text"
        value={formik.values.content}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.content && Boolean(formik.errors.content)}
        helperText={formik.touched.content && formik.errors.content}
      />
      <FlexCenterBox>
        <LoadingButton
          loading={fetching ? fetching : false}
          loadingPosition="start"
          variant="outlined"
          startIcon={<CreateRoundedIcon />}
          type="submit"
          disabled={!formik.dirty || formik.isSubmitting || !formik.isValid}
          sx={{
            width: {
              xs: "30%",
              md: "20%",
            },
          }}
        >
          Post
        </LoadingButton>
      </FlexCenterBox>
    </Box>
  );
}
