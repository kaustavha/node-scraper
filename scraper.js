
var conString = "postgres://postgres:qwerty@localhost:5432/comicdb"; 
//POSTGRES DATABASE CONNECTION ADDY, FORMAT usernamer:pass@addressOrPort/dbname

var pg = require("pg"),
scraper = require('scraper');
//require node modules for postgres txs and scraper for scraping hurr durr

function putInDb(name, src, title) {
//had to make the table(comics) by hand and well psql cmds, dunno if it can autobuild a table
	var txtstr = "INSERT INTO comics(name, src, title) VALUES ('"+name+"', '"+src+"', '"+title+"')";

	pg.connect(conString, function(error, client) {
		if (error) {
			return console.log(error);
		} else {
			return client.query(txtstr, function(error, results) {
				if (error) {
					return console.log(error);
				}
			});
		}
	});
}

function scrapeCnH(){
	var k=2; //replace with the highest comic no. or w/e
	for (i=0; i<k; i++){

		console.log(i);

		scraper('http://www.explosm.net/comics/'+i, function(err, jQuery) {	
			if (err) {throw err}
//check each img on the page, if the image src contains '/db/files/Comics', its the comic, add to the db
				jQuery('img').each(function() {

						var src = jQuery(this).attr( "src" ),
						title = jQuery('title').text();

						if ( src.indexOf('/db/files/Comics') !== -1 ) 
						{          
							putInDb('C&H', src, title);
						}        
					});

		});
	}
}



//Zen pencils is handled differently since the comic links are unique. 
//getNameZP goes to the archive page and retrieves the links to the comic
//scrapeZP gets the img src and adds to db
//also you should check out zenpencils, think you might like it
function getNameZP() {

		scraper('http://zenpencils.com/archives/', function(err, jQuery) {
    if (err) {throw err}

var src = jQuery('.archive-title a').attr( "href");

/*    	if ( src == "http://zenpencils.com/comic/127-j-k-rowling-the-fringe-benefits-of-failure/" )
    	{
    		console.log(src);
    		scrapeZP(src);
    	}
*/

//Comment the following block, and uncomment the above block to test if it appears to not work
//Its really slow on mine, and logs all the src's after a long wait and the next part takes the same time

    jQuery('.archive-title a').each(function() {
    	var src = jQuery(this).attr( "href" ),
						title = jQuery(this).text();
						console.log(src);
						scrapeZP(src);

					});

		
});
}

function scrapeZP(src) {
	var src = src;
			scraper(src, function(err, jQuery) {	
			if (err) {throw err}

						var src = jQuery('#comic-1 img').attr( "src" ),
						title = jQuery('title').text();

					console.log(src + title);

					putInDb('zenpencils', src, title);

					});

	

}

//broken or was broken
function scrapeSMBC() {
	for (i=1; i<3; i++){
		scraper(
    {
       'uri': 'http://www.smbc-comics.com/?id=1#comic'
           , 'headers': {
               'User-Agent': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)'
           }
    }
    , function(err, jQuery) {
        if (err) {throw err}

console.log(jQuery('#main').text());
			jQuery('img').each(function() {

				var src = jQuery(this).attr( "src" );
				console.log(src);
				console.log(src().text());
  });
    }
);
}
}



//XKCD has a JSON api so is handled differently
function scrapeXKCD(){

var Client = require('node-rest-client').Client;
//require node rest client for getting JSON and it can do RESTful stuff as well I guess
var k = 2; //replace with highest xkcd comic number or w/e

client = new Client();

for (i=0; i<k; i++){

client.get("http://xkcd.com/"+i+"/info.0.json", function(data, response){

            // parsed response body as js object
            var dataObj = JSON.parse(data),
            imgSrc = dataObj['img'],
            title = dataObj['safe_title'] + " " + dataObj['num'];
            putInDb('XKCD', imgSrc, title);       

        });
}
}

getNameZP();
