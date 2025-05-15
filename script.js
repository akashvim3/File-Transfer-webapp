// Socket.IO connection
const socket = io('http://localhost:3000');

// DOM Elements
const dropzoneBox = document.getElementsByClassName("dropzone-box")[0];
const inputFiles = document.querySelectorAll(".dropzone-area input[type='file']");
const inputElement = inputFiles[0];
const dropZoneElement = inputElement.closest(".dropzone-area");
const previewContainer = document.getElementById("preview-container");
const previewImage = document.getElementById("preview-image");
const progressBar = document.getElementById("progress-bar");
const progress = document.getElementById("progress");
const successMessage = document.getElementById("success-message");
const shareLinkContainer = document.getElementById("share-link-container");
const shareLink = document.getElementById("share-link");

// Tab switching
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        button.classList.add('active');
        document.getElementById(`${button.dataset.tab}-tab`).classList.add('active');
    });
});

// File upload handling
inputElement.addEventListener("change", (e) => {
    if(inputElement.files.length){
        updateDropzoneFileList(dropZoneElement, inputElement.files[0]);
        showPreview(inputElement.files[0]);
    }
});

dropZoneElement.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZoneElement.classList.add("dropzone--over");
});

["dragleave", "dragend"].forEach((type) => {
    dropZoneElement.addEventListener(type, (e) => {
        dropZoneElement.classList.remove("dropzone--over");
    });
});

dropZoneElement.addEventListener("drop", (e) =>{
    e.preventDefault();
    if(e.dataTransfer.files.length) {
        inputElement.files = e.dataTransfer.files;
        updateDropzoneFileList(dropZoneElement, e.dataTransfer.files[0]);
        showPreview(e.dataTransfer.files[0]);
    }
    dropZoneElement.classList.remove("dropzone--over");
});

const updateDropzoneFileList = (dropZoneElement, file) =>{
    let dropzoneFileMessage = dropZoneElement.querySelector(".file-info");
    const fileSize = formatFileSize(file.size);
    dropzoneFileMessage.innerHTML = `${file.name}, ${fileSize}`;
    validateFileType(file);
};

const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';
};

const validateFileType = (file) => {
    const submitButton = document.getElementById("submit-button");
    submitButton.disabled = false;
    dropZoneElement.classList.remove("dropzone--invalid");
};

function resetForm() {
    const fileInput = document.getElementById("upload-file");
    fileInput.value = "";
    let dropzoneFileMessage = dropZoneElement.querySelector(".file-info");
    dropzoneFileMessage.innerHTML = 'No Files Selected';
    dropZoneElement.classList.remove("dropzone--invalid");
    document.getElementById("submit-button").disabled = false;
    previewContainer.style.display = "none";
    progressBar.style.display = "none";
    successMessage.style.display = "none";
    shareLinkContainer.style.display = "none";
}

function showPreview(file) {
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            previewContainer.style.display = "block";
        };
        reader.readAsDataURL(file);
    } else {
        previewContainer.style.display = "none";
    }
}

function copyShareLink() {
    shareLink.select();
    document.execCommand('copy');
    alert('Link copied to clipboard!');
}

// Server-based file upload
dropzoneBox.addEventListener("submit", async (e) => {
    e.preventDefault();
    const myFile = document.getElementById("upload-file");
    
    if (!myFile.files.length) {
        alert("Please select a file to upload");
        return;
    }
    
    const submitButton = document.getElementById("submit-button");
    const originalText = submitButton.textContent;
    submitButton.textContent = "Uploading...";
    submitButton.disabled = true;
    progressBar.style.display = "block";
    progress.style.width = "0%";
    
    const formData = new FormData();
    formData.append('file', myFile.files[0]);
    
    try {
        const response = await fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            progress.style.width = "100%";
            successMessage.style.display = "block";
            shareLink.value = `${window.location.origin}${data.fileUrl}`;
            shareLinkContainer.style.display = "flex";
        } else {
            throw new Error(data.error || 'Upload failed');
        }
    } catch (error) {
        alert('Upload failed: ' + error.message);
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
});

// P2P File Transfer
let peerConnection = null;
let dataChannel = null;
let currentRoom = null;

function joinRoom() {
    const roomId = document.getElementById('room-id').value.trim();
    if (!roomId) {
        alert('Please enter a room ID');
        return;
    }
    
    currentRoom = roomId;
    socket.emit('join-room', roomId);
    document.getElementById('p2p-status').textContent = 'Connecting...';
}

socket.on('user-connected', (userId) => {
    document.getElementById('p2p-status').textContent = 'Connected to peer';
    createPeerConnection(userId);
});

socket.on('user-disconnected', () => {
    document.getElementById('p2p-status').textContent = 'Peer disconnected';
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
});

function createPeerConnection(userId) {
    const configuration = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' }
        ]
    };
    
    peerConnection = new RTCPeerConnection(configuration);
    
    // Create data channel
    dataChannel = peerConnection.createDataChannel('fileTransfer');
    setupDataChannel(dataChannel);
    
    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            socket.emit('ice-candidate', event.candidate, currentRoom);
        }
    };
    
    // Create and send offer
    peerConnection.createOffer()
        .then(offer => peerConnection.setLocalDescription(offer))
        .then(() => {
            socket.emit('offer', peerConnection.localDescription, currentRoom);
        });
}

socket.on('offer', async (offer, userId) => {
    if (!peerConnection) {
        createPeerConnection(userId);
    }
    
    try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.emit('answer', answer, currentRoom);
    } catch (error) {
        console.error('Error handling offer:', error);
    }
});

socket.on('answer', async (answer) => {
    try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
        console.error('Error handling answer:', error);
    }
});

socket.on('ice-candidate', async (candidate) => {
    try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
        console.error('Error adding ICE candidate:', error);
    }
});

function setupDataChannel(channel) {
    channel.onopen = () => {
        document.getElementById('p2p-status').textContent = 'Data channel open';
    };
    
    channel.onclose = () => {
        document.getElementById('p2p-status').textContent = 'Data channel closed';
    };
    
    channel.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'file') {
            handleReceivedFile(data);
        }
    };
}

// P2P File Dropzone
const p2pDropzone = document.getElementById('p2p-dropzone');
const p2pFileInput = document.getElementById('p2p-file-input');

p2pDropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    p2pDropzone.classList.add('dropzone--over');
});

p2pDropzone.addEventListener('dragleave', () => {
    p2pDropzone.classList.remove('dropzone--over');
});

p2pDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    p2pDropzone.classList.remove('dropzone--over');
    if (e.dataTransfer.files.length) {
        sendFile(e.dataTransfer.files[0]);
    }
});

p2pFileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
        sendFile(e.target.files[0]);
    }
});

function sendFile(file) {
    if (!dataChannel || dataChannel.readyState !== 'open') {
        alert('Not connected to peer');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const data = {
            type: 'file',
            name: file.name,
            size: file.size,
            data: e.target.result
        };
        dataChannel.send(JSON.stringify(data));
    };
    reader.readAsDataURL(file);
}

function handleReceivedFile(data) {
    const link = document.createElement('a');
    link.href = data.data;
    link.download = data.name;
    link.click();
}