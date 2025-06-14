document.addEventListener('DOMContentLoaded',function(){
    console.log('loaded')
    document.querySelectorAll('.choose').forEach(button=>{
        button.addEventListener('click', function(){
            let colour = button.dataset.colour
            console.log(colour)
        let target = document.querySelector('#t-shirt')
        if (colour){
            target.src = colour
        }
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