import type { IBook } from "@/model/book";
import type { PaginatedBooksResponse } from "@/model/paginatedBooksResponse";
import type { Context } from "@netlify/functions";
import { neon } from '@netlify/neon';

const handler = async (request: Request, context: Context) => {
  
  const queryStringParameters = new URL(request.url).searchParams;
  const DEFAULT_PAGE_NUM = 1;
  const DEFAULT_PAGE_SIZE = 20;
  const MIN_PAGE_SIZE = 1;
  const MAX_PAGE_SIZE = 100;
  console.debug("RequestUrl:", request.url);
  console.debug("QueryStringParameters", queryStringParameters);
  
  let allowMature = false;
  let actualBooks = books;
 
  try{
    const sql = neon(); // automatically uses env NETLIFY_DATABASE_URL
    // const posts = await sql`SELECT * FROM posts`;
    const dbresult = await sql`SELECT *
FROM pg_catalog.pg_tables
WHERE schemaname != 'pg_catalog' AND
    schemaname != 'information_schema';`;
    console.log(dbresult);
    // console.log(posts);
  }catch(error){
    console.log(error);
  }

  allowMature = queryStringParameters.get("mature")?.toLowerCase() === "true";
  
  console.log("AllowMature:", allowMature)
  
  if(!allowMature){
    actualBooks = books.filter((book, index) => {
      return book.rating?.toLowerCase() !=  "m";
    });
  }
  
  let requestPageSize = Number(queryStringParameters.get("pageSize"));
  if(queryStringParameters.get("pageSize") === null || requestPageSize === undefined || requestPageSize === null || Number.isNaN(requestPageSize)) requestPageSize = DEFAULT_PAGE_SIZE;

  if (requestPageSize < MIN_PAGE_SIZE) return (new Response(JSON.stringify({message: "Minimum page size is " + MIN_PAGE_SIZE}), {status:400, headers: [["Content-Type", "application/json"],]}));
  if (requestPageSize > MAX_PAGE_SIZE) return (new Response(JSON.stringify({message: "Maximum page size is " + MAX_PAGE_SIZE}), {status:400, headers: [["Content-Type", "application/json"],]}));
  
  let requestPageNum = Number(queryStringParameters.get("pageNum"));
  if(queryStringParameters.get("pageNum") === null || requestPageNum === undefined || requestPageNum === null || Number.isNaN(requestPageNum)) requestPageNum = DEFAULT_PAGE_NUM;
  let beginningNum = (requestPageNum - 1) * requestPageSize;
  if (beginningNum > actualBooks.length || beginningNum < 0) return (new Response(JSON.stringify({message: "Pagination out of range"}), {status:400, headers: [["Content-Type", "application/json"],]}));
  
  let endNum = (requestPageNum) * requestPageSize;
  if (endNum >= actualBooks.length) endNum = actualBooks.length;
  const subset = actualBooks.slice(
    beginningNum,
    endNum
  );

  let lastPage = Math.ceil(actualBooks.length / requestPageSize);

  let responseBody : PaginatedBooksResponse = {
    books: subset,
    currentPage: requestPageNum,
    maxPage: lastPage,
    pageSize: requestPageSize
  };

  responseBody.books = subset;

  let response : Response = new Response(JSON.stringify(responseBody, null, 2), {status:200, headers: [["Content-Type", "application/json"],]} );
  return (response);

};

