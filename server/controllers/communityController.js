const Post = require('../models/Post');

// @desc    Get all posts
// @route   GET /api/community
// @access  Private
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'name role')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a post
// @route   POST /api/community
// @access  Private
const createPost = async (req, res) => {
    const { title, content, tags } = req.body;

    try {
        const post = await Post.create({
            author: req.user.id,
            title,
            content,
            tags
        });

        const populatedPost = await Post.findById(post._id).populate('author', 'name role');
        res.status(201).json(populatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Like a post
// @route   PUT /api/community/:id/like
// @access  Private
const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if post has already been liked
        if (post.likes.includes(req.user.id)) {
            // Unlike
            post.likes = post.likes.filter(id => id.toString() !== req.user.id);
        } else {
            // Like
            post.likes.unshift(req.user.id);
        }

        await post.save();
        res.json(post.likes);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add comment
// @route   POST /api/community/:id/comment
// @access  Private
const addComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const newComment = {
            user: req.user.id,
            text: req.body.text,
            name: req.user.name
        };

        post.comments.unshift(newComment);
        await post.save();

        // Populate to return full details immediately if needed, 
        // but for now just returning the comments array is fine or refetch
        res.json(post.comments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getPosts,
    createPost,
    likePost,
    addComment
};
