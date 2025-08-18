// Function to adjust image size dynamically
function adjustImageSize() {
    var images = document.querySelectorAll('.image-display');
    images.forEach(function(image) {
        var aspectRatio = image.naturalWidth / image.naturalHeight;
        var maxHeight = 400;
        var maxWidth = maxHeight * aspectRatio;
        image.style.maxWidth = maxWidth + 'px';
    });
}

// when the page load
window.addEventListener('load', function() {
    adjustImageSize();
});

// when the window is resized
window.addEventListener('resize', function() {
    adjustImageSize();
});