const books : Array<IBook> = [
  {
    "id": 1,
    "title": "Twilight's List",
    "edition": "3rd",
    "img": "/assets/twilights-list-large.jpg",
    "rating": "T",
    "dateAdded": "2018/12/28",
    "expiry": "2016/06/31",
    "authors": [
      {
        "name" : "Kittyhawk Contrail / kits",
        "url": "https://www.fimfiction.net/user/283/kits"
      },
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/21583/twilights-list",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.deviantart.com/kittyhawk-contrail/art/Twilight-s-List-Third-Edition-PDF-for-print-601163537",
        "title": "PDF"
      },
    ],
    "tags": [
      "ongoing", "unconfirmed", "fimfic", "PDF"
    ]
  }
  ,{
    "id": 2,
    "title": "Inner Glory",
    "edition": "6th",
    "img": "https://cdn-img.fimfiction.net/story/51kf-1432425685-15353-medium",
    "rating": "T",
    "dateAdded": "2018/12/28",
    "expiry": "2018/12/28",
    "authors":[
      {
        "name": "Erindor / Kirk Hamilton",
        "url": "https://www.fimfiction.net/user/17890/Erindor"
      },
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/15353/inner-glory",
        "title": "Fimfiction.net"
      },
    ],
    "tags": [
      "ongoing", "unconfirmed", "fimfic", "hardcover"
    ]
  }
  ,{
    "id": 3,
    "title": "I'll Always Be Here For You",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/l15z-1468382491-146025-medium",
    "rating": "T",
    "dateAdded": "2018/12/28",
    "expiry": "2016/09/14",
    "authors":[
      {
        "name": "The Abyss",
        "url": "https://www.fimfiction.net/user/76233/The+Abyss"
      },
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/146025/ill-always-be-here-for-you",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.fimfiction.net/blog/673075/scoots-book-important-update",
        "title": "Hardcover with Dust Cover"
      },
    ],
    "tags": [
      "ongoing", "unconfirmed", "fimfic", "hardcover"
    ]
  }

  ,{
    "id": 4,
    "title": "Doctor Whoof: The Complete Series - The Director's Cut",
    "edition": "1st",
    "img": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/intermediary/f/9a93f0ce-01ce-4762-bab8-b613b255da2a/d3wpiri-6976f42e-94a9-4b1f-91dd-e3bd00d8820b.jpg/v1/fill/w_900,h_815,q_70,strp/doctor_whoof__director_s_cut_by_thegoldencrowbar_d3wpiri-fullview.jpg",
    "rating": "E",
    "dateAdded": "2018/12/28",
    "authors":[
      {
        "name": "Jonathan Lopez / The Golden Crowbar",
        "url": "https://www.deviantart.com/thegoldencrowbar"
      },
    ],
    "links": [
      {
        "url": "https://thegoldencrowbar.deviantart.com/gallery/?q=doctor+whoof",
        "title": "DeviantArt"
      },
      {
        "url": "https://www.lulu.com/shop/jonathan-lopez/doctor-whoof-the-complete-series-directors-cut/hardcover/product-16671951.html",
        "title": "Hardcover"
      },
    ],
    "tags": [
      "on demand", "unconfirmed", "da", "hardcover"
    ]
  }
  ,{
    "id": 5,
    "title": "My Little Dashie",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/hx62-1432420758-1888-medium",
    "rating": "E",
    "dateAdded": "2018/12/28",
    "authors":[
      {
        "name": "ROBCakeran53",
        "url": "https://www.fimfiction.net/user/2538/ROBCakeran53"
      },
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/1888/my-little-dashie",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.thebookpatch.com/BookStore/my-little-dashie/9da85c66-b5a3-4186-9cf1-88f349068ce3",
        "title": "Paperback"
      },
    ],
    "tags": [
      "fimfic", "paperback"
    ]
  }
  ,{
    "id": 6,
    "title": "The Story of My Life",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/p9j5-1432434906-30494-medium",
    "rating": "E",
    "dateAdded": "2018/12/29",
    "authors":[
      {
        "name": "Xupla Mindblower",
        "url": "https://www.fimfiction.net/user/708/Mindblower"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/30494/the-story-of-my-life",
        "title": "Fimfiction.net"
      },{
        "url": "https://www.lulu.com/shop/xupla-mindblower/the-story-of-my-life/paperback/product-20404756.html",
        "title": "Paperback"
      }
    ],
    "tags": [
      "fimfic", "on demand", "paperback"
    ]
  }
  ,{
    "id": 7,
    "title": "The Stranger and Her Friend",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/av08-1551073366-20514-medium",
    "rating": "T",
    "dateAdded": "2018/12/29",
    "authors":[
      {
        "name": "Tyler J. Barton / The Urban Moose",
        "url": "https://www.fimfiction.net/user/17188/TheUrbanMoose"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/20514/the-stranger-and-her-friend",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/tyler-j-barton/the-stranger-and-her-friend/hardcover/product-21422889.html",
        "title": "Matte Hardcover with Dust Cover"
      },
      {
        "url": "https://www.lulu.com/shop/tyler-barton/the-stranger-and-her-friend/hardcover/product-21422926.html",
        "title": "Glossy Hardcover with Dust Cover"
      },
      {
        "url": "https://www.lulu.com/shop/tyler-barton/the-stranger-and-her-friend/paperback/product-21422895.html",
        "title": "Paperback"
      }
    ],
    "tags": [
      "fimfic", "on demand", "hardcover", "dust cover", "paperback"
    ]
  }
  ,{
    "id": 8,
    "title": "The Tale of Saving Grace",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/7mbf-1432461341-71498-medium",
    "rating": "E",
    "dateAdded": "2018/12/29",
    "authors":[
      {
        "name": "Tyler Weiss / Cold Spike",
        "url": "https://www.fimfiction.net/user/63659/Cold+Spike"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/71498/the-tale-of-saving-grace",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/tyler-weiss/the-tale-of-saving-grace/paperback/product-21251555.html",
        "title": "Paperback"
      }
    ],
    "tags": [
      "fimfic", "on demand", "paperback"
    ]
  }
  ,{
    "id": 9,
    "title": "The Hope Called Night: Firstborn",
    "edition": "1st",
    "img": "https://assets.lulu.com/cover_thumbs/1/p/1penvpk5-front-shortedge-384.jpg",
    "rating": "?",
    "dateAdded": "2018/12/29",
    "authors":[
      {
        "name": "Shaelyn Green",
      }
    ],
    "links": [
      {
        "url": "https://www.lulu.com/shop/shaelyn-green/the-hope-called-night-firstborn/hardcover/product-21584438.html",
        "title": "Hardcover"
      }
    ],
    "tags": [
      "on demand", "hardcover"
    ]
  }
  ,{
    "id": 11,
    "title": "Daring Do Adventures #1: Daring Do and the Quest for the Sapphire Stone",
    "edition": "1st",
    "img": "https://assets.lulu.com/cover_thumbs/1/p/1pynvk2g-front-shortedge-384.jpg",
    "rating": "E",
    "dateAdded": "2018/12/29",
    "authors":[
      {
        "name": "Jordan McCarty / lukjad",
        "url": "https://www.fimfiction.net/user/12359/lukjad"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/9787/daring-do-adventures-1-daring-do-and-the-quest-for-the-sapphire-stone",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/jordyn-mccarty/my-paperback-book/paperback/product-22624966.html",
        "title": "Saddle-Stitched Paperback"
      }
    ],
    "tags": [
      "fimfic", "on demand", "paperback"
    ]
  }
  ,{
    "id": 12,
    "title": "Memoirs of a Magic Earth Pony",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/idmb-1432610188-256252-medium",
    "rating": "T",
    "dateAdded": "2018/12/29",
    "authors":[
      {
        "name": "The Lunar Samurai",
        "url": "https://www.fimfiction.net/user/71066/The+Lunar+Samurai"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/256252/memoirs-of-a-magic-earth-pony",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/the-lunar-samurai/memiors-of-a-magic-earth-pony/hardcover/product-22722529.html",
        "title": "Hardcover"
      }
    ],
    "tags": [
      "fimfic", "on demand", "hardcover"
    ]
  }
  ,{
    "id": 13,
    "title": "Of Horses And Whorses",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/xwu5-1432496409-119631-medium",
    "rating": "T",
    "dateAdded": "2018/12/29",
    "authors":[
      {
        "name": "GeodesicDragon",
        "url": "https://www.fimfiction.net/user/51028/GeodesicDragon"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/119631/of-horses-and-whorses",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/geodesicdragon-/of-horses-and-whorses/paperback/product-wn528p.html",
        "title": "Paperback"
      }
    ],
    "tags": [
      "fimfic", "on demand", "paperback"
    ]
  }
  ,{
    "id":14,
    "title": "The Celestia Code",
    "edition": "2nd",
    "img": "https://cdn-img.fimfiction.net/story/pzq1-1432512521-141549-medium",
    "rating": "T",
    "dateAdded": "2018/12/29",
    "expiry": "2020/11/18",
    "authors":[
      {
        "name": "iisaw",
        "url": "https://www.fimfiction.net/user/33084/iisaw"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/141549/the-celestia-code",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/iisaw/the-celestia-code/hardcover/product-22765383.html",
        "title": "Hardcover with Dust Cover"
      },
      {
        "url": "https://www.lulu.com/shop/iisaw/the-celestia-code/hardcover/product-22765393.html",
        "title": "Hardcover"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "dust cover", "on demand", "celestia code"
    ]
  }
  ,{
    "id": 15,
    "title": "The Luna Cypher",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/5ver-1432555680-175385-medium",
    "rating": "T",
    "dateAdded": "2018/12/29",
    "expiry": "2020/11/18",
    "authors":[
      {
        "name": "iisaw",
        "url": "https://www.fimfiction.net/user/33084/iisaw"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/175385/the-luna-cypher",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/iisaw/the-luna-cypher/hardcover/product-22790267.html",
        "title": "Hardcover with Dust Cover"
      },
      {
        "url": "https://www.lulu.com/shop/iisaw/the-luna-cypher/hardcover/product-22790291.html",
        "title": "Hardcover"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "dust cover", "on demand", "celestia code"
    ]
  }
  ,{
    "id": 16,
    "title": "The Twilight Enigma",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/ckwi-1432614757-264005-medium",
    "rating": "T",
    "dateAdded": "2018/12/29",
    "expiry": "2020/11/18",
    "authors":[
      {
        "name": "iisaw",
        "url": "https://www.fimfiction.net/user/33084/iisaw"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/264005/the-twilight-enigma",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/iisaw/the-twilight-enigma/hardcover/product-22800704.html",
        "title": "Hardcover with Dust Cover"
      },
      {
        "url": "https://www.lulu.com/shop/iisaw/the-twilight-enigma/hardcover/product-22800738.html",
        "title": "Hardcover"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "dust cover", "on demand", "celestia code"
    ]
  }
  ,{
    "id": 17,
    "title": "Change of Life",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/qemv-1432512464-141487-medium",
    "rating": "T",
    "dateAdded": "2018/12/29",
    "authors":[
      {
        "name": "Bernard Doove / Goldfur",
        "url": "https://www.fimfiction.net/user/84240/Goldfur"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/141487/change-of-life",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.amazon.com/Change-Life-Bernard-Doove/dp/149482177X/",
        "title": "Paperback"
      }
    ],
    "tags": [
      "fimfic", "paperback"
    ]
  }
  ,{
    "id": 18,
    "title": "Growing Up Dandy",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/wpwe-1432528424-163295-medium",
    "rating": "T",
    "dateAdded": "2018/12/29",
    "authors":[
      {
        "name": "Bernard Doove / Goldfur",
        "url": "https://www.fimfiction.net/user/84240/Goldfur"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/163295/growing-up-dandy",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.amazon.com/Growing-Up-Dandy-Bernard-Doove/dp/1499388470/",
        "title": "Paperback"
      }
    ],
    "tags": [
      "fimfic", "paperback"
    ]
  }
  ,{
    "id": 19,
    "title": "Conversations in a Canterlot Cafe",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/ku63-1432567814-192085-medium",
    "rating": "E",
    "dateAdded": "2018/12/29",
    "authors":[
      {
        "name": "Bernard Doove / Goldfur",
        "url": "https://www.fimfiction.net/user/84240/Goldfur"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/192085/conversations-in-a-canterlot-caf",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.amazon.com/Conversations-In-A-Canterlot-Cafe/dp/1505411041/",
        "title": "Paperback"
      }
    ],
    "tags": [
      "fimfic", "paperback"
    ]
  }
  ,{
    "id": 20,
    "title": "A Different Perspective",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/mmqe-1432603448-246414-medium",
    "rating": "T",
    "dateAdded": "2018/12/29",
    "authors":[
      {
        "name": "Bernard Doove / Goldfur",
        "url": "https://www.fimfiction.net/user/84240/Goldfur"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/246414/a-different-perspective",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.amazon.com/Different-Perspective-Bernard-Doove/dp/1519185537/",
        "title": "Paperback"
      }
    ],
    "tags": [
      "fimfic", "paperback"
    ]
  }
  ,{
    "id": 21,
    "title": "The Growing Years",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/lova-1483240287-296939-medium",
    "rating": "T",
    "dateAdded": "2018/12/29",
    "authors":[
      {
        "name": "Bernard Doove / Goldfur",
        "url": "https://www.fimfiction.net/user/84240/Goldfur"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/296939/the-growing-years",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.amazon.com/Growing-Years-Bernard-Doove/dp/1532898851/",
        "title": "Paperback"
      }
    ],
    "tags": [
      "fimfic", "paperback"
    ]
  }
  ,{
    "id": 22,
    "title": "Daring Do and the Quest for the Sapphire Stone",
    "edition": "A.K. Yearling Version",
    "img": "https://cdn-img.fimfiction.net/story/m9ih-1432567185-191159-medium",
    "rating": "E",
    "dateAdded": "2018/12/29",
    "authors":[
      {
        "name": "Craig Woodward / Almanac Pony",
        "url": "https://www.fimfiction.net/user/186684/AlmanacP"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/191159/1/series-1-daring-do-and-the-alicorn-secret-saga/1-daring-do-and-the-quest-for-the-sapphire-stone",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://almanacpony.tictail.com/product/daring-do-and-the-quest-for-the-sapphire-stone-akyearling-version",
        "title": "Hardcover"
      },
      {
        "url": "https://almanacpony.tictail.com/product/daring-do-and-the-quest-for-the-sapphire-stone-ak-yearling-dust-jacket-bw",
        "title": "Hardcover with Dust Cover"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "dustcover", "Daring Do and the Alicorn Secret Saga"
    ]
  }
  ,{
    "id": 23,
    "title": "Daring Do and the Quest for the Sapphire Stone",
    "edition": "Almanac Version",
    "img": "https://cdn-img.fimfiction.net/story/m9ih-1432567185-191159-medium",
    "rating": "E",
    "dateAdded": "2018/12/29",
    "authors":[
      {
        "name": "Craig Woodward / Almanac Pony",
        "url": "https://www.fimfiction.net/user/186684/AlmanacP"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/191159/1/series-1-daring-do-and-the-alicorn-secret-saga/1-daring-do-and-the-quest-for-the-sapphire-stone",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://almanacpony.tictail.com/product/daring-do-and-the-quest-for-the-sapphire-stone-almanac-version",
        "title": "Hardcover"
      },
      {
        "url": "https://almanacpony.tictail.com/product/daring-do-and-the-sapphire-stone-dust-jacket-bw",
        "title": "Hardcover with Dust Cover"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "dustcover", "Daring Do and the Alicorn Secret Saga"
    ]
  }
  ,{
    "id": 24,
    "title": "Daring Do and the Griffon's Goblet",
    "edition": "A.K. Yearling Version",
    "img": "https://cdn-img.fimfiction.net/story/m9ih-1432567185-191159-medium",
    "rating": "E",
    "dateAdded": "2018/12/29",
    "authors":[
      {
        "name": "Craig Woodward / Almanac Pony",
        "url": "https://www.fimfiction.net/user/186684/AlmanacP"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/191159/2/series-1-daring-do-and-the-alicorn-secret-saga/2-daring-do-and-the-griffons-goblet",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://almanacpony.tictail.com/product/preorder-daring-do-and-the-griffons-goblet-akyearling-version",
        "title": "Hardcover"
      },
      {
        "url": "https://almanacpony.tictail.com/product/preorder-daring-do-and-the-griffons-goblet-ak-yearling-dust-jacket-bw",
        "title": "Hardcover with Dust Cover"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "dustcover", "Daring Do and the Alicorn Secret Saga"
    ]
  }
  ,{
    "id": 25,
    "title": "Past Sins",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/jmlf-1432441823-41596-medium",
    "rating": "T",
    "dateAdded": "2018/12/29",
    "authors":[
      {
        "name": "Pen Stroke",
        "url": "https://www.fimfiction.net/user/3291/Pen+Stroke"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/41596/past-sins",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.ministryofimage.net/product-page/past-sins",
        "title": "Hardcover"
      },
      {
        "url": "https://www.thebookpatch.com/BookStore/past-sins/35b50398-956a-4890-8868-21ef8f58d904",
        "title": "Paperback"
      }
    ],
    "tags": [
      "fimfic", "paperback", "hardcover"
    ]
  }
  ,{
    "id": 27,
    "title": "Torchwood: The New Equestria Files",
    "edition": "1st",
    "img": "https://assets.lulu.com/cover_thumbs/1/9/19q4n98e-front-shortedge-384.jpg",
    "rating": "M",
    "dateAdded": "2018/12/29",
    "authors":[
      {
        "name": "Jonathan Lopez / The Golden Crowbar",
        "url": "https://www.deviantart.com/thegoldencrowbar"
      }
    ],
    "links": [
      {
        "url": "https://thegoldencrowbar.deviantart.com/gallery/?catpath=%2F&q=torchwood",
        "title": "DeviantArt"
      },
      {
        "url": "https://www.lulu.com/shop/jonathan-lopez/torchwood-the-new-equestria-files/paperback/product-16532790.html",
        "title": "Paperback"
      }
    ],
    "tags": [
      "da", "paperback"
    ]
  }
  ,{
    "id": 28,
    "title": "The Pegasus Device",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/l8tn-1432421974-5381-medium",
    "rating": "M",
    "dateAdded": "2018/12/29",
    "authors":[
      {
        "name": "Aurora Dawn",
        "url": "https://www.fimfiction.net/user/6949/AuroraDawn"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/5381/rainbow-factory",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/en/ca/shop/auroradawn-and-spectrasus-/the-pegasus-device/hardcover/product-k6zr75.html",
        "title": "Hardcover"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "on demand", "rainbow factory", "weather worker's song", "rainbow's factory", "reckoning", "pegasus device"
    ]
  }
  ,{
    "id": 29,
    "title": "Hail Mary",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/ubpl-1432504294-130470-medium",
    "rating": "M",
    "dateAdded": "2018/12/29",
    "authors":[
      {
        "name": "Ezrienel & Arby Works",
        "url": "https://www.fimfiction.net/user/125075/Ezrienel"
      }
    ],
    "links": [
      {
        "url": "https://fimfetch.net/story/130470/hail-mary",
        "title": "Fimfetch.net"
      },
      {
        "url": "https://www.lulu.com/shop/arby-works-and-ezrienel/hail-mary/paperback/product-21378699.html",
        "title": "Paperback"
      }
    ],
    "tags": [
      "fimfic", "paperback", "on demand"
    ]
  }
  ,{
    "id": 30,
    "title": "The Lost Element",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/jc9u-1432445686-47607-medium",
    "rating": "M",
    "dateAdded": "2018/12/30",
    "authors":[
      {
        "name": "Humanity",
        "url": "https://www.fimfiction.net/user/57410/Humanity"
      },
      {
        "name": "Ashton Crimson",
        "url": "https://www.lulu.com/search?contributor=Ashton+Crimson"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/47607/the-lost-element",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/ashton-crimson/the-lost-element-vol-1-a-newcomer-in-equestria-part-1/paperback/product-22857031.html",
        "title": "Paperback (Part 1)"
      },
      {
        "url": "https://www.lulu.com/shop/ashton-crimson/the-lost-element-vol-1-a-newcomer-in-equestria-part-2/paperback/product-22857036.html",
        "title": "Paperback (Part 2)"
      }
    ],
    "tags": [
      "fimfic", "paperback", "on demand"
    ]
  }
  ,{
    "id": 31,
    "title": "Silly Lyra: The Comic Series #1-15",
    "edition": "1st",
    "img": "https://i.etsystatic.com/11531913/r/il/a2f707/911315317/il_fullxfull.911315317_lsem.jpg",
    "rating": "E",
    "dateAdded": "2018/12/30",
    "authors":[
      {
        "name": "Dori-to Pony",
        "url": "https://www.deviantart.com/dori-to"
      }
    ],
    "links": [
      {
        "url": "https://dori-to.deviantart.com/gallery/",
        "title": "DeviantArt"
      },
      {
        "url": "http://tacohatstudios.com/",
        "title": "Saddle-Stitched Paperback (TacoHatStudios)"
      }
    ],
    "tags": [
      "da", "comic", "paperback"
    ]
  }
  ,{
    "id": 32,
    "title": "Bound Together",
    "edition": "1st",
    "img": "https://i.imgur.com/0kc8cMn.jpg",
    "rating": "E",
    "dateAdded": "2018/12/30",
    "authors":[
      {
        "name": "KefkaFloyd",
      },
      {
        "name": "Adlynh",
      },
      {
        "name": "Bakertoons",
      },
      {
        "name": "Centchi",
      },
      {
        "name": "Emberwisp",
      },
      {
        "name": "fxcellent",
      },
      {
        "name": "Jowybean",
      },
      {
        "name": "Leekfish",
      },
      {
        "name": "Muffinshire",
      },
      {
        "name": "Pasteur",
      },
      {
        "name": "Ponywise",
      },
      {
        "name": "Sofas And Quills",
      },
      {
        "name": "Spectralunicorn",
      },
      {
        "name": "Starry Night",
      },
      {
        "name": "Steve Holt",
      }
    ],
    "links": [
      {
        "url": "https://broniesforgood.org/bound-together/",
        "title": "Paperback"
      }
    ],
    "tags": [
      "paperback", "artbook", "on demand"
    ]
  }
  ,{
    "id": 33,
    "title": "Book of Gaia: EQUESTRIA, Volume 1",
    "edition": "1st",
    "img": "https://bookshow.blurb.com/bookshow/cache/P10411283/md/cover_2.jpeg?access_key=acd0fbe68a29ea7815af9e0575dabb3b",
    "rating": "E",
    "dateAdded": "2018/12/30",
    "authors":[
      {
        "name": "Earthsong9405",
        "url": ""
      }
    ],
    "links": [
      {
        "url": "https://www.blurb.com/bookstore/invited/5774309/c9e396a7a185ec31d3f6328cf3a7dc54a33f79e1",
        "title": "Paperback"
      }
    ],
    "tags": [
      "paperback"
    ]
  }
  ,{
    "id": 34,
    "title": "My Little Pony: Revenge of the Villains",
    "edition": "1st",
    "img": "https://assets.lulu.com/browse/product_thumbnail.php?productId=21038899&resolution=320",
    "rating": "E",
    "dateAdded": "2018/12/30",
    "expiry": "2020/11/01",
    "authors":[
      {
        "name": "Thomas Taylor",
        "url": ""
      }
    ],
    "links": [
      {
        "url": "https://www.lulu.com/shop/thomas-taylor/my-little-pony/paperback/product-21038899.html",
        "title": "Paperback"
      }
    ],
    "tags": [
      "paperback", "on demand", "comic"
    ]
  }
  ,{
    "id": 35,
    "title": "Rainbow Light and Friends: A Coloring Book",
    "edition": "1st",
    "img": "https://assets.lulu.com/cover_thumbs/1/p/1peg625k-front-shortedge-384.jpg",
    "rating": "E",
    "dateAdded": "2018/12/30",
    "authors":[
      {
        "name": "Sarah Sellers",
        "url": ""
      }
    ],
    "links": [
      {
        "url": "https://www.lulu.com/shop/sarah-sellers/rainbow-light-and-friends-a-coloring-book/paperback/product-20596075.html",
        "title": "Paperback"
      }
    ],
    "tags": [
      "coloring book", "on demand"
    ]
  }
  ,{
    "id": 36,
    "title": "Mlp Comic",
    "edition": "1st",
    "img": "https://assets.lulu.com/cover_thumbs/1/9/19zjyz79-front-shortedge-384.jpg",
    "rating": "E",
    "dateAdded": "2018/12/30",
    "authors":[
      {
        "name": "Polly Lewis",
        "url": ""
      }
    ],
    "links": [
      {
        "url": "https://www.lulu.com/shop/polly-lewis/mlp-comic/paperback/product-21267574.html",
        "title": "Saddle-Stitched Paperback"
      }
    ],
    "tags": [
      "paperback", "comic"
    ]
  }
  ,{
    "id": 37,
    "title": "Equestria",
    "edition": "1st",
    "img": "https://assets.lulu.com/cover_thumbs/1/g/1g8jk278-front-shortedge-384.jpg",
    "rating": "E",
    "dateAdded": "2018/12/30",
    "authors":[
      {
        "name": "Ryan Compton",
        "url": ""
      }
    ],
    "links": [
      {
        "url": "https://www.lulu.com/shop/ryan-compton/equestria/paperback/product-22147894.html",
        "title": "Paperback"
      }
    ],
    "tags": [
      "paperback", "art", "drawing", "on demand"
    ]
  }
  ,{
    "id": 38,
    "title": "Mi álbum",
    "edition": "1st",
    "img": "https://assets.lulu.com/browse/product_thumbnail.php?productId=22759210&resolution=320",
    "rating": "E",
    "dateAdded": "2018/12/30",
    "expiry": "2020/11/01",
    "authors":[
      {
        "name": "(Various)",
        "url": ""
      }
    ],
    "links": [
      {
        "url": "https://www.lulu.com/shop/mi-%C3%A1lbum/hardcover/product-22759210.html",
        "title": "Hardcover"
      }
    ],
    "tags": [
      "on demand", "art", "hardcover"
    ]
  }
  ,{
    "id": 82,
    "title": "Brony: The Unexpected Adult Fandom of \"My Little Pony, Friendship is Magic\"",
    "edition": "1st",
    "img": "https://bookshow.blurb.com/bookshow/cache/P6776240/md/cover_2.jpeg?access_key=ff14ccf932326520756ff32db2f8d6a2",
    "rating": "E",
    "dateAdded": "2018/12/30",
    "authors":[
      {
        "name": "Sandra Davis",
        "url": ""
      }
    ],
    "links": [
      {
        "url": "https://www.blurb.com/b/4234406-brony-the-unexpected-adult-fandom-of-my-little-pon",
        "title": "Paperback"
      },
      {
        "url": "https://www.blurb.com/b/4234406-brony-the-unexpected-adult-fandom-of-my-little-pon",
        "title": "Hardcover"
      },
      {
        "url": "https://www.blurb.com/b/4234406-brony-the-unexpected-adult-fandom-of-my-little-pon",
        "title": "Hardcover with Dust Cover"
      }
    ],
    "tags": [
      "art", "paperback", "hard cover", "dust cover"
    ]
  }
  ,{
    "id": 39,
    "title": "Cutey Confidential 2015 - Standard Edition",
    "edition": "1st",
    "img": "https://assets.lulu.com/browse/product_thumbnail.php?productId=21954294&resolution=320",
    "rating": "M",
    "dateAdded": "2018/12/30",
    "expiry": "2020/11/01",
    "authors":[
      {
        "name": "Iris Trismegistus",
        "url": "https://www.lulu.com/shop/search.ep?contributorId=1299801"
      }
    ],
    "links": [
      {
        "url": "https://www.lulu.com/shop/iris-trismegistus/cutey-confidential-2015-standard-edition/calendar/product-21954294.html",
        "title": "2015 Calendar"
      }
    ],
    "tags": [
      "calendar", "on demand"
    ]
  }
  ,{
    "id": 40,
    "title": "Cutey Confidential 2015 - Premium Edition",
    "edition": "1st",
    "img": "https://assets.lulu.com/browse/product_thumbnail.php?productId=21954275&resolution=320",
    "rating": "M",
    "dateAdded": "2020/11/01",
    "authors":[
      {
        "name": "Iris Trismegistus",
        "url": "https://www.lulu.com/shop/search.ep?contributorId=1299801"
      }
    ],
    "links": [
      {
        "url": "https://www.lulu.com/shop/iris-trismegistus/cutey-confidential-2015-premium-edition/calendar/product-21954275.html",
        "title": "2015 Calendar"
      }
    ],
    "tags": [
      "calendar", "on demand"
    ]
  }
  ,{
    "id": 41,
    "title": "My Little Sweetheart",
    "edition": "1st",
    "img": "https://assets.lulu.com/cover_thumbs/1/r/1re549w4-front-shortedge-384.jpg",
    "rating": "M",
    "dateAdded": "2018/12/30",
    "authors":[
      {
        "name": "Iris Trismegistus",
        "url": "https://www.lulu.com/shop/search.ep?contributorId=1299801"
      }
    ],
    "links": [
      {
        "url": "https://www.lulu.com/shop/iris-trismegistus/my-little-sweetheart/paperback/product-21966176.html",
        "title": "Paperback"
      }
    ],
    "tags": [
      "paperback", "on demand", "art"
    ]
  }
  ,{
    "id": 42,
    "title": "My Little Sweetheart Too!",
    "edition": "1st",
    "img": "https://assets.lulu.com/cover_thumbs/1/4/14m7dpyw-front-shortedge-384.jpg",
    "rating": "M",
    "dateAdded": "2018/12/30",
    "authors":[
      {
        "name": "Iris Trismegistus",
        "url": "https://www.lulu.com/shop/search.ep?contributorId=1299801"
      }
    ],
    "links": [
      {
        "url": "https://www.lulu.com/shop/iris-trismegistus/my-little-sweetheart-too/paperback/product-21966290.html",
        "title": "Paperback"
      }
    ],
    "tags": [
      "paperback", "on demand", "art"
    ]
  }
  ,{
    "id": 43,
    "title": "My Little Sweetheart 3",
    "edition": "1st",
    "img": "https://assets.lulu.com/cover_thumbs/1/j/1jn789r2-front-shortedge-384.jpg",
    "rating": "M",
    "dateAdded": "2018/12/30",
    "authors":[
      {
        "name": "Iris Trismegistus",
        "url": "https://www.lulu.com/shop/search.ep?contributorId=1299801"
      }
    ],
    "links": [
      {
        "url": "https://www.lulu.com/shop/iris-trismegistus/my-little-sweetheart-3/paperback/product-21774461.html",
        "title": "Paperback"
      }
    ],
    "tags": [
      "paperback", "on demand", "art"
    ]
  }
  ,{
    "id": 44,
    "title": "My Little Sweetheart 4",
    "edition": "1st",
    "img": "https://assets.lulu.com/cover_thumbs/1/7/179pvqnk-front-shortedge-384.jpg",
    "rating": "M",
    "dateAdded": "2018/12/30",
    "authors":[
      {
        "name": "Iris Trismegistus",
        "url": "https://www.lulu.com/shop/search.ep?contributorId=1299801"
      }
    ],
    "links": [
      {
        "url": "https://www.lulu.com/shop/iris-trismegistus/my-little-sweetheart-4/paperback/product-21928579.html",
        "title": "Paperback"
      }
    ],
    "tags": [
      "paperback", "on demand", "art"
    ]
  }
  ,{
    "id": 45,
    "title": "My Little Sweetheart 5",
    "edition": "1st",
    "img": "https://assets.lulu.com/cover_thumbs/1/v/1v4wmd5k-front-shortedge-384.jpg",
    "rating": "M",
    "dateAdded": "2018/12/30",
    "authors":[
      {
        "name": "Iris Trismegistus",
        "url": "https://www.lulu.com/shop/search.ep?contributorId=1299801"
      }
    ],
    "links": [
      {
        "url": "https://www.lulu.com/shop/iris-trismegistus/my-little-sweetheart-5/paperback/product-22565505.html",
        "title": "Paperback"
      }
    ],
    "tags": [
      "paperback", "on demand", "art"
    ]
  }
  ,{
    "id": 46,
    "title": "All Aboard",
    "edition": "1st",
    "img": "https://assets.bigcartel.com/product_images/194720581/comicsquare1.png?auto=format&fit=max&h=1000&w=1000",
    "rating": "M",
    "dateAdded": "2018/12/30",
    "authors":[
      {
        "name": "Braeburned",
        "url": ""
      }
    ],
    "links": [
      {
        "url": "https://braeburned.bigcartel.com/product/all-aboard",
        "title": "Signed Paperback"
      }
    ],
    "tags": [
      "paperback", "on demand", "comic", "signed"
    ]
  }
  ,{
    "id": 47,
    "title": "Fallout: Equestria (AE)",
    "edition": "4th",
    "img": "https://cdn-img.fimfiction.net/story/fuca-1432496101-119190-medium",
    "rating": "M",
    "dateAdded": "2018/12/30",
    "expiry": "2019/01/11",
    "authors":[
      {
        "name": "kkat",
        "url": "https://www.fimfiction.net/user/10369/Kkat"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/119190/fallout-equestria",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://book.fallout-equestria.com/forum/viewtopic.php?t=502&sid=78a342cf1e313e52226f99defecb9403",
        "title": "Information"
      },
      {
        "url": "https://goo.gl/WqLp2P",
        "title": "Preorder Signups (Ends 2019/01/10)"
      }
    ],
    "tags": [
      "fimfic", "preorder", "foe"
    ]
  }
  ,{
    "id": 48,
    "title": "Long Road to Friendship",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/27gh-1465629116-144198-medium",
    "rating": "T",
    "dateAdded": "2018/12/30",
    "authors":[
      {
        "name": "The Albinocorn",
        "url": "https://www.fimfiction.net/user/49989/The+Albinocorn"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/144198/long-road-to-friendship",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.ministryofimage.net/product-page/long-road-to-friendship",
        "title": "Hardcover"
      }
    ],
    "tags": [
      "fimfic", "hardcover"
    ]
  }
  ,{
    "id": 49,
    "title": "Austraeoh",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/z2ob-1475481445-25966-medium",
    "rating": "T",
    "dateAdded": "2018/12/30",
    "authors":[
      {
        "name": "Imploding Colon",
        "url": "https://www.fimfiction.net/user/32973/Imploding+Colon"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/25966/austraeoh",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/imploding-colon/austraeoh/hardcover/product-23207117.html",
        "title": "Hardcover"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "austraeoh", "on demand"
    ]
  }
  ,{
    "id": 50,
    "title": "Eljunbyro",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/relc-1475481490-57450-medium",
    "rating": "T",
    "dateAdded": "2018/12/30",
    "authors":[
      {
        "name": "Imploding Colon",
        "url": "https://www.fimfiction.net/user/32973/Imploding+Colon"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/57450/eljunbyro",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/imploding-colon/eljunbyro/hardcover/product-23212174.html",
        "title": "Hardcover"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "austraeoh", "on demand"
    ]
  }
  ,{
    "id": 51,
    "title": "Innavedr",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/mvlg-1475481515-88713-medium",
    "rating": "T",
    "dateAdded": "2018/12/30",
    "authors":[
      {
        "name": "Imploding Colon",
        "url": "https://www.fimfiction.net/user/32973/Imploding+Colon"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/88713/innavedr",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/imploding-colon/innavedr-vol-1/hardcover/product-23205794.html",
        "title": "Hardcover - Volume 1"
      },
      {
        "url": "https://www.lulu.com/shop/imploding-colon/innavedr-vol-2/hardcover/product-23205798.html",
        "title": "Hardcover - Volume 2"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "austraeoh", "on demand"
    ]
  }
  ,{
    "id": 52,
    "title": "Odrsjot",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/2er9-1475481603-126689-medium",
    "rating": "T",
    "dateAdded": "2018/12/30",
    "authors":[
      {
        "name": "Imploding Colon",
        "url": "https://www.fimfiction.net/user/32973/Imploding+Colon"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/126689/odrsjot",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/imploding-colon/odrsjot-vol-1/hardcover/product-23205803.html",
        "title": "Hardcover - Volume 1"
      },
      {
        "url": "https://www.lulu.com/shop/imploding-colon/odrsjot-vol-2/hardcover/product-23226423.html",
        "title": "Hardcover - Volume 2"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "austraeoh", "on demand"
    ]
  }
  ,{
    "id": 53,
    "title": "Urohringr",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/4ojh-1475481700-171718-medium",
    "rating": "T",
    "dateAdded": "2018/12/30",
    "authors":[
      {
        "name": "Imploding Colon",
        "url": "https://www.fimfiction.net/user/32973/Imploding+Colon"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/171718/urohringr",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/imploding-colon/urohringr-vol-1/hardcover/product-23210180.html",
        "title": "Hardcover - Volume 1"
      },
      {
        "url": "https://www.lulu.com/shop/imploding-colon/urohringr-vol-2/hardcover/product-23210183.html",
        "title": "Hardcover - Volume 2"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "austraeoh", "on demand"
    ]
  }
  ,{
    "id": 54,
    "title": "Yaerfaerda",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/1742-1475481733-213020-medium",
    "rating": "T",
    "dateAdded": "2018/12/30",
    "authors":[
      {
        "name": "Imploding Colon",
        "url": "https://www.fimfiction.net/user/32973/Imploding+Colon"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/213020/yaerfaerda",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/imploding-colon/yaerfaerda-vol-1/hardcover/product-23210188.html",
        "title": "Hardcover - Volume 1"
      },
      {
        "url": "https://www.lulu.com/shop/imploding-colon/yaerfaerda-vol-2/hardcover/product-23210194.html",
        "title": "Hardcover - Volume 2"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "austraeoh", "on demand"
    ]
  }
  ,{
    "id": 55,
    "title": "Ynanhluutr",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/mfit-1475481758-254555-medium",
    "rating": "T",
    "dateAdded": "2018/12/30",
    "authors":[
      {
        "name": "Imploding Colon",
        "url": "https://www.fimfiction.net/user/32973/Imploding+Colon"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/254555/ynanhluutr",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/imploding-colon/ynanhluutr-vol-1/hardcover/product-23210196.html",
        "title": "Hardcover - Volume 1"
      },
      {
        "url": "https://www.lulu.com/shop/imploding-colon/ynanhluutr-vol-2/hardcover/product-23210197.html",
        "title": "Hardcover - Volume 2"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "austraeoh", "on demand"
    ]
  }
  ,{
    "id": 56,
    "title": "Utaan",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/xw4c-1475481789-290208-medium",
    "rating": "T",
    "dateAdded": "2018/12/30",
    "authors":[
      {
        "name": "Imploding Colon",
        "url": "https://www.fimfiction.net/user/32973/Imploding+Colon"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/290208/utaan",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/imploding-colon/utaan-vol-1/hardcover/product-23285190.html",
        "title": "Hardcover - Volume 1"
      },
      {
        "url": "https://www.lulu.com/shop/imploding-colon/utaan-vol-2/hardcover/product-23285193.html",
        "title": "Hardcover - Volume 2"
      },
      {
        "url": "https://www.lulu.com/shop/imploding-colon/utaan-vol-3/hardcover/product-23285196.html",
        "title": "Hardcover - Volume 3"
      },
      {
        "url": "https://www.lulu.com/shop/imploding-colon/utaan-vol-4/hardcover/product-23285198.html",
        "title": "Hardcover - Volume 4"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "austraeoh", "on demand"
    ]
  }
  ,{
    "id": 57,
    "title": "Crystal's Wishes",
    "edition": "2nd",
    "img": "https://cdn-img.fimfiction.net/story/e497-1491747873-230097-medium",
    "rating": "T",
    "dateAdded": "2018/12/30",
    "expiry": "2022/06/13",
    "authors":[
      {
        "name": "Crystal Wishes",
        "url": "https://www.fimfiction.net/user/181476/Crystal+Wishes"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/230097/crystals-wishes",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/crystal/crystals-wishes-once-upon-a-time/hardcover/product-23189113.html",
        "title": "Hardcover with Dust Cover"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "dust cover", "on demand"
    ]
  }
  ,{
    "id": 58,
    "title": "Memoirs of a Royal Guard",
    "edition": "2nd",
    "img": "https://cdn-img.fimfiction.net/story/arge-1461444387-230095-medium",
    "rating": "T",
    "dateAdded": "2018/12/30",
    "expiry": "2022/02/09",
    "authors":[
      {
        "name": "Anzel",
        "url": "https://www.fimfiction.net/user/210160/Anzel"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/230095/memoirs-of-a-royal-guard",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/anzel/memoirs-of-a-royal-guard-2nd-printing/hardcover/product-23047407.html",
        "title": "Hardcover with Dust Cover"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "dust cover", "on demand"
    ]
  }
  ,{
    "id": 59,
    "title": "Through the Well of Pirene",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/6ol8-1451584292-73404-medium",
    "rating": "E",
    "dateAdded": "2018/12/30",
    "authors":[
      {
        "name": "Ether Echoes",
        "url": "https://www.fimfiction.net/user/19229/Ether+Echoes"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/73404/through-the-well-of-pirene",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/ether-echoes/through-the-well-of-pirene/hardcover/product-23231313.html",
        "title": "Hardcover with Dust Cover"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "dust cover", "on demand"
    ]
  }
  ,{
    "id": 60,
    "title": "Three Nights in Manehattan",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/unbt-1526056670-284980-medium",
    "rating": "T",
    "dateAdded": "2018/12/30",
    "authors":[
      {
        "name": "Ether Echoes",
        "url": "https://www.fimfiction.net/user/19229/Ether+Echoes"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/284980/three-nights-in-manehattan",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/ether-echoes/three-nights-in-manehattan/hardcover/product-23517310.html",
        "title": "Hardcover with Dust Cover"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "dust cover", "on demand"
    ]
  }
  ,{
    "id": 61,
    "title": "Fractured Sunlight",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/xppy-1432596096-234937-medium",
    "rating": "T",
    "dateAdded": "2018/12/30",
    "authors":[
      {
        "name": "Oroboro",
        "url": "https://www.fimfiction.net/user/163197/Oroboro"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/234937/fractured-sunlight",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.fimfiction.net/blog/822336/the-print-version-of-fractured-sunlight-is-now-available",
        "title": "Information"
      },
      {
        "url": "https://www.lulu.com/shop/oroboro/fractured-sunlight-bw/hardcover/product-23767180.html",
        "title": "Hardcover with Dust Cover (B&W)"
      },
      {
        "url": "https://www.lulu.com/shop/oroboro/fractured-sunlight-color/hardcover/product-23767215.html",
        "title": "Hardcover with Dust Cover (Color)"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "dust cover", "on demand"
    ]
  }
  ,{
    "id": 62,
    "title": "Reflections",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/rwp0-1537448143-343647-medium",
    "rating": "T",
    "dateAdded": "2019/01/03",
    "authors":[
      {
        "name": "Erik \"RQK\" Loyd",
        "url": "https://www.fimfiction.net/user/208413/RQK"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/343647/reflections",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/erik-loyd/reflections/paperback/product-23935297.html",
        "title": "Paperback"
      },
      {
        "url": "https://www.dropbox.com/s/fmpy55j2y9gp3zs/Reflections.pdf?dl=1",
        "title": "PDF"
      }
    ],
    "tags": [
      "fimfic", "paperback"
    ]
  }
  ,{
    "id": 63,
    "title": "Change",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/m5xt-1465493249-284555-medium",
    "rating": "T",
    "dateAdded": "2019/01/03",
    "authors":[
      {
        "name": "tom117z",
        "url": "https://www.fimfiction.net/user/242348/tom117z"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/284555/change",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/thomas-kemp/change/paperback/product-23145930.html",
        "title": "Paperback"
      }
    ],
    "tags": [
      "fimfic", "paperback", "change", "on demand"
    ]
  }
  ,{
    "id": 64,
    "title": "Change: Queen of the Hive",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/sgg8-1478441715-319895-medium",
    "rating": "T",
    "dateAdded": "2019/01/03",
    "authors":[
      {
        "name": "tom117z",
        "url": "https://www.fimfiction.net/user/242348/tom117z"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/319895/change-queen-of-the-hive",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/thomas-kemp/change-queen-of-the-hive/paperback/product-23604334.html",
        "title": "Paperback"
      }
    ],
    "tags": [
      "fimfic", "paperback", "change", "on demand"
    ]
  }
  ,{
    "id": 65,
    "title": "Change: Avia",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/b1mx-1527163590-364897-medium",
    "rating": "E",
    "dateAdded": "2019/01/03",
    "authors":[
      {
        "name": "tom117z",
        "url": "https://www.fimfiction.net/user/242348/tom117z"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/364897/change-avia",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/thomas-kemp/change-avia/paperback/product-23892358.html",
        "title": "Paperback"
      }
    ],
    "tags": [
      "fimfic", "paperback", "change", "on demand"
    ]
  }
  ,{
    "id": 66,
    "title": "The Skyla Pseudonym",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/v7qy-1484156641-360348-medium",
    "rating": "T",
    "dateAdded": "2019/01/03",
    "expiry": "2020/11/18",
    "authors":[
      {
        "name": "iisaw",
        "url": "https://www.fimfiction.net/user/33084/iisaw"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/360348/the-skyla-pseudonym",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/iisaw/the-skyla-pseudonym/hardcover/product-23467348.html",
        "title": "Hardcover with Dust Cover"
      },
      {
        "url": "https://www.lulu.com/shop/iisaw/the-skyla-pseudonym/hardcover/product-23467343.html",
        "title": "Hardcover"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "dust cover", "celestia code", "on demand"
    ]
  }
  ,{
    "id": 67,
    "title": "The Monster Below",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/14cr-1432465397-76931-medium",
    "rating": "T",
    "dateAdded": "2019/01/03",
    "authors":[
      {
        "name": "Greenback",
        "url": "https://www.fimfiction.net/user/88969/Greenback"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/76931/the-monster-below",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.fimfiction.net/user/88969/Greenback",
        "title": "PM the Author for a link"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "paperback", "on demand"
    ]
  }
  ,{
    "id": 68,
    "title": "Feedback",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/se2c-1463422628-248094-medium",
    "rating": "T",
    "dateAdded": "2019/01/03",
    "authors":[
      {
        "name": "Erik \"RQK\" Loyd",
        "url": "https://www.fimfiction.net/user/208413/RQK"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/248094/feedback",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.dropbox.com/s/ggdua1myvokp2bu/Feedback.pdf?dl=1",
        "title": "PDF"
      },
      {
        "url": "https://www.lulu.com/shop/erik-loyd/feedback/paperback/product-23884649.html",
        "title": "Paperback"
      }
    ],
    "tags": [
      "fimfic", "pdf", "on demand", "paperback", "crystal ball"
    ]
  }
  ,{
    "id": 69,
    "title": "Substitute",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/efl6-1537489545-307431-medium",
    "rating": "T",
    "dateAdded": "2019/01/03",
    "authors":[
      {
        "name": "Erik \"RQK\" Loyd",
        "url": "https://www.fimfiction.net/user/208413/RQK"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/307431/substitute",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.dropbox.com/s/18wbhbmyjqr82cr/Substitute.pdf?dl=1",
        "title": "PDF"
      },
      {
        "url": "https://www.lulu.com/shop/erik-loyd/substitute/paperback/product-23868667.html",
        "title": "Paperback"
      }
    ],
    "tags": [
      "fimfic", "pdf", "on demand", "paperback", "crystal ball"
    ]
  }
  ,{
    "id": 70,
    "title": "Divergence",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/tw53-1537490311-419204-medium",
    "rating": "T",
    "dateAdded": "2019/01/03",
    "expiry": "2019/01/02",
    "authors":[
      {
        "name": "Erik \"RQK\" Loyd",
        "url": "https://www.fimfiction.net/user/208413/RQK"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/419204/divergence",
        "title": "Fimfiction.net"
      },
      {
        "url": "",
        "title": "PDF"
      },
      {
        "url": "",
        "title": "Paperback"
      }
    ],
    "tags": [
      "fimfic", "pdf", "on demand", "paperback", "crystal ball", "incomplete"
    ]
  }
  ,{
    "id": 71,
    "title": "Fallout Equestria: Mending Hearts",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/lw29-1459299921-253729-medium",
    "rating": "M",
    "dateAdded": "2019/01/03",
    "authors":[
      {
        "name": "volrathxp",
        "url": "https://www.fimfiction.net/user/15746/volrathxp"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/253729/fallout-equestria-mending-hearts",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.dropbox.com/s/z3y35nqigd90wjv/Fallout_%20Equestria%20-%20Mending%20He%20-%20volrathxp.pdf?dl=0",
        "title": "PDF"
      }
    ],
    "tags": [
      "fimfic", "pdf", "foe"
    ]
  }
  ,{
    "id": 71,
    "title": "Fallout Equestria: Starlight",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/mmx8-1434158089-17890-medium",
    "rating": "M",
    "dateAdded": "2019/01/03",
    "authors":[
      {
        "name": "volrathxp",
        "url": "https://www.fimfiction.net/user/15746/volrathxp"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/17890/fallout-equestria-starlight",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.dropbox.com/s/uczlmyxccw1e5zg/Fallout%20Equestria_%20Starlight%20-%20volrathxp.pdf?dl=0",
        "title": "PDF"
      }
    ],
    "tags": [
      "fimfic", "pdf", "foe"
    ]
  }
  ,{
    "id": 72,
    "title": "Looking Glass",
    "edition": "",
    "img": "https://cdn-img.fimfiction.net/story/gl1a-1525349794-350494-medium",
    "rating": "T",
    "dateAdded": "2019/01/05",
    "expiry": "2022/06/13",
    "authors":[
      {
        "name": "Krickis",
        "url": "https://www.fimfiction.net/user/220433/Krickis"
      },
      {
        "name": "Ko-fi for Krickis",
        "url": "https://ko-fi.com/krickis"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/350494/looking-glass",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.fimfiction.net/blog/841015/looking-glass-book-now-available",
        "title": "Information"
      },
      {
        "url": "https://drive.google.com/drive/folders/1Y_fLwDQRp1bGlPQvOgVD7APIxS9h_PPR?usp=sharing",
        "title": "Audiobook"
      },
      {
        "url": "https://www.lulu.com/shop/krickis/looking-glass/hardcover/product-23909632.html",
        "title": "Hardcover with Dust Cover (Color)"
      },
      {
        "url": "https://www.lulu.com/shop/krickis/looking-glass/hardcover/product-23909647.html",
        "title": "Hardcover with Dust Cover (B&W)"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "dust cover", "on demand", "who we become"
    ]
  }
  ,{
    "id": 73,
    "title": "Anthropology",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/jged-1432421699-4656-medium",
    "rating": "E",
    "dateAdded": "2019/01/06",
    "authors":[
      {
        "name": "JasonTheHuman",
        "url": "https://www.fimfiction.net/user/5727/JasonTheHuman"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/4656/anthropology",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.ministryofimage.net/product-page/anthropology",
        "title": "Hardcover"
      }
    ],
    "tags": [
      "fimfic", "hardcover"
    ]
  }
  ,{
    "id": 74,
    "title": "Background Pony",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/dv8q-1585877781-19198-medium",
    "rating": "T",
    "dateAdded": "2019/01/06",
    "authors":[
      {
        "name": "shortskirtsandexplosions",
        "url": "https://www.fimfiction.net/user/1491/shortskirtsandexplosions"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/19198/background-pony",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://forms.gle/JRbnp3q5Nnp3kmfXA",
        "title": "Signup Form"
      },
      {
        "url": "https://www.ministryofimage.net/product-page/background-pony",
        "title": "Hardcover"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "signup"
    ]
  }
  ,{
    "id": 75,
    "title": "Fallout Equestria: Pink Eyes",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/l9td-1432420232-931-medium",
    "rating": "T",
    "dateAdded": "2019/01/06",
    "authors":[
      {
        "name": "mimezinga",
        "url": "https://www.fimfiction.net/user/724/mimezinga"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/931/fallout-equestria-pink-eyes",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.ministryofimage.net/product-page/pink-eyes",
        "title": "Hardcover"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "foe"
    ]
  }
  ,{
    "id": 76,
    "title": "Two Sides of Melody",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/xql3-1432435522-31474-large",
    "rating": "T",
    "dateAdded": "2019/01/06",
    "authors":[
      {
        "name": "errant",
        "url": "https://www.fimfiction.net/user/12443/errant"
      },
      {
        "name": "Avensis Astari",
        "url": "https://www.fimfiction.net/user/2168/Avensis+Astari"
      },
      {
        "name": "Dennis the Menace",
        "url": "https://www.fimfiction.net/user/6405/Dennis+the+Menace"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/31474/accidental-harmony",
        "title": "Fimfiction.net (Accidental Harmony)"
      },
      {
        "url": "https://www.fimfiction.net/story/2365/allegrezza",
        "title": "Fimfiction.net (Allegrezza)"
      },
      {
        "url": "https://www.fimfiction.net/story/36388/my-roommate-is-a-vampire",
        "title": "Fimfiction.net (My Roommate is a Vampire)"
      },
      {
        "url": "https://www.ministryofimage.net/product-page/two-sides-of-melody",
        "title": "Hardcover"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "Accidental Harmony", "Allegrezza", "My Roommate is a Vampire"
    ]
  }
  ,{
    "id": 77,
    "title": "Fallout Equestria - Dead Tree",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/n0js-1522006881-393681-medium",
    "rating": "M",
    "dateAdded": "2019/01/13",
    "authors":[
      {
        "name": "Fiaura",
        "url": "https://www.fimfiction.net/user/304873/Fiaura"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/393681/fallout-equestria-dead-tree",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://rena-miller.squarespace.com/shop/fallout-equestria-dead-tree-volume-1",
        "title": "Hardcover (Volume 1)"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "foe"
    ]
  }
  ,{
    "id": 78,
    "title": "Fallout Equestria: Project Horizons",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/0xm9-1441146045-208056-medium",
    "rating": "M",
    "dateAdded": "2019/01/29",
    "authors":[
      {
        "name": "Somber",
        "url": "https://www.fimfiction.net/user/17398/Somber"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/208056/fallout-equestria-project-horizons",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.ministryofimage.net/product-page/fallout-equestria-project-horizons",
        "title": "Hardcover"
      },
      {
        "url": "https://www.ministryofimage.net/product-page/fallout-equestria-project-horizons-vol-1",
        "title": "Hardcover (Volume 1)"
      },
      {
        "url": "https://www.ministryofimage.net/product-page/fallout-equestria-project-horizons-vol-2",
        "title": "Hardcover (Volume 2)"
      },
      {
        "url": "https://www.ministryofimage.net/product-page/fallout-equestria-project-horizons-part-3",
        "title": "Hardcover (Volume 3)"
      },
      {
        "url": "https://www.ministryofimage.net/product-page/fallout-equestria-project-horizons-part-4",
        "title": "Hardcover (Volume 4)"
      },
      {
        "url": "https://www.ministryofimage.net/product-page/fallout-equestria-project-horizons-part-5",
        "title": "Hardcover (Volume 5)"
      }
    ],
    "tags": [
      "fimfic", "foe", "hardcover"
    ]
  }
  ,{
    "id": 79,
    "title": "Message in a Bottle",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/jipe-1491037399-368986-medium",
    "rating": "T",
    "dateAdded": "2019/02/14",
    "expiry": "2019/03/01",
    "authors":[
      {
        "name": "Starscribe",
        "url": "https://www.fimfiction.net/user/173490/Starscribe"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/368986/message-in-a-bottle",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.indiegogo.com/projects/message-in-a-bottle-print-run#/",
        "title": "Hardcover (Indiegogo)"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "limited run"
    ]
  }
  ,{
    "id": 80,
    "title": "Fallout: Equestria (AE)",
    "edition": "4th",
    "img": "https://cdn-img.fimfiction.net/story/fuca-1432496101-119190-medium",
    "rating": "M",
    "dateAdded": "2019/02/14",
    "authors":[
      {
        "name": "Kkat",
        "url": "https://www.fimfiction.net/user/10369/Kkat"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/119190/fallout-equestria",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://absolutelyeverything.org/collections/fallout-equestria-books/products/fallout-equestria-4th-edition",
        "title": "Hardcover w/ Dust Cover"
      },
      {
        "url": "https://absolutelyeverything.org/collections/fallout-equestria-books/products/fallout-equestria-the-black-book-edition",
        "title": "Black Book Edition"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "foe"
    ]
  }
  ,{
    "id": 81,
    "title": "Fallout: Equestria - Murky Number Seven",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/rgi2-1432445486-47300-medium",
    "rating": "M",
    "dateAdded": "2019/02/14",
    "authors":[
      {
        "name": "FuzzyVeeVee",
        "url": "https://www.fimfiction.net/user/56707/FuzzyVeeVee"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/47300/fallout-equestria-murky-number-seven",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://absolutelyeverything.org/collections/fallout-equestria-books/products/fallout-equestria-murky-number-seven",
        "title": "Hardcover w/ Dust Cover"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "foe"
    ]
  }
  ,{
    "id": 83,
    "title": "Secrets of a Royal Guard",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/v05q-1548110325-262566-medium",
    "rating": "T",
    "dateAdded": "2019/02/23",
    "expiry": "2022/02/09",
    "authors":[
      {
        "name": "Anzel",
        "url": "https://www.fimfiction.net/user/210160/Anzel"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/262566/secrets-of-a-royal-guard",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/anzel/secrets-of-a-royal-guard/hardcover/product-23980222.html",
        "title": "Hardcover w/ Dust Cover"
      },
      {
        "url": "https://quillnblade.com/print-run-order-form/",
        "title": "Customizable Hard Cover Until Mar 1"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "custom"
    ]
  }
  ,{
    "id": 85,
    "title": "Off The Mark",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/ckkw-1534612975-415985-medium",
    "rating": "T",
    "dateAdded": "2019/04/24",
    "authors":[
      {
        "name": "Goldfur",
        "url": "https://www.fimfiction.net/user/84240/Goldfur"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/415985/off-the-mark",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.amazon.com/dp/1797620347",
        "title": "Paperback (Volume 1)"
      },
      {
        "url": "https://www.amazon.com/dp/B0851MHW4S",
        "title": "Paperback (Volume 2)"
      }
    ],
    "tags": [
      "fimfic", "paperback"
    ]
  }
  ,{
    "id": 86,
    "title": "Hard Reset",
    "edition": "3rd",
    "img": "https://cdn-img.fimfiction.net/story/gmtr-1432458620-67362-medium",
    "rating": "T",
    "dateAdded": "2019/04/24",
    "authors":[
      {
        "name": "Eakin",
        "url": "https://www.fimfiction.net/user/15048/Eakin"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/67362/hard-reset",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://forms.gle/JRbnp3q5Nnp3kmfXA",
        "title": "Signup Form"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "signup"
    ]
  }
  ,{
    "id": 87,
    "title": "Stardust (Nonex Publ.)",
    "edition": "2nd",
    "img": "https://cdn-img.fimfiction.net/story/ddv4-1432482453-100455-medium",
    "rating": "T",
    "dateAdded": "2019/04/24",
    "authors":[
      {
        "name": "Arad",
        "url": "https://www.fimfiction.net/user/45831/Arad"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/100455/stardust",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://forms.gle/JRbnp3q5Nnp3kmfXA",
        "title": "Signup Form"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "signup"
    ]
  }
  ,{
    "id": 89,
    "title": "The Life and Times of a Winning Pony",
    "edition": "3rd",
    "img": "https://cdn-img.fimfiction.net/story/e4fy-1432433497-28239-medium",
    "rating": "T",
    "dateAdded": "2019/05/21",
    "expiry": "2019/05/27",
    "authors":[
      {
        "name": "Chengar Qordath",
        "url": "https://www.fimfiction.net/user/10885/Chengar+Qordath"
      }
    ],
    "links": [
      {
        "url": "Fimfiction Story Link",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.fimfiction.net/blog/854779/the-life-and-times-of-a-winning-pony-print-project-mk-iii",
        "title": "Print Details"
      },
      {
        "url": "https://www.fimfiction.net/blog/854899/print-run-mk-iii-order-form",
        "title": "Preorder"
      }
    ],
    "tags": [
      "fimfic", "preorder", "limited run"
    ]
  }
  ,{
    "id": 90,
    "title": "The Education of Clover the Clever",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/mc14-1550009332-117214-medium",
    "rating": "E",
    "dateAdded": "2019/05/21",
    "authors":[
      {
        "name": "Daedalus Aegle",
        "url": "https://www.fimfiction.net/user/112079/Daedalus+Aegle"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/117214/the-education-of-clover-the-clever",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/daedalus-aegle/the-education-of-clover-the-clever/hardcover/product-24093950.html",
        "title": "Hardcover"
      },
      {
        "url": "https://www.lulu.com/shop/daedalus-aegle/the-education-of-clover-the-clever-pb/paperback/product-24093939.html",
        "title": "Paperback"
      }
    ],
    "tags": [
      "fimfic", "paperback", "hardcover"
    ]
  }
  ,{
    "id": 91,
    "title": "Before Time Began to Flow",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/i4m9-1555787857-80921-medium",
    "rating": "T",
    "dateAdded": "2019/05/21",
    "authors":[
      {
        "name": "Humanity",
        "url": "https://www.fimfiction.net/user/57410/Humanity"
      },
      {
        "name": "Ashton Crimson",
        "url": "https://www.lulu.com/search?contributor=Ashton+Crimson"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/80921/before-time-began-to-flow",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/ashton-crimson/before-time-began-to-flow/paperback/product-24082567.html",
        "title": "Paperback"
      }
    ],
    "tags": [
      "fimfic", "paperback"
    ]
  }
  ,{
    "id": 92,
    "title": "Stardust (MoI)",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/ddv4-1432482453-100455-medium",
    "rating": "T",
    "dateAdded": "2019/07/11",
    "authors":[
      {
        "name": "Arad",
        "url": "https://www.fimfiction.net/user/45831/Arad"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/100455/stardust",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.ministryofimage.net/product-page/stardust",
        "title": "Hardcover"
      }
    ],
    "tags": [
      "fimfic", "hardcover"
    ]
  }
  ,{
    "id": 93,
    "title": "Five Score, Divided by Four",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/1x9t-1432504564-130808-medium",
    "rating": "M",
    "dateAdded": "2019/07/11",
    "authors":[
      {
        "name": "TwistedSpectrum",
        "url": "https://www.fimfiction.net/user/102945/TwistedSpectrum"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/130808/five-score-divided-by-four---matureversion",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://absolutelyeverything.org/products/five-score",
        "title": "Hardcover"
      },
      {
        "url": "https://forms.gle/JRbnp3q5Nnp3kmfXA",
        "title": "Signup Form"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "signup"
    ]
  }
  ,{
    "id": 94,
    "title": "Around the World in 81 Days (And Other Problems Caused by Leap Years)",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/guwl-1470612455-341625-medium",
    "rating": "E",
    "dateAdded": "2019/07/11",
    "authors":[
      {
        "name": "GaPJaxie",
        "url": "https://www.fimfiction.net/user/18619/GaPJaxie"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/341625/around-the-world-in-81-days-and-other-problems-caused-by-leap-years",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/gapjaxie/around-the-world-in-81-days/paperback/product-24199644.html",
        "title": "Paperback"
      }
    ],
    "tags": [
      "fimfic", "paperback"
    ]
  }
  ,{
    "id": 95,
    "title": "The Last Pony on Earth",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/2yc8-1432519245-265629-medium",
    "rating": "T",
    "dateAdded": "2019/07/11",
    "expiry": "11/08/19",
    "authors":[
      {
        "name": "Starscribe",
        "url": "https://www.fimfiction.net/user/173490/Starscribe"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/265629/the-last-pony-on-earth",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.indiegogo.com/projects/last-pony-on-earth-hardcover-print#/",
        "title": "Hardcover (Indiegogo)"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "limited run"
    ]
  }
  ,{
    "id": 96,
    "title": "Display of Passion",
    "edition": "1st",
    "img": "https://derpicdn.net/img/2019/5/12/2037117/medium.png",
    "rating": "M",
    "dateAdded": "2019/07/11",
    "authors":[
      {
        "name": "Alcor",
        "url": "https://derpibooru.org/tags/artist-colon-alcor"
      }
    ],
    "links": [
      {
        "url": "https://derpibooru.org/tags/comic-colon-display+of+passion",
        "title": "Derpibooru.org"
      },
      {
        "url": "https://www.e-junkie.com/i/yjmi?card",
        "title": "Paperback (US/Can/Mex)"
      },
      {
        "url": "https://www.e-junkie.com/i/yjmh?card",
        "title": "Paperback (International)"
      }
    ],
    "tags": [
      "paperback", "limited run", "comic"
    ]
  }
  ,{
    "id": 97,
    "title": "History Repeats",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/acls-1432475042-90335-medium",
    "rating": "T",
    "dateAdded": "2020/02/24",
    "authors":[
      {
        "name": "SaddlesoapOpera",
        "url": "https://www.fimfiction.net/user/252/SaddlesoapOpera"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/90335/history-repeats",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/saddlesoap-opera/history-repeats-paperback/paperback/product-24172657.html",
        "title": "Paperback"
      },
      {
        "url": "https://www.lulu.com/shop/saddlesoap-opera/history-repeats/hardcover/product-24353064.html",
        "title": "Hardcover"
      }
    ],
    "tags": [
      "paperback", "hardcover", "fimfic"
    ]
  }
  ,{
    "id": 98,
    "title": "The Best Night Ever",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/feje-1432427170-18087-medium",
    "rating": "T",
    "dateAdded": "2020/02/24",
    "authors":[
      {
        "name": "Captain Chryssalid",
        "url": "https://www.fimfiction.net/user/22220/Capn_Chryssalid"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/18087/the-best-night-ever",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/captain-chryssalid/the-best-night-ever-paperback/paperback/product-24172683.html",
        "title": "Paperback"
      },
      {
        "url": "https://www.lulu.com/shop/captain-chryssalid/the-best-night-ever/hardcover/product-24172670.html",
        "title": "Hardcover"
      }
    ],
    "tags": [
      "paperback", "hardcover", "fimfic"
    ]
  }
  ,{
    "id": 99,
    "title": "The Night Is Passing",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/m1kx-1432475236-90558-medium",
    "rating": "T",
    "dateAdded": "2020/02/24",
    "authors":[
      {
        "name": "Cynewulf",
        "url": "https://www.fimfiction.net/user/5097/Cynewulf"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/90558/the-night-is-passing",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/cynewulf/the-night-is-passing-vol-i-paperback/paperback/product-24172473.html",
        "title": "Paperback - Volume 1"
      },
      {
        "url": "https://www.lulu.com/shop/cynewulf/the-night-is-passing-vol-ii-paperback/paperback/product-24172462.html",
        "title": "Paperback - Volume 2"
      },
      {
        "url": "https://www.lulu.com/shop/cynewulf/the-night-is-passing-vol-iii-paperback/paperback/product-24172459.html",
        "title": "Paperback - Volume 3"
      },
      {
        "url": "https://www.lulu.com/shop/cynewulf/the-night-is-passing-vol-i/hardcover/product-24352930.html",
        "title": "Hardcover - Volume 1"
      },
      {
        "url": "https://www.lulu.com/shop/cynewulf/the-night-is-passing-vol-ii/hardcover/product-24352909.html",
        "title": "Hardcover - Volume 2"
      },
      {
        "url": "https://www.lulu.com/shop/cynewulf/the-night-is-passing-vol-iii/hardcover/product-24352894.html",
        "title": "Hardcover - Volume 3"
      }
    ],
    "tags": [
      "paperback", "hardcover", "fimfic"
    ]
  }
  ,{
    "id": 100,
    "title": "The Purloined Pony",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/f0n5-1432558277-178769-medium",
    "rating": "E",
    "dateAdded": "2020/02/24",
    "authors":[
      {
        "name": "Chris",
        "url": "https://www.fimfiction.net/user/13928/Chris"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/178769/the-purloined-pony",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/chris/the-purloined-pony-pick-your-path-12/paperback/product-24249799.html",
        "title": "Paperback"
      }
    ],
    "tags": [
      "paperback", "fimfic", "chose your own adventure"
    ]
  }
  ,{
    "id": 101,
    "title": "Lost Time",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/rckm-1450899745-304593-medium",
    "rating": "T",
    "dateAdded": "2020/02/24",
    "authors":[
      {
        "name": "bookplayer",
        "url": "https://www.fimfiction.net/user/26449/bookplayer"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/304593/lost-time",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/bookplayer/lost-time-paperback/paperback/product-24200739.html",
        "title": "Paperback"
      },
      {
        "url": "https://www.lulu.com/shop/bookplayer/lost-time/hardcover/product-24353096.html",
        "title": "Hardcover"
      }
    ],
    "tags": [
      "paperback", "hardcover", "fimfic"
    ]
  }
  ,{
    "id": 102,
    "title": "The Haunting",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/8mjm-1562637971-423769-medium",
    "rating": "T",
    "dateAdded": "2020/02/25",
    "expiry": "2022/06/13",
    "authors":[
      {
        "name": "Admiral Biscuit",
        "url": "https://www.fimfiction.net/user/72053/Admiral+Biscuit"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/423769/the-haunting",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/admiral-biscuit/the-haunting/paperback/product-24168831.html",
        "title": "Paperback"
      }
    ],
    "tags": [
      "paperback", "fimfic"
    ]
  }
  ,{
    "id": 103,
    "title": "TD the Alicorn Princess",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/4sw1-1432498177-122018-medium",
    "rating": "T",
    "dateAdded": "2020/02/25",
    "authors":[
      {
        "name": "BronyWriter",
        "url": "https://www.fimfiction.net/user/43858/BronyWriter"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/122018/td-the-alicorn-princess",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/bronywriter/td-the-alicorn-princess/paperback/product-23795746.html",
        "title": "Paperback"
      }
    ],
    "tags": [
      "paperback", "fimfic"
    ]
  }
  ,{
    "id": 104,
    "title": "Into the Dark",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/zc9r-1562787050-327564-medium",
    "rating": "T",
    "dateAdded": "2020/02/25",
    "authors":[
      {
        "name": "Corejo",
        "url": "https://www.fimfiction.net/user/10457/Corejo"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/327564/into-the-dark",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/content/paperback-book/into-the-dark/24918047",
        "title": "Paperback"
      },
      {
        "url": "https://www.lulu.com/content/hardcover-book/into-the-dark/24831764",
        "title": "Hardcover"
      }
    ],
    "tags": [
      "paperback", "hardcover", "fimfic"
    ]
  }
  ,{
    "id": 105,
    "title": "Dash Tries to Win Your Heart",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/ruwv-1565023489-298089-medium",
    "rating": "T",
    "dateAdded": "2020/02/25",
    "authors":[
      {
        "name": "Flutterpriest",
        "url": "https://www.fimfiction.net/user/177150/Flutterpriest"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/298089/dash-tries-to-win-your-heart",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/flutterpriest/dash-tries-to-win-your-heart/paperback/product-24145890.html",
        "title": "Paperback"
      },
      {
        "url": "https://www.lulu.com/shop/flutterpriest/dash-tries-to-win-your-heart-hard-cover/hardcover/product-24168738.html",
        "title": "Hardcover"
      }
    ],
    "tags": [
      "paperback", "hardcover", "fimfic"
    ]
  }
  ,{
    "id": 106,
    "title": "The Traveling Tutor and the Librarian",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/szgi-1432458372-67042-medium",
    "rating": "E",
    "dateAdded": "2020/02/25",
    "authors":[
      {
        "name": "Georg",
        "url": "https://www.fimfiction.net/user/47923/Georg"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/67042/the-traveling-tutor-and-the-librarian",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/lynn-wahl/travelingtutor2em/paperback/product-24120528.html",
        "title": "Paperback"
      }
    ],
    "tags": [
      "paperback", "fimfic"
    ]
  }
  ,{
    "id": 107,
    "title": "The Monster in the Twilight",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/pq0m-1432466538-78582-medium",
    "rating": "T",
    "dateAdded": "2020/02/25",
    "authors":[
      {
        "name": "Georg",
        "url": "https://www.fimfiction.net/user/47923/Georg"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/78582/the-monster-in-the-twilight",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/lynn-wahl/bcb-monster2cpb/paperback/product-24141158.html",
        "title": "Paperback"
      },
      {
        "url": "https://www.lulu.com/shop/lynn-wahl/bcb-monster-2c/hardcover/product-24141128.html",
        "title": "Hardcover"
      }
    ],
    "tags": [
      "paperback", "hardcover", "fimfic"
    ]
  }
  ,{
    "id": 108,
    "title": "Letters From a Little Princess Monster",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/bezw-1432513687-143216-medium",
    "rating": "T",
    "dateAdded": "2020/02/25",
    "authors":[
      {
        "name": "Georg",
        "url": "https://www.fimfiction.net/user/47923/Georg"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/143216/letters-from-a-little-princess-monster",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/lynn-wahl/bcb-letters2c-stdpaperback/paperback/product-24141167.html",
        "title": "Paperback"
      },
      {
        "url": "https://www.lulu.com/shop/lynn-wahl/bcb-letters-2c/hardcover/product-24140933.html",
        "title": "Hardcover"
      }
    ],
    "tags": [
      "paperback", "hardcover", "fimfic"
    ]
  }
  ,{
    "id": 109,
    "title": "The Monster Below: Nightfall",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/08ed-1432567230-191246-medium",
    "rating": "T",
    "dateAdded": "2020/02/25",
    "authors":[
      {
        "name": "Greenback",
        "url": "https://www.fimfiction.net/user/88969/Greenback"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/191246/the-monster-below-nightfall",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.fimfiction.net/blog/873407/information-on-how-to-order-a-physical-copy-of-the-monster-below-nightfall",
        "title": "Information"
      }
    ],
    "tags": [
      "paperback", "hardcover", "fimfic"
    ]
  }
  ,{
    "id": 110,
    "title": "It’s a Dangerous Business, Going Out Your Door",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/696s-1432561326-182859-medium",
    "rating": "T",
    "dateAdded": "2020/02/25",
    "authors":[
      {
        "name": "Jetfire2012",
        "url": "https://www.fimfiction.net/user/182261/Jetfire2012"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/182859/its-a-dangerous-business-going-out-your-door",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/jetfire2012/its-a-dangerous-business-going-out-your-door/paperback/product-24225905.html",
        "title": "Paperback"
      }
    ],
    "tags": [
      "paperback", "fimfic"
    ]
  }
  ,{
    "id": 111,
    "title": "Bulletproof Heart",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/7yi2-1533074552-416114-medium",
    "rating": "T",
    "dateAdded": "2020/02/25",
    "authors":[
      {
        "name": "PaulAsaran",
        "url": "https://www.fimfiction.net/user/111840/PaulAsaran"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/416114/bulletproof-heart",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/jeremy-p-courville/bulletproof-heart-hardcover/hardcover/product-24170071.html",
        "title": "Hardcover"
      }
    ],
    "tags": [
      "paperback", "hardcover", "fimfic"
    ]
  }
  ,{
    "id": 112,
    "title": "The Gentle Nights: Audience of One",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/7675-1432582298-213853-medium",
    "rating": "E",
    "dateAdded": "2020/02/25",
    "authors":[
      {
        "name": "PaulAsaran",
        "url": "https://www.fimfiction.net/user/111840/PaulAsaran"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/213853/the-gentle-nights-audience-of-one",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/jeremy-p-courville/the-gentle-nights-audience-of-one/paperback/product-24170075.html",
        "title": "Paperback"
      }
    ],
    "tags": [
      "paperback", "fimfic"
    ]
  }
  ,{
    "id": 113,
    "title": "A New Way",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/uduz-1432515094-145158-medium",
    "rating": "T",
    "dateAdded": "2020/02/25",
    "expiry": "2021/12/08",
    "authors":[
      {
        "name": "Phoenix_Dragon",
        "url": "https://www.fimfiction.net/user/49263/Phoenix_Dragon"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/145158/a-new-way",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/phoenix/a-new-way/hardcover/product-24259465.html",
        "title": "Hardcover"
      }
    ],
    "tags": [
      "hardcover", "fimfic"
    ]
  }
  ,{
    "id": 114,
    "title": "Fragments",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/g7cc-1432444485-45720-medium",
    "rating": "E",
    "dateAdded": "2020/02/25",
    "expiry": "2021/12/08",
    "authors":[
      {
        "name": "Phoenix_Dragon",
        "url": "https://www.fimfiction.net/user/49263/Phoenix_Dragon"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/45720/fragments",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/phoenix/fragments/hardcover/product-24259457.html",
        "title": "Hardcover"
      }
    ],
    "tags": [
      "hardcover", "fimfic"
    ]
  }
  ,{
    "id": 115,
    "title": "Without a Hive",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/g0ep-1432449152-52953-medium",
    "rating": "T",
    "dateAdded": "2020/02/25",
    "expiry": "2021/12/08",
    "authors":[
      {
        "name": "Phoenix_Dragon",
        "url": "https://www.fimfiction.net/user/49263/Phoenix_Dragon"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/52953/without-a-hive",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/phoenix/without-a-hive/hardcover/product-24144714.html",
        "title": "Hardcover"
      }
    ],
    "tags": [
      "hardcover", "fimfic"
    ]
  }
  ,{
    "id": 116,
    "title": "Knights of Equestria",
    "edition": "1st",
    "img": "https://assets.lulu.com/cover_thumbs/1/r/1r89rzej-front-shortedge-384.jpg",
    "rating": "M",
    "dateAdded": "2020/02/25",
    "authors":[
      {
        "name": "Solaris90",
        "url": "https://www.fimfiction.net/user/2758/Solaris90"
      }
    ],
    "links": [
      {
        "url": "https://www.deviantart.com/solaris90/art/Knights-of-Equestria-Part-1-205456422",
        "title": "DeviantArt"
      },
      {
        "url": "https://www.lulu.com/shop/solaris90/knights-of-equestria/hardcover/product-23020397.html",
        "title": "Hardcover"
      }
    ],
    "tags": [
      "hardcover", "fimfic"
    ]
  }
  ,{
    "id": 117,
    "title": "Spark Visions of Twilight",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/deh3-1460262613-305096-medium",
    "rating": "T",
    "dateAdded": "2020/02/25",
    "authors":[
      {
        "name": "Tangerine Blast",
        "url": "https://www.fimfiction.net/user/67017/Tangerine+Blast"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/305096/spark-visions-of-twilight",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/tangerine-blast/spark-visions-of-twilight/paperback/product-24200783.html",
        "title": "Paperback"
      }
    ],
    "tags": [
      "paperback", "fimfic"
    ]
  }
  ,{
    "id": 118,
    "title": "Gunsmoke",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/u5u9-1448144012-301042-medium",
    "rating": "T",
    "dateAdded": "2020/02/25",
    "authors":[
      {
        "name": "Wanderer D",
        "url": "https://www.fimfiction.net/user/144/Wanderer+D"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/301042/gunsmoke",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/wanderer-d/gunsmoke/paperback/product-24180275.html",
        "title": "Paperback"
      }
    ],
    "tags": [
      "paperback", "fimfic"
    ]
  }
  ,{
    "id": 119,
    "title": "A Song of Storms: Of Skies Long Forgotten",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/rt80-1456622100-54946-medium",
    "rating": "T",
    "dateAdded": "2020/02/25",
    "authors":[
      {
        "name": "The 24th Pegasus",
        "url": "https://www.fimfiction.net/user/60513/The+24th+Pegasus"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/54946/a-song-of-storms-of-skies-long-forgotten",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/the-24th-pegasus/a-song-of-storms-of-skies-long-forgotten/paperback/product-24151926.html",
        "title": "Paperback"
      }
    ],
    "tags": [
      "paperback", "fimfic"
    ]
  }
  ,{
    "id": 120,
    "title": "Fallout: Equestria - The Chrysalis",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/qyqf-1441747646-288365-medium",
    "rating": "M",
    "dateAdded": "2020/02/29",
    "expiry": "2021/12/08",
    "authors":[
      {
        "name": "Phoenix_Dragon",
        "url": "https://www.fimfiction.net/user/49263/Phoenix_Dragon"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/288365/",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/shop/phoenix/fallout-equestria-the-chrysalis-book-1-wake/hardcover/product-24431412.html",
        "title": "Hardcover (Volume 1)"
      },
      {
        "url": "https://www.lulu.com/shop/phoenix/fallout-equestria-the-chrysalis-book-2-seek/hardcover/product-24431416.html",
        "title": "Hardcover (Volume 2)"
      },
      {
        "url": "https://www.lulu.com/shop/phoenix/fallout-equestria-the-chrysalis-book-3-change/hardcover/product-24431417.html",
        "title": "Hardcover (Volume 3)"
      }
    ],
    "tags": [
      "hardcover", "fimfic", "foe"
    ]
  }
  ,{
    "id": 121,
    "title": "Through the Aurora",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/kbol-1554527439-436202-medium",
    "rating": "T",
    "dateAdded": "2020/03/08",
    "expiry": "2020/04/1",
    "authors":[
      {
        "name": "Starscribe",
        "url": "https://www.fimfiction.net/user/173490/Starscribe"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/436202/through-the-aurora",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://igg.me/at/through-the-aurora",
        "title": "Hardcover (Indiegogo)"
      }
    ],
    "tags": [
      "hardcover", "fimfic", "limited run"
    ]
  }
  ,{
    "id": 122,
    "title": "My Little Sweetheart 7: Final",
    "edition": "1st",
    "img": "https://assets.lulu.com/cover_thumbs/1/8/189j6vr9-front-shortedge-384.jpg",
    "rating": "M",
    "dateAdded": "2020/11/27",
    "authors":[
      {
        "name": "Iris Trismegistus",
        "url": "https://www.lulu.com/shop/search.ep?contributorId=1299801"
      }
    ],
    "links": [
      {
        "url": "https://www.lulu.com/shop/iris-trismegistus/my-little-sweetheart-7-final/paperback/product-189j6vr9.html",
        "title": "Paperback"
      }
    ],
    "tags": [
      "paperback", "on demand", "art"
    ]
  }
  ,{
    "id": 123,
    "title": "Fallout Equestria: Duck and Cover (& Make Love Not War)",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/ur3l-1432512535-141568-medium",
    "rating": "M",
    "dateAdded": "2020/11/27",
    "authors":[
      {
        "name": "hahatimeforponies",
        "url": "https://www.fimfiction.net/user/4287/hahatimeforponies"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/141568/fallout-equestria-duck-and-cover",
        "title": "Duck and Cover (Fimfiction.net)"
      },
      {
        "url": "https://www.fimfiction.net/story/301900/fallout-equestria-make-love-not-war",
        "title": "Make Love Not War (Fimfiction.net)"
      },
      {
        "url": "https://absolutelyeverything.org/collections/fallout-equestria-books/products/fallout-equestria-duck-and-cover",
        "title": "Hardcover w/ Dust Cover"
      },
      {
        "url": "https://absolutelyeverything.org/products/fallout-equestria-duck-and-cover-leather",
        "title": "Leather Hardcover w/ Dust Cover"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "foe", "Make Love Not War"
    ]
  }
  ,{
    "id": 124,
    "title": "Fallout: Equestria (MoI)",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/fuca-1432496101-119190-medium",
    "rating": "M",
    "dateAdded": "2020/11/27",
    "authors":[
      {
        "name": "Kkat",
        "url": "https://www.fimfiction.net/user/10369/Kkat"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/119190/fallout-equestria",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.ministryofimage.net/product-page/fallout-equestria",
        "title": "Hardcover"
      },
      {
        "url": "https://www.ministryofimage.net/product-page/fallout-equestria-special-edition",
        "title": "Special Edition"
      }
    ],
    "tags": [
      "hardcover", "fimfic", "foe"
    ]
  }
  ,{
    "id": 125,
    "title": "The Enchanted Library",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/rkmy-1593759272-240255-medium",
    "rating": "T",
    "dateAdded": "2020/11/27",
    "authors":[
      {
        "name": "Monochromatic",
        "url": "https://www.fimfiction.net/user/121767/Monochromatic"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/240255/the-enchanted-library",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.ministryofimage.net/product-page/the-enchanted-library",
        "title": "Hardcover"
      }
    ],
    "tags": [
      "hardcover", "fimfic", "on demand"
    ]
  }
  ,{
    "id": 126,
    "title": "Fallout Equestria: Pink Eyes (AE)",
    "edition": "2nd",
    "img": "https://cdn-img.fimfiction.net/story/l9td-1432420232-931-medium",
    "rating": "T",
    "dateAdded": "2021/01/03",
    "expiry": "2021/01/15",
    "authors":[
      {
        "name": "mimezinga",
        "url": "https://www.fimfiction.net/user/724/mimezinga"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/931/fallout-equestria-pink-eyes",
        "title": "Fimfiction.net"
      },
      {
        "url": "http://horse.bible/PinkEyes",
        "title": "Preorder Signups (Ends 2021/01/15)"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "foe"
    ]
  }
  ,{
    "id": 127,
    "title": "Auntie Tia's Matchmaking Service",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/vk7m-1601064616-478567-medium",
    "rating": "E",
    "dateAdded": "2021/01/03",
    "authors":[
      {
        "name": "Shaslan",
        "url": "https://www.fimfiction.net/user/386952/Shaslan"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/478567/auntie-tias-matchmaking-service",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/en/gb/shop/shaslan-/auntie-tias-matchmaking-service/hardcover/product-n6mnnm.html",
        "title": "Hardcover"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "on demand"
    ]
  }
  ,{
    "id": 128,
    "title": "I.D. - That Indestructible Something",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/636j-1432471364-85294-medium",
    "rating": "T",
    "dateAdded": "2021/03/26",
    "authors":[
      {
        "name": "Chatoyance",
        "url": "https://www.fimfiction.net/user/1291/Chatoyance"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/85294/id-that-indestructible-something",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://forms.gle/JRbnp3q5Nnp3kmfXA",
        "title": "Signup Form"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "signup"
    ]
  }
  ,{
    "id": 129,
    "title": "I Am Not Sombra",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/xtfw-1584598291-462778-medium",
    "rating": "T",
    "dateAdded": "2021/04/01",
    "authors":[
      {
        "name": "Boopy Doopy",
        "url": "https://www.fimfiction.net/user/369104/Boopy+Doopy"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/462778/i-am-not-sombra",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/en/us/shop/boopy-doopy-and-mayhem-moth/i-am-not-sombra/paperback/product-4d8kp2.html",
        "title": "Paperback"
      }
    ],
    "tags": [
      "fimfic", "paperback", "on demand"
    ]
  }
  ,{
    "id": 130,
    "title": "Foal of the Forest",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/pl93-1432624247-116344-medium",
    "rating": "T",
    "dateAdded": "2021/04/18",
    "authors":[
      {
        "name": "moguera",
        "url": "https://www.fimfiction.net/user/13307/moguera"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/116344/foal-of-the-forest",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/en/us/shop/moguera-and-equinox3141-/foal-of-the-forest/hardcover/product-5dw265.html",
        "title": "Hardcover"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "on demand"
    ]
  }
  ,{
    "id": 131,
    "title": "Fine Print",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/gujr-1584609238-463533-medium",
    "rating": "T",
    "dateAdded": "2021/04/18",
    "expiry": "2021/05/17",
    "authors":[
      {
        "name": "Starscribe",
        "url": "https://www.fimfiction.net/user/173490/Starscribe"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/463533/fine-print",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.indiegogo.com/projects/fine-print-hardcover-publication#/",
        "title": "Hardcover (Indiegogo)"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "limited run"
    ]
  }
  ,{
    "id": 132,
    "title": "A Shadow Hangs Overhead",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/xsop-1432504707-131045-medium",
    "rating": "T",
    "dateAdded": "2021/06/16",
    "authors":[
      {
        "name": "BronyWriter",
        "url": "https://www.fimfiction.net/user/43858/BronyWriter"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/131045/a-shadow-hangs-overhead",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/en/us/shop/bronywriter-/a-shadow-hangs-overhead/paperback/product-7jdzv6.html",
        "title": "Paperback"
      }
    ],
    "tags": [
      "fimfic", "paperback", "on demand"
    ]
  }
  ,{
    "id": 133,
    "title": "Fallout: Equestria - Heroes",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/3fx2-1432419418-662-medium",
    "rating": "T",
    "dateAdded": "2021/06/16",
    "authors":[
      {
        "name": "No One",
        "url": "https://www.fimfiction.net/user/872/No+One"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/662/fallout-equestria-heroes",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.ministryofimage.net/product-page/fallout-equestira-heroes",
        "title": "Hardcover"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "on demand"
    ]
  }
  ,{
    "id": 134,
    "title": "Them",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/2eg2-1629148306-119865-medium",
    "rating": "T",
    "dateAdded": "2021/08/28",
    "authors":[
      {
        "name": "Ether Echoes",
        "url": "https://www.fimfiction.net/user/19229/Ether+Echoes"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/119865/them",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.lulu.com/en/us/shop/ether-echoes/them/hardcover/product-972rvn.html",
        "title": "Hardcover"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "on demand"
    ]
  }
  ,{
    "id": 135,
    "title": "Princess Celestia: The Changeling Queen",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/sfck-1516859701-82748-medium",
    "rating": "E",
    "dateAdded": "2021/08/28",
    "authors":[
      {
        "name": "vren55",
        "url": "https://www.fimfiction.net/user/26998/vren55"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/82748/princess-celestia-the-changeling-queen",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://forms.gle/JRbnp3q5Nnp3kmfXA",
        "title": "Signup"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "signup"
    ]
  }
  ,{
    "id": 136,
    "title": "Sparkle's No. 1 Assistant",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/jm9a-1432562336-184299-medium",
    "rating": "T",
    "dateAdded": "2022/07/07",
    "authors":[
      {
        "name": "Wanderer D",
        "url": "https://www.fimfiction.net/user/144/Wanderer+D"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/184299/sparkles-no-1-assistant",
        "title": "Fimfiction.net"
      },
      {
        "url": "Paperback",
        "title": "https://www.lulu.com/shop/wanderer-d/sparkles-no-1-assistant/paperback/product-mnk68p.html"
      }
    ],
    "tags": [
      "fimfic", "paperback", "on demand"
    ]
  }
  ,{
    "id": 137,
    "title": "Before Time Began to Flow",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/i4m9-1555787857-80921-medium",
    "rating": "T",
    "dateAdded": "2022/07/07",
    "authors":[
      {
        "name": "Humanity",
        "url": "https://www.fimfiction.net/user/57410/Humanity"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/80921/before-time-began-to-flow",
        "title": "Fimfiction.net"
      },
      {
        "url": "Paperback",
        "title": "http://www.lulu.com/shop/ashton-crimson/before-time-began-to-flow/paperback/product-24082567.html"
      }
    ],
    "tags": [
      "fimfic", "paperback", "on demand"
    ]
  }
  ,{
    "id": 138,
    "title": "Winds of the Past",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/oj6z-1656250970-143878-medium",
    "rating": "T",
    "dateAdded": "2022/07/07",
    "authors":[
      {
        "name": "Fantasia",
        "url": "https://www.fimfiction.net/user/13423/Fantasia"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/143878/winds-of-the-past",
        "title": "Fimfiction.net"
      },
      {
        "url": "Hardcover",
        "title": "https://www.lulu.com/shop/fantasia-/winds-of-the-past/hardcover/product-njv79j.html"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "on demand"
    ]
  }
  ,{
    "id": 139,
    "title": "Friendship is Optimal",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/hkjy-1432455016-62074-medium",
    "rating": "T",
    "dateAdded": "2022/07/07",
    "authors":[
      {
        "name": "Iceman",
        "url": "https://www.fimfiction.net/user/16334/Iceman"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/62074/friendship-is-optimal",
        "title": "Fimfiction.net"
      },
      {
        "url": "Hardcover",
        "title": "https://www.ministryofimage.net/product-page/friendship-is-optimal"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "on demand"
    ]
  }
  ,{
    "id": 140,
    "title": "The Mare Who Once Lived on the Moon",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/kqiz-1485743579-247031-medium",
    "rating": "T",
    "dateAdded": "2022/07/07",
    "authors":[
      {
        "name": "MrNumbers",
        "url": "https://www.fimfiction.net/user/8831/MrNumbers"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/247031/the-mare-who-once-lived-on-the-moon",
        "title": "Fimfiction.net"
      },
      {
        "url": "Hardcover (MoI)",
        "title": "https://www.ministryofimage.net/product-page/the-mare-who-once-lived-on-the-moon"
      },
      {
        "url": "Paperback (Lulu)",
        "title": "https://www.lulu.com/en/us/shop/mrnumbers-/the-mare-who-once-lived-on-the-moon-paperback/paperback/product-w6vdjk.html"
      },
      {
        "url": "Hardcover (Lulu)",
        "title": "https://www.lulu.com/en/us/shop/mrnumbers-/the-mare-who-once-lived-on-the-moon/hardcover/product-eveyw6.html"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "on demand"
    ]
  }
  ,{
    "id": 141,
    "title": "A Stallion for the Time Being",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/o2fv-1432496738-120102-medium",
    "rating": "T",
    "dateAdded": "2022/07/07",
    "authors":[
      {
        "name": "Sharp Spark",
        "url": "https://www.fimfiction.net/user/105050/Sharp+Spark"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/120102/a-stallion-for-the-time-being",
        "title": "Fimfiction.net"
      },
      {
        "url": "Hardcover",
        "title": "https://www.ministryofimage.net/product-page/a-stallion-for-the-time-being"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "on demand"
    ]
  }
  ,{
    "id": 142,
    "title": "Better Living Through Science and Ponies",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/ajx4-1432429782-22535-medium",
    "rating": "E",
    "dateAdded": "2022/07/07",
    "authors":[
      {
        "name": "Pen Stroke",
        "url": "https://www.fimfiction.net/user/3291/Pen+Stroke"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/22535/better-living-through-science-and-ponies",
        "title": "Fimfiction.net"
      },
      {
        "url": "Hardcover",
        "title": "https://www.ministryofimage.net/product-page/better-living-through-science-and-ponies"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "on demand"
    ]
  }
  ,{
    "id": 143,
    "title": "Why am I Pinkie Pie?!",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/7fgs-1432437568-34702-medium",
    "rating": "E",
    "dateAdded": "2022/07/07",
    "authors":[
      {
        "name": "Hoopy McGee",
        "url": "https://www.fimfiction.net/user/5316/Hoopy+McGee"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/34702/why-am-i-pinkie-pie",
        "title": "Fimfiction.net"
      },
      {
        "url": "Hardcover",
        "title": "https://www.ministryofimage.net/product-page/why-am-i-pinkie-pie"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "on demand"
    ]
  }
  ,{
    "id": 144,
    "title": "The King of Love Bugs",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/m4jg-1623080094-358524-medium",
    "rating": "E",
    "dateAdded": "2022/07/07",
    "authors":[
      {
        "name": "NavelColt",
        "url": "https://www.fimfiction.net/user/40075/NavelColt"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/358524/the-king-of-love-bugs",
        "title": "Fimfiction.net"
      },
      {
        "url": "https://www.fimfiction.net/user/40075/NavelColt",
        "title": "Message author for link"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "on demand"
    ]
  }
  ,{
    "id": 145,
    "title": "Best Hell Ever & Heaven of a Hell",
    "edition": "1st",
    "img": "https://cdn-img.fimfiction.net/story/kw8c-1507747851-388353-medium",
    "rating": "E",
    "dateAdded": "2022/07/07",
    "authors":[
      {
        "name": "Rambling Writer",
        "url": "https://www.fimfiction.net/user/253168/Rambling+Writer"
      }
    ],
    "links": [
      {
        "url": "https://www.fimfiction.net/story/388353/best-hell-ever",
        "title": "Fimfiction.net"
      },
      {
        "url": "Hardcover",
        "title": "https://www.lulu.com/shop/rambling-writer-/best-hell-ever-heaven-of-a-hell/hardcover/product-zzzd84.html"
      }
    ],
    "tags": [
      "fimfic", "hardcover", "on demand"
    ]
  }
];

export default handler;