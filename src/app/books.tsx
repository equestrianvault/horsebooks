"use client";
import { Grid, Typography, Card, CardContent, CardHeader, CardMedia, Container, CardActions, Button, Stack, List, ListItem, Link, Accordion, AccordionSummary, AccordionDetails } from "@mui/material"
import type { IAuthor, IBook, IBookLink } from '@/model/book';
import type { PaginatedBooksResponse } from "@/model/paginatedBooksResponse";

export default function Books({books} : {books: Array<IBook>} ) {
  return(
    <Container sx={{
        display: 'flex',
        pt: {xs:12, sm:8},
        width: '100%',
      }}
    >
    {
      !books ? (<Typography>Loading...</Typography>) : (
        <Grid 
          container 
          columns={{
            xl: 5,
            lg: 4,
            md: 3,
            sm: 2
          }} 
          spacing={2} 
          height={{sm:"100%"}}
          width={{
            xl: 1436, 
            lg: 1100, 
            md: 800, 
            sm: 500
          }}
          marginX="auto"
        >
        {books.map((book: IBook, index: any) =>(
          <Grid key={index} size={1} >
            <Card sx={{height: "100%", width: "100%", overflow: "clip", p: 4}}>
              <CardMedia component="img" src={book.img} alt={book.title} sx={{marginX: "auto", width: "auto", maxHeight: "150px"}}/>
              <CardHeader disableTypography={false} title={book.title} slotProps={{
                title: {
                  fontWeight: "bold",
                  fontSize: 14,
                  textAlign: "center",
                  textOverflow: "ellipsis",
                  marginX: "auto",
                  width: "auto",
                  padding: 0,
                  
                }}}
                sx={{
                  p: 0,
                  textDecoration: "underline"
                }}
              />
              <List>
              {book.links.map((link: IBookLink, index: number) => (
                <ListItem key={index}>
                  <Link sx={{width: "100%" }} target="_blank" href={link.url}>{link.title}</Link>
                </ListItem>
              ))}
              </List>
            </Card>
          </Grid>
        ))}
      </Grid>
    )
  }
  </Container>
  );
}
