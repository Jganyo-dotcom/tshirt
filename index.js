document.addEventListener('DOMContentLoaded',function(){
    console.log('loaded')
    let lock_range = true;
    document.querySelector('#lock-range').textContent = 'unlock';
    document.querySelectorAll('input[type="range"]').forEach(function(range){
        range.disabled = true
    })

    
    let target = document.querySelector('#t-shirt')
    document.querySelectorAll('.choose').forEach(button=>{
        target.onerror = null
        target.onerror = function(){
            alert('not available at the moment')
            target.src = 'gray.jpg'
        }
        button.addEventListener('click', function(){
            let colour = button.dataset.colour
            console.log(colour)
        target.src = colour
        
        })
        
    })

    document.querySelectorAll('.change').forEach(function(image){
    image.addEventListener('click', function(){
         let design_type = image.dataset.src
         image.style.width = '150px'
         image.style.height = '150px'
         document.querySelector('.design').src = design_type
         document.querySelector('.design').style.width = '150px'
         document.querySelector('.design').style.height = '150px'

    })
   
})


document.querySelector('#show-designs').addEventListener('click', function(){
    document.querySelector('#modal').style.display = 'block';
})
document.querySelector('#close-modal').addEventListener('click',function(){
    document.querySelector('#modal').style.display = 'none'
})

document.querySelector('#resize-height').addEventListener('input', ()=>{
    save_current()
    document.querySelector('.design').style.height = document.querySelector('#resize-height').value + 'px'
});

document.querySelector('#resize-width').addEventListener('input', ()=>{
    save_current()
    document.querySelector('.design').style.width = document.querySelector('#resize-width').value + 'px'

})

document.querySelector('#upward').addEventListener('input', ()=>{
    save_current()
    document.querySelector('.design').style.top = document.querySelector('#upward').value + '%'
});

document.querySelector('#move-left').addEventListener('input', ()=>{
    save_current()
    document.querySelector('.design').style.left = document.querySelector('#move-left').value + '%'

})

let resizeHistory=[]

function save_current(){
  resizeHistory.push({
    width: document.querySelector('.design').style.width,
    height: document.querySelector('.design').style.height,
    up: document.querySelector('.design').style.top,
    left: document.querySelector('.design').style.left
  })  

}
document.querySelector('#undo').addEventListener('click',() =>{
    if(resizeHistory.length===0){
        alert('nothing to undo')
        return;
    };
    let lastsize = resizeHistory.pop()
    document.querySelector('.design').style.width = lastsize.width;
    document.querySelector('.design').style.height= lastsize.height;
    document.querySelector('.design').style.left = lastsize.left;
    document.querySelector('.design').style.top = lastsize.up;

    document.querySelector('#resize-width').value = parseInt(lastsize.width),
    document.querySelector('#resize-height').value = parseInt(lastsize),
    document.querySelector('#move-left').value = parseInt(lastsize.left)
    document.querySelector('#upward').value = parseInt(lastsize.top)
})

function handleerror(img) {
    // Prevent repeated alerts
    if (!img.dataset.errorHandled) {
      alert('⚠️ Image failed to load due to poor connection.');
      img.dataset.errorHandled = "true";
    }

    img.onerror = null;
    img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAJUlEQVR42u3BAQEAAACCIP+vbkhAAQAAAAAAAAAAAAAAAAAAAAAAAPA2DS4AAXokF9UAAAAASUVORK5CYII=';
  img.alt = 'errorw';
  img.style.objectFit = "contain";

    
    // img.src = 'placeholder.png';
    // img.style.display = 'block';
    // img.style.opacity = '0.6';
  }

document.querySelector("#lock-range").addEventListener('click', function(){
    lock_range = !lock_range;
    if (lock_range){
        document.querySelector('#lock-range').textContent = 'unlock';
    document.querySelectorAll('input[type="range"]').forEach(function(range){
        range.disabled = true
    })

    }else{
       document.querySelector('#lock-range').textContent = 'lock';
    document.querySelectorAll('input[type="range"]').forEach(function(range){
        range.disabled = false;
    })
    }
})

document.querySelector('#show-order').addEventListener('click', function(){
    document.querySelector('#modaltwo').style.display = 'block';
})
document.querySelector('#close-modaltwo').addEventListener('click',function(){
    document.querySelector('#modaltwo').style.display = 'none'
})

// Form screenshot logic
document.querySelector('form').addEventListener('submit', function(event) {
    alert('wait a while')
  event.preventDefault(); // Prevent the default form submission

  const dressing = document.querySelector('#dressing');

  html2canvas(dressing).then(canvas => {
    const dataURL = canvas.toDataURL("image/png"); // Base64 image
    document.querySelector('#screenshot_data').value = dataURL;
    
    // Now submit the form after the screenshot is set
    event.target.submit();
  }).catch(error => {
    alert("Screenshot failed. Please try again.");
    console.error(error);
  });
});




  function handleerror(img) {
    img.src = "34.png"; // Replace with a fallback image if one fails to load
    img.style.display = "block";
    if (img.previousElementSibling) {
      img.previousElementSibling.style.display = "none";
    }
  }


  window.addEventListener("load", () => {
    const [navEntry] = performance.getEntriesByType("navigation");
    
    if (navEntry && navEntry.duration > 10000) {
      // Show warning if total load took over 5 seconds
      document.getElementById("connection-warning").style.display = "block";
    }
  });

  // Fallback in case 'load' doesn't fire within 10 seconds
  setTimeout(() => {
    const [navEntry] = performance.getEntriesByType("navigation");
    if (!navEntry || navEntry.duration === 0) {
      document.getElementById("connection-warning").style.display = "block";
    }
  }, 10000);



  document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
    alert('🚫 Right-click is disabled on this page.');
  });

  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  });








})

