// Version: 1.0

var currentVideo = null;
var folderLoaded = false;
var currentSelectedItem = null;

document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for the "Select File" button
    document.getElementById('fileInput').addEventListener('click', function() {
        document.getElementById('fileInputHidden').click();
    });

    document.getElementById('fileInputHidden').addEventListener('change', function(event) {
        var file = event.target.files[0];
        if (file) {
            if (folderLoaded) {
                // If a folder has been loaded, clear the playlist
                clearPlaylist();
                folderLoaded = false;
            }
            loadVideo(file);
        }
    });

	document.getElementById('folderInput').addEventListener('click', function() {
		var input = document.createElement('input');
		input.type = 'file';
		input.setAttribute('webkitdirectory', '');
		input.setAttribute('directory', '');
		input.setAttribute('accept', 'video/mp4, video/ogg, video/avi, video/webm');
		input.addEventListener('change', function(event) {
			var files = event.target.files;
			if (files.length > 0) {
				// Get the folder name and replace underscores with spaces
				var folderName = files[0].webkitRelativePath.split('/')[0].replace(/_/g, ' ');
				document.title = 'LVP - ' + folderName;
				displayPlaylist(files);
				folderLoaded = true;
			}
		});
		input.click();
	});
});

function displayPlaylist(files) {
    var playlistContainer = document.getElementById('playlist');
    playlistContainer.innerHTML = '';

    // Display the playlist header
    var playlistHeader = document.createElement('h3');
    playlistHeader.textContent = 'Playlist';
    playlistContainer.appendChild(playlistHeader);

    // Create nested div for playlist items
    var playlistItemsContainer = document.createElement('div');
    playlistItemsContainer.id = 'playlistItems';
    playlistContainer.appendChild(playlistItemsContainer);

    // Display each video file in the playlist
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (file.type.startsWith('video/mp4')) {
            var videoItem = document.createElement('div');
            var videoTitle = document.createElement('span');
            var fileName = file.name.split('.').slice(0, -1).join('.');
            videoTitle.textContent = fileName;
            videoItem.appendChild(videoTitle);
            playlistItemsContainer.appendChild(videoItem); // Append the playlist item to nested div
            videoItem.addEventListener('mouseover', createMouseOverHandler(fileName)); // Add event listener for mouseover
            videoItem.addEventListener('mouseout', hidePopover); // Add event listener for mouseout to hide popover
            videoItem.addEventListener('click', createPlayEventHandler(file, videoItem)); // Pass videoItem to the event handler
        }
    }

    // Function to create mouseover event handler for each playlist item
    function createMouseOverHandler(title) {
        return function(event) {
            showPopover(event, title);
        };
    }
}



function createPlayEventHandler(file, videoItem) {
    return function() {
        loadVideo(file);
        highlightSelectedItem(videoItem);
    };
}

function loadVideo(file) {
    var video = document.getElementById('videoPlayer');
    var source = document.createElement('source');
    source.src = URL.createObjectURL(file);
    source.type = 'video/mp4';
    video.innerHTML = ''; // Clear any previous sources
    video.appendChild(source);
    video.load();
    video.play(); // Auto-play the new video

    // Update the title and replace underscores with spaces
    var fileName = file.name.split('.').slice(0, -1).join('.').replace(/_/g, ' ');
    document.title = 'LVP - ' + fileName;
}

function highlightSelectedItem(videoItem) {
    if (currentSelectedItem) {
        currentSelectedItem.classList.remove('selected');
    }
    videoItem.classList.add('selected');
    currentSelectedItem = videoItem;
}

function clearPlaylist() {
    var playlistContainer = document.getElementById('playlist');
    playlistContainer.innerHTML = '';
}

// Function to create and show the popover
function showPopover(event, title) {
    hidePopover(); // Ensure only one popover is shown at a time
    var popover = document.createElement('div');
    popover.className = 'popover';
    popover.textContent = title;
	
    // Position the popover at the top left corner of the viewport
    popover.style.bottom = '0';
    popover.style.left = '0';
    document.body.appendChild(popover);
}

// Function to hide the popover
function hidePopover() {
    var popover = document.querySelector('.popover');
    if (popover) {
        popover.remove();
    }
}