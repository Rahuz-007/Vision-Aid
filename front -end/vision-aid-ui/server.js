const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'build')));

// Handle all routes by serving index.html (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Frontend server running on port ${PORT}`);
    console.log(`Navigate to http://localhost:${PORT}`);
});
