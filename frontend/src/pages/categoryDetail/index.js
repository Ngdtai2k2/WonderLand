import React, { useEffect, useState } from "react";
import Zoom from "react-medium-image-zoom";
import { useParams } from "react-router-dom";
import { useTheme } from "@emotion/react";
import axios from "axios";

import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import TabContext from "@mui/lab/TabContext";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import WhatshotRoundedIcon from "@mui/icons-material/WhatshotRounded";
import QueryBuilderRoundedIcon from "@mui/icons-material/QueryBuilderRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";

import CustomBox from "../../components/CustomBox";
import NotFound from "../../components/NotFound";
import RenderPost from "../../components/RenderPost";

import { BaseApi, createElementStyleForZoom } from "../../constants/constant";
import { AvatarCategory } from "./styles";
import LoadingCircularIndeterminate from "../../components/Loading";
import ReadMore from "../../components/Readmore";

export default function CategoryDetail() {
  const [category, setCategory] = useState();
  const [loading, setLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const { name } = useParams();
  const theme = useTheme();

  useEffect(() => {
    document.title = category ? category.name : "Category not found!";
  }, [category]);

  useEffect(() => {
    createElementStyleForZoom(theme);
  }, [theme, theme.palette.mode]);

  useEffect(() => {
    const getCategoryDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.post(`${BaseApi}/category/details`, {
          name: name,
        });
        setCategory(response.data.category);
      } catch (error) {
        setCategory(null);
      } finally {
        setLoading(false);
      }
    };
    getCategoryDetails();
  }, [name]);

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  return loading ? (
    <LoadingCircularIndeterminate />
  ) : category ? (
    <CustomBox>
      <Paper
        sx={{
          p: {
            xs: 2,
            md: 4,
          },
        }}
      >
        <Grid container spacing={2} marginBottom={2}>
          <Grid item xs={12} sm={4} md={3}>
            <Zoom>
              <AvatarCategory
                src={category?.media?.url}
                variant="rounded"
                alt={category?.name}
              />
            </Zoom>
          </Grid>
          <Grid
            item
            xs={12}
            sm={8}
            md={9}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h4" fontWeight={700}>
                  {category?.name}
                </Typography>
                <Button variant="outlined" sx={{ height: 30 }}>
                  Follow
                </Button>
              </Box>
              <ReadMore
                maxLength={100}
                typographyProps={{
                  component: "span",
                  variant: "body1",
                }}
              >
                {category?.description}
              </ReadMore>
            </Box>
            <Box display="flex" justifyContent="flex-end" alignItems="center">
              <Box display="flex" justifyContent="center" alignItems="center">
                <IconButton aria-label="like category">
                  <FavoriteBorderRoundedIcon />
                </IconButton>
                <Typography variant="body1" paddingX={0.5}>
                  111
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <TabContext value={tabIndex}>
          <Tabs value={tabIndex} onChange={handleChangeTab} centered>
            <Tab
              label={
                <Typography
                  variant="body1"
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                >
                  <WhatshotRoundedIcon fontSize="16" />
                  Hot
                </Typography>
              }
            />
            <Tab
              label={
                <Typography
                  variant="body1"
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                >
                  <QueryBuilderRoundedIcon fontSize="16" />
                  Fresh
                </Typography>
              }
            />
            <Tab
              label={
                <Typography
                  variant="body1"
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                >
                  <InfoRoundedIcon fontSize="16" />
                  Description
                </Typography>
              }
            />
          </Tabs>
        </TabContext>
      </Paper>
      <Box>
        {tabIndex === 0 && (
          <RenderPost
            apiLink={`${BaseApi}/post/category/${name}?_isFresh=false&_order=desc&_sort=createdAt&`}
            isHiddenButtonBar={true}
          />
        )}
        {tabIndex === 1 && (
          <RenderPost
            apiLink={`${BaseApi}/post/category/${name}?_isFresh=true&_order=desc&_sort=createdAt&`}
            isHiddenButtonBar={true}
          />
        )}
        {tabIndex === 2 && (
          <Box marginY={2}>
            <Typography>{category?.description}</Typography>
          </Box>
        )}
      </Box>
    </CustomBox>
  ) : (
    <NotFound />
  );
}
