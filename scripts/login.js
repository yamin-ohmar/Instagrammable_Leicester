var attempt = 3;

// function to validate the login credentials
function validate() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    
    // Check if the username exists in localStorage
    if (localStorage.getItem(username)) {
        // Retrieve the stored password for the entered username
        var storedCredentials = JSON.parse(localStorage.getItem(username));
        var storedPassword = storedCredentials.password;
        
        // Check if the entered password matches the stored password
        if (password === storedPassword) {
            alert("Login successful");

            // Set login flag and current username to local storage
            localStorage.setItem("loggedIn", "true");
            localStorage.setItem("currentUser", username);

            window.location = "../index.html";
            return false;
        } else {
			attempt--;
            alert("Incorrect password. Please try again. You have left " + attempt + " attempts.");
        }
    } else {
        alert("Username does not exist. Please sign up first.");
    }
    
    if (attempt === 0) {
        document.getElementById("username").disabled = true;
        document.getElementById("password").disabled = true;
        document.getElementById("login_submit").disabled = true;
    }
}

// function to handle signup
function signup() {
    var new_username = document.getElementById("new_username").value;
    var new_password = document.getElementById("new_password").value;
    var confirm_password = document.getElementById("confirm_password").value;

    if (new_username && new_password && confirm_password) {
        if (new_password !== confirm_password) {
            alert("Passwords do not match. Please re-enter the password.");
            return;
        }

        // Check if the username already exists in localStorage
        if (localStorage.getItem(new_username)) {
            alert("Username already exists. Please choose a different username.");
        } else {
            // Store the new username and password in localStorage
            localStorage.setItem(new_username, JSON.stringify({ username: new_username, password: new_password }));
            alert("Sign up successful! You are now logged in.");

            // Set login flag and current username to local storage
            localStorage.setItem("loggedIn", "true");
            localStorage.setItem("currentUser", new_username);

            window.location = "../index.html";
        }
    } else {
        alert("Please enter all fields.");
    }
}


// function to check if the user is logged in or signed out
function checkLogin() {
    var isLoggedIn = localStorage.getItem("loggedIn");
    var curUser = localStorage.getItem("currentUser");

    if (isLoggedIn) {
        console.log("Checked loggedIn flag is TRUE.");
        // If user is logged in, change the login button to user button
        var loginButton = document.getElementById("loginButton");
        if (loginButton) {
            // Get the path of the current page
            var currentPagePath = window.location.pathname;
            // Construct the URL for the profile page relative to the current page's location
            var profilePageURL;
            if (currentPagePath.includes("pages")) {
                profilePageURL = "profile.html";
            } else {
                profilePageURL = "pages/profile.html";
            }
            // Set the href attribute of the login button to the profile page URL
            loginButton.href = profilePageURL;
            loginButton.innerHTML = curUser;
        }
    }
}

// function to handle sign out
function signOut() {
    // Display a confirmation dialog
    var confirmSignOut = confirm("Are you sure you want to sign out?");
    // Check if the user confirmed the sign-out action
    if (confirmSignOut) {
        alert("You have successfully signed out.");

        // Clear the loggedIn flag and current username from localStorage
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("currentUser");
        
        // Redirect to the index.html page
        window.location = "../index.html";
    } else {
        // If the user cancels, do nothing
        console.log("Sign out canceled by user.");
        window.location = "profile.html";
    }
}

// Function to toggle between CSS style sheets for accessibility
function swapStyleSheet(sheet) {

    // Get the path of the current page
    var currentPagePath = window.location.pathname;

    // Construct the URL for the CSS style sheet relative to the current page's location
    var cssFolderURL;
    if (currentPagePath.includes("pages")) {
        cssFolderURL = "../css/";
    } else {
        cssFolderURL = "css/";
    }
    document.getElementById("pagestyle").setAttribute("href", cssFolderURL + sheet);

    // Remove the 'pressed' class from all accessibility buttons
    var button1 = document.getElementById('navbarButton1');
    var button2 = document.getElementById('navbarButton2');
    button1.classList.remove('pressed');
    button2.classList.remove('pressed');
    // Add the 'pressed' class to the clicked button
    event.currentTarget.classList.add('pressed');
}

// When the page loads
window.onload = function() {
    checkLogin();
    
    // Add the 'pressed' class to navbarButton1
    var button1 = document.getElementById('navbarButton1');
    button1.classList.add('pressed');
};

