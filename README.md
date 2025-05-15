# File Transfer Application

A modern web application that enables file sharing through both server-based and peer-to-peer (P2P) methods. Built with Node.js, Express, and WebRTC.

## Features

### Server-based File Sharing
- Drag and drop file upload
- File preview for images
- Progress bar for upload tracking
- Shareable download links
- Support for all file types
- Mobile-friendly interface

### Peer-to-Peer File Transfer
- Direct device-to-device file transfer
- Room-based connections
- Real-time status updates
- No server storage needed
- Secure P2P connection

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd file-transfer-app
```

2. Install dependencies:
```bash
npm install
```

3. Create an uploads directory:
```bash
mkdir uploads
```

## Usage

1. Start the server:
```bash
npm start
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

### Server-based File Sharing
1. Click on the "Upload & Share" tab
2. Drag and drop a file or click to select
3. Click "Upload & Share"
4. Copy the generated share link
5. Share the link with others to download the file

### Peer-to-Peer File Transfer
1. Click on the "P2P Transfer" tab
2. Enter the same room ID on both devices
3. Wait for the connection to establish
4. Drag and drop files to transfer them directly

## Technical Details

### Server Components
- Express.js for the web server
- Socket.IO for real-time communication
- Multer for file upload handling
- UUID for unique file naming

### Client Components
- WebRTC for P2P connections
- Socket.IO client for signaling
- Modern CSS with CSS variables
- Responsive design

## API Endpoints

### POST /upload
- Uploads a file to the server
- Returns a shareable download link

### GET /download/:filename
- Downloads a file from the server

## WebRTC Signaling
- Room-based peer connections
- ICE candidate exchange
- Offer/Answer negotiation

## Security Considerations
- Files are stored with unique names
- P2P connections are direct and encrypted
- CORS enabled for cross-origin requests

## Browser Support
- Chrome (recommended)
- Firefox
- Edge
- Safari

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- Socket.IO for real-time communication
- WebRTC for P2P capabilities
- Express.js for the server framework 