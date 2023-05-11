import fs from 'fs'
import { __dirname } from '../path.js';

const path = __dirname + '/json/products.json';

export const getProducts = async(limit) => {
  try {
    if (fs.existsSync(path)) {
      const productos = await fs.promises.readFile(path, 'utf8');
      const productosJS = JSON.parse(productos);
      if (limit) {
        return productosJS.slice(0, limit);
      } else {
        return productosJS;
      }
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
  }
}

export const addProduct = async(title, description, price, url, code, stock) => {
  try {
    const productosArchivo = await this.getProducts();
    const codigoExistente = productosArchivo.find(
      (producto) => producto.codigo === code
    );

    if (codigoExistente) {
      console.log(`Ya existe un producto con el código ${code}`);
    } else {
      const ultimoProducto = productosArchivo[productosArchivo.length - 1];
      const nuevoId = ultimoProducto ? ultimoProducto.id + 1 : this.idContador;
      const producto = {
        id: nuevoId,
        nombre: title,
        descripcion: description,
        precio: price,
        imagen: url,
        codigo: code,
        stock,
      };

      productosArchivo.push(producto);
      await fs.promises.writeFile(this.path, JSON.stringify(productosArchivo));
    }
  } catch (error) {
    console.log(error);
  }
}

export const deleteProduct = async (idProducto) => {
  try {
    const productosArchivo = await this.getProducts();
    const indiceProducto = productosArchivo.findIndex((producto) => producto.id === idProducto);

    if (indiceProducto === -1) {
      console.log('No se encontró el producto con el ID especificado');
    } else {
      productosArchivo.splice(indiceProducto, 1);
      await fs.promises.writeFile(this.path, JSON.stringify(productosArchivo));
      console.log(`Producto con ID ${idProducto} eliminado exitosamente`);
    }
  } catch (error) {
    console.log(error);
  }
}
