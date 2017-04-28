function Carro(){
	// atributos
	this.productos = [];

	// metodos
	this.getTotalSinDescuento = getTotalSinDescuento;
	this.agregarAlCarro = agregarAlCarro;
	this.sacarDelCarro = sacarDelCarro;
	this.actualizarCantPorId = actualizarCantPorId;
	this.getCantProductos = getCantProductos;
	this.promociones = [];
	this.getCantProdById=getCantProdById;
	this.getDescuentosPromo = getDescuentosPromo;
	this.getPrecioTotal=getPrecioTotal;
	this.vaciarCarro = vaciarCarro;
	// Privados
	this._getProductoEnCarro  = _getProductoEnCarro;

	function getCantProdById(id_prod){
		var prod_en_carro =_.find(this.productos, function(producto){return producto.producto.id == id_prod})
		if (prod_en_carro)
			return Number(prod_en_carro.cantidad);
		return 0;
	}
	function getTotalSinDescuento(){
		var total = 0; 
		for (var i in this.productos){
			total += Number(this.productos[i].precioSubTotal);
		}
		return total.toFixed(2);
	}
	
	function agregarAlCarro(producto, cantidad){
		if (cantidad <= 0)
			return;
		var producto_para_agregar = this._getProductoEnCarro(producto);
		if (producto_para_agregar == undefined){
			var sub_total = producto.precio * cantidad;
			sub_total = sub_total.toFixed(2);
			producto_para_agregar = {
				"producto": producto, 
				"cantidad": Number(cantidad),
				"precioSubTotal": (producto.getPrecio(cantidad)).toFixed(2) 
			}
			this.productos.push(producto_para_agregar);	
		}else{
			producto_para_agregar.cantidad += Number(cantidad);
			producto_para_agregar.precioSubTotal = (producto.getPrecio(producto_para_agregar.cantidad)).toFixed(2); 
			 
			console.log("todiex");
		}
	}

	function sacarDelCarro(indice){
		this.productos.splice(indice, 1);
	}
	function actualizarCantPorId(id_prod, nueva_cant, promociones){
		var p =_.find(this.productos, function(producto){
			return producto.producto.id == id_prod;
		})
		if (p != undefined){
			p.precioSubTotal = (p.producto.getPrecio(nueva_cant)).toFixed(2); 
			p.cantidad = nueva_cant;
		}
	}
	function getCantProductos(){
		var cont_prod = 0;		
		_.each(this.productos, function(producto){
			cont_prod += producto.cantidad;
		});		
		return cont_prod;
	};
	function getDescuentosPromo (promociones){
		var descuentos = 0;
		var productos_carro = this.productos;
		_.each(promociones, function(promocion){
			var result = promocion.getTotalConDescuentos(productos_carro);
			descuentos += result;							
		});
		return descuentos.toFixed(2);
	}
	function _getProductoEnCarro(prod){
		return _.find(this.productos, function(producto){
			return producto.producto.id == prod.id;
		})
	}
	function getPrecioTotal(promociones){
		var sub_total =  this.getTotalSinDescuento();
		var descuentos = this.getDescuentosPromo(promociones);
		var total =sub_total - descuentos;
		return total.toFixed(2);
	}
	function vaciarCarro(){
		this.productos = [];
	}

	
}

function Store(){}
Store.getPromociones = function(){
	var promociones = Lockr.get('promociones');
	_.each(promociones, function(promo){
		promo.__proto__ = new Promocion;
		_.each(promo.productos, function(prod){
			prod.__proto__ = new Producto;
		});

	});
	return promociones;
}
Store.getProductos = function(){
	var productos = Lockr.get('productos');
	_.each(productos, function(p)
		{p.__proto__ = new Producto
	});
	return productos;
}
Store.getCategorias = function(){
	return Lockr.get('categorias');
}
Store.setPromociones =function(promociones){
	Lockr.set('promociones', promociones);
}
Store.setProductos =function(productos){
	Lockr.set('productos', productos);
}
Store.setCategorias =function(categorias){
	Lockr.set('categorias', categorias);
}

