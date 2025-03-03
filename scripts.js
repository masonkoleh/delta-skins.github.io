//global variables
var database;
var downloadLink;
var captionText;
var images;
var skinsLikes;
var consolesLikes;

// Script to open and close sidebar
function w3_open() {
  document.getElementById("mySidebar").style.display = "block";
  document.getElementById("myOverlay").style.display = "block";
}
function w3_close() {
  document.getElementById("mySidebar").style.display = "none";
  document.getElementById("myOverlay").style.display = "none";
}
function onClick(element) {
  firebaseOpen(element);
  var modalImg = document.getElementById("img01");
  modalImg.src = element.src;
  modalImg.style.maxWidth = "220px";
  document.getElementById("modal01").style.display = "block";
  var creatorText = document.getElementById("creator");
  var maker = element.getAttribute("data-maker");
  creatorText.innerHTML = maker;
  captionText = document.getElementById("caption");
  captionText.innerHTML = element.alt;
  var supportsText = document.getElementById("supports");
  var supports = element.getAttribute("data-supports");
  supportsText.innerHTML = supports;
  var downloadText = document.getElementsByTagName("button");
  downloadLink = element.getAttribute("data-download");
  if (typeof(Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
    var likeButton = document.getElementById("likeButton");
    likeButton.dataset.skinname = element.alt;
    likeButton.style.display = "";
    
      if(localStorage[element.alt]=="1"){
        likeButton.src="logos/liked.png"
      } else {
        likeButton.src="logos/notliked.png"
      }
    }
  }

function downloadNow(){
  window.location.href=downloadLink;	
}
function downloadRom(element){
  window.location.href=element.dataset.download;	
}
  function customLinks() {
    var url = decodeURIComponent(document.location.href)
    if (url.indexOf("?") > -1){
        params = url.split('?')
        customLink = params[1].toString();
          filterSkinsCreator(customLink);
          document.getElementsByTagName("select")[1].value = customLink;
      }
    }
//ran on page load
function loadImages(){
  //checks to see if URL has a ? after .html, if it does it does things with it
  database = firebase.database();
  //pulls all imgs into images array.
  images = Array.from(document.getElementsByTagName("img"))
  images.splice(-2,2)
  sortBy("newold");
  customLinks();
}
function showFilters(element){
  if (element.innerHTML=="<b>Show Filters</b>"){
  document.getElementById("filters").style.display="block";
  element.innerHTML = "<b>Hide Filters</b>"
} else{
  document.getElementById("filters").style.display="none";
  element.innerHTML = "<b>Show Filters</b>"
  }
}
function filterSkinsSupport(filterType){
  if(!(window.location.pathname.indexOf("creator")>-1)){
    document.getElementById("sort").disabled = false;
    }
  for(i in images){
    images[i].classList.remove("hideSupport");
  }
  if(filterType == "new"){
    document.getElementById("sort").disabled = true;
  for(i in images){
    if (images[i].getAttribute("data-supports").includes("8")){
      images[i].classList.add("hideSupport");
    }
  }
}else if(filterType == "old"){
  document.getElementById("sort").disabled = true;
  for(i in images){
    if (images[i].getAttribute("data-supports").includes("X")){
      images[i].classList.add("hideSupport");
    }
  }
}
}

function filterSkinsCreator(filterType){
  //if the page isn't the creator page, enable sorting
  if(!(window.location.pathname.indexOf("creator")>-1)){
  document.getElementById("sort").disabled = false;
  }
  var validCreator = false;
  for(i in images){
    images[i].classList.remove("hideCreator");
  }
  if(filterType!=""){
    document.getElementById("sort").disabled = true;
  for(i in images){
    if(!(images[i].getAttribute("data-maker").includes(filterType))){
      images[i].classList.add("hideCreator")
    }else{
      validCreator = true;
    }
  }
  if(!validCreator){
    document.getElementsByTagName("select")[1].value = "No filter";
    window.alert("No creators found.");
    for(i in images){
      images[i].classList.remove("hideCreator");
    }
  }
  }
}
function includeLandscape(element){
  if(element.checked){
    document.getElementById("sort").disabled = true;
    for(i in images){
      if(!(images[i].getAttribute("data-supports").includes("landscape"))){
      images[i].classList.add("hidePortrait")
    }
    }
  }else {
    if(!(window.location.pathname.indexOf("creator")>-1)){
      document.getElementById("sort").disabled = false;
      }
    for(i in images){
      images[i].classList.remove("hidePortrait")
    }
  }
}
function sortBy(sort){
  if (sort == "newold"){
    var sortedImages = Array.from(document.getElementsByTagName("img"));
    sortedImages.splice(-2,2);
    sortedImages.sort(function(a,b){
      var contentA =parseInt(a.dataset.added,10);
      var contentB =parseInt(b.dataset.added,10);
      return (contentB - contentA);
    });
    var unsortedImages = Array.from(document.getElementsByTagName("img"));
    unsortedImages.splice(-2,2);
    const attrs = sortedImages.map(node => ({
      src: node.src,
      alt: node.alt,
      download: node.dataset.download,
      added: node.dataset.added,
      supports: node.dataset.supports,
      maker: node.dataset.maker,
    }))
    
    attrs.forEach((item, i) => {
      unsortedImages[i].src = item.src;
      unsortedImages[i].alt = item.alt;
      unsortedImages[i].dataset.download = item.download;
      unsortedImages[i].dataset.added = item.added;
      unsortedImages[i].dataset.supports = item.supports;
      unsortedImages[i].dataset.maker = item.maker;
    })
  } else if (sort == "oldnew"){
    var sortedImages = Array.from(document.getElementsByTagName("img"));
    sortedImages.splice(-1,1);
    sortedImages.sort(function(a,b){
      var contentA =parseInt(a.dataset.added,10);
      var contentB =parseInt(b.dataset.added,10);
      return (contentA - contentB);
    });
    var unsortedImages = Array.from(document.getElementsByTagName("img"));
    unsortedImages.splice(-1,1);
    const attrs = sortedImages.map(node => ({
      src: node.src,
      alt: node.alt,
      download: node.dataset.download,
      added: node.dataset.added,
      supports: node.dataset.supports,
      maker: node.dataset.maker,
    }))
    
    attrs.forEach((item, i) => {
      unsortedImages[i].src = item.src;
      unsortedImages[i].alt = item.alt;
      unsortedImages[i].dataset.download = item.download;
      unsortedImages[i].dataset.added = item.added;
      unsortedImages[i].dataset.supports = item.supports;
      unsortedImages[i].dataset.maker = item.maker;
    })
  } else if (sort == "likes"){
    var sortedImages = Array.from(document.getElementsByTagName("img"));
    sortedImages.splice(-2,2);
    //pulls current likes for selected skin
    var currentLikes; 
    var consoleType = window.location.pathname;
    consoleType = consoleType.split("/").pop().split(".").splice(0,1).toString();   
    //if (consoleType != "creator"){
    consolesLikes = firebase.database().ref(consoleType);
    consolesLikes.once("value", function(data) {
      var consolesSkins = data.val();
      for(i in sortedImages){
      currentLikes = consolesSkins[sortedImages[i].alt];
      if (currentLikes == undefined){
        currentLikes = "0";
      } 
      sortedImages[i].dataset.likes = currentLikes;
      }
      });
    // } else if (consoleType == "creator") {
    //   var gbaLikes = firebase.database().ref("gba");
    //   var gbcLikes = firebase.database().ref("gbc");
    //   var n64Likes = firebase.database().ref("n64");
    //   var nesLikes = firebase.database().ref("nes");
    //   var snesLikes = firebase.database().ref("snes");
    //   var ndsLikes = firebase.database().ref("nds");
    //   gbaSkins = gbaLikes.once("value",function(data){
    //      data.val();
    //   });
    //   gbcSkins = gbcLikes.once("value",function(data){
    //      data.val();
    //   })
    //   n64Skins = n64Likes.once("value",function(data){
    //     data.val();
    //   })
    //   nesSkins = nesLikes.once("value",function(data){
    //     data.val();
    //   })
    //   snesSkins = snesLikes.once("value",function(data){
    //     data.val();
    //   })
    //   ndsSkins = ndsLikes.once("value",function(data){
    //     data.val();
    //   })
    //   test = "Sketch GBA"
    //   setTimeout(() => {
    //     console.log(gbaSkins[test])
    //   }, 100);
      
    // }
    
    
    setTimeout(function(){
      sortedImages.sort(function(a,b){
        var contentA =parseInt(a.dataset.likes);
        var contentB =parseInt(b.dataset.likes);
        return (contentB - contentA);
      });
      var unsortedImages = Array.from(document.getElementsByTagName("img"));
      unsortedImages.splice(-2,2);
      const attrs = sortedImages.map(node => ({
        src: node.src,
        alt: node.alt,
        download: node.dataset.download,
        added: node.dataset.added,
        supports: node.dataset.supports,
        maker: node.dataset.maker,
        likes: node.dataset.likes,
      }))
      
      attrs.forEach((item, i) => {
        unsortedImages[i].src = item.src;
        unsortedImages[i].alt = item.alt;
        unsortedImages[i].dataset.download = item.download;
        unsortedImages[i].dataset.added = item.added;
        unsortedImages[i].dataset.supports = item.supports;
        unsortedImages[i].dataset.maker = item.maker;
        unsortedImages[i].dataset.likes = item.likes;
      })
     },150);
  }
}


function closeModal(){
  document.getElementById("modal01").style.display = "none";
}
//localStore == 1 is liked, 0 is not liked/unliked
function liked(element){
    if (localStorage[element.dataset.skinname] == "1"){
      //unlike the skin
      element.src = "logos/notliked.png";
      localStorage[element.dataset.skinname] = "0";
      firebaseUpdate("0",element);
    } else {
      //like the skin
      element.src = "logos/liked.png";
      localStorage[element.dataset.skinname] = "1";
      firebaseUpdate("1",element);
    }
  }
  //opens firebase connection
function firebaseOpen(element){
  //pulls current likes for selected skin
  consolesLikes = firebase.database().ref(element.dataset.console);
  consolesLikes.once("value", function(data) {
    var consolesSkins = data.val();
    skinsLikes = consolesSkins[element.alt];
   });
   //timeout makes sure it gets the value before its printed in console
   setTimeout(function(){
     if (skinsLikes == undefined){
    console.log("Current likes for " + element.alt + " is 0");
   } else {
    console.log("Current likes for " + element.alt + " is " + skinsLikes);
    }},150);
}
function firebaseUpdate(updateNum, element){
 //if skin isn't in database, add it
    if (skinsLikes == undefined){
      consolesLikes.update ({
        [element.dataset.skinname]: 1
      })
    } else if (updateNum == "1"){ //increase like by 1
      skinsLikes++;
      consolesLikes.update ({
        [element.dataset.skinname]: skinsLikes
      })
    } else if (updateNum == "0"){ //decrease like by 1
      skinsLikes--;
      consolesLikes.update ({
        [element.dataset.skinname]: skinsLikes
      })
    }
    console.log("Current likes of " + element.dataset.skinname + " is " + skinsLikes);
  
}