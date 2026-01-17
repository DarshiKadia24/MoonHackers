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
  Code as CodeIcon,
  DataObject as DataIcon,
  CloudQueue as CloudIcon,
  AutoAwesome as AIIcon,
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
  Insights as InsightsIcon,
  Rocket as RocketIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { healthcareColors, glassmorphism } from '../theme';
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

  const specialtyCategories = [
    {
      name: 'Software Engineering',
      icon: <CodeIcon sx={{ fontSize: 60 }} />,
      description: 'Master modern development frameworks, architecture patterns, and engineering best practices.',
      gradient: 'linear-gradient(135deg, #1E3A5F 0%, #2C5282 100%)',
    },
    {
      name: 'Data Science & AI',
      icon: <AIIcon sx={{ fontSize: 60 }} />,
      description: 'Build expertise in machine learning, data analytics, and artificial intelligence solutions.',
      gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    },
    {
      name: 'Cloud Architecture',
      icon: <CloudIcon sx={{ fontSize: 60 }} />,
      description: 'Design and implement scalable cloud infrastructure and distributed systems.',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
    },
    {
      name: 'DevOps & Platform',
      icon: <DataIcon sx={{ fontSize: 60 }} />,
      description: 'Streamline deployment pipelines, automation, and infrastructure as code.',
      gradient: 'linear-gradient(135deg, #2C5282 0%, #3B82F6 100%)',
    },
    {
      name: 'Cybersecurity',
      icon: <SecurityIcon sx={{ fontSize: 60 }} />,
      description: 'Protect systems and data with advanced security practices and compliance frameworks.',
      gradient: 'linear-gradient(135deg, #D4AF37 0%, #F0C850 100%)',
    },
  ];

  const features = [
    {
      icon: <TrendingIcon sx={{ fontSize: 48, color: 'white' }} />,
      title: 'Real-Time Analytics',
      description: 'Track skill development with advanced analytics dashboards and performance insights.',
    },
    {
      icon: <SchoolIcon sx={{ fontSize: 48, color: 'white' }} />,
      title: 'AI-Powered Learning',
      description: 'Receive intelligent course recommendations tailored to your professional goals.',
    },
    {
      icon: <AssessmentIcon sx={{ fontSize: 48, color: 'white' }} />,
      title: 'Smart Gap Analysis',
      description: 'Identify skill gaps and get strategic recommendations to advance your career.',
    },
    {
      icon: <AwardIcon sx={{ fontSize: 48, color: 'white' }} />,
      title: 'Industry Certifications',
      description: 'Validate expertise with globally recognized professional certifications.',
    },
    {
      icon: <InsightsIcon sx={{ fontSize: 48, color: 'white' }} />,
      title: 'Career Insights',
      description: 'Unlock data-driven career path recommendations based on market trends.',
    },
    {
      icon: <RocketIcon sx={{ fontSize: 48, color: 'white' }} />,
      title: 'Accelerated Growth',
      description: 'Fast-track your professional development with personalized learning paths.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Mitchell',
      role: 'Senior Software Engineer',
      avatar: 'SM',
      content: 'This platform transformed my career trajectory! The AI-powered recommendations helped me master cloud architecture and land my dream role.',
      rating: 5,
    },
    {
      name: 'Marcus Chen',
      role: 'Lead Data Scientist',
      avatar: 'MC',
      content: 'The skill tracking and analytics are phenomenal. I\'ve gained 12 new certifications and doubled my expertise in just 6 months!',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'DevOps Architect',
      avatar: 'ER',
      content: 'Best platform for tech professionals. The personalized career insights helped me transition into DevOps leadership seamlessly.',
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
                icon={<RocketIcon />}
                label="Next-Generation Skill Intelligence Platform"
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
                Elevate Your Professional Journey
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
                Master in-demand skills across Software Engineering, Data Science, Cloud Architecture, and more.
                Track progress with AI-powered insights and accelerate your professional growth.
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
            Powerful Features for Modern Professionals
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto' }}>
            Everything you need to accelerate your professional development in one intelligent platform
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
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
              Explore Skill Categories
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto' }}>
              Comprehensive learning paths across all major technology domains
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {specialtyCategories.map((specialty, index) => (
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
            Join thousands of professionals accelerating their careers with intelligent skill tracking
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
                Ready to Accelerate Your Professional Growth?
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
                Join thousands of professionals who are mastering new skills,
                tracking their progress, and achieving career breakthroughs with our AI-powered platform.
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
                <RocketIcon sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Skill Intelligence Platform
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 3, lineHeight: 1.7 }}>
                Empowering professionals to master in-demand skills and accelerate their careers
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
              © {new Date().getFullYear()} Skill Intelligence Platform. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
