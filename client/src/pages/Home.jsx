import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Box, Grid, Card, CardMedia } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";
import { keyframes } from "@emotion/react";

// Custom styled components
const HeroContainer = styled(Box)(({ theme }) => ({
  minHeight: "90vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  borderRadius: "15px",
  padding: theme.spacing(4),
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
  position: "relative",
  marginTop: theme.spacing(4),
}));

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const ShimmerOverlay = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundImage: "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)",
  backgroundSize: "1000px 100%",
  animation: `${shimmer} 8s infinite linear`,
});

const StyledTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  color: "white",
  textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
  position: "relative",
  zIndex: 2,
}));

const StyledSubtitle = styled(Typography)(({ theme }) => ({
  color: "rgba(255,255,255,0.9)",
  marginBottom: theme.spacing(5),
  position: "relative",
  zIndex: 2,
  maxWidth: "600px",
  marginLeft: "auto",
  marginRight: "auto",
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: "30px",
  padding: "12px 35px",
  fontSize: "1.1rem",
  fontWeight: 600,
  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
  transition: "all 0.3s ease",
  background: "white",
  color: "#764ba2",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 15px 25px rgba(0,0,0,0.2)",
    background: "white",
  },
}));

const FeatureBox = styled(motion.div)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.15)",
  backdropFilter: "blur(10px)",
  padding: theme.spacing(3),
  borderRadius: "15px",
  textAlign: "center",
  color: "white",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
  height: "100%",
}));

const ProductCard = styled(Card)(({ theme }) => ({
  height: "100%",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-10px)",
    boxShadow: "0 12px 25px rgba(0,0,0,0.15)",
  },
}));

const ImageOverlay = styled(Box)({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)",
  padding: "20px",
  transition: "opacity 0.3s ease",
});

const CategoryTitle = styled(Typography)({
  color: "white",
  fontWeight: 600,
  textShadow: "1px 1px 3px rgba(0,0,0,0.3)",
});

// Feature icons using SVG directly in the component
const FeatureIcon = ({ type }) => {
  const iconMap = {
    "vendors": (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5"/>
        <path d="M12 8V16M8 12H16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    "payments": (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="6" width="18" height="12" rx="2" stroke="white" strokeWidth="1.5"/>
        <path d="M3 10H21" stroke="white" strokeWidth="1.5"/>
        <path d="M7 15H13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    "delivery": (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 16V8H3V16H16Z" stroke="white" strokeWidth="1.5"/>
        <path d="M16 12H20L22 14V16H16V12Z" stroke="white" strokeWidth="1.5"/>
        <circle cx="6" cy="18" r="2" stroke="white" strokeWidth="1.5"/>
        <circle cx="19" cy="18" r="2" stroke="white" strokeWidth="1.5"/>
      </svg>
    ),
    "support": (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5"/>
        <path d="M12 16V12M12 8H12.01" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  };
  
  return iconMap[type] || iconMap["vendors"];
};

// Array of featured products with embedded SVG images
const featuredProducts = [
  { 
    id: 1, 
    category: "Electronics", 
    image: (
      <svg width="100%" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#3498db"/>
        <rect x="50" y="50" width="100" height="80" rx="5" fill="#f1f1f1"/>
        <rect x="70" y="140" width="60" height="10" rx="2" fill="#f1f1f1"/>
        <circle cx="100" cy="90" r="25" fill="#2980b9"/>
      </svg>
    )
  },
  { 
    id: 2, 
    category: "Fashion", 
    image: (
      <svg width="100%" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#e74c3c"/>
        <path d="M100,40 L130,70 L130,160 L70,160 L70,70 Z" fill="#f1f1f1"/>
        <circle cx="100" cy="60" r="10" fill="#c0392b"/>
      </svg>
    )
  },
  { 
    id: 3, 
    category: "Home & Kitchen", 
    image: (
      <svg width="100%" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#27ae60"/>
        <path d="M60,80 L140,80 L150,150 L50,150 Z" fill="#f1f1f1"/>
        <rect x="95" y="60" width="10" height="20" fill="#f1f1f1"/>
      </svg>
    )
  },
  { 
    id: 4, 
    category: "Beauty", 
    image: (
      <svg width="100%" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#9b59b6"/>
        <rect x="80" y="50" width="40" height="100" rx="20" fill="#f1f1f1"/>
        <circle cx="100" cy="60" r="15" fill="#8e44ad"/>
      </svg>
    )
  }
];

// Banner SVG
const BannerSVG = () => (
  <svg width="100%" height="300" viewBox="0 0 1200 300" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bannerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: "#6c5ce7", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#a29bfe", stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect width="1200" height="300" fill="url(#bannerGradient)"/>
    <circle cx="300" cy="150" r="80" fill="rgba(255,255,255,0.1)"/>
    <circle cx="900" cy="100" r="120" fill="rgba(255,255,255,0.05)"/>
    <circle cx="1100" cy="200" r="50" fill="rgba(255,255,255,0.15)"/>
    <path d="M0,200 Q300,100 600,200 T1200,150" stroke="rgba(255,255,255,0.2)" fill="none" strokeWidth="5"/>
  </svg>
);

// Product Card SVG
const ProductCardSVG = ({ index }) => {
  const colors = ["#3498db", "#e74c3c", "#2ecc71", "#f39c12", "#9b59b6", "#1abc9c"];
  const color = colors[index % colors.length];
  
  return (
    <svg width="100%" height="180" viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="180" fill={color}/>
      <rect x="50" y="40" width="200" height="100" rx="10" fill="rgba(255,255,255,0.2)"/>
      <circle cx="150" cy="90" r="30" fill="rgba(255,255,255,0.3)"/>
    </svg>
  );
};

// Floating decorative elements using SVG
const FloatingDecoratorSVG = ({ color = "#ffffff", opacity = 0.3 }) => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="15" fill={color} fillOpacity={opacity}/>
    <circle cx="50" cy="50" r="20" fill={color} fillOpacity={opacity + 0.1}/>
  </svg>
);

