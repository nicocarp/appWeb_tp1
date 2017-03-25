function Carro(){
	this.productos = [];
	this.calcularTotal = calcularTotal;
	this.agregarAlCarro = agregarAlCarro;
	this.sacarDelCarro = sacarDelCarro;
	function calcularTotal(){
		var total = 0; 
		for (i in this.productos){
			total += this.productos[i].producto.precio * this.productos[i].cantidad;
		}
		console.log("por retornar e total"+Number(total) );
		return total;
	}
	function agregarAlCarro(producto, cantidad){
		if (cantidad > 0){
			this.productos.push({"producto": producto, "cantidad": cantidad});	
		}
		
	}
	function sacarDelCarro(indice){
		this.productos.splice(indice, indice);
	}
}

function Ventas(productos, carro){
	//this.productos = productos;
	this.iniciarProductos = iniciarProductos;
	this.productos = iniciarProductos(productos);
	this.carro = carro;
	this.agregarAlCarro = agregarAlCarro;
	this.mostrarPropiedades = mostrarPropiedades;
	this.promociones = promociones;
	this.seleccionProducto = seleccionProducto;
	function seleccionProducto(indice){
		return this.productos[indice];
	}
	function agregarAlCarro(producto, cantidad){
		this.carro.agregarAlCarro(producto, cantidad);
	}
	function mostrarPropiedades(){
		console.log("Mis propiedades");
		console.log('Productos '+this.productos);
		console.log('Carrito '+this.carro);
	}
	function iniciarProductos(productos){
		for (p in productos){
			productos[p].devolverNombre = function(){
				return this.nombre;
			}
			
			productos[p].disminuirStock = function(cant_disminuir){
				var c = this.cantidad - cant_disminuir;
				if (c < 0){
					return false;
				}
				this.cantidad = c;
				return true;
			},
			
			productos[p].aumentarStock = function(cant_aumentar){
				var c = this.cantidad + cant_aumentar;
				this.cantidad = c;
				return true;
			}			
		}
		return productos;
	}
	function promociones(){
		console.log("No Manejamos promociones D: !!!");
	}



}

