
const GITHUB_RAW_URL = 'db.json';

async function loadProducts() {
    const container = document.getElementById('productContainer');
    const loading = document.getElementById('loading');

    try {
        const response = await fetch(GITHUB_RAW_URL);
        if (!response.ok) throw new Error('Kết nối thất bại');
        
        const products = await response.json();

        loading.classList.add('d-none'); 

        products.forEach(product => {
            const productHtml = `
                <div class="col">
                    <div class="card product-card">
                        <span class="badge bg-primary badge-category">${product.category.name}</span>
                        <img src="${product.images[0]}" class="card-img-top product-img" alt="${product.title}" 
                             onerror="this.src='https://placehold.co/600x400?text=No+Image'">
                        <div class="card-body">
                            <h5 class="card-title text-truncate">${product.title}</h5>
                            <p class="card-text text-muted small" style="height: 40px; overflow: hidden;">
                                ${product.description}
                            </p>
                            <div class="d-flex justify-content-between align-items-center mt-3">
                                <span class="fw-bold text-danger">$${product.price}</span>
                                <button class="btn btn-sm btn-outline-dark">Chi tiết</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += productHtml;
        });

    } catch (error) {
        loading.innerHTML = `<div class="alert alert-danger">Lỗi: ${error.message}</div>`;
        console.error('Error:', error);
    }
}

loadProducts();