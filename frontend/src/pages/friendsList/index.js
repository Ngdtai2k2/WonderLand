import React, { useEffect, useState } from "react";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import TabContext from "@mui/lab/TabContext";

import Diversity3RoundedIcon from "@mui/icons-material/Diversity3Rounded";
import CakeRoundedIcon from "@mui/icons-material/CakeRounded";
import GroupAddRoundedIcon from "@mui/icons-material/GroupAddRounded";

import FriendsListTab from "./friendsListTab";
import CustomBox from "../../components/CustomBox";
import { ButtonTab } from "../styles";
import FriendsRequestListTab from "./friendsRequestListTab";
import { BoxSpaceBetween } from "./styles";

export default function FriendsList() {
  const [tabIndex, setTabIndex] = useState(0);

  const theme = useTheme();
  const isSmOrBelow = useMediaQuery(theme.breakpoints.down("sm"));
  
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const tab_index = Number(urlParams.get("tab_index"));

  useEffect(() => {
    setTabIndex(tab_index);
  }, [tab_index]);

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <CustomBox>
      <TabContext value={tabIndex}>
        <Box sx={{ marginY: 2, ...(isSmOrBelow ? null : { display: "flex" }) }}>
          <Tabs
            value={tabIndex}
            onChange={handleChangeTab}
            variant={isSmOrBelow ? "scrollable" : "standard"}
            orientation={isSmOrBelow ? "horizontal" : "vertical"}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <ButtonTab
              label={
                <BoxSpaceBetween>
                  <Diversity3RoundedIcon />
                  <Typography variant="body1">Friends list</Typography>
                </BoxSpaceBetween>
              }
            />
            <ButtonTab
              label={
                <BoxSpaceBetween>
                  <GroupAddRoundedIcon />
                  <Typography variant="body1">Friends request</Typography>
                </BoxSpaceBetween>
              }
            />
            <ButtonTab
              label={
                <BoxSpaceBetween>
                  <CakeRoundedIcon />
                  <Typography variant="body1">Birthday</Typography>
                </BoxSpaceBetween>
              }
            />
          </Tabs>
          <Box
            sx={{
              ...(isSmOrBelow
                ? { marginTop: 3, width: "100%" }
                : { marginLeft: 3, width: "65%" }),
            }}
          >
            {tabIndex === 0 && <FriendsListTab />}
            {tabIndex === 1 && <FriendsRequestListTab />}
          </Box>
        </Box>
      </TabContext>
    </CustomBox>
  );
}
