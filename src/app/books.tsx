import { Grid, Typography, Card, CardContent, CardHeader, CardMedia } from "@mui/material"
import type { IBook } from '@/model/book';
import type { PaginatedBooksResponse } from "@/model/paginatedBooksResponse";

export default function Books({books} : {books: Array<IBook>} ) {
  return(
    <>
    {
      !books ? (<Typography>Loading...</Typography>) : (
        <Grid 
        container 
        columns={{
        xl: 5,
        lg: 4,
        md: 3,
        sm: 2,
        xs: 1
      }} 
      spacing={2} 
      height={410}
      maxWidth={{
        xl: 1436, 
        lg: 1100, 
        md: 800, 
        sm: 500,
        xs: 1
      }}
      minWidth={{
        xl: 1436, 
        lg: 1100, 
        md: 800, 
        sm: 500,
        xs: 1
        }}
        marginX="auto"
        boxShadow={5}
        >
        {books.map((book: IBook, index: any) =>(
          <Grid key={index} size={1} minHeight={1}>
            <Card sx={{height: "100%", width: "100%", overflow: "clip"}}>
              <CardHeader disableTypography={false} title={book.title} slotProps={{title: {
                fontWeight: "bold",
                fontStyle: "italic",
                fontSize: 14,
                textAlign: "center",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                marginX: "auto",
              }}}/>
              <CardMedia>
                <img 
                  src={book.img}
                  style={{
                    maxWidth: "80%",
                    maxHeight: "100%",
                    margin: "auto",
                  }}
                  alt={book.title} />
              </CardMedia>
            </Card>
          </Grid>
        ))}
      </Grid>
    )
  }
  </>
  );
}
