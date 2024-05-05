import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import RestoreRoundedIcon from '@mui/icons-material/RestoreRounded';
import QuestionMarkRoundedIcon from '@mui/icons-material/QuestionMarkRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';

export const publicDrawerList = [
  { link: '/', icon: <HomeRoundedIcon />, text: 'Home' },
  { link: '/top', icon: <BarChartRoundedIcon />, text: 'Top' },
  { link: '/trend', icon: <TrendingUpRoundedIcon />, text: 'Trend' },
  { link: '/fresh', icon: <RestoreRoundedIcon />, text: 'Fresh' },
  { link: '/ask', icon: <QuestionMarkRoundedIcon />, text: 'Ask' },
];

export const adminDrawerList = [
  { link: '/', icon: <HomeRoundedIcon />, text: 'Home' },
  {
    link: '/admin',
    icon: <AdminPanelSettingsRoundedIcon />,
    text: 'Dashboard',
  },
  {
    link: '/admin/categories',
    icon: <CategoryRoundedIcon />,
    text: 'Categories',
  },
];
