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


document.querySelector('#show-designs').addEventListener('click', function() {
  document.querySelector('#modal').style.display = 'block';
});

document.querySelector('#close-modal').addEventListener('click', function() {
  document.querySelector('#modal').style.display = 'none';
});

window.addEventListener("click", function(event) {
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modal-content");

  // Close the modal only if the user clicks directly on the background
  if (event.target === modal) {
    modal.style.display = "none";
  }
});


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
    
})
document.querySelector('#close-modaltwo').addEventListener('click',function(){
    document.querySelector('#modaltwo').style.display = 'none'
})

// Form screenshot logic

let compressedFile = null;

document.getElementById("show-order").addEventListener("click", function () {
  if (!confirm("Are you ready to upload your design and place your order?")) return;

  const dressingDiv = document.getElementById("dressing");
  const loader = document.getElementById("page-loaderr");
  loader.style.display = "block";

  // Take screenshot of #dressing
  html2canvas(dressingDiv, { useCORS: true }).then(canvas => {
    canvas.toBlob(function (blob) {
      if (!blob) {
        alert("❌ Failed to get design image.");
        loader.style.display = "none";
        return;
      }
      
      // Create compressed file
      compressedFile = new File([blob], "design.webp", { type: "image/webp" });

      // Show preview
      const preview = document.getElementById("preview");
      preview.src = URL.createObjectURL(blob);
      preview.style.display = "block";

      // Show form
      document.getElementById("modaltwo").style.display = "block";
      loader.style.display = "none";
    }, "image/webp", 0.75); // compression level
  }).catch(error => {
    alert("❌ Screenshot failed.");
    console.error(error);
    loader.style.display = "none";
  });
});

document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
  const form = e.target;
  const loader = document.getElementById("page-loaderr");
  loader.style.display = "block";

  if (!compressedFile) {
    alert("Please click 'Order Now' first to prepare your design.");
    loader.style.display = "none";
    return;
  }

  const formData = new FormData();
  formData.append("screenshot_data", compressedFile);
  formData.append("name", form.name.value);
  formData.append("number", form.number.value);
  formData.append("phone", form.phone.value);
  formData.append("email", form.email.value);
  formData.append("to_email", form.to_email.value);
  formData.append("notes", form.notes.value);

  fetch("https://tshirt-backend-lr0i.onrender.com/orders/submit_order/", {
    method: "POST",
    body: formData
  })
  .then(response => {
    if (!response.ok) throw new Error("Server error");
    return response.text();
  })
  .then(data => {
    alert("✅ Order submitted successfully!");
    form.reset();
    document.getElementById("preview").style.display = "none";
    document.getElementById("order-form").style.display = "none";
    loader.style.display = "none";
  })
  .catch(error => {
    console.error("❌ Submission failed:", error);
    alert("❌ Submission failed.");
    loader.style.display = "none";
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
  }, 150000);



  document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
    alert('🚫 Right-click is disabled on this page.');
  });

  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  });



document.querySelectorAll('#my-colours .choose').forEach(button => {
  button.addEventListener('click', () => {
    // Remove 'active' from only the buttons in #my-colours
    document.querySelectorAll('#my-colours .choose').forEach(btn => {
      btn.classList.remove('active');
    });

    // Add 'active' to the clicked one
    button.classList.add('active');
  });
});

const images = [
  "showcase1.jpg",
  "showcase2.jpg",
  "showcase3.jpg",
  "showcase4.jpg", // Add more if needed
  "showcase5.jpg",
  "showcase6.jpg",
  "showcase7.jpg",
  "showcase8.jpg" ,
  "showcase1.jpg",
  "showcase2.jpg"
  
];

let index = 0;
const imageElement = document.getElementById("gallery-image");

setInterval(() => {
  index = (index + 1) % images.length;
  imageElement.style.opacity = 0;

  setTimeout(() => {
    imageElement.src = images[index];
    imageElement.style.opacity = 1;
  }, 500); // short fade-out before showing new image
}, 3000); // 3 seconds


setTimeout(() => {
      const loader = document.getElementById('page-loader');
      const content = document.getElementById('main-content');

      if (loader) loader.style.display = 'none';
      if (content) content.style.display = 'block';
    }, 5000); // ⏳ Wait 5 seconds
  



})

