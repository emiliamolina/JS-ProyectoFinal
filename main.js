let servicios = []

fetch("./servicios.json")
  .then((res) => res.json())
  .then((data) => {
    mostrarServicios(data);
  });

const mostrarServicios = (data) => {
    servicios = data
    const contenedor = document.getElementById("container")
    servicios.forEach((servicio, indice)=>{
        let card = document.createElement("div")
        card.classList.add("card", "col-sm-12", "col-md-6", "col-lg-4")
        card.innerHTML = `<div class="col">
            <div class="card">
            <img src="${servicio.imagen}" class="card-img-top" alt="imagen del servicio">
            <div class="card-body">
            <h3 class="card-title">${servicio.nombre}</h3>
            <p class="card-text text-center">$ ${servicio.precio} por persona</p>
            <a href="#carrito" class="btn w-100 btn-comprar" onClick="cargarCarrito(${indice})">Contratar</a>
            </div>
            </div>
            </div>`
  contenedor.appendChild(card)
})
}

let carritoFinal = []

let cantInvitados = document.getElementById('inputInvitados')
cantInvitados.addEventListener('input',()=>{
    cantidad ()
    })

let invitados
const cantidad = () => {
    invitados = `${cantInvitados.value}`
    localStorage.setItem("invitados", JSON.stringify(invitados))
}
 

const cargarCarrito = (indice) => {
    if(!invitados){
        Swal.fire({
            title: 'Cantidad de Invitados',
            text: 'Para poder asesorarte, necesitamos conocer cuántas personas hay en tu lista de invitados',
            icon: 'warning',
            timer: 3000
            })
    }
    else {
        const servicioAgregado = servicios[indice]
        carritoFinal.push(servicioAgregado)
        dibujarCarrito()
        actualizarStorage(carritoFinal)
        Toastify({
            text: 'Servicio Añadido',
            duration: 2000,
            position: 'center',
            gravity: 'top',
            className: 'btntoastify',
        }).showToast()
    }    
}        


const modeloDeCarrito = document.getElementById("carrito")

    const dibujarCarrito = () => {
        carritoFinal.forEach((elemento, indice) => {
        const containerCarrito = document.createElement("div") 
        containerCarrito.classList.add("servicio-carrito", "servicio-detalle", "cart")
        containerCarrito.innerHTML=`<img class="car-img" src="${elemento.imagen}"/>
        <div class="product-details">${elemento.nombre}</div>
        <div class="product-details"> Invitados: ${invitados}
        </div>
        <div class="product-details"> Precio: ${elemento.precio}
        </div>
        <div class="product-details"> Subtotal $: ${invitados * elemento.precio}
        </div>
        <button class="btn btn-color" id="remove-product" onClick="eliminarServicio(${indice})">Eliminar Servicio</button>
        `
        modeloDeCarrito.appendChild(containerCarrito)
        })
       
        actualizarStorage(carritoFinal)
        calcularTotal ()
        
    }


const eliminarServicio = (indice) => {
    carritoFinal.splice(indice, 1)
    actualizarStorage(carritoFinal)
    console.log(carritoFinal)
    dibujarCarrito()
}

const total = document.getElementById("total")
const calcularTotal = () => {
    const contenedorSuma = document.createElement("div")
    const suma = carritoFinal.reduce((acc, servicio) => {
        return acc + parseInt(servicio.precio) * parseInt(`${invitados}`)
    }, 0)
    contenedorSuma.innerHTML=`<div class="center final"> El total a pagar es $: ${suma}
    </div>`
    total.replaceChildren(contenedorSuma)
}

const botonVaciar = document.getElementById('boton-vaciar')
botonVaciar.addEventListener('click', () => {
    vaciarCarrito()
    })

function vaciarCarrito () {
    carritoFinal = []
    console.log(carritoFinal)
    actualizarStorage(carritoFinal)
    localStorage.clear()
    dibujarCarrito()
    }

const actualizarStorage = (carritoFinal) =>{
    localStorage.setItem("carrito", JSON.stringify(carritoFinal))
}

if(localStorage.getItem("invitados") && localStorage.getItem("carrito")){
    personas = JSON.parse(localStorage.getItem("invitados"))
    invitados = Number(personas)
    console.log(invitados)
    carritoFinal = JSON.parse(localStorage.getItem("carrito"))
    console.log(carritoFinal)
    dibujarCarrito()
}