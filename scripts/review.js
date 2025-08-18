
// Get all login buttons and add event listener to each login button
var loginButtons = document.querySelectorAll(".loginReviewBtn");
loginButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        // Redirect the user to the login.html page
        window.location.href = "pages/login.html";
    });
});

// Get all textarea elements and add event listener to each textarea
var textAreas = document.querySelectorAll(".review-form textarea");
textAreas.forEach(function(textArea) {
    textArea.addEventListener("focus", function() {
        this.removeAttribute("placeholder");
    });

    textArea.addEventListener("blur", function() {
        if (!this.value) {
        this.setAttribute("placeholder", "Please leave a review about this place...");
        }
    });
});

// Event listener for character count
document.addEventListener('DOMContentLoaded', function() {
    // Loop through each textarea element
    textAreas.forEach(function(textarea) {
        // Get related elements for this textarea
        var charCount = textarea.parentElement.querySelector('.char-count');
        var submitButton = textarea.parentElement.parentElement.querySelector('.submitReviewBtn');
        var maxLength = 250;

        // Add input event listener to the textarea
        textarea.addEventListener('input', function() {
            var count = this.value.length;
            charCount.textContent = count + ' / ' + maxLength;

            // condition for character count display
            if (count > maxLength) {
                charCount.classList.add('over-limit');
            } else {
                charCount.classList.remove('over-limit');
            }

            // condition for button display
            if (count === 0 || count > maxLength) {
                submitButton.disabled = true;
            } else {
                submitButton.disabled = false;
            }
        });
    });
});

// Function to create a review list item
function createReviewListItem(review) {
    // Create list item
    var li = document.createElement("li");

    // Create container for user icon and user info
    var userInfoContainer = document.createElement("div");
    userInfoContainer.className = "user-info-container";

    // Create user icon
    var userIcon = document.createElement("img");
    userIcon.src = "images/user.png";
    userIcon.alt = "User";
    userIcon.className = "review-user-icon";

    // Create user name and date & time
    var userInfo = document.createElement("div");
    userInfo.textContent = review.username + " (" + review.date + " " + review.time + ")";
    userInfo.className = "user-info";

    // Append user icon and user info to container
    userInfoContainer.appendChild(userIcon);
    userInfoContainer.appendChild(userInfo);

    // Append container to list item
    li.appendChild(userInfoContainer);

    // Create review content
    var reviewContent = document.createElement("div");
    reviewContent.textContent = review.review;
    reviewContent.className = "review-content";

    // Append review content to list item
    li.appendChild(reviewContent);

    // Get username
    var curUser = localStorage.getItem("currentUser");

    // Create delete button for each review
    if (curUser === review.username) {
        // Create delete button for the user's own review
        var deleteButton = document.createElement("button");
        deleteButton.className = "btn btn-dark delete-review-btn";
        deleteButton.innerHTML = '<i class="fa fa-trash-o"></i>';
        deleteButton.setAttribute("data-username", review.username);
        deleteButton.setAttribute("data-review", JSON.stringify(review));

        // Append delete button to list item
        li.appendChild(deleteButton);
    }

    // Add margin-bottom to list item for spacing
    li.style.marginBottom = "20px";

    return li;
}

// Function to toggle button visibility
function toggleButtonVisibility(button, isVisible) {
    if (isVisible) {
        button.style.display = "block";
    } else {
        button.style.display = "none";
    }
}

