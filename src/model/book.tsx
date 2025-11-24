export interface IBook{
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

export interface IAuthor{
	name : string;
	url? : string;
}

export interface IBookLink{
	title : string;
	url : string;
}
