"use client";

import { CssBaseline, Divider, Stack } from "@mui/material";
import { useState } from 'react';
import Footer from "./footer";
import Books from "./books";
import axios from "axios";
import { Menu } from "./menu";
import AppTheme from "./appTheme";

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://www.equestrianvault.com/' // Use relative path in production
  : 'http://localhost:8888/';

axios.defaults.baseURL = API_BASE_URL;

export default function Home() {
  let defaultPage = 1;
  const BOOK_DATA_URL = "/.netlify/functions/books";
  const [currentPage, setCurrrentPage] = useState(defaultPage);
  const [data, setData] = useState({books:[], currentPage: defaultPage, maxPage: defaultPage, pageSize:1});
  const [isLoading, setLoading] = useState(false);
  const [freshLoad, setFreshLoad] = useState(true);

  const fetchData = async (pageNumber : Number) => {
    setLoading(true);
    const response = await axios.get(`${BOOK_DATA_URL}`, {
      params: {
        pageNum: pageNumber
      }
    }).then((response) => {
      setCurrrentPage(response.data.currentPage);
      setData(response.data);
    }).catch((thrownError) => {
      console.log(thrownError)
    }).finally(() => {
      setLoading(false);
    });
  };

  function changePage(event: React.ChangeEvent<unknown>, pageNumber: Number) : void {
    console.debug(event);
    fetchData(pageNumber);
  };

  if(freshLoad){
    setFreshLoad(false);
    fetchData(1);
  }

  return (
    <AppTheme>
      <CssBaseline />
      <Stack flexGrow={1} flexDirection={"column"} sx={{pt: 6}}>
        <Menu pageChange={changePage} currentPage={currentPage} maxPage={data.maxPage}/>
        <Books books={data.books}/>
        <Divider/>
        <Footer/>
      </Stack>
    </AppTheme>
  );
}
