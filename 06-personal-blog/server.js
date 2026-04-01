const express = require('express');
const mongoose = require('mongoose'); // 1. 引入 mongoose
const app = express();
const cors = require('cors'); // 引入
app.use(cors()); // 允许跨域
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 2. 连接 MongoDB 数据库
// blog_db 是我们要创建的数据库名称，如果不存在，MongoDB 会自动帮你创建
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blog_db')
    .then(() => console.log('✅ 成功连接到 MongoDB 数据库！'))
    .catch(err => console.error('❌ 数据库连接失败:', err));

// 3. 定义数据模型 (Schema)
// 就像是在数据库里建一张“表”，规定每篇博客必须有哪些字段
const postSchema = new mongoose.Schema({
    title: { type: String, required: true }, // 标题，必填
    content: { type: String, required: true }, // 内容，必填
    date: { type: Date, default: Date.now } // 发布日期，默认为当前时间
});

// 4. 创建模型对象 (Model)
// 以后我们就通过 Post 来增删改查文章
const Post = mongoose.model('Post', postSchema);

// --- 路由部分 ---

app.get('/', (req, res) => {
    res.send('<h1>📚 我的全栈博客后端</h1><p>数据库已连接！</p>');
});

// 5. 获取所有博客文章 (从数据库查)
app.get('/api/posts', async (req, res) => {
    try {
        const posts = await Post.find(); // 去数据库里找所有文章
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: '服务器错误' });
    }
});

// 6. 创建新文章 (存入数据库)
app.post('/api/posts', async (req, res) => {
    try {
        const newPost = new Post({
            title: req.body.title,
            content: req.body.content
        });
        const savedPost = await newPost.save(); // 保存到数据库
        res.status(201).json(savedPost);
    } catch (err) {
        res.status(400).json({ message: '保存失败，请检查数据' });
    }
});

// 添加未捕获异常处理和日志记录
process.on('uncaughtException', (err) => {
    console.error('未捕获异常:', err);
});
app.listen(PORT, () => {
    console.log(`🚀 服务器已在 http://localhost:${PORT} 启动`);
});