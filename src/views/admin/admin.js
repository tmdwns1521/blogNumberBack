
import * as Api from '/api.js';

window.onload = async function () {
    const localData = window.localStorage.getItem('user')
    if (localData != null){
        let postData = await Api.get('http://49.247.45.148:80/api/consultings');
        const phone_list = []
        const ip_list = []
        for (const i of postData){
            const ip = i.ip
            const phone = i.phone
            ip_list.push(ip)
            let ip_count = ip_list.filter(element => ip === element).length;
            phone_list.push(phone)
            let phone_count = phone_list.filter(element => phone === element).length;
            i.ip_count = ip_count
            i.phone_count = phone_count
        }
        
        postData = postData.reverse()
        const tables = document.getElementById('products')
        let datas = ''
        let n = postData.length
        for (const i of postData){
            const ip = i.ip
            const phone = i.phone
            datas += `<tr><td>${n}</td><td>${i.ip_count}</td><td>${i.phone_count}</td><td>${i.ip}</td><td>${i.phone}</td><td>${i.car}</td><td>${i.selects}</td><td>${i.name}</td><td>${i.kr_time}</td></tr>`
            n -= 1
        }
        datas = `<tbody>${datas}</tbody>`
        tables.innerHTML += datas
    } else {
        location.href = "/login";
    }
}

function sayHi() {
    var $setRows = $('#setRows');

    $setRows.submit(function (e) {
        e.preventDefault();
        var rowPerPage = 20;// 1 을  곱하여 문자열을 숫자형로 변환


        var zeroWarning = 'Sorry, but we cat\'t display "0" rows page. + \nPlease try again.'
        if (!rowPerPage) {
            alert(zeroWarning);
            return;
        }
        $('#nav').remove();
        var $products = $('#products');

        $products.after('<div id="nav">');


        var $tr = $($products).find('tbody tr');
        var rowTotals = $tr.length;
    //	console.log(rowTotals);

        var pageTotal = Math.ceil(rowTotals/ rowPerPage);
        var i = 0;

        for (; i < pageTotal; i++) {
            $('<a href="#"></a>')
                    .attr('rel', i)
                    .html(i + 1)
                    .appendTo('#nav');
        }

        $tr.addClass('off-screen')
                .slice(0, rowPerPage)
                .removeClass('off-screen');

        var $pagingLink = $('#nav a');
        $pagingLink.on('click', function (evt) {
            evt.preventDefault();
            var $this = $(this);
            if ($this.hasClass('active')) {
                return;
            }
            $pagingLink.removeClass('active');
            $this.addClass('active');

            // 0 => 0(0*4), 4(0*4+4)
            // 1 => 4(1*4), 8(1*4+4)
            // 2 => 8(2*4), 12(2*4+4)
            // 시작 행 = 페이지 번호 * 페이지당 행수
            // 끝 행 = 시작 행 + 페이지당 행수

            var currPage = $this.attr('rel');
            var startItem = currPage * rowPerPage;
            var endItem = startItem + rowPerPage;

            $tr.css('opacity', '0.0')
                    .addClass('off-screen')
                    .slice(startItem, endItem)
                    .removeClass('off-screen')
                    .animate({opacity: 1}, 300);

            });

            $pagingLink.filter(':first').addClass('active');

        });

    $setRows.submit();

  }
  
setTimeout(sayHi, 500);


const cpaButton = document.getElementById('CPA')
const visitorButton = document.getElementById('VISITOR')
const logoutButton = document.getElementById('LOGOUT')

cpaButton.addEventListener("click", () => {
    location.href = '/admin'
})

visitorButton.addEventListener("click", () => {
    location.href = '/visitor'
})

logoutButton.addEventListener("click", () => {
    window.localStorage.removeItem('user');
    location.reload()
})