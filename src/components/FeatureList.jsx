import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import GearIcon from '@mui/icons-material/Build';
import ToolIcon from '@mui/icons-material/Construction';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import logo from '../assets/img/logo-2-300x124.png'; // Path to your .png logo

const features = [
  {
    icon: <GearIcon sx={{ color: '#4CAF50' }} />, // Use color to make icons stand out
    title: 'Adaptable performance',
    description: 'Our product effortlessly adjusts to your needs, boosting efficiency and simplifying your tasks.',
  },
  {
    icon: <ToolIcon sx={{ color: '#FF9800' }} />,
    title: 'Built to last',
    description: 'Experience unmatched durability that goes above and beyond with lasting investment.',
  },
  {
    icon: <ThumbUpIcon sx={{ color: '#2196F3' }} />,
    title: 'Great user experience',
    description: 'Integrate our product into your routine with an intuitive and easy-to-use interface.',
  },
  {
    icon: <FlashOnIcon sx={{ color: '#F44336' }} />,
    title: 'Innovative functionality',
    description: 'Stay ahead with features that set new standards, addressing your evolving needs better than the rest.',
  },
];

export default function FeatureList() {
  return (
    <Box
      sx={{
        maxWidth: 700, // Increased width for more spacious layout
        mx: 'auto',
        mt: 4,
        p: 5,
        bgcolor: 'background.paper',
        borderRadius: 3,
        boxShadow: 4,
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 1,
      }}
    >
      <Box display="flex" justifyContent="center" width="100%" mb={3}>
        <img src={logo} alt="Company Logo" style={{ width: 100 }} />
      </Box>

      {/* Feature List */}
      {features.map((feature, index) => (
        <Box key={index} display="flex" alignItems="flex-start" gap={3}>
          <Box sx={{ fontSize: 36 }}>{feature.icon}</Box>
          {/* Title and Description */}
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary', lineHeight: 1.4, width: '100%'}}>
              {feature.title}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              {feature.description}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
