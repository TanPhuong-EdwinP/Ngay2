const POST_API = 'http://localhost:3000/posts';
const COMMENT_API = 'http://localhost:3000/comments';
let allPosts = [];

// 1. Hàm bổ trợ: Tạo ID tự tăng (Max + 1) và trả về String
async function generateNextId(apiUrl) {
    const res = await fetch(apiUrl);
    const data = await res.json();
    if (data.length === 0) return "1";
    const maxId = Math.max(...data.map(item => parseInt(item.id)));
    return (maxId + 1).toString();
}

// 2. Chức năng hiển thị (Render) - Có xử lý gạch ngang cho Post xóa mềm
function renderTable(posts) {
    const tableBody = document.getElementById('productTableBody');
    tableBody.innerHTML = '';

    posts.forEach(post => {
        const isDeleted = post.isDeleted === true;
        // Thêm style gạch ngang nếu post đã bị xóa mềm
        const rowStyle = isDeleted ? 'style="text-decoration: line-through; opacity: 0.5;"' : '';
        
        const row = `
            <tr ${rowStyle}>
                <td>#${post.id}</td>
                <td><div class="fw-bold">${post.title}</div></td>
                <td>${post.views} views</td>
                <td>
                    ${!isDeleted ? `<button onclick="softDeletePost('${post.id}')" class="btn btn-sm btn-outline-danger">Xoá mềm</button>` : '<span class="badge bg-secondary">Đã xoá</span>'}
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// 3. Chức năng Xoá mềm (Sử dụng PATCH thay vì DELETE)
async function softDeletePost(id) {
    await fetch(`${POST_API}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDeleted: true })
    });
    init(); // Tải lại bảng
}

// 4. CRUD cho Comments
const commentService = {
    // Thêm comment với ID tự tăng (String)
    create: async (text, postId) => {
        const nextId = await generateNextId(COMMENT_API);
        const newComment = { id: nextId, text, postId, isDeleted: false };
        return fetch(COMMENT_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newComment)
        });
    },
    // Đọc danh sách
    getAll: () => fetch(COMMENT_API).then(res => res.json()),
    // Cập nhật
    update: (id, newText) => fetch(`${COMMENT_API}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newText })
    }),
    // Xoá cứng hoặc xoá mềm (tùy ý, ở đây ví dụ xoá cứng)
    delete: (id) => fetch(`${COMMENT_API}/${id}`, { method: 'DELETE' })
};

// Khởi tạo app
async function init() {
    const response = await fetch(POST_API);
    allPosts = await response.json();
    renderTable(allPosts);
}

init();