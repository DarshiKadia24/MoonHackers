import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Chip,
  IconButton,
} from '@mui/material';
import {
  LocalHospital as HospitalIcon,
  MedicalServices as MedicalIcon,
  HealthAndSafety as HealthIcon,
  Psychology as PsychologyIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingIcon,
  Assessment as AssessmentIcon,
  School as SchoolIcon,
  EmojiEvents as AwardIcon,
  Star as StarIcon,
  ArrowForward as ArrowIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  GitHub as GitHubIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { healthcareColors, specialtyGradients, glassmorphism } from '../theme';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const heroRef = useRef(null);

  useEffect(() => {
    // Smooth scroll animation on mount
    if (heroRef.current) {
      heroRef.current.style.opacity = '0';
      heroRef.current.style.transform = 'translateY(20px)';
      setTimeout(() => {
        if (heroRef.current) {
          heroRef.current.style.transition = 'all 0.8s ease-out';
          heroRef.current.style.opacity = '1';
          heroRef.current.style.transform = 'translateY(0)';
        }
      }, 100);
    }
  }, []);

  const specialties = [
    {
      name: 'Health Informatics',
      icon: <MedicalIcon sx={{ fontSize: 60 }} />,
      description: 'Master health information systems, EHR management, and healthcare data analytics.',
      gradient: specialtyGradients['Health Informatics'],
    },
    {
      name: 'Medical Devices',
      icon: <HealthIcon sx={{ fontSize: 60 }} />,
      description: 'Develop expertise in medical device technology, regulation, and innovation.',
      gradient: specialtyGradients['Medical Devices'],
    },
    {
      name: 'Telemedicine',
      icon: <PsychologyIcon sx={{ fontSize: 60 }} />,
      description: 'Learn remote healthcare delivery, telemedicine platforms, and virtual care solutions.',
      gradient: specialtyGradients['Telemedicine'],
    },
    {
      name: 'Clinical Data',
      icon: <AssessmentIcon sx={{ fontSize: 60 }} />,
      description: 'Analyze clinical data, improve patient outcomes, and drive evidence-based care.',
      gradient: specialtyGradients['Clinical Data'],
    },
    {
      name: 'Healthcare Cybersecurity',
      icon: <SecurityIcon sx={{ fontSize: 60 }} />,
      description: 'Protect patient data and ensure compliance with healthcare security standards.',
      gradient: specialtyGradients['Healthcare Cybersecurity'],
    },
  ];

  const features = [
    {
      icon: <TrendingIcon sx={{ fontSize: 48, color: 'white' }} />,
      title: 'Track Your Progress',
      description: 'Monitor your skill development with advanced analytics and visualizations.',
    },
    {
      icon: <SchoolIcon sx={{ fontSize: 48, color: 'white' }} />,
      title: 'Personalized Learning',
      description: 'Get custom course recommendations tailored to your career goals.',
    },
    {
      icon: <AssessmentIcon sx={{ fontSize: 48, color: 'white' }} />,
      title: 'Gap Analysis',
      description: 'Identify skill gaps and receive targeted recommendations to fill them.',
    },
    {
      icon: <AwardIcon sx={{ fontSize: 48, color: 'white' }} />,
      title: 'Earn Certifications',
      description: 'Showcase your expertise with industry-recognized certifications.',
    },
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Health Informatics Specialist',
      avatar: 'SJ',
      content: 'This platform transformed my career! The personalized recommendations helped me transition into health informatics seamlessly.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Medical Device Engineer',
      avatar: 'MC',
      content: 'The skill tracking and gap analysis features are incredible. I\'ve gained 15 new certifications in just 6 months!',
      rating: 5,
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Telemedicine Coordinator',
      avatar: 'ER',
      content: 'Best platform for healthcare tech professionals. The career path guidance is spot-on and helped me achieve my goals.',
      rating: 5,
    },
  ];

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Section with Animated Gradient */}
      <Box
        ref={heroRef}
        sx={{
          background: healthcareColors.gradientHero,
          backgroundSize: '200% 200%',
          animation: 'gradientShift 15s ease infinite',
          color: 'white',
          py: { xs: 10, md: 16 },
          px: 2,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
            pointerEvents: 'none',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              textAlign: 'center',
              maxWidth: '900px',
              mx: 'auto',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Chip
                icon={<HospitalIcon />}
                label="Next-Gen Healthcare Technology Platform"
                sx={{
                  mb: 3,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  py: 2.5,
                  px: 1,
                  ...glassmorphism,
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Typography
                variant="h1"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 800,
                  mb: 3,
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                  lineHeight: 1.1,
                  textShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                }}
              >
                Transform Your Healthcare Technology Career
              </Typography>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Typography
                variant="h5"
                sx={{
                  mb: 5,
                  opacity: 0.95,
                  fontSize: { xs: '1.1rem', sm: '1.35rem', md: '1.5rem' },
                  lineHeight: 1.6,
                  fontWeight: 400,
                  maxWidth: '800px',
                  mx: 'auto',
                }}
              >
                Master cutting-edge skills in Health Informatics, Medical Devices, Telemedicine, and more.
                Track your progress, get personalized recommendations, and accelerate your career growth.
              </Typography>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                {isAuthenticated ? (
                  <Button
                    component={Link}
                    to="/dashboard"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowIcon />}
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      px: 5,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.95)',
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
                      },
                    }}
                  >
                    Go to Dashboard
                  </Button>
                ) : (
                  <>
                    <Button
                      component={Link}
                      to="/register"
                      variant="contained"
                      size="large"
                      endIcon={<ArrowIcon />}
                      sx={{
                        bgcolor: 'white',
                        color: 'primary.main',
                        px: 5,
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.95)',
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
                        },
                      }}
                    >
                      Get Started Free
                    </Button>
                    <Button
                      component={Link}
                      to="/login"
                      variant="outlined"
                      size="large"
                      sx={{
                        borderColor: 'white',
                        borderWidth: 2,
                        color: 'white',
                        px: 5,
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        ...glassmorphism,
                        '&:hover': {
                          borderColor: 'white',
                          borderWidth: 2,
                          bgcolor: 'rgba(255, 255, 255, 0.15)',
                          transform: 'translateY(-4px)',
                        },
                      }}
                    >
                      Sign In
                    </Button>
                  </>
                )}
              </Box>
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 2,
              background: healthcareColors.gradientPrimary,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Why Choose Our Platform?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto' }}>
            Everything you need to advance your healthcare technology career in one powerful platform
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 3,
                    background: healthcareColors.gradientCard,
                    border: '2px solid',
                    borderColor: 'rgba(13, 71, 161, 0.1)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.03)',
                      boxShadow: '0 20px 48px rgba(13, 71, 161, 0.2)',
                      borderColor: 'primary.main',
                      '& .feature-icon': {
                        transform: 'scale(1.1) rotate(5deg)',
                      },
                    },
                  }}
                >
                  <Box
                    className="feature-icon"
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '20px',
                      background: healthcareColors.gradientPrimary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      boxShadow: '0 8px 24px rgba(13, 71, 161, 0.3)',
                      transition: 'all 0.4s ease',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 1.5 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Healthcare Specialty Cards Section */}
      <Box sx={{ bgcolor: 'background.paper', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 700,
                mb: 2,
                background: healthcareColors.gradientSecondary,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Explore Healthcare Specialties
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto' }}>
              Comprehensive skill development across all major healthcare technology domains
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {specialties.map((specialty, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'white',
                      border: '2px solid',
                      borderColor: 'rgba(13, 71, 161, 0.1)',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-12px)',
                        boxShadow: '0 24px 56px rgba(13, 71, 161, 0.25)',
                        borderColor: 'transparent',
                        '& .specialty-gradient': {
                          opacity: 1,
                        },
                        '& .specialty-icon': {
                          transform: 'scale(1.15) rotate(8deg)',
                        },
                      },
                    }}
                  >
                    <Box
                      className="specialty-gradient"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '6px',
                        background: specialty.gradient,
                        opacity: 0.7,
                        transition: 'opacity 0.4s ease',
                      }}
                    />
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        textAlign: 'center',
                        pt: 5,
                        pb: 3,
                      }}
                    >
                      <Box
                        className="specialty-icon"
                        sx={{
                          width: 100,
                          height: 100,
                          borderRadius: '24px',
                          background: specialty.gradient,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 3,
                          color: 'white',
                          boxShadow: '0 12px 32px rgba(13, 71, 161, 0.25)',
                          transition: 'all 0.4s ease',
                        }}
                      >
                        {specialty.icon}
                      </Box>
                      <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                        {specialty.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {specialty.description}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'center', pb: 4, pt: 0 }}>
                      <Button
                        component={Link}
                        to={isAuthenticated ? '/dashboard' : '/register'}
                        variant="outlined"
                        endIcon={<ArrowIcon />}
                        sx={{
                          fontWeight: 600,
                          px: 3,
                          borderWidth: 2,
                          '&:hover': {
                            borderWidth: 2,
                            background: specialty.gradient,
                            color: 'white',
                            borderColor: 'transparent',
                          },
                        }}
                      >
                        Explore
                      </Button>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 2,
              background: healthcareColors.gradientPurple,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            What Our Users Say
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto' }}>
            Join thousands of healthcare professionals advancing their careers
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    height: '100%',
                    p: 4,
                    ...glassmorphism,
                    background: 'white',
                    border: '2px solid rgba(13, 71, 161, 0.08)',
                    transition: 'all 0.4s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 16px 40px rgba(13, 71, 161, 0.2)',
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        background: healthcareColors.gradientPrimary,
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        mr: 2,
                      }}
                    >
                      {testimonial.avatar}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} sx={{ color: '#FFB800', fontSize: 20 }} />
                    ))}
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      fontStyle: 'italic',
                      lineHeight: 1.8,
                      color: 'text.secondary',
                    }}
                  >
                    "{testimonial.content}"
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Final CTA Section */}
      <Box
        sx={{
          background: healthcareColors.gradientHero,
          backgroundSize: '200% 200%',
          animation: 'gradientShift 15s ease infinite',
          color: 'white',
          py: { xs: 8, md: 12 },
          px: 2,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{
                  fontWeight: 800,
                  mb: 3,
                  fontSize: { xs: '2rem', md: '3rem' },
                  textShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                }}
              >
                Ready to Transform Your Healthcare Career?
              </Typography>
              <Typography
                variant="h6"
                paragraph
                sx={{
                  mb: 5,
                  opacity: 0.95,
                  lineHeight: 1.8,
                  fontSize: { xs: '1rem', md: '1.25rem' },
                }}
              >
                Join thousands of healthcare professionals who are mastering new skills,
                tracking their progress, and accelerating their careers with our intelligent platform.
              </Typography>
              {!isAuthenticated && (
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowIcon />}
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      px: 6,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.95)',
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
                      },
                    }}
                  >
                    Start Your Journey Today
                  </Button>
                  <Button
                    component={Link}
                    to="/login"
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: 'white',
                      borderWidth: 2,
                      color: 'white',
                      px: 6,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      ...glassmorphism,
                      '&:hover': {
                        borderColor: 'white',
                        borderWidth: 2,
                        bgcolor: 'rgba(255, 255, 255, 0.15)',
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    Sign In
                  </Button>
                </Box>
              )}
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* Modern Footer */}
      <Box
        sx={{
          bgcolor: '#1a1a2e',
          color: 'white',
          py: 6,
          px: 2,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <HospitalIcon sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Healthcare Skills Intelligence
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 3, lineHeight: 1.7 }}>
                Empowering healthcare professionals to master technology skills and advance their careers
                through intelligent tracking, personalized recommendations, and comprehensive learning paths.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    '&:hover': {
                      bgcolor: healthcareColors.gradientPrimary,
                      transform: 'translateY(-4px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <LinkedInIcon />
                </IconButton>
                <IconButton
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    '&:hover': {
                      bgcolor: healthcareColors.gradientSecondary,
                      transform: 'translateY(-4px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <TwitterIcon />
                </IconButton>
                <IconButton
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    '&:hover': {
                      bgcolor: healthcareColors.gradientPurple,
                      transform: 'translateY(-4px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <GitHubIcon />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {['About Us', 'Features', 'Pricing', 'Contact'].map((item) => (
                  <Typography
                    key={item}
                    variant="body2"
                    sx={{
                      opacity: 0.8,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        opacity: 1,
                        transform: 'translateX(8px)',
                        color: healthcareColors.secondary,
                      },
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Resources
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {['Documentation', 'API', 'Support', 'Blog'].map((item) => (
                  <Typography
                    key={item}
                    variant="body2"
                    sx={{
                      opacity: 0.8,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        opacity: 1,
                        transform: 'translateX(8px)',
                        color: healthcareColors.secondary,
                      },
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Box>
            </Grid>
          </Grid>
          <Box
            sx={{
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              mt: 6,
              pt: 4,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              © {new Date().getFullYear()} Healthcare Skills Intelligence Platform. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
