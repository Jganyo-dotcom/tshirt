document.addEventListener('DOMContentLoaded',function(){
    console.log('loaded')
    let target = document.querySelector('#t-shirt')
    document.querySelectorAll('.choose').forEach(button=>{
        target.onerror = null
        target.onerror = function(){
            alert('not available')
            target.src = 'gray.jpg'
        }
        button.addEventListener('click', function(){
            let colour = button.dataset.colour
            console.log(colour)
        target.src = colour
        
        })
        
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

