document.addEventListener('DOMContentLoaded', function () {
  // Lock/unlock range inputs toggle
  let lock_range = true;
  const lockRangeBtn = document.querySelector('#lock-range');
  lockRangeBtn.textContent = 'unlock';

  document.querySelectorAll('input[type="range"]').forEach(range => {
    range.disabled = true;
  });

  // T-shirt image & color selection
  const target = document.querySelector('#t-shirt');
  target.onerror = function () {
    alert('Not available at the moment');
    target.src = 'gray.jpg';
  };

  document.querySelectorAll('.choose').forEach(button => {
    button.addEventListener('click', function () {
      const colour = button.dataset.colour;
      let mine = colour.split('.')[0]
      let minee = mine.split('/')[1]
      alert(minee);
      target.src = colour;
    });
  });

  // Design selection
  document.querySelectorAll('.change').forEach(image => {
    image.addEventListener('click', function () {
      const design_type = image.dataset.src;
      image.style.width = '150px';
      image.style.height = '150px';

      const designImg = document.querySelector('.design');
      designImg.src = design_type;
      designImg.style.width = '150px';
      designImg.style.height = '150px';
    });
  });

  // Modal show/hide for designs
  const modal = document.querySelector('#modal');
  const modalContent = document.querySelector('#modal-content');

  document.querySelector('#show-designs').addEventListener('click', function () {
    modal.style.display = 'block';
  });

  document.querySelector('#close-modal').addEventListener('click', function () {
    modal.style.display = 'none';
   
  
    

  });

  window.addEventListener('click', function (event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Resize & move design handlers
  const design = document.querySelector('.design');
  const resizeHistory = [];

  function save_current() {
    resizeHistory.push({
      width: design.style.width,
      height: design.style.height,
      up: design.style.top,
      left: design.style.left
    });
  }

  document.querySelector('#resize-height').addEventListener('input', () => {
    save_current();
    design.style.height = document.querySelector('#resize-height').value + 'px';
  });

  document.querySelector('#resize-width').addEventListener('input', () => {
    save_current();
    design.style.width = document.querySelector('#resize-width').value + 'px';
  });

  document.querySelector('#upward').addEventListener('input', () => {
    save_current();
    design.style.top = document.querySelector('#upward').value + '%';
  });

  document.querySelector('#move-left').addEventListener('input', () => {
    save_current();
    design.style.left = document.querySelector('#move-left').value + '%';
  });

  document.querySelector('#undo').addEventListener('click', () => {
    if (resizeHistory.length === 0) {
      alert('Nothing to undo');
      return;
    }
    const lastsize = resizeHistory.pop();

    design.style.width = lastsize.width;
    design.style.height = lastsize.height;
    design.style.left = lastsize.left;
    design.style.top = lastsize.up;

    document.querySelector('#resize-width').value = parseInt(lastsize.width) || 0;
    document.querySelector('#resize-height').value = parseInt(lastsize.height) || 0;
    document.querySelector('#move-left').value = parseInt(lastsize.left) || 0;
    document.querySelector('#upward').value = parseInt(lastsize.up) || 0;
  });

  // Lock/unlock range inputs toggle button
  lockRangeBtn.addEventListener('click', function () {
    lock_range = !lock_range;
    if (lock_range) {
      lockRangeBtn.textContent = 'unlock';
      document.querySelectorAll('input[type="range"]').forEach(range => {
        range.disabled = true;
      });
    } else {
      lockRangeBtn.textContent = 'lock';
      document.querySelectorAll('input[type="range"]').forEach(range => {
        range.disabled = false;
      });
    }
  });

  // Close second modal
  document.querySelector('#close-modaltwo').addEventListener('click', function () {
    document.querySelector('#modaltwo').style.display = 'none';
    let form = document.querySelector('#my_first')
    
    if (form){
      form.reset()
    }
    
  });

  // Order modal and screenshot logic
  let compressedFile = null;

  document.getElementById('show-order').addEventListener('click', function () {
    if (!confirm('Are you ready to upload your design and place your order?')) return;

    const dressingDiv = document.getElementById('dressing');
    const loader = document.getElementById('page-loaderr');
    loader.style.display = 'block';

    html2canvas(dressingDiv, { useCORS: true })
      .then(canvas => {
        canvas.toBlob(function (blob) {
          if (!blob) {
            alert('❌ Failed to get design image.');
            loader.style.display = 'none';
            return;
          }

          compressedFile = new File([blob], 'design.webp', { type: 'image/webp' });

          const preview = document.getElementById('preview');
          preview.src = URL.createObjectURL(blob);
          preview.style.display = 'block';

          document.getElementById('modaltwo').style.display = 'block';
          loader.style.display = 'none';
        }, 'image/webp', 0.5);
      })
      .catch(error => {
        alert('❌ Screenshot failed.');
        console.error(error);
        loader.style.display = 'none';
      });
  });

  // Form submit
  document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();
    let submit_two = document.getElementById('submit_two')
    submit_two.disabled = true;
    submit_two.innerText = 'sending'
    const form = e.target;
    const loader = document.getElementById('page-loaderr');
    loader.style.display = 'block';

    if (!compressedFile) {
      alert("Please click 'Order Now' first to prepare your design.");
      loader.style.display = 'none';
      return;
    }

    const formData = new FormData();
    formData.append('screenshot_data', compressedFile);
    formData.append('name', form.name ? form.name.value : '');
    formData.append('number', form.number ? form.number.value : '');
    formData.append('phone', form.phone ? form.phone.value : '');
    formData.append('email', form.email ? form.email.value : '');
    formData.append('to_email', form.to_email ? form.to_email.value : '');
    formData.append('size', form.size ? form.size.value : '');
    formData.append('notes', form.notes ? form.notes.value : '');

    fetch('https://tshirt-backend-lr0i.onrender.com/orders/submit_order/', {
      method: 'POST',
      body: formData
    })
      .then(response => {
        if (!response.ok) throw new Error('Server error');
        return response.json();
      })
      .then((data) => {
        alert(data.message);
        form.reset();
        submit_two.disabled = false;
        submit_two.innerText = 'Sent order'
        document.getElementById('preview').style.display = 'none';
        document.getElementById('modaltwo').style.display = 'none';
        loader.style.display = 'none';
      })
      .catch(error => {
        console.error('❌ Submission failed:', error);
        alert('❌ Submission failed.');
        loader.style.display = 'none';
        submit_two.disabled = false;
        submit_two.innerText = 'Place order'
      });
  });

  // Image error handler
  function handleerror(img) {
    if (!img.dataset.errorHandled) {
      alert('⚠️ Image failed to load due to poor connection.');
      img.dataset.errorHandled = 'true';
    }
    img.onerror = null;
    img.src =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAJUlEQVR42u3BAQEAAACCIP+vbkhAAQAAAAAAAAAAAAAAAAAAAAAAAPA2DS4AAXokF9UAAAAASUVORK5CYII=';
    img.alt = 'errorw';
    img.style.objectFit = 'contain';
  }

  // Connection warning on slow load
  window.addEventListener('load', () => {
    const [navEntry] = performance.getEntriesByType('navigation');
    if (navEntry && navEntry.duration > 10000) {
      document.getElementById('connection-warning').style.display = 'block';
    }
  });

  // Fallback if load doesn't fire
  setTimeout(() => {
    const [navEntry] = performance.getEntriesByType('navigation');
    if (!navEntry || navEntry.duration === 0) {
      document.getElementById('connection-warning').style.display = 'block';
    }
  }, 150000);

  // Disable right-click context menu
  document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
    alert('🚫 Right-click is disabled on this page.');
  });

  // Color button active class toggle (within #my-colours)
  document.querySelectorAll('#my-colours .choose').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('#my-colours .choose').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });

  // Gallery image slideshow
  const images = [
  
  { src: 'Slideshow/showcase13.jpg', id: '3333' },
  { src: 'Slideshow/showcase27.jpg', id: '3333' },
  
  { src: 'Slideshow/showcase30.jpg', id: '5555' },
  { src: 'Slideshow/showcase23.jpg', id: '2345' },
  
 { src: 'Slideshow/showcase33.jpg', id: '8888' },
 { src: 'Slideshow/showcase28.jpg', id: '4444' },
  { src: 'Slideshow/showcase10.jpg', id: '1111' },
   { src: 'Slideshow/showcase26.jpg', id: '2222' },
  { src: 'Slideshow/showcase35.jpg', id: '2345' },
  { src: 'Slideshow/showcase9.jpg', id: '2345' },
 
  { src: 'Slideshow/showcase12.jpg', id: '2222' },
  { src: 'Slideshow/showcase29.jpg', id: '1111' },
  { src: 'Slideshow/showcase31.jpg', id: '6666' },
  { src: 'Slideshow/showcase14.jpg', id: '4444' },
  { src: 'Slideshow/showcase25.jpg', id: '2345' },
  { src: 'Slideshow/showcase16.jpg', id: '6666' },
   { src: 'Slideshow/showcase21.jpg', id: '2345' },
  { src: 'Slideshow/showcase17.jpg', id: '7777' },
  
  { src: 'Slideshow/showcase19.jpg', id: '1234' },
   { src: 'Slideshow/showcase34.jpg', id: '1234' },
  { src: 'Slideshow/showcase20.jpg', id: '2345' },
  { src: 'Slideshow/showcase32.jpg', id: '7777' },
 { src: 'Slideshow/showcase18.jpg', id: '8888' },
  { src: 'Slideshow/showcase22.jpg', id: '2345' },
   { src: 'Slideshow/showcase15.jpg', id: '5555' },
  { src: 'Slideshow/showcase24.jpg', id: '2345' },
 


];

