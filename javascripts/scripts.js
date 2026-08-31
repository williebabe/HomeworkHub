document.getElementById('addBtn').addEventListener('click', function() {
    const subject = document.getElementById('subjectInput').value;
    const desc = document.getElementById('descInput').value;
    const date = document.getElementById('dateInput').value;
    const link = document.getElementById('linkInput').value; 
    if (!subject) return;
    
    const homeworkItem = { subject, desc, date, link };
    
    saveToStorage(homeworkItem);
    addHomeworkToDOM(homeworkItem);
    
    
    document.getElementById('subjectInput').value = '';
    document.getElementById('descInput').value = '';
    document.getElementById('dateInput').value = '';
    document.getElementById('linkInput').value = '';
});


window.addEventListener('DOMContentLoaded', loadHomework);

document.getElementById('addBtn').addEventListener('click', function() {
    const subject = document.getElementById('subjectInput').value;
    const desc = document.getElementById('descInput').value;
    const date = document.getElementById('dateInput').value;
    const link = document.getElementById('linkInput').value;
    const imageInput = document.getElementById('imageInput');
    
    if (!subject) return;

    if (imageInput.files && imageInput.files[0]) {
        const file = imageInput.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const imageData = e.target.result;
            const homeworkItem = { subject, desc, date, link, image: imageData };
            
            saveAndRender(homeworkItem);
        };
        
        reader.onerror = function() {
            alert('อ่านไฟล์รูปภาพไม่สำเร็จ ลองเปลี่ยนรูปอื่นดูครับ');
        };

        reader.readAsDataURL(file);
    } else {
        const homeworkItem = { subject, desc, date, link, image: null };
        saveAndRender(homeworkItem);
    }
});

function saveAndRender(item) {
    try {
        saveToStorage(item);
        addHomeworkToDOM(item);
        
        // ล้างค่าช่องกรอก
        document.getElementById('subjectInput').value = '';
        document.getElementById('descInput').value = '';
        document.getElementById('dateInput').value = '';
        document.getElementById('linkInput').value = '';
        document.getElementById('imageInput').value = '';
    } catch (error) {
        alert('พื้นที่จัดเก็บเต็ม (LocalStorage เต็ม) ลองใช้รูปที่มีขนาดเล็กลงครับ!');
        console.error(error);
    }
}

function addHomeworkToDOM(item) {
    const list = document.getElementById('homeworkList');
    const li = document.createElement('li');
    li.className = 'homework-item';
    
    li.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: start;">
            <div style="width: 100%; word-break: break-word;">
                <strong style="font-size: 15px;">${item.subject}</strong>
                <p style="margin: 4px 0; color: #555; font-size: 13px;">${item.desc || ''}</p>
                <small style="color: #888; display: block; margin-top: 4px;">📅 กำหนดส่ง: ${item.date || 'ไม่ระบุ'}</small>
                ${item.link ? `<a href="${item.link}" target="_blank" style="color: #4f46e5; font-size: 12px; text-decoration: none; display: inline-block; margin-top: 4px;">🔗 ลิงก์สไลด์</a>` : ''}
                
                ${item.image ? `<div style="margin-top: 10px;"><img src="${item.image}" style="max-width: 100%; max-height: 180px; border-radius: 10px; border: 1px solid #e2e8f0; object-fit: cover;"></div>` : ''}
            </div>
            <button onclick="removeHomework(this, '${item.subject}')" style="background: none; border: none; color: #ff4d4d; cursor: pointer; font-size: 16px; padding-left: 8px;">✕</button>
        </div>
    `;
    
    list.appendChild(li);
}

function saveToStorage(item) {
    let homeworks = JSON.parse(localStorage.getItem('homeworks')) || [];
    homeworks.push(item);
    localStorage.setItem('homeworks', JSON.stringify(homeworks));
}

function loadHomework() {
    let homeworks = JSON.parse(localStorage.getItem('homeworks')) || [];
    homeworks.forEach(item => addHomeworkToDOM(item));
}

function removeHomework(button, subjectName) {
    const li = button.closest('li');
    li.classList.add('deleting');
    setTimeout(() => li.remove(), 300);
    
    let homeworks = JSON.parse(localStorage.getItem('homeworks')) || [];
    homeworks = homeworks.filter(item => item.subject !== subjectName);
    localStorage.setItem('homeworks', JSON.stringify(homeworks));
}