Store.setCarro = function(carro){
	Lockr.set('carro', carro);
}
Store.getCarro = function(){
	var carro = Lockr.get('carro');
	if (!carro)
		return undefined;
	carro.__proto__ = new Carro;
	_.each(carro.productos, function(p_carro){		
		p_carro.producto.__proto__ = new Producto;
	});
	return carro;
}
Store.getProdEnCarro = function(){
	var ps_carro = Lockr.get('prodsEnCarro');
	if (ps_carro == undefined)
		return [];
	_.each(ps_carro, function(p_carro){		
		p_carro.producto.__proto__ = new Producto;
	});
	return ps_carro;
}
Store.setProdEnCarro = function(prods){
	Lockr.set('prodsEnCarro', prods);	
}

function Ventas(){
	//this.productos = productos;
	
	this.agregarAlCarro = agregarAlCarro;
	this.seleccionProducto = seleccionProducto;
	this.checkout = checkout;
	this.getProductos = getProductos;
	this.getIdsProdsEnPromo = getIdsProdsEnPromo;
	this.actualizarCantEnCarro = actualizarCantEnCarro;
	this.getProductosPorFiltro = getProductosPorFiltro;
	this.getProductoById=getProductoById;
	this.getPromociones = getPromociones;
	this.agregarComboAlCarro= agregarComboAlCarro;
	this._agregarAlCarro = _agregarAlCarro;
	this.cargarPromocionesRandom = cargarPromocionesRandom;
	this._i_prods_random= _i_prods_random;
	
	this.cargarProductosYCategorias = cargarProductosYCategorias;
	this.cargarPromociones = cargarPromociones;
	this.cargarCarro = cargarCarro;
	this.restart_app = restart_app;
	this.start_app = start_app;

	this.start_app();
	
	function start_app(){
		this.cargarProductosYCategorias();
		this.cargarPromociones();
		this.cargarCarro();
	}
	function restart_app(){
		Lockr.rm('productos');
		Lockr.rm('categorias');
		Lockr.rm('promociones');
		Lockr.rm('prodsEnCarro');
		this.start_app();
	}
	function cargarCarro(){
		var carrito = new Carro();
		carrito.productos = Store.getProdEnCarro();
		this.carro = carrito;
	}

	function cargarPromociones () {
		this.promociones = Store.getPromociones();
		if (!this.promociones){
			this.promociones = this.cargarPromocionesRandom();
			Store.setPromociones(this.promociones);
		}
	}		

	function cargarProductosYCategorias(){
		var prods = Store.getProductos();
		var categorias = [];
		if (!prods){
			$.ajaxSetup( { "async": false } );
			$.getJSON( "datos.json", function(datos) {
				prods = new ProductoFactory(datos.ProductosVentas);
				categorias = datos.categorias;
			});
			$.ajaxSetup( { "async": true } );
			Store.setProductos(prods);
			Store.setCategorias(categorias);
		}		
		this.productos = prods;	
		this.categorias = _.sortBy(Store.getCategorias(categorias), 'nombre');		
	}

	function _i_prods_random(cant, max_valor){
		var indices = [];
		var indice;
		for (var i = 0; i<=cant; i++){
			indice = _.random(max_valor);
			if ( _.contains(indices, indice)){
				i--;
				continue;
			}
			indices.push(indice);			
		}
		return indices;
	}

	function cargarPromocionesRandom(){
		var CANT_PRODS = [1,1,4];
		var CANT_PRODS_PROMO = [1,2,1];
		var DESCUENTOS = [10, 15, 10];
		var TIPO = ['descuento', 'combo', 'combo'];
		var MJES = ['Llevando este producto tenes un 10% de descuento', 
					'Llevando dos unidades tenes un 15% de descuento', 
					'llevando estos cuatro productos tenes un 20% de descuento'];
		var max = this.productos.length;
		var productos = this.productos;
		var indices = this._i_prods_random(max-1, max-1);
		var prods_para_promos = [];
		var promociones = [];
		for (var i=0; i < CANT_PRODS.length; i++){
			var parse = _.first(indices, CANT_PRODS[i]);
			_.each(parse, function(ind){
				prods_para_promos.push(productos[ind]);
			});
			indices = _.rest(indices, CANT_PRODS[i]);
			promociones.push( PromocionFactory.crearPromocion(
				TIPO[i],
				prods_para_promos,
				CANT_PRODS_PROMO[i],
				MJES[i],
				DESCUENTOS[i]	
			));
			prods_para_promos = [];
		}
		return promociones;
		
	}
	function agregarComboAlCarro(promo_id){
		var promo = _.find(this.promociones, function(promo){return promo.id==promo_id});
		var carro = this.carro;
		if (_.every(promo.productos, function(p){
			return p.alcanzaStock(promo.cantidad + carro.getCantProdById(p.id))})){
			for (i in promo.productos){
				this._agregarAlCarro(promo.productos[i], promo.cantidad );
			}
			Store.setProdEnCarro(this.carro.productos);
			return 'ok';
		}
		return 'No alcanza el stock para cubrir la promocion';
	}

	function seleccionProducto(indice){
		return this.productos[indice];
	}
	function _agregarAlCarro(prod, cantidad){
		this.carro.agregarAlCarro(prod, cantidad);	
	}
	function agregarAlCarro(prod_id, cantidad){
		var p = _.find(this.productos, function(prod){return prod.id == prod_id});
		var cantidad_total = cantidad + this.carro.getCantProdById(prod_id);
		if (!p.alcanzaStock(cantidad_total))
			return "Cantidad no disponible";
		this._agregarAlCarro(p, cantidad);	
		Store.setProdEnCarro(this.carro.productos);
		return "ok";
	}
	function actualizarCantEnCarro(id_prod, cantidad){
		var prod = _.find(this.productos, function(p){return p.id == id_prod;});
		if (!prod.alcanzaStock(cantidad))
			return 'Cantidad no Disponible';	
		this.carro.actualizarCantPorId(id_prod, cantidad, this.promociones);
		Store.setProdEnCarro(this.carro.productos);
		return 'ok';
	}
	function checkout(){
		var errores = [];
		var precio_a_pagar = this.carro.getPrecioTotal(this.promociones);

		var results = _.map(this.carro.productos, function(prod_carro){
			if (prod_carro.producto.alcanzaStock(prod_carro.cantidad))
				return true;
			return "Para el producto "+prod_carro.producto.nombre+" No alcanza Stock";
		});
		if (_.every(results, function(elem){return elem == true})){
			var decrementar= _.map(this.carro.productos,function(prod_carro){
				return {'id_prod': prod_carro.producto.id,
						'cantidad': prod_carro.cantidad };
			});
			
			for (i in decrementar){
				var id_buscar = decrementar[i].id_prod;
				var prod = this.getProductoById(id_buscar);
				prod.disminuirStock(decrementar[i].cantidad);
			}
			
			
			Store.setProductos(this.productos);
			this.carro.vaciarCarro();
			Store.setProdEnCarro(this.carro.productos);
			return "Stock decrementados";
		}
		else{
			console.log("devolver errores");
		}
	}
	function getProductos(){
		return this.productos;
	}
	function getProductosEnPromocion(){
		return this.promociones.getProductosEnPromocion();
	}
	function getIdsProdsEnPromo(){
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
	function getProductosPorFiltro(filtros){
		var filtro = this.productos;
		if (!_.isEmpty(filtros.categoria))
			filtro = _.filter(filtro, function(p){return p.categoria==filtros.categoria});
		if (filtros.stock)
			filtro = _.filter(filtro, function(p){return p.cantidad > 0});
		if (!_.isEmpty(filtros.nombre))			
			filtro = _.filter(filtro, function(p){return p.nombre.toLocaleLowerCase().indexOf(filtros.nombre) != -1;});
		return filtro;
	}
	function getProductoById(id_prod){
		return _.find(this.productos, function(p){
			return p.id == id_prod;
		});
	}
	function getPromociones(){
		return this.promociones;
	}
}
function PromocionFactory(){}
PromocionFactory.next_id = 1;
PromocionFactory.crearPromocion = function(tipo_promo, productos, cantidad, mjePromo, descuento){
	var promo = new Promocion();
	promo.tipoPromocion = tipo_promo;
	promo.productos = productos;
	promo.cantidad = cantidad;
	promo.descuento = descuento;
	promo.mjePromocion = mjePromo;
	promo.id = PromocionFactory.next_id++;
	return promo;
}

function Promocion(){
	this.productos = [];
	this.cantidad = 1;
	this.descuento = null;
	this.mjePromocion = null;
	this.tipoPromocion = null;
	// Privados

	this.hayStock = function(){
		var cantidad_buscada = this.cantidad;
		var result = _.every(this.productos, function(producto){
			return producto.alcanzaStock(cantidad_buscada);
		});

		return result;
	}

	/* True si todos los productos de la promo estan en el carro. */
	this.hay_promo = function(prod_en_carro){
		var ids_en_promo = _.map(this.productos, function(p){return p.id});
		var ids_en_carro = _.map(prod_en_carro, function(p){return p.producto.id});
		if (!_.every(ids_en_promo, function(id_promo){return _.contains(ids_en_carro, id_promo)}))
			return false;
		return true;
	}

	/* Esta funcion devuelve la cantidad de veces que la promo se repite en listado de prod en carro*/
	this.get_cant_repe_promo= function(prods_en_carro){		
		var cantidad_para_promo = this.cantidad;
		var cant_repeticiones = [];
		_.each(prods_en_carro, function(prod_en_carro){
			var result = ~~(prod_en_carro.cantidad / cantidad_para_promo); 
			cant_repeticiones.push(result);			  
		});
		if (_.contains(cant_repeticiones, 0))
			return 0;
		return _.min(cant_repeticiones);
	}

	this.getTotalConDescuentos = function(productos_en_carro){
		var productos_en_promo = this.productos;
		var cantidad_para_promo = this.cantidad;
		var en_carro_y_promo = _.filter(productos_en_carro, function(producto){
			return producto.producto.contenidoEn(productos_en_promo) &&
					producto.cantidad >= cantidad_para_promo;			
		});
		if (!this.hay_promo(en_carro_y_promo))
			return 0;
		var cant_repe_promo = this.get_cant_repe_promo(en_carro_y_promo);
		var precio_total_promo = this.getPrecioTotalSinDescuento() * cant_repe_promo;		
		var precio_total_promo_con_descuento = this.aplicarDescuento(this.descuento, precio_total_promo);
		return precio_total_promo - precio_total_promo_con_descuento;
	}
	
	this.getDescuento =function(){
		return this.descuento;
	}

	this.getPorcentajeDescuento = function(){
		return this.descuento;
	}
	
	this.getTipo = function(){
		return this.tipoPromocion;
	}
	/* devuelve el precio del combo sin aplicar descuentos */
	this.getPrecioTotalSinDescuento = function(){
		var precios = _.chain(this.productos)
			.map(function(p){return p.precio;})
			.reduce(function(acum, item){return acum + item;});
		
		return precios * this.cantidad;
	}
	this.getPrecioTotalConDescuento = function(){
		var precio = this.getPrecioTotalSinDescuento();
		return this.aplicarDescuento(this.descuento, precio);
	}	
	this.aplicarDescuento = function(descuento, precio){
		var result = precio - ((precio * descuento) / 100);
		return result.toFixed(2);
	};
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
	
	this.disminuirStock = function(cant_disminuir){
		var c = this.cantidad - cant_disminuir;
		if (c >= 0){
			this.cantidad = c;
			return true;
		}
		return false;
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
			return _.reduce(descuentos, function(acum, des) { return des(acum)}, monto);
		}
		return 0;
	}	
	this.getPrecioUnitario = function(funcion_descuento){
		var result = funcion_descuento(this.precio);
		return result;
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
	
}
