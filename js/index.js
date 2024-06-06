// Function to maintain the aspect ratio of the iframe based on the video
function setIframeHeight() {
    const iframe = document.getElementById('videoPlayerIframe');
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    const video = iframeDocument.querySelector('video');

    if (video) {
        // Ensure the video has loaded enough metadata to get its dimensions
        video.onloadedmetadata = function() {
            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;
            const iframeWidth = iframe.offsetWidth;
            const defaultHeight = (iframeWidth * 9) / 16;

            // Check if video height is greater than width
            if (videoHeight > videoWidth) {
                const height = defaultHeight; // Maintain 16:9 aspect ratio for the iframe
                iframe.style.height = `${height}px`;
                // Add logic to resize the video within the iframe if necessary
                video.style.width = 'auto';
                video.style.height = '100%';
            } else {
                const height = (iframeWidth * videoHeight) / videoWidth; // Maintain video aspect ratio
                iframe.style.height = `${height}px`;
                video.style.width = '100%';
                video.style.height = 'auto';
            }
        };
    } else {
        // Default to 16:9 aspect ratio if no video is present
        const iframeWidth = iframe.offsetWidth;
        const height = (iframeWidth * 9) / 16;
        iframe.style.height = `${height}px`;
    }
}

// Set the iframe height on load and on window resize
window.onload = setIframeHeight;
window.onresize = setIframeHeight;

// Initial call to set iframe height for default 16:9 ratio
setIframeHeight();
