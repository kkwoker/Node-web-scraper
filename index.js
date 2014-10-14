var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var path = require('path');



var run = function(url){
	request(url, function(error, response, body){
		if(!error && response.statusCode == 200){
			
			var writeToFile = function(data){
				fs.appendFile("images.csv", data, function(err) {
			    if(err) {
			        console.log(err);
			    } else {
			        console.log("The file was saved!");
			    }
				}); 
			}

			$ = cheerio.load(body);
			var data = '';
			
			//.each is Synchronous!
			$("tr").each(function(index){
				var code = $(this).find("code").first().text();
				var abs_url = "http://substack.net" + $(this).find("a").attr("href");
				var isDirectory = abs_url.slice(-1) === '/';
				var isNotRoot = abs_url.slice(-3) !== '../';
				if ( isDirectory && isNotRoot ){
					console.log(abs_url);
					//abs_url is a directory, we need to open it
					run(abs_url);
				}else{
					if (isNotRoot){
						data += code + ',' + abs_url + ',' + path.extname(abs_url) + '\n';
					}
				}
			});

			console.log("Writing to file");
			writeToFile(data);


		}
	});

}


var url = 'http://substack.net/images/'
run(url);