// Function to update the review list
function updateReviewList(listItemClass) {
    var loadMoreButton;
    var showLesserButton;

    // Retrieve reviews from localStorage
    var reviews = JSON.parse(localStorage.getItem(listItemClass + "_reviews")) || [];
    var reviewList = document.querySelector("." + listItemClass + " .review-list");
    var loadMoreButton = reviewList.parentNode.querySelector(".load-more-reviews-btn");
    var showLessButton = reviewList.parentNode.querySelector(".show-lesser-reviews-btn");

    // Clear existing reviews
    reviewList.innerHTML = "";

    var numReviewsToShow = Math.min(reviews.length, 3);
    // Render each review in reverse order
    for (var i = reviews.length - 1; i >= reviews.length - numReviewsToShow; i--) {
        var review = reviews[i];

        // Create list item
        var li = createReviewListItem(review);

        // Append list item to review list
        reviewList.appendChild(li);
    }
    attachDeleteListener();

    // If there are more than 3 reviews, show the "Load more reviews" button
    if (reviews.length > 3) {
        toggleButtonVisibility(loadMoreButton, true);
    }

    // Event listener for "Load more reviews" button
    loadMoreButton.addEventListener("click", function() {
        // Render and append the rest of the reviews
        for (var j = reviews.length - numReviewsToShow - 1; j >= 0; j--) {
            var review = reviews[j];
            var li = createReviewListItem(review);
            reviewList.appendChild(li);
        }
        attachDeleteListener();
        // Hide the "Load more reviews" button
        toggleButtonVisibility(loadMoreButton, false);
        // Show the "Show lesser reviews" button
        toggleButtonVisibility(showLessButton, true);
    });

    // Event listener for "Show lesser reviews" button
    showLessButton.addEventListener("click", function() {
        // Clear the review list
        reviewList.innerHTML = "";
        // Render only the top 3 reviews
        for (var i = reviews.length - 1; i >= reviews.length - numReviewsToShow; i--) {
            var review = reviews[i];
            var li = createReviewListItem(review);
            reviewList.appendChild(li);
        }
        attachDeleteListener();
        // Hide the "Show lesser reviews" button
        toggleButtonVisibility(showLessButton, false);
        // Show the "Load more reviews" button
        toggleButtonVisibility(loadMoreButton, true);
    });

    // Attach event listener to delete buttons
    function attachDeleteListener() {
        var deleteButtons = reviewList.querySelectorAll(".delete-review-btn");
        deleteButtons.forEach(function(deleteButton) {
            // Remove existing event listeners
            deleteButton.removeEventListener("click", deleteReview);

            // Add new event listener
            deleteButton.addEventListener("click", deleteReview);
        });
    }

    // Function to handle delete review
    function deleteReview() {
        if (confirm("Are you sure you want to delete this review?")) {
            // Get review data from the delete button
            var reviewData = JSON.parse(this.getAttribute("data-review"));

            // Find the index of the review to be deleted
            var reviewIndex = reviews.findIndex(function(existingReview) {
                return existingReview.review === reviewData.review &&
                    existingReview.date === reviewData.date &&
                    existingReview.time === reviewData.time;
            });

            // If review found, remove it from the array and update localStorage
            if (reviewIndex !== -1) {
                reviews.splice(reviewIndex, 1);
                localStorage.setItem(listItemClass + "_reviews", JSON.stringify(reviews));
                
                // Remove the review list item from the DOM
                this.closest("li").remove();

                // Reload the page
                window.location.reload();
            } else {
                console.log("Review not found in the existing reviews array.");
            }
        }
    }
}

// Event for submit buttons
document.addEventListener("click", function(event) {
    if (event.target && event.target.classList.contains("submitReviewBtn")) {
        // Get review text
        var review = event.target.closest("li").querySelector("#reviewInput").value;
        // Get username
        var curUser = localStorage.getItem("currentUser");
        // Get the class of the list item
        var listItemClass = event.target.closest("li").classList[0];
        // Get current date and time
        var currentDate = new Date().toISOString().split('T')[0];
        var currentTime = new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' });
        
        // Create review object
        var newReview = {
            review: review,
            username: curUser,
            date: currentDate,
            time: currentTime
        };

        // Retrieve existing reviews from localStorage
        var existingReviews = JSON.parse(localStorage.getItem(listItemClass + "_reviews")) || [];
        // Add new review to existing reviews
        existingReviews.push(newReview);
        // Store updated reviews back to localStorage
        localStorage.setItem(listItemClass + "_reviews", JSON.stringify(existingReviews));
        // Clear review input
        event.target.closest("li").querySelector("#reviewInput").value = "";
        // Reload the page
        window.location.reload();
    }
});


// Count the total number of reviews for each location and update the review count in the HTML
function updateReviewCount() {
    var listItems = document.querySelectorAll('.list-locations > li');
    listItems.forEach(function(listItem) {
        var reviewList = listItem.querySelector('.review-list');
        var existingReviews = JSON.parse(localStorage.getItem(listItem.classList[0] + "_reviews")) || [];
        var reviewCount = existingReviews.length;
        var reviewCountElement = listItem.querySelector('.review-count');
        reviewCountElement.textContent = reviewCount + ' Review(s)';
    });
}

// when the page loads
window.addEventListener("load", function() {
    var isLoggedIn = localStorage.getItem("loggedIn");

    // if the user is logged in
    if (isLoggedIn) {
        // change the placeholder text
        var textareaElements = document.querySelectorAll("textarea.review-input");
        textareaElements.forEach(function(textarea) {
            textarea.placeholder = "Please leave a review about this place...";
            textarea.removeAttribute("disabled");
        });

        // Enable submit review button
        var submitButtons = document.querySelectorAll(".submitReviewBtn");
        submitButtons.forEach(function(button) {
            button.style.display = "block";
        });

        // Hide login for review button
        var loginForReviewButtons = document.querySelectorAll(".loginReviewBtn");
        loginForReviewButtons.forEach(function(button) {
            button.style.display = "none";
        });

        // Loop through each review section and update its review list to display
        var locations = document.querySelectorAll('.list-locations > li');
        locations.forEach(function(location) {
            var listItemClass = location.classList[0];
            updateReviewList(listItemClass);
        });
    } else {
        // User is not logged in, disable the textarea
        var reviewInput = document.getElementById("reviewInput");
        if (reviewInput) {
            reviewInput.setAttribute("disabled", "disabled");
            reviewInput.style.backgroundColor = "#f2f2f2"; // Gray out background color
        }
    }

    updateReviewCount();
});
