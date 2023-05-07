import * as Api from '/api.js';

const bank = document.getElementById('bank');
bank.style.display = 'none';

const ok1 = document.getElementById('ok1')
const ok0 = document.getElementById('ok0')

let latitude = '';
let longitude = '';
let team = '';

function success({ coords, timestamp }) {
	latitude = coords.latitude;   // 위도
	longitude = coords.longitude; // 경도
}

function error() {
	alert('미동의시 출석체크를 할수 없습니다.');
	location.reload()
  }

function getUserLocation() {
	if (!navigator.geolocation) {
		throw "위치 정보가 지원되지 않습니다.";
	}
	navigator.geolocation.getCurrentPosition(success, error);
}

ok0.addEventListener("click", (e) => {
	e.preventDefault;
	const check0 = document.getElementById('check0')
	check0.style.display = "none";
	const check1 = document.getElementById('check1')
	check1.style.display = "block";
})

ok1.addEventListener("click", (e) => {
	e.preventDefault;
	const check1 = document.getElementById('check1')
	check1.style.display = "none";
	getUserLocation();
	const check2 = document.getElementById('check2')
	check2.style.display = "block";
})

const no0 = document.getElementById('no0')

no0.addEventListener("click", (e) => {
	e.preventDefault;
	alert('출석체크를 위해 확인이 필요합니다.')
})

const no1 = document.getElementById('no1')

no1.addEventListener("click", (e) => {
	e.preventDefault;
	alert('출석체크를 위해 동의가 필요합니다.')
})

const no2 = document.getElementById('no2')

no2.addEventListener("click", (e) => {
	e.preventDefault;
	alert('출석체크를 위해 확인이 필요합니다.')
})

const ok2 = document.getElementById('ok2')

ok2.addEventListener("click", (e) => {
	e.preventDefault;
	const check1 = document.getElementById('check2')
	check1.style.display = "none";
	const check2 = document.getElementById('check3')
	check2.style.display = "block";
})

const submit_button = document.getElementById('submit_button')

const employee_name = document.getElementById('employee_name');
const employee_num = document.getElementById('employee_num');
const tel = document.getElementById('tel');


const teamo = document.getElementById('team');
const temass = document.getElementsByName('name');
let team_name = '';
teamo.addEventListener("change", (e) => {
	team_name = e.target.value;
	if (e.target.value === '수협중앙회지부' || e.target.value === '신한은행지부') {
		bank.style.display = 'block';
	} else {
		bank.style.display = 'none';
	}
});

let reations = ''

const me = document.getElementById('me');
const family = document.getElementById('family');

me.addEventListener("click", (e) => {
	e.preventDefault;
	reations = me.value;
	me.style.backgroundColor = 'lightgreen';
	family.style.backgroundColor = 'white';
});

family.addEventListener("click", (e) => {
	e.preventDefault;
	reations = family.value;
	family.style.backgroundColor = 'lightgreen';
	me.style.backgroundColor = 'white'
});


submit_button.addEventListener("click", async (e) => {
	e.preventDefault;
	const employee_names = employee_name.value;
	const employee_nums = employee_num.value;
	const tels = tel.value;
	const bank_name = document.getElementById('bank_name').value
	const bank_number = document.getElementById('bank_number').value
	const bank_admin = document.getElementById('bank_admin').value
	if (team_name === "") {
		alert('소속을 선택해주세요!')
		return false;
	}
	if (employee_names === '') {
		alert('성명을 작성해주세요!')
		return false;
	}
	if (employee_nums === '') {
		alert('직원번호을 작성해주세요!')
		return false;
	}
	if (tels === '') {
		alert('핸드폰번호를 작성해주세요!')
		return false;
	}
	if (reations === '') {
		alert('본인 유무를 확인해주세요!')
		return false;
	}
	const data = {
		team_name,
		employee_names,
		employee_nums,
		tels,
		reations,
		latitude,
		longitude,
		bank_name,
		bank_number,
		bank_admin
	}
	const postData = await Api.post('https://www.financialrally.pe.kr/api/visitor', data);
	// const postData = await Api.post('http://localhost:80/api/visitor', data);
	if (postData.result === false) {
		alert('이미 등록된 기기입니다.');
		return false;
	} else if (postData.result === 'no') {
		alert('집회 출석 시간이 아니거나, GPS가 꺼져 있는 상태입니다.');
		return false;
	}
	const tn = postData.data.team_name;
	const en = postData.data.employee_names;
	const enm = postData.data.employee_nums;
	const t = postData.data.tels;
	const rl = postData.data.reations;
	const bn = postData.data.bank_name;
	const bnb = postData.data.bank_number;
	const ba = postData.data.bank_admin;
	const {ip, address_data } = postData.data;
	let confirm_data;
	if (bn === ''){
		confirm_data = confirm(address_data + "\n" + en + "\n" + enm + "\n" + t + "\n" + tn + "\n" + rl + "\n" + ip);
	} else {
		confirm_data = confirm(address_data + "\n" + en + "\n" + enm + "\n" + t + "\n" + tn + "\n" + rl + "\n" + ip + "\n" + bn + "\n" + bnb + "\n" + ba);
	}
	// console.log(confirm_data);
	if (confirm_data === true) {
		// console.log('hiahfie');
		const newData = {
			ip,
			address_data,
			team_name: tn,
			employee_names: en,
			employee_nums: enm,
			tels: t,
			reations: rl,
			bank_name: bn,
			bank_number: bnb,
			bank_admin: ba,
		}
		const postDataOk = await Api.post('https://www.financialrally.pe.kr/api/visitorOk', newData);
		// const postDataOk = await Api.post('http://localhost:80/api/visitorOk', newData);
		const ment = postDataOk.result;
		alert(ment);
		location.reload()
	}
})


