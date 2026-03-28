// 1. 获取 HTML 元素
const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const pendingList = document.getElementById('pending-list');
const completedList = document.getElementById('completed-list');
const pendingCount = document.getElementById('pending-count');
const completedCount = document.getElementById('completed-count');
const clearBtn = document.getElementById('clear-all');
const pendingEmpty = document.getElementById('pending-empty');
const completedEmpty = document.getElementById('completed-empty');

// 2. 封装：创建任务条目
function createTask(text, isCompleted = false) {
    const li = document.createElement('li');
    if (isCompleted) li.classList.add('completed');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = isCompleted;
    
    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = text;
    span.title = "双击可编辑内容";

    const delBtn = document.createElement('button');
    delBtn.textContent = '删除';
    delBtn.className = 'delete-btn';

    // 双击编辑功能
    span.addEventListener('dblclick', function() {
        const newText = prompt("编辑任务内容：", span.textContent);
        if (newText !== null && newText.trim() !== "") {
            span.textContent = newText.trim();
            saveTasks();
        }
    });

    // 复选框：切换完成状态
    checkbox.addEventListener('change', function() {
        if (checkbox.checked) {
            li.classList.add('completed');
            completedList.prepend(li);
        } else {
            li.classList.remove('completed');
            pendingList.appendChild(li);
        }
        updateCounts();
        saveTasks();
    });

    // 删除按钮
    delBtn.addEventListener('click', function() {
        li.remove();
        updateCounts();
        saveTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);

    if (isCompleted) {
        completedList.appendChild(li);
    } else {
        pendingList.appendChild(li);
    }
}

// 3. 封装：更新计数器和空状态
function updateCounts() {
    const pCount = pendingList.children.length;
    const cCount = completedList.children.length;
    
    pendingCount.textContent = pCount;
    completedCount.textContent = cCount;

    pendingEmpty.style.display = pCount === 0 ? 'block' : 'none';
    completedEmpty.style.display = cCount === 0 ? 'block' : 'none';
}

// 4. 封装：本地存储
function saveTasks() {
    const tasks = [];
    pendingList.querySelectorAll('li').forEach(li => {
        tasks.push({ text: li.querySelector('.task-text').textContent, completed: false });
    });
    completedList.querySelectorAll('li').forEach(li => {
        tasks.push({ text: li.querySelector('.task-text').textContent, completed: true });
    });
    localStorage.setItem('dual-tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const saved = localStorage.getItem('dual-tasks');
    if (saved) {
        const tasks = JSON.parse(saved);
        tasks.forEach(task => createTask(task.text, task.completed));
    }
    updateCounts();
}

// 5. 事件监听
addBtn.addEventListener('click', function() {
    const text = input.value.trim();
    if (text) {
        createTask(text);
        updateCounts();
        saveTasks();
        input.value = "";
    }
});

input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addBtn.click();
});

clearBtn.addEventListener('click', function() {
    if (confirm("确定要清空所有已完成的任务吗？")) {
        completedList.innerHTML = "";
        updateCounts();
        saveTasks();
    }
});

// 6. 初始化加载
loadTasks();