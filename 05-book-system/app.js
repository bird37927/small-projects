const { createApp, ref, computed, onMounted, watch } = Vue;

createApp({
    setup() {
        // 1. 数据定义 (响应式变量)
        const books = ref([
            { title: '活着', author: '余华', price: 35, category: '小说' },
            { title: '代码大全', author: '史蒂夫', price: 128, category: '科技' },
            { title: '设计心理学', author: '唐纳德', price: 68, category: '艺术' }
        ]);

        const searchQuery = ref('');
        const filterCategory = ref('');

        // --- 🌟 弹窗相关的响应式变量 ---
        const showModal = ref(false);       // 控制弹窗显示隐藏
        const isEditing = ref(false);       // 是否处于编辑模式
        const editingIndex = ref(-1);       // 正在编辑的书籍索引
        const currentBook = ref({           // 弹窗表单绑定的对象
            title: '',
            author: '',
            price: 0,
            category: '小说'
        });

        // 2. 逻辑：实时搜索与过滤 (Computed 计算属性)
        const filteredBooks = computed(() => {
            return books.value.filter(book => {
                const matchesSearch = book.title.includes(searchQuery.value) || 
                                     book.author.includes(searchQuery.value);
                const matchesCategory = filterCategory.value === '' || 
                                       book.category === filterCategory.value;
                return matchesSearch && matchesCategory;
            });
        });

        // 3. 弹窗操作逻辑
        const openAddModal = () => {
            isEditing.value = false;
            currentBook.value = { title: '', author: '', price: 0, category: '小说' };
            showModal.value = true;
        };

        const openEditModal = (book, index) => {
            isEditing.value = true;
            editingIndex.value = index;
            // 使用解构赋值 {...book} 避免直接修改原对象，实现“取消”功能
            currentBook.value = { ...book };
            showModal.value = true;
        };

        const closeModal = () => {
            showModal.value = false;
        };

        const saveBook = () => {
            if (isEditing.value) {
                // 编辑模式：更新数组中对应位置的对象
                books.value[editingIndex.value] = { ...currentBook.value };
            } else {
                // 添加模式：推入新对象
                books.value.push({ ...currentBook.value });
            }
            closeModal();
        };

        const removeBook = (index) => {
            if(confirm('确定要删除这本书吗？')) {
                books.value.splice(index, 1);
            }
        };

        // --- 职业级：数据持久化 ---
        onMounted(() => {
            const saved = localStorage.getItem('my-books');
            if (saved) books.value = JSON.parse(saved);
        });

        watch(books, (newVal) => {
            localStorage.setItem('my-books', JSON.stringify(newVal));
        }, { deep: true });

        // 4. 返回给模板使用
        return {
            books,
            searchQuery,
            filterCategory,
            filteredBooks,
            removeBook,
            showModal,
            isEditing,
            currentBook,
            openAddModal,
            openEditModal,
            closeModal,
            saveBook
        };
    }
}).mount('#app');