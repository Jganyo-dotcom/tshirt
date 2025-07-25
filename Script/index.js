document.addEventListener('DOMContentLoaded', function () {
  let discount_is_applied = false
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
      left: design.style.left,
      
      
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
    if (document.querySelector("amount")){
      document.querySelector('#amount').value = ''
    }
    if (form){
      form.reset()
    }
    
  });

  // Order modal and screenshot logic
  let compressedFile = null;

  document.getElementById('show-order').addEventListener('click', function () {
  if (!confirm('Are you ready to upload your design and place your order?')) return;

  const dressingDiv = document.getElementById('dressing');
  const loader     = document.querySelector('.css-spinner');


    //calculating the amount using the area of the design 
const length = document.querySelector('#sizes_design').offsetHeight;
const width = document.querySelector('#sizes_design').offsetWidth;

const area = length * width;

 
 

let estimated_amount
  if (area <= 22500){
    estimated_amount = 150 
  };
  if (area > 22500 && area <= 30000){
    estimated_amount = 150 
  };

  if (area > 30000 && area < 34000 ){
    estimated_amount =  150 
  };
  if (area >=34000 ){
    estimated_amount =  150 
  };
  
  

  document.querySelector('#amount').value = `GHC${estimated_amount}`
  const btntxt = document.querySelector('#temp');
  
  btntxt.style.display = 'none';
  loader.style.display = 'inline-block';
 // Start timer for html2canvas render
 
  // 1 Disable your entry animations/transitions
  dressingDiv.style.animation = 'none';
  dressingDiv.querySelector('.design').style.animation = 'none';
  dressingDiv.querySelector('.design').style.transition = 'none';

  // 2️ Give the browser time to finish loading assets & settle styles
  setTimeout(() => {
    html2canvas(dressingDiv, { useCORS: true, scale: 1 })
      .then(canvas => {
        canvas.toBlob(blob => {
          loader.style.display = 'none';
          btntxt.style.display = 'block';
          if (!blob) return alert('❌ Failed to get design image.');

          // Build your File, show preview & modal
          compressedFile = new File([blob], 'design.webp', { type: 'image/webp' });
          const preview = document.getElementById('preview');
          preview.src = URL.createObjectURL(blob);
          preview.style.display = 'block';
          document.getElementById('modaltwo').style.display = 'block';
          
          
          
          
          // 3️ Re‑enable animations/transitions
          dressingDiv.style.animation = '';
          dressingDiv.querySelector('.design').style.animation = '';
          dressingDiv.querySelector('.design').style.transition = '';
        }, 'image/webp', 0.5);
      })
      .catch(error => {
        const loader     = document.querySelector('.css-spinner');
        loader.style.display = 'none';
        console.error(error);
        alert('❌ Screenshot failed.');
      });
  }, 150);  // ← tweak this delay (100–200 ms) as needed
});


  // Form submit
  document.querySelector('form').addEventListener('submit', function (e) {
  e.preventDefault();

  let submit_two = document.getElementById('submit_two');
  submit_two.disabled = true;
  submit_two.innerText = 'Sending...';
  
  const form = e.target;
  const loadertwo = document.getElementById('page-loaderr');
   loadertwo.style.display = 'flex';

  if (!compressedFile) {
    alert("Please click 'Order Now' first to prepare your design.");
    loadertwo.style.display = 'none';
    return;
  }

  
const length = document.querySelector('#sizes_design').offsetHeight;
const width = document.querySelector('#sizes_design').offsetWidth;


  
let many = document.getElementById('status').value;

let code = document.querySelector('#code').value
let number = document.querySelector('#number_number').value
let estimated_amount = document.querySelector('#amount').value


  const formData = new FormData();
  formData.append('screenshot_data', compressedFile);
  formData.append('name', form.name?.value || '');
  formData.append('number', form.number?.value || '');
  formData.append('phone', form.phone?.value || '');
  formData.append('location', form.location?.value || '');
  formData.append('to_email', form.to_email?.value || '');
  formData.append('size', form.size?.value || '');
  formData.append('notes', form.notes?.value || '');
  formData.append('price', estimated_amount );
  formData.append('height', length);
  formData.append('width', width)
  formData.append('discount_status', many)
  formData.append('discount_code', code)

  fetch("https://tshirt-backend-lr0i.onrender.com/orders/submit_order/", {
    method: "POST",
    body: formData
  })
  .then(response => {
    if (!response.ok) throw new Error("Server error");
    return response.json();
  })
  .then(data => {
    alert(data.message);
    form.reset();
     const loader     = document.querySelector('.css-spinner');
    document.getElementById("preview").style.display = "none";
    document.getElementById("modaltwo").style.display = "none";
    loader.style.display = "none";
    loadertwo.style.display = "none";
  })
  .catch(error => {
    console.error("❌ Submission failed:", error);
    console.log("❌ Submission failed.");
    loadertwo.style.display = "none";
    submit_two.disabled = false;
  submit_two.innerText = 'Place order';

  });
});;


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
  
  { src: 'Slideshow/showcase13.webp', id: '3333' },
  { src: 'Slideshow/showcase27.webp', id: '3333' },
  
  { src: 'Slideshow/showcase30.webp', id: '5555' },
  { src: 'Slideshow/showcase23.webp', id: '2345' },
  
 { src: 'Slideshow/showcase33.webp', id: '8888' },
 { src: 'Slideshow/showcase28.webp', id: '4444' },
  { src: 'Slideshow/showcase10.webp', id: '1111' },
   { src: 'Slideshow/showcase26.webp', id: '2222' },
  { src: 'Slideshow/showcase35.webp', id: '2345' },
  { src: 'Slideshow/showcase9.webp', id: '2345' },
 { src: 'Slideshow/showcase95.webp', id: '2345' },
  { src: 'Slideshow/showcase12.webp', id: '2222' },
  { src: 'Slideshow/showcase29.webp', id: '1111' },
  { src: 'Slideshow/showcase31.webp', id: '6666' },
  { src: 'Slideshow/showcase14.webp', id: '4444' },
  { src: 'Slideshow/showcase25.webp', id: '2345' },
  { src: 'Slideshow/showcase16.webp', id: '6666' },
   { src: 'Slideshow/showcase21.webp', id: '2345' },
  { src: 'Slideshow/showcase17.webp', id: '7777' },
   { src: 'Slideshow/showcase36.webp', id: '7777' },
  { src: 'Slideshow/showcase19.webp', id: '1234' },
   { src: 'Slideshow/showcase34.webp', id: '1234' },
  { src: 'Slideshow/showcase20.webp', id: '2345' },
  { src: 'Slideshow/showcase32.webp', id: '7777' },
 { src: 'Slideshow/showcase18.webp', id: '8888' },
  { src: 'Slideshow/showcase22.webp', id: '2345' },
   { src: 'Slideshow/showcase15.webp', id: '5555' },
  { src: 'Slideshow/showcase24.webp', id: '2345' },
  { src: 'Slideshow/showcase5.webp', id: '2345' },
  
  { src: 'Slideshow/showcase38.webp', id: '2345' },
  
 


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
}, 10000);

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
    let your_width = document.querySelector('.react').offsetWidth + 'px';
    console.log(your_width)
 
  if (your_width){
    
    
   
    
  }
    if ( content.style.display = 'block' && isMobileDevice()) {
  console.log('⚠️ Tip: For best performance, close other apps before submitting your design!');
}
  }, 11000 
);
let discountapplied = false;
document.querySelector('#order_collection').addEventListener('click',function(){
  let discountapplied = false;
  let goahead = false
  document.querySelector('#modalthree').style.display = 'block';
  let price = 120 
  document.querySelector('#customized_price').value =  `GHC${price}`
  currentImageSrc =imageElement.src;
  let location_pic = currentImageSrc
  location_pic = location_pic.split('//')[1]
  location_pic= location_pic.split('/')
  location_pic=location_pic.slice(1)
  location_pic=location_pic.join('/')
  document.getElementById('preview_collection').src = location_pic
  document.getElementById('id_name').value = currentImageSrc;
  window.addEventListener('click', (e)=>{
    let number_tops_customized = parseInt(document.querySelector('#number').value)
    if (!document.querySelector('#number').contains(e.target) && !discountapplied ){
      if (number_tops_customized ==='' || isNaN(number_tops_customized)){
        document.querySelector('#customized_price').value = 'GHC'+ 0
        return;
      }else{
          document.querySelector('#customized_price').value = 'GHC'+ parseInt(number_tops_customized) * 150
      }
      
    }else if(document.querySelector('#number').contains(e.target) && discountapplied){
      document.querySelector('#customized_price').value = 'GHC'+ number_tops_customized * 150
      alert('discount removed')
       discountapplied = false;
    }
    
    
  })

  document.querySelector('#number').addEventListener('input', (e)=>{
    if(e.target.value===''){
      document.querySelector('#customized_price').value = 'GHC'+ 0
      return
    }else{
      document.querySelector('#customized_price').value = 'GHC'+ parseInt(e.target.value) * 150
    goahead = true
    }
    
  })
  let discount_btn = document.querySelector('#apply_discount')
  
  
  discount_btn.addEventListener('click', ()=>{
    
    let price_customized = parseFloat(document.querySelector('#customized_price').value.replace(/[^\d\.]/g, ''))
    let discount_value_entered = document.querySelector('#customized_discount').value
      if(discountapplied){
        alert('discount already applied to your order')
        return;
      }
      if(discount_value_entered === 'MAKEITYOURS' && !discountapplied){
          
            console.log(price_customized)
            let final = price_customized * 0.8
            document.querySelector('#customized_price').value ='GHC'+ final
            document.querySelector('#customized_discount').value = '';
            discountapplied = true;
            document.querySelector('#listen').value = 'Applied discount'
            
           
           
            alert('Discount applied to your order')
              
      }else if (discount_value_entered !== 'MAKEITYOURS'){
        alert("Invalid discount code")
        document.querySelector('#listen').value = 'Not eligible'
         discountapplied = false;
      } else{
        alert('An error occurred')
        document.querySelector('#listen').value = 'contact me to attend to this'
         discountapplied = false;
      }
      
  })
  document.querySelector('#send_request').addEventListener('submit', function(e){
    e.preventDefault();
    let submit = document.getElementById('submit');
    submit.disabled= true;
    submit.innerText = 'sending';
    document.getElementById('page-loaderr').style.display = 'flex';
    
    let form = e.target;
    

    let formData = new FormData(form);
    fetch('https://tshirt-backend-lr0i.onrender.com/orders/submit_specific_order/',{
    method: 'POST',
    body: formData,
  })
  .then(response =>response.json())
  .then(data=>{
    alert(data.message)
    form.reset();
    document.getElementById('page-loaderr').style.display = 'none';
    submit.innerText= 'Place Order';
    submit.disabled = false;
    document.getElementById('modalthree').style.display = 'none';
        
  })
  .catch(error=>{
    alert("couldnt place order")
    console.error('error', error)
    document.getElementById('page-loaderr').style.display = 'none'
    submit.innerText = 'Place order'
    submit.disabled = false;
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

document.getElementById('upload_designs').addEventListener('click',function(){
  if(!confirm('I agree not to upload any inappropriate design?')){
    return;
  }
  document.querySelector('#img_place').click()
})
document.querySelector('#img_place').addEventListener('change', function(){
  const file = this.files[0]
  if (file){
    const reader = new FileReader();
    reader.onload = function(e){
      document.querySelector('#uploaded').src = e.target.result;
      document.querySelector('#uploaded').dataset.src = e.target.result;
      
      document.querySelector('#uploaded').className= 'change design-img'
      document.getElementById('show_design_here').style.display= 'block'
      document.querySelector('#uploaded').style.display= 'block'
      alert('kindly tap Designs to access your design')
    }
    reader.readAsDataURL(file)
  }
})

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
 
}



document.querySelector('#modal-button').addEventListener('click', ()=>{
  document.querySelector('#modal_big').classList.add('show');
  document.querySelector('#modal-button').style.display = 'none';
 
})

document.querySelector('#close_me').addEventListener('click', ()=>{
  document.querySelector('#modal_big').classList.remove('show');
  document.querySelector('#modal-button').style.display = 'block'
})
 document.querySelector('#modal_big').onclick = (e)=>{
   if (!document.querySelector('#Slide_in_modal').contains(e.target)){
     document.querySelector('#modal_big').classList.remove('show');
     document.querySelector('#modal-button').style.display = 'block'
   }
 }
 let section = document.querySelector('#my-colours')
let divone = document.querySelector('.color-options')
let divs = document.querySelectorAll('.together')
let font = document.querySelectorAll('.white')
let toggle = document.querySelector('#my-toggle')
toggle.addEventListener('change', ()=>{
  if(toggle.checked){
    document.body.style.background = 'black';
    font.forEach((e)=>{
      e.style.color = 'blue';
    })
     divs.forEach((div)=>{
      div.style.backgroundColor = 'gray';
    })
    divone.style.backgroundColor = 'gray';
    section.style.backgroundColor = 'gray';
    console.log('got')
  }else{
    document.body.style.background = 'linear-gradient(-45deg, hwb(207 80% 4%), hwb(183 73% 4%), hwb(140 78% 4%), hsl(180, 11%, 96%))';
    font.forEach((e)=>{
      e.style.color = 'black';
    });
    divs.forEach((div)=>{
      div.style.backgroundColor = 'rgb(240, 250, 250, 1)';
    })
    divone.style.backgroundColor = 'rgb(240, 250, 250, 1)';
    section.style.backgroundColor = 'rgb(240, 250, 250, 1)';
  }
})



document.querySelector('#dressing').addEventListener('click',()=>{
  if(document.querySelector('#modal_big')){
    document.querySelector('#modal_big').classList.remove('show');
     document.querySelector('#modal-button').style.display = 'block'
  }
});

document.querySelector('#controls').addEventListener('click',()=>{
  if(document.querySelector('#modal_big')){
    document.querySelector('#modal_big').classList.remove('show');
     document.querySelector('#modal-button').style.display = 'block'
  }
})

document.querySelector('#my-colours').addEventListener('click',()=>{
  if(document.querySelector('#modal_big')){
    document.querySelector('#modal_big').classList.remove('show');
     document.querySelector('#modal-button').style.display = 'block'
  }
})
document.querySelector('#design-div-on-order').addEventListener('click',()=>{
  if(document.querySelector('#modal_big')){
    document.querySelector('#modal_big').classList.remove('show');
     document.querySelector('#modal-button').style.display = 'block'
  }
})
document.querySelector('#gallery-container').addEventListener('click',()=>{
  if(document.querySelector('#modal_big')){
    document.querySelector('#modal_big').classList.remove('show');
     document.querySelector('#modal-button').style.display = 'block'
  }
})
document.querySelector('#discount').addEventListener('click', function () {
  console.log(discount_is_applied)
  if(discount_is_applied){
    alert('already applied discount to your order')
    return;
    
  }
  
  // 1. Get dimensions of the design
  const length = document.querySelector('#sizes_design').offsetHeight;
  const width = document.querySelector('#sizes_design').offsetWidth;
  const area = length * width;
   //get the number of shirts the person is buying 
  let number = document.querySelector('#number_number').value;
  let number_tops = parseInt(number)

  // 2. Determine the estimated amount based on area
  let estimated_amount;
  if (area <= 22500) {
    estimated_amount = 150 * number_tops ;
  } else if (area <= 30000) {
    estimated_amount = 150 * number_tops;
  } else if (area < 34000) {
    estimated_amount = 150 * number_tops;
  } else {
    estimated_amount = 150  * number_tops;
  }

 

  // 3. Set amount field (ensure it's just a number string)
  document.querySelector('#amount').value = `GHC${estimated_amount}`;
 //passed console.log(estimated_amount);
  // 4. Check for discount
  const discount_value = document.getElementById('discount_value').value;
  let priceField = document.querySelector('#amount');
  
  let current_price = parseFloat(priceField.value.replace(/[^\d\.]/g, '')); // <-- convert string to number
//console.log(current_price)
  if (discount_value === 'MAKEITYOURS' ) {
    const new_price = parseFloat((current_price * 0.80).toFixed(2)); // apply 15% discount
   // console.log(current_price)
    pina = parseFloat(new_price)
    //console.log(pina)
    priceField.value =`GHC${new_price}` ; // update input
    //console.log(priceField.value)
   // console.log(new_price)
    document.getElementById('status').value = 'Discount Applied'
    document.querySelector('#amount').value = `GHC${new_price}`
    document.getElementById('discount_value').value = '';
    
    alert('discount applied to your order')
    document.querySelector('#code').value = discount_value;
    discount_is_applied= true


  
  }else if (discount_value !== 'MAKEITYOURS'){
    let many = document.getElementById('status').value
    alert('Invalid discount code');
    document.getElementById('status').value = 'No discount'    
    document.getElementById('discount_value').value = ''; 
    document.querySelector('#code').value = discount_value;
    discount_is_applied=  false
  }else{
    alert('An error occured')
     discount_is_applied=  false
     document.getElementById('status').value = 'Discount Applied'
  }
});
  
  


function calcuate(){
  // 1. Get dimensions of the design
  const length = document.querySelector('#sizes_design').offsetHeight;
  const width = document.querySelector('#sizes_design').offsetWidth;
  const area = length * width;
   //get the number of shirts the person is buying 
  let number = document.querySelector('#number_number').value;
  let number_tops = parseInt(number)

  // 2. Determine the estimated amount based on area
  let estimated_amount;
  if (area <= 22500) {
    estimated_amount = 150  ;
  } else if (area <= 30000) {
    estimated_amount = 150  
  } else if (area < 34000) {
    estimated_amount = 150  
  } else {
    estimated_amount = 150   
  }
  
  let number_shirts = document.querySelector('#number_number').value

  let pricee = document.querySelector('#amount').value.replace(/[^\d\.]/g, '');
  
  let price = parseFloat(pricee)
  final_Amount = estimated_amount * number_shirts
  
  document.querySelector('#amount').value = `GHC${final_Amount}`;
 
  
}

function calculate(){
  // 1. Get dimensions of the design
  const length = document.querySelector('#sizes_design').offsetHeight;
  const width = document.querySelector('#sizes_design').offsetWidth;
  const area = length * width;
   //get the number of shirts the person is buying 
  let number = document.querySelector('#number_number').value;
  let number_tops = parseInt(number)

  // 2. Determine the estimated amount based on area
  let estimated_amount;
  if (area <= 22500) {
    estimated_amount = 150  ;
  } else if (area <= 30000) {
    estimated_amount = 150  
  } else if (area < 34000) {
    estimated_amount = 150  
  } else {
    estimated_amount = 150   
  }
  
  let number_shirts = document.querySelector('#number_number').value

  let pricee = document.querySelector('#amount').value.replace(/[^\d\.]/g, '');
  
  let price = parseFloat(pricee)
  final_Amount = estimated_amount * number_shirts
  
  document.querySelector('#amount').value = `GHC${final_Amount}`;
  discount_is_applied =false
  
}

function calc_discount(){
  // 1. Get dimensions of the design
  const length = document.querySelector('#sizes_design').offsetHeight;
  const width = document.querySelector('#sizes_design').offsetWidth;
  const area = length * width;
   //get the number of shirts the person is buying 
  let number = document.querySelector('#number_number').value;
  let number_tops = parseInt(number)

  // 2. Determine the estimated amount based on area
  let estimated_amount;
  if (area <= 22500) {
    estimated_amount = 150  * number_tops ;
  } else if (area <= 30000) {
    estimated_amount = 150  * number_tops;
  } else if (area < 34000) {
    estimated_amount = 150  * number_tops;
  } else {
    estimated_amount = 150   * number_tops;
  }

 

  // 3. Set amount field (ensure it's just a number string)
  if (!isNaN(estimated_amount) ){
    document.querySelector('#amount').value = `GHC${estimated_amount}`;
  console.log('got here')
  }else{
    document.querySelector('#amount').value = 'GHC'+ 0;
  }
  
 
};

document.querySelector('#number_number').addEventListener('input', function(){
  discount_is_applied = false;
  calcuate()
      
})

  const giftBtn = document.getElementById("gift");
  const giftModal = document.getElementById("gift-modal");
  const closeModal = document.getElementById("close-modal5");
 
  function disapper(){
    let mine =  document.querySelector('#gift')
    mine.style.display = 'none'
  }

  function appear(){
    let mine =  document.querySelector('#gift')
    mine.style.display = 'block'
  }
  setInterval(appear,18000)

  setInterval(disapper, 48000)

  giftBtn.addEventListener("click", () => {
    giftModal.classList.toggle("show");
    giftBtn.style.display = 'none'
  });

  closeModal.addEventListener("click", () => {
    giftModal.classList.remove("show");
    document.querySelector('#gift').style.display = 'block'
  });

  // Optional: close modal when clicked outside
  window.addEventListener("click", (e) => {
    if (!giftModal.contains(e.target) && e.target !== giftBtn && e.target !== giftBtn.querySelector("img")) {
      giftModal.classList.remove("show");
    }
  });
let inter;
function tellem(){
   if(!confirm('if your custmized shirts is taking long to upload kindly clear recent apps on device')){
    return;
   }else{
     clearInterval(inter)
   }
}

inter = setInterval(tellem,30000)

});
