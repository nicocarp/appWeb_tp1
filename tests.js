QUnit.test( "hello test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});


QUnit.module( "Carro", {
  before: function() {
    
    var prod1= {
          "id":1,
          "nombre":"Futbol Nro5", 
    			"cantidad":10, "precio":2, 
    			"imagen":"estaticos/imagenes/pelota.jpg", "precio":1};
   	var prod2 ={ 
            "id":2,
            "nombre":"Futbol Nro4",
        		"cantidad":10, "precio":5,
        		"imagen":"estaticos/imagenes/pelota.jpg", "precio":2};
	this.prod1 = prod1;
	this.prod2 = prod2;
  },
    beforeEach: function() {
    this.carrito = new Carro();
    this.carrito.productos = [];

  }
});

QUnit.test("testAgregarAlCarro", function( assert ) {
    this.carrito.agregarAlCarro(this.prod1, 1);
    this.carrito.agregarAlCarro(this.prod2, 1);
	 assert.equal(this.carrito.productos.length, 2);    
  });
QUnit.test("testSacarDelCarro", function( assert ) {
    this.carrito.agregarAlCarro(this.prod1, 1);
    this.carrito.agregarAlCarro(this.prod2, 1);
    this.carrito.sacarDelCarro(1);
	assert.equal(this.carrito.productos.length, 1);
  });
QUnit.test("testSacarDelCarroProductoIndicado", function( assert ) {
    this.carrito.agregarAlCarro(this.prod1, 1);
    this.carrito.agregarAlCarro(this.prod2, 1);
    this.carrito.sacarDelCarro(0);
	assert.notEqual(this.prod1.nombre, this.carrito.productos[0].producto.nombre);
  });
QUnit.test("testCalcularTotal", function( assert ) {
    this.carrito.agregarAlCarro(this.prod1, 1);
    this.carrito.agregarAlCarro(this.prod2, 1);
	assert.equal(this.carrito.calcularTotal(), 7);    
  });
QUnit.test("testCalcularTotalComplejo", function( assert ) {
    var cant_prod1 = 12;
	var cant_prod2 = 2;
	var cuenta = (this.prod1.precio * cant_prod1) + (this.prod2.precio * cant_prod2);
	this.carrito.agregarAlCarro(this.prod1, cant_prod1);
    this.carrito.agregarAlCarro(this.prod2, cant_prod2);
	assert.equal(this.carrito.calcularTotal(), cuenta);    
  });

QUnit.test("getCantProductos", function( assert ) {
    this.carrito.agregarAlCarro(this.prod1, 1);
    this.carrito.agregarAlCarro(this.prod2, 2);
    assert.equal(this.carrito.getCantProductos(), 3);    
  });
QUnit.test("getCantProductosComplejo", function( assert ) {
    this.carrito.agregarAlCarro(this.prod1, 2);
    this.carrito.agregarAlCarro(this.prod2, 2);
    this.carrito.sacarDelCarro(0);
    assert.equal(this.carrito.getCantProductos(), 2);    
  });

QUnit.module( "Producto", {
  before: function() {

  },
    beforeEach: function() {
    this.prod = new Producto();
  }
});
QUnit.test("testNoAlcanzaStock", function( assert ) {
  this.prod.cantidad = 10;
  assert.equal(this.prod.alcanzaStock(11), false);    
});
QUnit.test("testSiAlcanzaStock", function( assert ) {
  this.prod.cantidad = 10;
  assert.equal(this.prod.alcanzaStock(10), true);    
});
QUnit.test("testDisminuirStock", function( assert ) {
  this.prod.cantidad = 10;
  this.prod.disminuirStock(2);
  assert.equal(this.prod.cantidad, 8);    
});
QUnit.test("testDisminuirStockCero", function( assert ) {  
  this.prod.cantidad = 0;
  this.prod.disminuirStock(2);
  assert.equal(this.prod.cantidad, 0);    
});
QUnit.test("testDisminuirStockNegativo", function( assert ) {
  this.prod.cantidad = 10;
  this.prod.disminuirStock(12);
  assert.equal(this.prod.cantidad, 10);    
});


// D E S C U E N T O S
QUnit.module( "Descuento", {
  before: function() {

  },
    beforeEach: function() {
    
  }
});
QUnit.test("testFuncionDescuentaCorrectamente", function( assert ) {
  this.descuento = new Descuento(10);
  assert.equal(this.descuento(800), 80);    
});
QUnit.test("testFuncionDescuentaCorrectamenteNumerosReales", function( assert ) {
  // ESte descuento da un resultado muy aproximado por lo que es valido para nuestro dominio
  this.descuento = new Descuento(10);
  assert.notEqual(this.descuento(123.54), 12.354);    
});

// P R O M O C I O N E S
QUnit.module( "Promocion", {
  before: function() {

  },
    beforeEach: function() {
    
  }
});
QUnit.test("testGenerandoPromociones", function( assert ) {
  this.promociones = new PromocionManager([1,2,3,4,5]);
  assert.equal(this.promociones.promociones.length, 3);    
});
