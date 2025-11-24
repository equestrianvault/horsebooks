"use client";

import { AppBar, Card, CardContent, CardHeader, CardMedia, Grid, List, ListItem, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from 'react';
import useSWR from 'swr';

const BOOK_DATA_URL = "/.netlify/functions/books";
const fetcher = (...args) => fetch(...args).then(res => res.json());

interface IBook{
  id : number;
	title : string;
	edition : string;
	img : string;
	dateAdded? : string;
	authors : Array<IAuthor>;
	links : Array<IBookLink>;
	tags? : Array<string>;
	rating? : string;
	expiry? : string;
}

interface IBookLink{
	title : string;
	url : string;
}

interface IAuthor{
	name : string;
	url? : string;
}

interface FetchResponseProps {
  onReturned?: Response,
  onRejected?: any
}


export default function Home() {
  const { data, error, isLoading } = useSWR(BOOK_DATA_URL, fetcher);
  if (error) return <Typography>{error}</Typography>
  if (isLoading) return <Typography>Loading...</Typography>;  
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-12xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <AppBar sx={{backgroundColor: "rgb(63, 81, 181)"}} >
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
        </AppBar>        
        <Grid 
          container 

          columns={{
            xl: 8,
            lg: 6,
            md: 4,
            sm: 3,
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
          {data.books.map((book: IBook, index) =>(
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
                    src={"window.svg"}
                    width={1}
                    height={1}
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
