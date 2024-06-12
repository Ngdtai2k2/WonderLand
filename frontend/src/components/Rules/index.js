import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import Checkbox from '@mui/material/Checkbox';

import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';

import LoadingCircularIndeterminate from '../Loading';

import { API } from '../../api';

export default function Rules({ isReport, setState }) {
  const [rules, setRules] = useState();
  const [loading, setLoading] = useState(false);
  const [openRule, setOpenRule] = useState({});
  const [checked, setChecked] = useState({});

  const handleOpenDescriptionRule = (id) => {
    setOpenRule((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleChangeChecked = (id) => {
    setChecked((prevState) => {
      const newChecked = {};
      newChecked[id] = !prevState[id];
      return newChecked;
    });
    setState(id);
  };

  const getAllRules = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API.RULE.BASE);
      setRules(response.data.result.docs);
    } catch (error) {
      setRules(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllRules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return loading ? (
    <LoadingCircularIndeterminate />
  ) : (
    <Box sx={isReport ? { overflowY: 'auto', height: '55vh' } : {}}>
      {!isReport && (
        <Typography
          variant="h6"
          fontWeight={700}
          textAlign="center"
          marginBottom={2}
        >
          Rules
        </Typography>
      )}
      {rules ? (
        rules?.map((rule) => (
          <Box key={rule._id}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box display="flex" alignItems="center">
                {isReport && (
                  <Checkbox
                    size="small"
                    onChange={() => handleChangeChecked(rule._id)}
                    checked={checked[rule._id] || false}
                  />
                )}
                <Typography variant="h6" fontSize={18} fontWeight={600}>
                  {rule.name}
                </Typography>
              </Box>

              <IconButton
                size="small"
                onClick={() => handleOpenDescriptionRule(rule._id)}
              >
                {openRule[rule._id] ? (
                  <KeyboardArrowUpRoundedIcon />
                ) : (
                  <KeyboardArrowDownRoundedIcon />
                )}
              </IconButton>
            </Box>
            <Collapse in={openRule[rule._id]}>
              <Typography
                variant="body1"
                paddingLeft={2}
                sx={{ whiteSpace: 'pre-line' }}
              >
                {rule.description}
              </Typography>
            </Collapse>
          </Box>
        ))
      ) : (
        <Typography variant="body1">We couldn't find the data</Typography>
      )}
    </Box>
  );
}
