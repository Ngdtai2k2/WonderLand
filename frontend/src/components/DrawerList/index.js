import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import RestoreRoundedIcon from '@mui/icons-material/RestoreRounded';
import { Link } from '@mui/material';

function DrawerList() {
  return (
    <List>
      <ListItem>
        <Link href="/" underline="none" variant="inherit">
          Wonder Land
        </Link>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>
            <HomeRoundedIcon />
          </ListItemIcon>
          <ListItemText primary={'Home'} />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>
            <BarChartRoundedIcon />
          </ListItemIcon>
          <ListItemText primary={'Top'} />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>
            <TrendingUpRoundedIcon />
          </ListItemIcon>
          <ListItemText primary={'Trend'} />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>
            <RestoreRoundedIcon />
          </ListItemIcon>
          <ListItemText primary={'Fresh'} />
        </ListItemButton>
      </ListItem>
    </List>
  );
}

export default DrawerList;
