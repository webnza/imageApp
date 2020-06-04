'use strict';

require('dotenv').config();

exports.language    = process.env.LANGUAGE;
exports.port    	= process.env.PORT;
exports.secret    	= process.env.SECRET;
exports.credentials = {
	"john":"12345",
	"anil":"123456",
	"rajeev":"54321"
}
