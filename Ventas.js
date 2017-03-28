function Carro(){
	this.productos = [];
	this.calcularTotal = calcularTotal;
	this.agregarAlCarro = agregarAlCarro;
	this.sacarDelCarro = sacarDelCarro;
	
	function calcularTotal(){
		var total = 0; 
		for (var i in this.productos){
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
		this.productos.splice(indice, 1);
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
	this.checkout = checkout;
	function seleccionProducto(indice){
		return this.productos[indice];
	}
	function agregarAlCarro(i_prod, cantidad){
		this.carro.agregarAlCarro(this.productos[i_prod], cantidad);
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
	function checkout(){
		// aca hay que tener en cuenta las promociones
		return this.carro.calcularTotal();
	}
}
function Promocion(productos){
	this.combos = []
	this.generarPromociones = function(productos){
		// usar numeros random		
		// para producto 0 comprando 1 unidad hay un descuento del 20%
		combos.push({"productos": [productos[0]], "cantidad":1, "descuento":20 });
		combos.push({"productos": [productos[1]], "cantidad":2, "descuento":10 });
		combos.push({"productos": [productos[1],productos[2],productos[3] ], "cantidad":1, "descuento":20 })
	};
	this.getPromociones = function(){
		return this.combos;
	};
	this.checkout = function(lista_carro){
		return -1
	}
}

function ProductoFactory(productos_json){
	var atributos_producto;
	var productos = [];
	for (i in productos_json){
		atributos_producto = Object.keys(productos_json[i]);
		var nuevo_producto = new Producto();
		for (k in atributos_producto){
			nuevo_producto[atributos_producto[k]] = productos_json[i][atributos_producto[k]];
			productos.push(nuevo_producto);
		}
	}
	return productos;
}

function Producto(){
	this.devolverNombre = function(){
				return this.nombre;
	}
	
	this.disminuirStock = function(cant_disminuir){
		var c = this.cantidad - cant_disminuir;
		if (c < 0){
			return false;
		}
		this.cantidad = c;
		return true;
	},
	
	this.aumentarStock = function(cant_aumentar){
		var c = this.cantidad + cant_aumentar;
		this.cantidad = c;
		return true;
	},
	
	this.alcanzaStock = function(cantidad_pedida){
		if (cantidad_pedida > this.cantidad){
			return false;
		}
		return true;

	}
}
