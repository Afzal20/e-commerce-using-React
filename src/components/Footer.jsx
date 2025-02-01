import React from "react";
import { Container, Grid, TextField, Button, Typography, Box } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneIcon from "@mui/icons-material/Phone";
import logo from "../assets/img/logo-2-300x124.png";
import qrCodee from "../assets/img/transparent-2-qr-1024x1024.png";

const Footer = () => {
  const [email, setEmail] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [details, setDetails] = React.useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      email,
      subject,
      details
    };
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        alert("Message sent successfully!");
      } else {
        alert("Error sending message.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  return (
    <Box sx={{ backgroundColor: "#05050A", color: "#FFD700", py: 4 }}>
      <Container>
        <Grid container spacing={5} alignItems="center">
          <Grid item xs={12} md={4} sx={{ textAlign: "center", display: "flex", justifyContent: "center" }}>
            <img src={qrCodee} alt="QR Code" width="250" style={{ margin: "0 auto" }} />
          </Grid>

          <Grid item xs={12} md={4} sx={{ textAlign: "center", justifyContent: "center", borderRadius : 10 }}>
            <TextField fullWidth label="Email" placeholder="Enter your email" variant="outlined" margin="dense" sx={{
              input: { color: "#FFD700" },
              fieldset: { borderColor: "#FFD700" },
              label: { color: "#FFD700" },
              borderRadius: 2,
              "& .MuiInputBase-input::placeholder": { color: "#FFD700", opacity: 1 }
            }} 
            onChange={(e) => setEmail(e.target.value)}
            />
            <TextField fullWidth label="Subject" placeholder="Enter subject" variant="outlined" margin="dense" sx={{ 
              input: { color: "#FFD700" }, 
              label: { color: "#FFD700" },
              fieldset: { borderColor: "#FFD700" }, 
              borderRadius: 2,
              "& .MuiInputBase-input::placeholder": { color: "#FFD700", opacity: 1 }
              }} 
              onChange={(e) => setSubject(e.target.value)}
              />
            <TextField fullWidth label="Details" placeholder="Enter message details" variant="outlined" margin="dense" multiline rows={3} 
            sx={{ 
              input: { color: "#FFD700" }, 
              label: { color: "#FFD700" },
              fieldset: { borderColor: "#FFD700" }, 
              borderRadius: 2,
              "& .MuiInputBase-input::placeholder": { color: "#FFD700", opacity: 1 }
              }} 
              onChange={(e) => setDetails(e.target.value)}
              />
            <Button fullWidth variant="contained" sx={{ mt: 2, backgroundColor: "#FFD700", color: "#05050A" }} onClick={handleSubmit}>
              Send Message
            </Button>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4} sx={{ textAlign: "center", justifyContent: "center" }}>
            <Box>
              <img src={logo} alt="Logo" width="120" style={{ margin: "0 auto" }} />
            </Box>
            <Typography variant="h6" sx={{ mt: 2 }}>CONTACT US</Typography>
            <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
              <EmailIcon sx={{ mr: 1, color: "#FFD700" }} />
              <Typography>bindubritto2024@gmail.com</Typography>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
              <WhatsAppIcon sx={{ mr: 1, color: "#FFD700" }} />
              <Typography>+8801306994872</Typography>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
              <PhoneIcon sx={{ mr: 1, color: "#FFD700" }} />
              <Typography>+8801771325577</Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
