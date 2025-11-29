import Image from "next/image";
import { AppBar, Link, Pagination, PaginationItem, Stack, Typography } from "@mui/material";
import GitHubIcon from '@mui/icons-material/GitHub';
import CoffeeIcon from '@mui/icons-material/Coffee';
import KoFiIcon from "@/app/ko-fi-logo.png";
import EVIcon from "@/app/favicon.ico";


export function Menu({pageChange, currentPage, maxPage} : {pageChange:any, currentPage: number, maxPage: number} ){
  return(
    <AppBar sx={{backgroundColor: "rgb(63, 81, 181)"}} style={{ padding:4, width: "100%", flexDirection:"row"}} >
        <Image src={EVIcon} alt="Equestrian Vault Icon" style={{height:20, width: "auto"}}/>
        <Typography fontSize={"20px"} >Equestrian Vault</Typography>
        <Stack direction={"row"} alignContent={"flex-end"}>
          <Link target="_blank" href="https://github.com/equestrianvault/horsebooks" sx={{color:"white"}}><GitHubIcon/></Link>
          <Link target="_blank" href="https://ko-fi.com/tsitra_irl" sx={{color:"white"}}><Image src={KoFiIcon} alt={"Ko-fi"} style={{height: 20, width: "auto"}}></Image></Link>
            <Pagination onChange={pageChange} page={currentPage} count={maxPage} color="primary" variant="outlined" sx={{mx: "auto"}} siblingCount={1}
            renderItem={(item) => (
              <PaginationItem
                sx={{height: 20}}
                {...item}
              />
            )}
            />
        </Stack>
    </AppBar>
  );
}
