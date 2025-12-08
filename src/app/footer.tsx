import { Box, Container, Divider, Link, Paper, Typography } from "@mui/material";

export default function Footer(){
  return(
    <Container 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pb: { xs: 4, sm: 8 },
        textAlign: { sm: 'center', md: 'left' },
        width: "100%",
      }} 
    >
      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, textAlign: "center" }}>
        Hello
      </Typography>
      <Link href="https://www.netlify.com">
        <img height="50px" width="114px" src="https://www.netlify.com/assets/badges/netlify-badge-dark.svg" alt="Deploys by Netlify" />
      </Link>
    </Container>        
  )
}