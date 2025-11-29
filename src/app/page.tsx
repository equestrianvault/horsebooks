"use client";

import { Stack } from "@mui/material";
import { useState } from 'react';
import Footer from "./footer";
import Books from "./books";
import axios from "axios";
import { Menu } from "./menu";

export default function Home() {
  let defaultPage = 1;
  const BOOK_DATA_URL = "/.netlify/functions/books";
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

  return (
    <div className="flex min-h-screen items-center justify-center font-sans transparent">
      <main className="flex min-h-screen w-full max-w-12xl flex-col items-center justify-between py-32 px-16 sm:items-start transparent">
        <Stack direction={"column"}>
          <Menu pageChange={changePage} currentPage={currentPage} maxPage={data.maxPage}/>
          <Books books={data.books}/>
        </Stack>
        <Footer/>
      </main>
    </div>
  );
}
