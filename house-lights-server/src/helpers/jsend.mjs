//import config from 'config';
//import _ from 'lodash';
//import util from 'util';

const jcompose = (code,data,message) => {

	let response = {};	

	if (code < 600 && code >= 500) {

		response.status='error';
		response.code=code;
		response.data=null;
		response.message=data;
		
	}
	else {

		if (code < 300 && code >= 200)
			response.status='success'
		else if (code < 500 && code >= 400)
			response.status='fail';

		response.code=code;		
		response.data = data;
		
		if (message)
			response.message=message;
	}
	
	return response;
}



export default jcompose;

