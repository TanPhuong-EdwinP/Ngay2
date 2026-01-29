const BASE_URL = 'http://localhost:3000';

// --- HÀM BỔ TRỢ ---

// 1. Tạo ID tự tăng (Max + 1) và trả về String
async function generateNextId(resource) {
    const res = await fetch(`${BASE_URL}/${resource}`);
    const data = await res.json();
    if (data.length === 0) return "1";
    const ids = data.map(item => parseInt(item.id)).filter(id => !isNaN(id));
    return (ids.length > 0 ? Math.max(...ids) + 1 : 1).toString();
}

// --- LOGIC CHO POSTS ---

async function fetchPosts() {
    const res = await fetch(`${BASE_URL}/posts`);
    const posts = await res.json();
    const body = document.getElementById('postTableBody');
    body.innerHTML = '';

    posts.forEach(post => {
        const isDeleted = post.isDeleted === true;
        body.innerHTML += `
            <tr class="${isDeleted ? 'deleted-row' : ''}">
                <td>#${post.id}</td>
                <td>${post.title}</td>
                <td>${post.views}</td>
                <td>${isDeleted ? 'Đã xóa mềm' : 'Hoạt động'}</td>
                <td>
                    ${!isDeleted ? `<button class="btn btn-sm btn-danger" onclick="softDeletePost('${post.id}')">Xóa mềm</button>` : ''}
                </td>
            </tr>`;
    });
}

async function addNewPost() {
    const title = prompt("Nhập tiêu đề bài viết:");
    if (!title) return;
    
    const nextId = await generateNextId('posts');
    await fetch(`${BASE_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: nextId, title, views: 0, isDeleted: false })
    });
    fetchPosts();
}

async function softDeletePost(id) {
    if (confirm("Xóa mềm bài viết này?")) {
        await fetch(`${BASE_URL}/posts/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isDeleted: true })
        });
        fetchPosts();
    }
}

// --- LOGIC CHO COMMENTS (CRUD ĐẦY ĐỦ) ---

async function fetchComments() {
    const res = await fetch(`${BASE_URL}/comments`);
    const comments = await res.json();
    const body = document.getElementById('commentTableBody');
    body.innerHTML = '';

    comments.forEach(c => {
        if (c.isDeleted) return; // Chỉ hiện comment chưa xóa (hoặc gạch ngang tùy bạn)
        body.innerHTML += `
            <tr>
                <td>#${c.id}</td>
                <td>${c.text}</td>
                <td>Post #${c.postId}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="editComment('${c.id}', '${c.text}')">Sửa</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteComment('${c.id}')">Xóa</button>
                </td>
            </tr>`;
    });
}

async function addNewComment() {
    const text = prompt("Nội dung bình luận:");
    const postId = prompt("ID của bài viết (ví dụ: 1):");
    if (!text || !postId) return;

    const nextId = await generateNextId('comments');
    await fetch(`${BASE_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: nextId, text, postId, isDeleted: false })
    });
    fetchComments();
}

async function editComment(id, oldText) {
    const newText = prompt("Sửa bình luận:", oldText);
    if (!newText) return;
    await fetch(`${BASE_URL}/comments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newText })
    });
    fetchComments();
}

async function deleteComment(id) {
    if (confirm("Xóa bình luận này?")) {
        await fetch(`${BASE_URL}/comments/${id}`, { method: 'DELETE' });
        fetchComments();
    }
}

// Khởi chạy ứng dụng
fetchPosts();
fetchComments();