import { useTranslation } from 'react-i18next';

import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import RestoreRoundedIcon from '@mui/icons-material/RestoreRounded';
import QuestionMarkRoundedIcon from '@mui/icons-material/QuestionMarkRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import GavelRoundedIcon from '@mui/icons-material/GavelRounded';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import TranslateRoundedIcon from '@mui/icons-material/TranslateRounded';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';

export const PublicDrawerList = () => {
  const { t } = useTranslation('sidebar');

  return [
    { link: '/', icon: <HomeRoundedIcon />, text: t('home') },
    { link: '/top', icon: <BarChartRoundedIcon />, text: t('top') },
    { link: '/trend', icon: <TrendingUpRoundedIcon />, text: t('trend') },
    { link: '/fresh', icon: <RestoreRoundedIcon />, text: t('fresh') },
    { link: '/ask', icon: <QuestionMarkRoundedIcon />, text: t('ask') },
  ];
};

export const AdminDrawerList = () => {
  const { t } = useTranslation('sidebar');

  return [
    { link: '/', icon: <HomeRoundedIcon />, text: t('home') },
    {
      link: '/admin',
      icon: <AdminPanelSettingsRoundedIcon />,
      text: t('dashboard'),
    },
    {
      link: '/admin/categories',
      icon: <CategoryRoundedIcon />,
      text: t('categories'),
    },
    {
      link: '/admin/rules',
      icon: <GavelRoundedIcon />,
      text: t('rules'),
    },
    {
      link: '/admin/reports',
      icon: <ReportProblemRoundedIcon />,
      text: t('reports_list'),
    },
    {
      link: '/admin/bad-words',
      icon: <TranslateRoundedIcon />,
      text: t('bad_words'),
    },
    {
      link: '/admin/transactions',
      icon: <PaidRoundedIcon />,
      text: t('transactions'),
    },
  ];
};
