
function generar_li(nombre, precio, path_imagen, indice){
  var string_li = "<li class=\"product-grid-layout animated bounceIn  item last col s12 m6 l3 product-item-box\" onclick=\"click_producto([[indice]])\"> <div class=\"card\"><div class=\"card-image\"><img src=\"[[ruta_imagen]]\"><span class=\"card-title\">Card Title</span><a class=\"btn-floating halfway-fab waves-effect waves-light red\"><i class=\"material-icons\">add</i></a></div><div class=\"card-content\"><p>Producto: [[nombre]]</p><p>$ [[precio]]</p></div></li>";
    string_li = string_li.replace('[[ruta_imagen]]', path_imagen);
  string_li = string_li.replace('[[nombre]]', nombre);
  string_li = string_li.replace('[[precio]]', precio);
  string_li = string_li.replace('[[indice]]', indice);
  return string_li;
}