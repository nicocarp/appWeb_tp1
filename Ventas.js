function Carro(){
	this.productos = [];
	this.calcularTotal = calcularTotal;
	this.agregarAlCarro = agregarAlCarro;
	this.sacarDelCarro = sacarDelCarro;
	this.existeProd  = existeProd;
	this.actualizarCantPorId = actualizarCantPorId;
	function calcularTotal(){
		var total = 0; 
		for (var i in this.productos){
			total += this.productos[i].precioSubTotal;
		}
		return total;
	}
	function agregarAlCarro(producto, cantidad){
		if (cantidad > 0){
			var prod_ya_cargado = this.existeProd(producto);
			if (prod_ya_cargado == undefined){
				this.productos.push({
				"producto": producto, 
				"cantidad": cantidad,
				"precioSubTotal":producto.precio * cantidad
				});	
			}else{
				prod_ya_cargado.cantidad += cantidad
				prod_ya_cargado.precioSubTotal += cantidad * producto.precio;
			}
				
		}
	}
	function sacarDelCarro(indice){
		this.productos.splice(indice, 1);
	}
	function existeProd(prod){
		return _.find(this.productos, function(producto){
			return producto.producto.id == prod.id;
		})
	}
	function actualizarCantPorId(id_prod, nueva_cant){
		var p =_.find(this.productos, function(producto){
			return producto.producto.id == id_prod;
		})
		if (p != undefined){
			p.precioSubTotal = p.producto.getPrecio(nueva_cant); 
			p.cantidad = nueva_cant;
		}
	}
}

function Ventas(productos, carro){
	//this.productos = productos;
	this.productos = productos;
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
		}
		nuevo_producto.indice = i; // pos en la lista de: ventas y en el ul html
		productos.push(nuevo_producto);
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
	this.getPrecio = function(cantidad){
		if (cantidad > 0){
			return this.precio * cantidad;
		}
		return 0;
	}
}
