import { Box, Container, Divider, Paper, Typography } from "@mui/material";

export default function Footer(){
  return(
    <Container sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      pb: { xs: 4, sm: 8 },
      textAlign: { sm: 'center', md: 'left' },}} 
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          pt: { xs: 2, sm: 4 },
          width: '100%',
        }}
      >
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, textAlign: "center" }}>
          Hello
        </Typography>
      </Box>
    </Container>        
  )
}