const socket = io();

socket.on("products", (data) => {
    renderProducts(data);
});


const renderProducts = (data) => {
    const productsContainer = document.getElementById("productsContainer");
    productsContainer.innerHTML = "";

    const row = document.createElement("div");
    row.classList.add("row");

    data.forEach(item => {

        const card = document.createElement("div");
        card.classList.add("col-sm-6", "col-md-4", "col-lg-3", "mb-3");
        card.innerHTML = `
            <div class="card rounded-5">
                <div class="card-body shadow text-center rounded-5">
                    <p><strong>${item.title}</strong></p>
                    <p>ID: ${item._id}</p>
                    <p>Descripción: ${item.description}</p>
                    <p>Precio: ${item.price}</p>
                    <p>Código: ${item.code}</p>
                    <p>Stock: ${item.stock}</p>
                    <p>Categoría: ${item.category}</p>
                    <p>Estado: ${item.status ? 'Activo' : 'Inactivo'}</p>
                    <p>Imágenes: ${item.thumbnails ? item.thumbnails : 'Sin imágenes'}</p>
                    <button class="btnDelete rounded-pill" data-id="${item._id}">Eliminar</button> 
                </div>
            </div>
        `;

        row.appendChild(card);
    });

    productsContainer.appendChild(row);

    productsContainer.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const productId = e.target.getAttribute("data-id");
            deleteProducts(productId);
        });
    });
}

const deleteProducts = (id) => {
    socket.emit("deleteProducts", id);
}


document.getElementById("btnSend").addEventListener("click", () => {
    newProduct();
})


const newProduct = () => {
    const product = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        thumbnails: document.getElementById("thumbnails").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true",
    }

    socket.emit("newProduct", product);
}