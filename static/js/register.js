const showLabel = document.getElementById('show-text'),
    showCheckbox = document.getElementById('show-password'),
    emailInput = document.getElementById('email-input'),
    passwordInput = document.getElementById('password-input'),
    confirmInput = document.getElementById('confirm-input'),
    tokenInput = document.getElementById('token-input'),
    nameInput = document.getElementById('name-input');

const errorBox = document.getElementById('error-box'),
      successBox = document.getElementById('success-box');

function logError(value) {
    successBox.innerHTML = '';
    errorBox.innerHTML = value;
    setTimeout(() => errorBox.innerHTML = '', '30000');
}

function logSuccess(value) {
    errorBox.innerHTML = '';
    successBox.innerHTML = value;
    setTimeout(() => successBox.innerHTML = '', '30000');
}

function showPassword() {
    if (showCheckbox.checked){
        showLabel.innerHTML = 'Hide';
        passwordInput.type = 'text';
        confirmInput.type = 'text';
    }
    else{
        showLabel.innerHTML = 'Show';
        passwordInput.type = 'password';
        confirmInput.type = 'password';
    }
}

function verify(event) {
    event.preventDefault();

    if (emailInput.value.substring(emailInput.value.length - 8, emailInput.value.length) != '@hdsb.ca') {
        logError('The email you entered is either invalid or not an HDSB email.');
        return
    }

    $.ajax({
        url: '/send-verify-email',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ 'email' : emailInput.value }),
        success: function(response) {
            if (response.result == 'database error')          
                logError('There was an error with the database, please try again later.');      
            else if (response.result == 'user already exists')
                logError('Email already used.');
            else
                logSuccess(`Verification email sent to ${emailInput.value}.`);
        },
        error: function(xhr, status, error) {
            console.error('Error: ', error);
        }
    });
}

function createAccount(event) {
    event.preventDefault();

    if (!emailInput.value || !nameInput.value || !tokenInput.value || !passwordInput.value) {
        logError('Please fill in all the fields.');
        return;
    }

    if (!/^[a-zA-Z\s]+$/.test(nameInput.value)) {
        logError('Your name can only contain letters.');
        return;
    }

    if (passwordInput.value != confirmInput.value) {
        logError('Passwords must match.');
        return;
    }

    $.ajax({
        url: '/create-account',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ 'email' : emailInput.value,
                               'name' : nameInput.value,
                               'token' : tokenInput.value,
                               'password' : passwordInput.value }),
        success: function(response) {
            if (response.result == 'database error')                
                logError('There was an error with the database, please try again later.');      
            else if (response.result == 'token mismatch')
                logError('The token does not match the token given.');
            else
                window.location.href = `${url}/login`;
                // logSuccess('Account successfully created');
        },
        error: function(xhr, status, error) {
            console.error('Error: ', error);
        }
    });
}