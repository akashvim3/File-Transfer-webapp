File Transfer Application

Overview

A modern, full-featured file transfer application that provides both server-based file sharing and peer-to-peer (P2P) transfer capabilities. Built with Node.js and WebRTC, this application offers a seamless, secure, and efficient way to share files across devices and networks.
Key Highlights

    🚀 Dual Transfer Modes: Server-based sharing and direct P2P transfer
    📱 Responsive Design: Optimized for desktop and mobile devices
    🔒 Secure Transfers: Encrypted P2P connections and unique file links
    ⚡ Real-time Updates: Live progress tracking and status notifications
    🎯 Multiple File Support: Compatible with all file types

Features
🌐 Server-based File Sharing

    Drag & Drop Interface: Intuitive file selection and upload
    File Preview: Built-in image preview functionality
    Progress Tracking: Real-time upload progress visualization
    Shareable Links: Generate secure, shareable download URLs
    Universal Compatibility: Support for all file types and sizes
    Mobile Optimized: Touch-friendly interface for mobile devices

🔄 Peer-to-Peer Transfer

    Direct Transfer: Device-to-device file transfer without server intermediary
    Room-based Connections: Simple room ID system for pairing devices
    Real-time Status: Live connection and transfer status updates
    Zero Storage: Files never touch the server during P2P transfer
    WebRTC Security: Secure, encrypted peer connections

Prerequisites

Before running this application, ensure you have the following installed:

    Node.js: Version 14.0.0 or higher (Download Node.js)
    npm: Comes bundled with Node.js
    Modern Browser: Chrome, Firefox, Edge, or Safari with WebRTC support

Quick Start
1. Installation

bash

# Clone the repository
git clone https://github.com/akashvim3/file-transfer-app.git
cd file-transfer-app

# Install dependencies
npm install

# Create uploads directory
mkdir uploads

# Create environment file (optional)
cp .env.example .env

2. Configuration

Create a .env file in the root directory:

env

PORT=3000
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=100MB
CORS_ORIGIN=*

3. Running the Application

bash

# Development mode
npm run dev

# Production mode
npm start

# Run with custom port
PORT=5000 npm start

4. Access the Application

Open your browser and navigate to:

http://localhost:3000

Usage Guide
Server-based File Sharing

    Navigate to Upload Tab
        Click on the "Upload & Share" tab in the interface
    Select File
        Drag and drop a file onto the upload area
        Or click the upload area to open file browser
    Upload & Share
        Click "Upload & Share" button
        Monitor the upload progress
        Copy the generated shareable link
    Share the Link
        Send the link to recipients
        Recipients can download the file directly

Peer-to-Peer Transfer

    Access P2P Tab
        Switch to the "P2P Transfer" tab
    Create/Join Room
        Enter a unique Room ID on both devices
        Wait for connection to establish
    Transfer Files
        Once connected, drag and drop files to transfer
        Monitor transfer progress in real-time

API Documentation
File Upload Endpoint

POST /upload

Upload a file to the server.

Headers:

Content-Type: multipart/form-data

Body:

file: [File object]

Response:

json

{
  "success": true,
  "filename": "unique-filename.ext",
  "downloadLink": "/download/unique-filename.ext",
  "originalName": "original-filename.ext",
  "size": 1024
}

File Download Endpoint

GET /download/:filename

Download a previously uploaded file.

Parameters:

    filename: The unique filename returned from upload

Architecture
Backend Components

    Express.js: Web server framework
    Socket.IO: Real-time bidirectional communication
    Multer: Middleware for handling multipart/form-data
    UUID: Unique identifier generation
    Helmet: Security middleware

Frontend Components

    WebRTC: Peer-to-peer communication protocol
    Socket.IO Client: Real-time communication with server
    Modern CSS: CSS Grid, Flexbox, and CSS Variables
    Progressive Enhancement: Works without JavaScript for basic features

WebRTC Signaling Flow

mermaid