let index = 0;

const mainImg = document.getElementById('gallery-image');
const prevImg = document.getElementById('prev-preview');
const nextImg = document.getElementById('next-preview');
const imageElement = document.getElementById('gallery-image');

function updateGallery(newIndex) {
  index = (newIndex + images.length) % images.length;

  // Add animation
  mainImg.classList.add('animate');
  setTimeout(() => {
    mainImg.src = images[index].src;
    prevImg.src = images[(index - 1 + images.length) % images.length].src;
    nextImg.src = images[(index + 1) % images.length].src;
    mainImg.classList.remove('animate');
  }, 400);
}

// Auto slide every 5 seconds
setInterval(() => {
  updateGallery(index + 1);
}, 5000);

// Manual click
prevImg.addEventListener('click', () => updateGallery(index - 1));
nextImg.addEventListener('click', () => updateGallery(index + 1));


  function showPreviousImage(){
    imageElement.style.opacity = 0;
    index = (index  - 1 + images.length)% images.length;
    setTimeout(() => {
      imageElement.src = images[index].src;
      imageElement.style.opacity = 1;
    }, 500);
  }

  function showNextImage(){
    imageElement.style.opacity = 0
    index = (index  + 1)% images.length
    setTimeout(() => {
      imageElement.src = images[index].src;
      imageElement.style.opacity = 1;
    }, 500);
  }

  

  // Page loader fade out
  setTimeout(() => {
    const loader = document.getElementById('page-loader');
    const content = document.getElementById('main-content');

    if (loader) loader.style.display = 'none';
    if (content) content.style.display = 'block';
  }, 2000);

document.querySelector('#order_collection').addEventListener('click',function(){
  document.querySelector('#modalthree').style.display = 'block';
  currentImageSrc =imageElement.src;
  document.getElementById('id_name').value = currentImageSrc;
  document.querySelector('#send_request').addEventListener('submit', function(e){
    e.preventDefault();
    let submit = document.getElementById('submit');
    submit.disabled= true;
    submit.innerText = 'sending';
    const loader = document.getElementById('page-loader');
    
    let form = e.target;
    

    let formData = new FormData(form);
    fetch('https://tshirt-backend-lr0i.onrender.com/orders/submit_specific_order/',{
    method: 'POST',
    body: formData,
  })
  .then(response =>response.json())
  .then(data=>{
    alert(data.message)
    submit.innerText= 'sent'
    document.getElementById('modalthree').style.display = 'none';
        
  })
  .catch(error=>{
    alert("couldnt place order")
    console.error('error', error)
    submit.innerText = 'Place order'
    submit.disabled = false
  })
  })
})






 document.querySelector('#close-modalthree').addEventListener('click', function () {
    document.querySelector('#modalthree').style.display = 'none';
     let form = document.querySelector('#send_request')
    
    if (form){
      form.reset()
    }
    
  });



});
