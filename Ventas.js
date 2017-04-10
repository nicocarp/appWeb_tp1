function Carro(){
	this.productos = [];
	this.calcularTotal = calcularTotal;
	this.agregarAlCarro = agregarAlCarro;
	this.sacarDelCarro = sacarDelCarro;
	this.getProductoEnCarro  = getProductoEnCarro;
	this.actualizarCantPorId = actualizarCantPorId;
	this.getCantProductos = getCantProductos;
	this.promociones = [];
	this.setPromociones=setPromociones;

	function calcularTotal(){
		var total = 0; 
		for (var i in this.productos){
			total += this.productos[i].precioSubTotal;
		}
		return total;
	}
	function setPromociones(promociones){
		this.promociones = promociones;
	}
	function agregarAlCarro(producto, cantidad){
		if (cantidad <= 0)
			return;
		var producto_para_agregar = this.getProductoEnCarro(producto);
		if (producto_para_agregar == undefined){
			producto_para_agregar = {
				"producto": producto, 
				"cantidad": Number(cantidad),
				"precioSubTotal":producto.precio * cantidad
			}
			this.productos.push(producto_para_agregar);	
		}else{
			producto_para_agregar.cantidad += Number(cantidad);
			producto_para_agregar.precioSubTotal += cantidad * producto.precio;
		}
		this.promociones.buscarPromosEnCarrito(this.productos);
	}
	function sacarDelCarro(indice){
		this.productos.splice(indice, 1);
	}
	function getProductoEnCarro(prod){
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
			this.promociones.buscarPromosEnCarrito(this.productos);
		}
	}
	function getCantProductos(){
		var cont_prod=0;		
		_.each(this.productos, function(producto){
			cont_prod += producto.cantidad;
		});		
		return cont_prod;
	}
	
}