sequenceDiagram
    participant A as Device A
    participant S as Signaling Server
    participant B as Device B
    
    A->>S: Join Room
    B->>S: Join Room
    S->>A: Peer Joined
    S->>B: Peer Joined
    A->>S: WebRTC Offer
    S->>B: WebRTC Offer
    B->>S: WebRTC Answer
    S->>A: WebRTC Answer
    A<->>B: Direct P2P Connection

Security Considerations
Server-based Security

    Files are stored with UUID-based names to prevent guessing
    CORS configured for cross-origin security
    File size limits to prevent abuse
    Automatic file cleanup (configurable)

P2P Security

    WebRTC provides end-to-end encryption
    Room-based isolation prevents unauthorized access
    No data passes through server during transfer
    ICE candidates for NAT traversal

Browser Compatibility

Browser	Server Mode	P2P Mode
Chrome 60+	✅	✅
Firefox 55+	✅	✅
Edge 79+	✅	✅
Safari 12+	✅	⚠️ (Limited)

Note: P2P mode requires WebRTC support. Some mobile browsers may have limitations.
Performance Optimization
Server Mode

    Chunked file upload for large files
    Progress throttling to prevent UI flooding
    Automatic cleanup of old files

P2P Mode

    Efficient data channel configuration
    Adaptive bitrate based on connection quality
    Connection reliability monitoring

Deployment
Production Deployment

    Environment Setup

bash

# Set NODE_ENV to production
export NODE_ENV=production

# Install only production dependencies
npm ci --only=production

    Process Management

bash

# Using PM2
npm install -g pm2
pm2 start ecosystem.config.js

# Or using systemd
sudo cp file-transfer.service /etc/systemd/system/
sudo systemctl enable file-transfer
sudo systemctl start file-transfer

    Reverse Proxy (Nginx)

nginx

server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}


bash

# Build and run
docker build -t file-transfer-app .
docker run -p 3000:3000 -v uploads:/app/uploads file-transfer-app

Development
Setting up Development Environment

bash

# Install all dependencies including dev dependencies
npm install

# Run in development mode with nodemon
npm run dev

# Run linter
npm run lint

# Run tests
npm test

# Generate documentation
npm run docs

Contributing

We welcome contributions! Please see our Contributing Guidelines for details.
Development Workflow

    Fork the repository
    Create a feature branch (git checkout -b feature/amazing-feature)
    Commit your changes (git commit -m 'Add amazing feature')
    Push to the branch (git push origin feature/amazing-feature)
    Open a Pull Request

Code Standards

    Follow ESLint configuration
    Write meaningful commit messages
    Add tests for new features
    Update documentation as needed

Troubleshooting
Common Issues

Upload fails with large files

    Check MAX_FILE_SIZE environment variable
    Verify server disk space

P2P connection fails

    Ensure both devices are on compatible networks
    Check firewall settings
    Try different STUN/TURN servers

Files not accessible after upload

    Verify uploads directory permissions
    Check file system disk space

Logs and Debugging

bash

# Enable debug logging
DEBUG=* npm start

# Check application logs
tail -f logs/app.log

# Monitor file uploads
ls -la uploads/

FAQ

Q: Is there a file size limit? A: Yes, configurable through MAX_FILE_SIZE environment variable (default: 100MB)

Q: How long are files stored on the server? A: Files can be configured to auto-delete after a specified time (see configuration)

Q: Are P2P transfers secure? A: Yes, WebRTC provides end-to-end encryption

Q: Can I use this behind a corporate firewall? A: Yes, but you may need to configure STUN/TURN servers for P2P mode
Roadmap

    File encryption at rest
    User authentication system
    File sharing permissions
    Mobile app version
    Bulk file transfer
    Transfer history tracking
    Bandwidth limiting options

License

This project is licensed under the MIT License - see the LICENSE file for details.
Support

    📧 Email: ajyak749@gmail.com.com
    🐛 Issues: GitHub Issues
    💬 Discussions: GitHub Discussions

Acknowledgments

    Socket.IO - Real-time communication
    WebRTC - Peer-to-peer capabilities
    Express.js - Web framework
    Multer - File upload handling
    UUID - Unique identifier generation

Made with ❤️ by [Akash Vimal/Organization]
