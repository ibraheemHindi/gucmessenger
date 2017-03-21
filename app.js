
var express = require('express');
var app = express();
var httpntlm = require('httpntlm');
var cheerio = require('cheerio');
var request = require('request');
var bodyParser = require('body-parser');
var fs = require('fs');


app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	next();
});


//Test this at http://localhost:4000/api/authenticate/<email>/<pass>   -----------   http not https please :D

router.route('/authenticate/:e/:p').get(function(req,res){

    var email = req.params.e;
	var pass = req.params.p;

	httpntlm.get({
    url: 'http://student.guc.edu.eg/External/LSI/EAACMS/SACMM/ClassAttendance_ViewStudentAttendance.aspx',
    username: email,
    password: pass
	}, function (err, resp){

	    var $ = cheerio.load(resp.body);
	
		if(err) {
			console.log('ERROR');
		    return err;
		}

		if(resp.statusCode == 200){
			
			$('select').filter(function(){
				
				var result = '';
				var data = $(this);
				var courses = data.children();
				
				courses.each(function(i, elm) {
					var myText = $(this).text();
					result += (myText+"&");
				});
				
                res.json({
					'authenticated' : 'true',
					'courses' : result
				});
				
            })	
	
		}

		else{
			res.json({'authenticated' : 'false'});
		}

	});

});	

app.use('/api', router);

app.listen(process.env.PORT || 3000,function(){
	console.log('server up and running');
});