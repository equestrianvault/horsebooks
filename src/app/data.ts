import { Story, Author, Book, Publication } from './services/data.service';

export const STORIES : Story[] = [
	{
		"id": 1,
		"title": "Twilight's List",
		"description": null,
		"image": "https://cdn-img.fimfiction.net/story/p0ne-1432429218-21583-medium",
		"authorIds": [1],
		"rating": "T",
		"sourceLinks": [
			{
				"title": "Fimfiction.net",
				"url": "https://www.fimfiction.net/story/21583/twilights-list",

			}
		],
		"tags": ["ongoing"]
	},
	// {
	// 	"id": 1,
	// 	"title": "",
	// 	"description": "",
	// 	"image": "",
	// 	"authorIds": [],
	// 	"rating": "",
	// 	"sourceLinks": []
	//  "tags": []
	// }
];

export const AUTHORS : Author[] = [
	{
		"id": 1,
		"name": "Kittyhawk Contrail aka kits",
		"url": "https://www.fimfiction.net/user/283/kits"
	}
	// {
	// 	"id": 1,
	// 	"name": "",
	// 	"url": ""
	// }
];

export const BOOKS : Book[] = [
	{
		"id": 1,
		"storyIds": [1],
		"title": "Twilight's List",
		"image": "https://cdn-img.fimfiction.net/story/p0ne-1432429218-21583-medium",
		"description": null
	}
	// {
	// 	"id": 1,
	// 	"storyIds": [],
	// 	"title": "",
	// 	"image": "",
	// 	"description": ""
	// }
];

export const PUBLICATIONS : Publication[] = [
	{
		"id": 1,
		"bookId": 1,
		"edition": "Third",
		"purchaseLinks": [
			{
				"title": "PDF",
				"url": "https://www.deviantart.com/kittyhawk-contrail/art/Twilight-s-List-Third-Edition-PDF-for-print-601163537",
				"startDate": "2018/12/28",
				"expiry": null
			}
		]
	}
	// {
	// 	"id": 1,
	// 	"bookId": 1,
	// 	"edition": "",
	// 	"purchaseLinks": []
	// }
];
