"use client";

import { AppBar, Card, CardContent, CardHeader, CardMedia, Grid, List, ListItem, Pagination, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useState } from 'react';
import type { IAuthor, IBook } from '@/model/book';
import axios from "axios";
let defaultPage = 1;
const BOOK_DATA_URL = "/.netlify/functions/books";

export default function Home() {
  const [currentPage, setCurrrentPage] = useState(defaultPage);
  const [data, setData] = useState({books:[], currentPage: defaultPage, maxPage: defaultPage, pageSize:1});
  const [isLoading, setLoading] = useState(false);
  const [freshLoad, setFreshLoad] = useState(true);

  const fetchData = async (pageNumber : Number) => {
    setLoading(true);
    try{
      const response = await axios.get(`${BOOK_DATA_URL}?pageNum=${pageNumber}`);
      setCurrrentPage(response.data.currentPage);
      setData(response.data);
    } catch( thrownError ) {
      console.log(thrownError)
    } finally{
      setLoading(false);
    }
  }

  function changePage(event: React.ChangeEvent<unknown>, pageNumber: Number) : void {
    console.debug(event);
    fetchData(pageNumber);
  };

  if(freshLoad){
    setFreshLoad(false);
    fetchData(1);
  }

  if (isLoading) return <Typography>Loading...</Typography>;  
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-12xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <AppBar sx={{backgroundColor: "rgb(63, 81, 181)"}} >
          <Stack direction={"column"}>
            <Stack direction={"row"} py={{md:3, sm: 1}} px={{md:2, sm:1}} spacing={2}>
              <Typography fontSize={"20px"} >Equestrian Vault</Typography>
              <Stack direction={"row"} alignContent={"flex-end"}>
                <Image width={20} height={30} src={"file.svg"} alt={"file icon"}/>
                <Image width={20} height={30} src={"globe.svg"} alt={"globe icon"}/>
                <Image width={20} height={30} src={"next.svg"} alt={"next icon"}/>
                <Image width={20} height={30} src={"vercel.svg"} alt={"vercel icon"}/>
                <Image width={20} height={30} src={"window.svg"} alt={"window icon"}/>
              </Stack>
            </Stack>
            <Pagination onChange={changePage} page={currentPage} count={data.maxPage} color="primary" variant="outlined" sx={{mx: "auto"}}/>
          </Stack>
        </AppBar>
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

          height={{
            xl: 400,
            lg: 600,
            md: 600,
            sm: 600,
            xs: 600
          }}
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
        >
          {data.books.map((book: IBook, index: any) =>(
            <Grid key={index} size={1} height={1}>
              <Card sx={{height: "100%", width: "100%", overflow: "clip"}}>
                <CardHeader disableTypography={false} title={book.title} slotProps={{title: {
                  fontWeight: "bold",
                  textAlign: "center",
                  overflow: "clip",
                }}}></CardHeader>
                <CardContent sx={{overflow: "clip"}}>
                    <List disablePadding dense subheader="By:" >
                      {book.authors.map((author: IAuthor, authorIndex) => (
                        <ListItem disableGutters disablePadding divider key={authorIndex} dense>
                          {author.name}
                        </ListItem>
                      ))}
                    </List>
                </CardContent>
                <CardMedia>
                  <Image 
                    src={book.img}
                    width={512}
                    height={515}
                    style={{
                      width: "100%",
                      height: "auto"
                    }}
                    alt={book.title} >
                  </Image>
                </CardMedia>
              </Card>
            </Grid>
          ))}
        </Grid>

      </main>
    </div>
  );
}
