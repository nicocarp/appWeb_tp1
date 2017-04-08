import os

JSON_PRODUCTO = open("plantilla_json.json").read()

JSON_COMPLETO = open("datos.json").read()


def crear_json_producto():
	ids = 8
	nombre = "un nombre "+str(ids)
	cantidad = 50000
	precio = 1000
	imagen = "estaticos/imagenes/pelota.jpg"
	p = ""
	for i in range(5000):
		nombre = "un nombre "+str(ids)
		p += JSON_PRODUCTO.replace("[[nombre]]", nombre)
		p = p.replace("[[precio]]", str(precio))
		p = p.replace("[[cantidad]]", str(cantidad))
		p = p.replace("[[imagen]]", imagen)
		p = p.replace("[[id]]", str(ids))
		ids += 1
	
	productos_listos = JSON_COMPLETO.replace("[[NUEVOS]]", p)
	
	archivo = open("generados.json", "w")
	archivo.writelines(productos_listos)


if __name__ == '__main__':
	crear_json_producto()