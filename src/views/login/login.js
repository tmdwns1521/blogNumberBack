import * as Api from '/api.js';

const login = document.getElementById('login')
login.addEventListener("click", async (e) => {
    e.preventDefault
    const id = document.getElementById('id').value
    console.log(id)
    if (id == ''){
        swal("아이디를 입력해주십시오.");
        return false;
    }
    const pw = document.getElementById('pw').value
    console.log(pw);
    if (pw == ''){
        swal("비밀번호를 입력해주십시오.");
        return false;
    }
    const datas = { id, pw }
    const postData = await Api.post('http://49.247.45.148:80/api/login', datas);
    if (postData.status == 200){
        const token = postData.result
        window.localStorage.setItem('user', token)
        const localData = window.localStorage.getItem('user')
        if (localData == null){
            location.reload();
        } else {
            location.href = "/admin";
        }
    } else{
        swal(postData.result);
    }
})