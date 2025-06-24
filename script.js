function darkmode(){
    document.querySelector(".body").style.backgroundColor = 'rgb(57 35 35)';
    document.querySelector("body").style.backgroundColor = 'rgb(57 35 35)';
    document.querySelector("#logo").setAttribute("src", "img/logo-light.png");
    document.querySelector(".main-bg").style.backgroundColor = 'rgb(179 174 145 / 41%)';
    document.querySelectorAll(".divparent .card").forEach(function (item){
        item.style.backgroundColor = '#d6c6aa';
    })
    document.querySelector(".last-div").style.backgroundColor = 'rgb(38 14 14)';
    document.querySelector(".foo").style.backgroundColor = 'rgb(214 198 170)';
    document.querySelectorAll(".body .slick").forEach(function (item){
        item.style.color = '#392323';
    })
    document.querySelector(".h2").style.color = '#3923238a';


    document.querySelector(".cust").style.backgroundColor = '#e2cfae';
    document.querySelector(".cust").style.color = 'rgb(57 35 35)';

    document.querySelectorAll(".navbar-nav .h").forEach(function (item){
        item.style.color = '#e6d2b4';
    })
    document.querySelector(".active").style.color = '#e1ceac';
    document.querySelector(".active").onmouseenter = function (item) {
        item.style.color = '#b1a184';
    }
    document.querySelectorAll(".navbar-nav .h").onmouseenter = function (item) {
        item.style.color = '#b1a184';
    }
    document.querySelector(".h44").style.color = 'rgba(214,198,170,0.77)';

    document.querySelector(".alink").style.backgroundColor = 'rgba(214,198,170,0.77)';
    document.querySelector(".login").style.color = '#d6c6aa';
    document.querySelector(".dolar").style.color = '#d6c6aa';

    document.querySelector(".text").style.color = 'rgb(121 41 41 / 69%)';

    document.querySelectorAll(".vv .text").forEach(function (item){
        item.style.color = 'rgb(108 41 41)';
    })
    document.querySelector(".copy").style.color = '#d6c6aa';

    document.querySelectorAll(".btns .btn-lightt").forEach(function (item){
        item.style.backgroundColor = 'rgb(85 24 24 / 74%)';
    })
    document.querySelectorAll(".boy-girl .btn-lightt").forEach(function (item){
        item.style.backgroundColor = 'rgb(85 24 24 / 74%)';
        item.style.color = '#d6c6aa';
    })
    document.querySelector(".textt").style.color = '#792929';


    document.querySelectorAll(".body .btn-darkk").forEach(function (item){
        item.style.backgroundColor = 'rgb(57 35 35)';
        item.style.color = 'rgb(230,216,185)';
    })

    document.querySelectorAll(".body .h333").forEach(function (item){
        item.style.color = '#d6c6aa';
    })
    document.querySelector(".h33").style.color = '#d6c6aa';
    document.querySelector(".bgdiv").style.backgroundColor = 'rgb(93 59 59 / 89%)';
    document.querySelectorAll(".body .btnn").forEach(function (item){
        item.style.backgroundColor = 'rgb(219 189 135)';
        item.style.color = 'rgb(53 39 39)';
    })

    document.querySelectorAll(".body .ico-btn").forEach(function (item){
        item.style.color = 'rgb(230,216,185)';
    })
}


function sign(){
    window.location.replace("index.html");
}

document.addEventListener('DOMContentLoaded', async function () {
  // Only run on homepage
  if (document.getElementById('summer-collection') && document.getElementById('winter-collection')) {
    const lang = localStorage.getItem('lang') || 'en';
    // Fetch featured products for summer and winter
    const summerProducts = await getFeaturedProducts({ season: 'summer', limit: 4 });
    const winterProducts = await getFeaturedProducts({ season: 'winter', limit: 4 });

    function renderProductCard(product) {
      const name = lang === 'ar' ? product.name_ar : product.name_en;
      const sizes = (product.sizes || []).map(size => `<span class='badge badge-secondary mx-1'>${size}</span>`).join(' ');
      const colors = (product.colors || []).map(color => `<span style='display:inline-block;width:18px;height:18px;border-radius:50%;background:${color};border:1px solid #ccc;margin-right:4px;'></span>`).join(' ');
      const img = (product.images && product.images.length) ? product.images[0] : 'img/div-empty.jpg';
      return `
        <div class="col-md-3 mb-4">
          <div class="card h-100">
            <img src="${img}" class="card-img-top" alt="${name}">
            <div class="card-body">
              <h5 class="card-title">${name}</h5>
              <div><strong>${lang === 'ar' ? 'المقاسات' : 'Sizes'}:</strong> ${sizes}</div>
              <div><strong>${lang === 'ar' ? 'الألوان' : 'Colors'}:</strong> ${colors}</div>
              <a href="product.html?id=${product.id}" class="btn btn-primary mt-2">${lang === 'ar' ? 'عرض التفاصيل' : 'View Details'}</a>
            </div>
          </div>
        </div>
      `;
    }

    document.getElementById('summer-collection').innerHTML = summerProducts.map(renderProductCard).join('');
    document.getElementById('winter-collection').innerHTML = winterProducts.map(renderProductCard).join('');
  }
});