function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Check if user is logged in
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBrowseProducts = () => {
    if (token) {
      navigate("/products"); // Go to products if logged in
    } else {
      navigate("/auth"); // Redirect to login/signup if not logged in
    }
  };

  const features = [
    { title: "Trusted Vendors", description: "Shop from verified sellers offering quality products", icon: "vendors" },
    { title: "Secure Payments", description: "Multiple payment options with enhanced security", icon: "payments" },
    { title: "Fast Delivery", description: "Quick shipping options available nationwide", icon: "delivery" },
    { title: "24/7 Support", description: "Customer service available around the clock", icon: "support" },
  ];

  const decoratorImages = [
    { top: "15%", left: "5%", rotation: -15, size: 120, delay: 0 },
    { top: "10%", right: "8%", rotation: 10, size: 90, delay: 0.5 },
    { top: "65%", left: "8%", rotation: -10, size: 70, delay: 1 },
    { top: "70%", right: "10%", rotation: 20, size: 110, delay: 1.5 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <Container maxWidth="lg">
      <HeroContainer>
        <ShimmerOverlay />
        
        {/* Floating decorator images using SVG */}
        {decoratorImages.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20, rotate: item.rotation }}
            animate={{ opacity: 0.6, y: 0, rotate: item.rotation }}
            transition={{ delay: item.delay, duration: 1 }}
            style={{
              position: "absolute",
              top: item.top,
              left: item.left,
              right: item.right,
              zIndex: 1,
              width: `${item.size}px`,
              height: `${item.size}px`,
            }}
          >
            <FloatingDecoratorSVG opacity={0.2 + (index * 0.05)} />
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <StyledTitle variant="h2" align="center" gutterBottom>
            Welcome to MarketHub
          </StyledTitle>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <StyledSubtitle variant="h5" align="center">
            Your premium one-stop multi-vendor e-commerce platform for exceptional shopping experiences
          </StyledSubtitle>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{ zIndex: 2, textAlign: "center" }}
        >
          <ActionButton
            variant="contained"
            onClick={handleBrowseProducts}
            size="large"
          >
            Explore Products
          </ActionButton>
        </motion.div>

        <Box mt={8} position="relative" zIndex={2}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={3}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div variants={itemVariants}>
                    <FeatureBox
                      whileHover={{ y: -10, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
                    >
                      <Box mb={2}>
                        <FeatureIcon type={feature.icon} />
                      </Box>
                      <Typography variant="h6" gutterBottom>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2">
                        {feature.description}
                      </Typography>
                    </FeatureBox>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Box>
      </HeroContainer>

      {/* Featured Categories Section */}
      <Box mt={8} mb={8}>
        <Typography variant="h4" align="center" gutterBottom fontWeight="700">
          Shop by Category
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" gutterBottom mb={4}>
          Discover our wide range of products across popular categories
        </Typography>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <Grid container spacing={3}>
            {featuredProducts.map((product, index) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <motion.div variants={itemVariants}>
                  <ProductCard>
                    <Box sx={{ position: "relative" }}>
                      {product.image}
                      <ImageOverlay>
                        <CategoryTitle variant="h6">
                          {product.category}
                        </CategoryTitle>
                      </ImageOverlay>
                    </Box>
                  </ProductCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Box>

      {/* Banner Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <Box 
          sx={{ 
            position: "relative", 
            borderRadius: "15px", 
            overflow: "hidden",
            marginBottom: 8,
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          }}
        >
          <BannerSVG />
          <Box 
            sx={{ 
              position: "absolute", 
              top: 0, 
              left: 0, 
              width: "100%", 
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: 4,
              background: "linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)",
            }}
          >
            <Typography variant="h3" color="white" fontWeight="800" gutterBottom>
              Special Offer
            </Typography>
            <Typography variant="h6" color="white" sx={{ maxWidth: "500px", mb: 3 }}>
              Get up to 40% off on your first purchase. Limited time offer!
            </Typography>
            <Box>
              <Button 
                variant="contained" 
                sx={{ 
                  backgroundColor: "white", 
                  color: "#764ba2",
                  fontWeight: "600",
                  "&:hover": { backgroundColor: "#f5f5f5" } 
                }}
              >
                Shop Now
              </Button>
            </Box>
          </Box>
        </Box>
      </motion.div>

      {/* Trending Products Section */}
      <Box mt={8} mb={8}>
        <Typography variant="h4" align="center" gutterBottom fontWeight="700">
          Trending Now
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" gutterBottom mb={4}>
          Discover what's popular on MarketHub
        </Typography>
        
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((item, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={item}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: item * 0.1 }}
                viewport={{ once: true }}
              >
                <Card sx={{ borderRadius: "12px", overflow: "hidden" }}>
                  <Box height="180px">
                    <ProductCardSVG index={index} />
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Category
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="600" gutterBottom noWrap>
                      Product Name Example {item}
                    </Typography>
                    <Typography variant="h6" color="primary" fontWeight="700">
                      $149.99
                    </Typography>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

export default Home;