import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDCkxDZH0tSd_c02dFkaEVQMpV4ZL06etU",
    authDomain: "chanzel-ecommerce.firebaseapp.com",
    projectId: "chanzel-ecommerce",
    storageBucket: "chanzel-ecommerce.appspot.com",
    messagingSenderId: "379673191328",
    appId: "1:379673191328:web:3ae431b8d0c23a4e177ac5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
