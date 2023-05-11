const socketClient = io();
const form = document.querySelector('form');
const inputName = document.getElementById('name');
const inputPrice = document.getElementById('price');
const inputDesc = document.getElementById('description');
const products = document.querySelector('p');

form.onsubmit = (e) => {
  e.preventDefault();
  const name = inputName.value;
  const price = inputPrice.value;
  const description = inputDesc.value;

  if (price === '' || name === '' || description === '') {
    alert('Por favor, completa todos los campos.');
    return false;
  }

  socketClient.emit('newProduct', { name, price, description });

  return true;
};

socketClient.on('getProducts', (products) => {
  let data = '';

  products.forEach((p, index) => {
    data += `
      <div style="border: 1px solid black; margin-bottom: 10px; width: 450px;">
        <ul>
          <h1>${p.name}</h1>
          <h2>Price: $${p.price}</h2>
          <h3>Description: ${p.description}</h3>
        </ul>
        <button onclick="deleteProducto(${index})">Eliminar</button>
      </div>
    `;
  });

  products.innerHTML = data;
});

function deleteProduct(id) {
  socketClient.emit('deleteProducts', id);
}