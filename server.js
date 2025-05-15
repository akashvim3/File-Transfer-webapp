const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

// Enable CORS
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

// Store active peer connections
const activePeers = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle peer connection requests
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        activePeers.set(socket.id, roomId);
        socket.to(roomId).emit('user-connected', socket.id);
    });

    // Handle file transfer signaling
    socket.on('offer', (offer, roomId) => {
        socket.to(roomId).emit('offer', offer, socket.id);
    });

    socket.on('answer', (answer, roomId) => {
        socket.to(roomId).emit('answer', answer, socket.id);
    });

    socket.on('ice-candidate', (candidate, roomId) => {
        socket.to(roomId).emit('ice-candidate', candidate, socket.id);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        const roomId = activePeers.get(socket.id);
        if (roomId) {
            socket.to(roomId).emit('user-disconnected', socket.id);
            activePeers.delete(socket.id);
        }
    });
});

// File upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const fileUrl = `/download/${req.file.filename}`;
    res.json({
        success: true,
        fileUrl: fileUrl,
        fileName: req.file.originalname
    });
});

// File download endpoint
app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);
    res.download(filePath);
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 