function Ventas(productos, carro){
	//this.productos = productos;
	this.productos = productos;
	this.carro = carro;
	this.agregarAlCarro = agregarAlCarro;
	this.promociones = new PromocionFactory(productos);
	this.seleccionProducto = seleccionProducto;
	this.checkout = checkout;
	this.getProductos = getProductos;
	this.carro.setPromociones(this.promociones);
	this.getIdsEnPromo = getIdsEnPromo;
	this.actualizarCantEnCarro = actualizarCantEnCarro;
	this.getProductosPorFiltro = getProductosPorFiltro;
		
	function seleccionProducto(indice){
		return this.productos[indice];
	}
	function agregarAlCarro(prod_id, acum, cantidad){
		var p = _.find(this.productos, function(prod){return prod.id == prod_id});
		if (!p.alcanzaStock(acum))
			return "Cantidad no disponible";
		this.carro.agregarAlCarro(p, cantidad);	
		return "ok";
	}
	function actualizarCantEnCarro(id_prod, cantidad){
		var prod = _.find(this.productos, function(p){return p.id == id_prod;});
		if (!prod.alcanzaStock(cantidad))
			return 'Cantidad no Disponible';	
		this.carro.actualizarCantPorId(id_prod, cantidad);	
		return 'ok';
	}
	function promociones(){
		console.log("No Manejamos promociones D: !!!");
	}
	function checkout(){
		// aca hay que tener en cuenta las promociones
		return this.carro.calcularTotal();
	}
	function getProductos(){
		return this.productos;
	}
	function getProductosEnPromocion(){
		return this.promociones.getProductosEnPromocion();
	}
	function getIdsEnPromo(){
		return this.promociones.getIdsEnPromo();
	}
	function getProductosPorFiltro(filtros){
		console.log(filtros);
		var filtro = this.productos;
		if (!_.isEmpty(filtros.categoria))
			filtro = _.filter(filtro, function(p){return p.categoria==filtros.categoria});
		if (filtros.stock)
			filtro = _.filter(filtro, function(p){return p.cantidad > 0});
		if (!_.isEmpty(filtros.nombre))			
			filtro = _.filter(filtro, function(p){return p.nombre.toLocaleLowerCase().indexOf(filtros.nombre) != -1;});

		return filtro;


	}
}
function PromocionFactory(productos){
	console.log("PromocionFactory");
	this.productos = productos;
	this.promociones = [];
	this.generarPromociones = generarPromociones;
	this.generarPromociones();
	
	function generarPromociones(){
		/* Posc: un producto solo estara en una promocion  FALTA AGREGAR ALEATORIOS*/ 
		var promo = new Promocion();
		promo.productos = [this.productos[0]];
		promo.cantidad = 1;
		promo.descuento = new Descuento(20);
		promo.mjePromocion = "Este producto tiene un descuento del 20%";
		promo.tipoPromocion = "descuento";
		this.productos[0].promocion = promo;
		/* otra promo */
		var promo2 = new Promocion();
		promo2.productos = [this.productos[1]];
		promo2.cantidad = 2;
		promo2.descuento = new Descuento(15);
		promo2.mjePromocion = "Llevando 2 unidades recibis un 15% de descuento";
		promo2.tipoPromocion = "descuento";
		this.productos[0].promocion = promo2;
		/* otra promo */
		var promo3 = new Promocion();
		promo3.productos = [this.productos[2],this.productos[3],this.productos[4]];
		promo3.cantidad = 1;
		promo3.descuento = new Descuento(30);
		promo3.tipoPromocion = "combo";
		promo3.mjePromocion = "Combo descuento! al llevar estos tres productos hay un 30% descuento";
		this.productos[2].promocion = promo3;
		this.productos[3].promocion = promo3;
		this.productos[4].promocion = promo3;
		this.promociones.push(promo);
		this.promociones.push(promo2);
		this.promociones.push(promo3);
		console.log("Generadas Las promociones Del dia !!!"+this.promociones.length);
		console.log(this.promociones);		
	}
	this.getPromociones = function(){
		return this.promociones;
	}
	/* devuelve un diccionario usado por la interfaz para mostrar los datos facilmente*/
	this.getIdsEnPromo = function(){
		var promociones = this.promociones;
		return _.reduce(_.map(this.promociones, function(promo){
			return _.map(promo.productos, function(p){
				var s = String(p.id);
				return { "id_prod":p.id, "promocion":promo};
			});
		}), function(acum, item){
			 return _.union(acum, item);
		});		
	}
	
	this.getProductos = function(){
		//En [prod_venta] deben destacarse los que esten en promocion con un mje
		for (i in this.productos){
			this.agregarMjePromocion(this.productos[i]);
		}
		return this.productos;
	}
	this.agregarMjePromocion = function(producto){
		for (y in this.promociones){
			var prod_existe = _.find(this.promociones[y].productos, function(p){
				return p.id == producto.id;
			});
			if (prod_existe != undefined){
				producto.mjePromocion = this.promociones[y].mjePromocion;
				producto.descuento = this.promociones[y].descuento.porcentaje_descuento;
			}				
		}
	}
	
	this.getProductosEnPromocion = function(){
		return this.promociones;
	}
	/* Esta funcion recorre los productos que estan en un carrito {p,cant,subTotal}
	*  Debe identificar descuentos, combos y actualizar precio con descuento.
	*/	
	this.buscarPromosEnCarrito = function(productos_en_carro)	{
		_.each(this.promociones, function(promocion){
			promocion.buscarPromosEnCarrito(productos_en_carro);
		});
		
	}
}
function Promocion(){
	this.productos = [];
	this.cantidad = 0;
	this.descuento = null;
	this.mjePromocion = null;
	this.tipoPromocion = null;

	this.buscarPromosEnCarrito = function(productos_en_carro){
		var productos_en_promo = this.productos
		var en_carro_y_promo = _.filter(productos_en_carro, function(producto){
			return producto.producto.contenidoEn(productos_en_promo);
		});
		if (productos_en_promo.length == en_carro_y_promo.length){
			var c = this.cantidad;
			var hay_combo = true;
			for (i in en_carro_y_promo){
				if (en_carro_y_promo[i].cantidad < c){
					hay_combo = false;
					break;
				}
			}
			if (hay_combo) {
				console.log("----Encontre COMBO");
				console.log(this.mjePromocion);		
				console.log(this.productos);
			};			
		}
		return false;	
	}
	this.getDescuento =function(){
		return this.descuento;
	}
	this.getPorcentajeDescuento = function(){
		return this.descuento.porcentajeDescuento;
	}
	this.getTipo = function(){
		return this.tipoPromocion;
	}
}

function PromocionCombo(){
	console.log("PromocionCombo");
}
function PromocionDescuento(){
	console.log("PromocionDescuento");
}

PromocionCombo.prototype = new Promocion;
PromocionDescuento.prototype = new Promocion;



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
		return this.cantidad >= cantidad_pedida ;
	}
	this.getPrecio = function(cantidad, descuentos){
		if (cantidad > 0){
			var monto = this.precio * cantidad;
			return _.reduce(this.descuentos, function(acu, des) { return des(acum)}, monto)
		}
		return 0;
	}	
	this.getPrecioUnitario = function(descuento){
		return descuento.aplicarDescuento(this.precio);
	}
	this.equals = function(otro_producto){
		if (otro_producto == null || otro_producto == undefined)
			return false;
		return this.id == otro_producto.id;		
	}
	this.contenidoEn =function(lista_productos){
		var id = this.id;
		var contenido = false;
		for (i in lista_productos){
			if (lista_productos[i].id == id){
				contenido = true;
				break;
			}
		}
		return contenido;
	}
	this.getId =function(){
		return this.id;
	}
}

/* Cada descuento es una funcion que aplica un descuento al precio indicado por aprametro*/
function Descuento(porcentajeDescuento){
	this.porcentajeDescuento = porcentajeDescuento;
	this.getMensajeDescuento= getMensajeDescuento;
	this.aplicarDescuento = aplicarDescuento;
	
	function aplicarDescuento(precio){
		var result = precio - (precio * porcentajeDescuento) / 100;
			return result;
	};
	
	function getMensajeDescuento(){
		return this.porcentaje_descuento+"% de Descuento!!";
	}

}