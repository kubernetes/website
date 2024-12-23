// The page and script is loaded successfully
$(document).ready(function() {
    // Function to handle hover over <figure> elements
    function handleFigureHover() {
        // Only change cursor to zoom-in if figure has 'clickable-zoom' class
        if ($(this).hasClass('clickable-zoom') && !$(this).hasClass('figure-fullscreen-content')) {
            $(this).css('cursor', 'zoom-in');
        }
    }

    // Attach hover event to <figure> elements with 'clickable-zoom' class
    $('figure.clickable-zoom').hover(handleFigureHover, function() {
        // Mouse out - revert cursor back to default
        $(this).css('cursor', 'default');
    });

    // Attach click event to <figure> elements with 'clickable-zoom' class
    $('figure.clickable-zoom').click(function() {
        var $figure = $(this);

        // Check if the figure has 'clickable-zoom' class
        if ($figure.hasClass('clickable-zoom')) {
            var $img = $figure.find('img'); // Get the <img> element within the clicked <figure>

            // Toggle 'figure-zoomed' class to scale the image
            $img.toggleClass('figure-zoomed');

            // Create a full-screen overlay
            var $fullscreenOverlay = $('<div class="figure-fullscreen-overlay"></div>');

            // Clone the <img> element to display in full-screen
            var $fullscreenImg = $img.clone();
            $fullscreenImg.addClass('figure-fullscreen-img');

            // Append the full-screen image to the overlay
            $fullscreenOverlay.append($fullscreenImg);

            // Create a close button for the full-screen overlay
            var $closeButton = $('<span class="figure-close-button">&times;</span>');
            $closeButton.click(function() {
                // Remove the full-screen overlay when close button is clicked
                $fullscreenOverlay.remove();
                $('body').css('overflow', 'auto'); // Restore scrolling to the underlying page

                // Remove 'figure-zoomed' class to reset image scale
                $img.removeClass('figure-zoomed');
            });
            $fullscreenOverlay.append($closeButton);

            // Append the overlay to the body
            $('body').append($fullscreenOverlay);

            // Disable scrolling on the underlying page
            $('body').css('overflow', 'hidden');

            // Close full-screen figure when clicking outside of it (on the overlay)
            $fullscreenOverlay.click(function(event) {
                if (event.target === this) {
                    // Clicked on the overlay area (outside the full-screen image)
                    $fullscreenOverlay.remove();
                    $('body').css('overflow', 'auto'); // Restore scrolling to the underlying page

                    // Remove 'figure-zoomed' class to reset image scale
                    $img.removeClass('figure-zoomed');
                }
            });
        }
    });
});
