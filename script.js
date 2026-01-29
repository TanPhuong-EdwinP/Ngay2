const GITHUB_RAW_URL = 'db.json';
let allProducts = []; // Lưu trữ dữ liệu gốc

// 1. Khởi tạo ứng dụng
async function init() {
    const loading = document.getElementById('loading');
    try {
        const response = await fetch(GITHUB_RAW_URL);
        if (!response.ok) throw new Error('Kết nối thất bại');
        
        allProducts = await response.json();
        loading.classList.add('d-none');
        
        renderTable(allProducts); // Hiển thị lần đầu
        setupListeners(); // Thiết lập tìm kiếm và sắp xếp
    } catch (error) {
        loading.innerHTML = `<div class="alert alert-danger">Lỗi: ${error.message}</div>`;
        console.error('Error:', error);
    }
}

// 2. Hàm hiển thị dữ liệu vào Bảng
function renderTable(products) {
    const tableBody = document.getElementById('productTableBody');
    const noResult = document.getElementById('noResult');
    tableBody.innerHTML = '';

    if (products.length === 0) {
        noResult.classList.remove('d-none');
    } else {
        noResult.classList.add('d-none');
        products.forEach(product => {
            const row = `
                <tr>
                    <td><span class="text-muted small">#${product.id}</span></td>
                    <td>
                        <img src="${product.images[0]}" class="product-img-table" 
                             onerror="this.src='https://placehold.co/100?text=No+Img'">
                    </td>
                    <td>
                        <div class="fw-bold">${product.title}</div>
                        <div class="text-muted x-small text-truncate" style="max-width: 250px;">
                            ${product.description}
                        </div>
                    </td>
                    <td><span class="badge bg-info text-dark">${product.category.name}</span></td>
                    <td><span class="fw-bold text-danger">$${product.price}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary">Sửa</button>
                        <button class="btn btn-sm btn-outline-danger">Xóa</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    }
}

// 3. Thiết lập Tìm kiếm (onChanged) và Sắp xếp
function setupListeners() {
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');

    const handleFilter = () => {
        let filtered = [...allProducts];

        // Logic Tìm kiếm theo tên
        const searchTerm = searchInput.value.toLowerCase();
        filtered = filtered.filter(p => p.title.toLowerCase().includes(searchTerm));

        // Logic Sắp xếp
        const sortValue = sortSelect.value;
        if (sortValue === 'name-asc') {
            filtered.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortValue === 'name-desc') {
            filtered.sort((a, b) => b.title.localeCompare(a.title));
        } else if (sortValue === 'price-asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortValue === 'price-desc') {
            filtered.sort((a, b) => b.price - a.price);
        }

        renderTable(filtered);
    };

    // Sự kiện "input" hoạt động như onChanged (gọi mỗi khi gõ phím)
    searchInput.addEventListener('input', handleFilter);
    sortSelect.addEventListener('change', handleFilter);
}

init();