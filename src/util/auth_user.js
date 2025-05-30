// import Cookies from 'js-cookie'


export function SET_USER(user){
	localStorage.setItem('admin@info', JSON.stringify(user));
}

export function SET_TOKEN(token){
	localStorage.setItem('admin@Token', token);
}


export function GET_USER(){
	const user = localStorage.getItem('admin@info');

	return user ? JSON.parse(user) : null;
}

export function GET_TOKEN(){
	const token = localStorage.getItem('admin@Token');

	return token ? token : null;
}

export function REMOVE_USER(){
	localStorage.removeItem('admin@info');
	localStorage.removeItem('admin@Token');
}


