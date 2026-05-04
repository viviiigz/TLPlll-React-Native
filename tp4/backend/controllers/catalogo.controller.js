import productosMaquillaje from '../db/db.js';

export const getAllMaquillajes = (req, res) => {
    res.json(productosMaquillaje);
}

export const getMaquillajeById = (req, res) => {
    // convertimos el id a número con parseInt, porque de la URL siempre llega como texto
    const idBuscado = parseInt(req.params.id);

    // buscamos en el arreglo el producto que tenga ese mismo id
    const producto = productosMaquillaje.find(p => p.id === idBuscado);

    if (producto) {
        res.json(producto); // si lo encuentra, lo devuelve al cliente
    } else {
        // si no lo encuentra, mandamos el error 404 (No encontrado) que pide la consigna
        res.status(404).json({ mensaje: 'Producto de maquillaje no encontrado' });
    }
}

export const createMaquillaje = (req, res) => {
    const { nombre, marca, categoria, precio } = req.body;

    if (!nombre || !marca || !categoria || !precio) {
        return res.status(400).json({ mensaje: 'Cuidado, te faltó completar algún campo' });
    }

    const nuevoProducto = {
        // asignar un id unico. En este caso, le damos el número del largo del arreglo + 1, para q seasiempre un numero nuevo
        id: productosMaquillaje.length + 1,
        nombre: nombre,
        marca: marca,
        categoria: categoria,
        precio: precio
    };
    productosMaquillaje.push(nuevoProducto);

    res.status(201).json(nuevoProducto);
}

export const updateMaquillaje = (req, res) => {
    const idBuscado = parseInt(req.params.id);
    const { nombre, marca, categoria, precio } = req.body;

    // buscamos en qué posición (índice) del arreglo está el producto. 
    // findIndex devuelve -1 si no encuentra nada
    const posicion = productosMaquillaje.findIndex(p => p.id === idBuscado);

    if (posicion !== -1) {
        productosMaquillaje[posicion].nombre = nombre || productosMaquillaje[posicion].nombre;
        productosMaquillaje[posicion].marca = marca || productosMaquillaje[posicion].marca;
        productosMaquillaje[posicion].categoria = categoria || productosMaquillaje[posicion].categoria;
        productosMaquillaje[posicion].precio = precio || productosMaquillaje[posicion].precio;

        res.json(productosMaquillaje[posicion]);
    } else {
        res.status(404).json({ mensaje: 'No encontramos el producto que querías actualizar' });
    }

}

export const deleteMaquillaje = (req, res) => {
    const idBuscado = parseInt(req.params.id);

    // buscamos la posición igual que hicimos en el PUT
    const posicion = productosMaquillaje.findIndex(p => p.id === idBuscado);

    if (posicion !== -1) {
        // guardamos el producto en una variable temporal solo para mostrarle al usuario qué borramos
        const productoEliminado = db.productosMaquillaje[posicion];

        // el método .splice() borra elementos de un arreglo. Le pasamos la posición, y el "1" indica que borre solo ese elemento.
        db.productosMaquillaje.splice(posicion, 1);

        res.json({ mensaje: 'Producto borrado exitosamente', producto: productoEliminado });
    } else {
        res.status(404).json({ mensaje: 'No encontramos el producto para eliminar' });
    }
}

