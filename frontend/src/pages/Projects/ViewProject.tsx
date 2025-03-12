import bgImage from '../../assets/images/bg.jpg';

<Box 
  sx={{ 
    p: 3,
    minHeight: '100vh',
    background: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  }}
> 