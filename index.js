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

function handleerror(img){
    img.onerror = null
    alert('poor connection')
    img.alt= 'error';
    img,style.display='none'
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



})

