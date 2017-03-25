QUnit.test( "hello test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});


QUnit.module( "Carro", {
  before: function() {
    
    var prod1= {"nombre":"Futbol Nro5", 
    			"cantidad":10, "precio":2, 
    			"imagen":"estaticos/imagenes/pelota.jpg"};
   	var prod2 ={ "nombre":"Futbol Nro4",
        		"cantidad":10, "precio":5,
        		"imagen":"estaticos/imagenes/pelota.jpg"};
	this.prod1 = prod1;
	this.prod2 = prod2;
  },
    beforeEach: function() {
    this.carrito = new Carro();
  }
});

QUnit.test("agregarAlCarro", function( assert ) {
    this.carrito.agregarAlCarro(this.prod1, 1);
    this.carrito.agregarAlCarro(this.prod2, 1);
	assert.equal(this.carrito.productos.length, 2);    
  });
QUnit.test("sacarDelCarro", function( assert ) {
    this.carrito.agregarAlCarro(this.prod1, 1);
    this.carrito.agregarAlCarro(this.prod2, 1);
    this.carrito.sacarDelCarro(1);
	assert.equal(this.carrito.productos.length, 1);
  });
QUnit.test("sacarDelCarroProductoIndicado", function( assert ) {
    this.carrito.agregarAlCarro(this.prod1, 1);
    this.carrito.agregarAlCarro(this.prod2, 1);
    this.carrito.sacarDelCarro(0);
	assert.notEqual(this.prod1.nombre, this.carrito.productos[0].producto.nombre);
  });
QUnit.test("calcularTotal", function( assert ) {
    this.carrito.agregarAlCarro(this.prod1, 1);
    this.carrito.agregarAlCarro(this.prod2, 1);
	assert.equal(this.carrito.calcularTotal(), 7);    
  });

QUnit.test("calcularTotalComplejo", function( assert ) {
    var cant_prod1 = 12;
	var cant_prod2 = 2;
	var cuenta = (this.prod1.precio * cant_prod1) + (this.prod2.precio * cant_prod2);
	this.carrito.agregarAlCarro(this.prod1, cant_prod1);
    this.carrito.agregarAlCarro(this.prod2, cant_prod2);
	assert.equal(this.carrito.calcularTotal(), cuenta);    
  });

