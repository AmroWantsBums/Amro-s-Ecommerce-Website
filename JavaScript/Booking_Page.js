document.getElementById('bookingForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Get form values
    const name = this.Name.value.trim();
    const email = this.Email.value.trim();
    const phoneNumber = this.phoneNumber.value.trim();
    const selectedDate = new Date(document.getElementById('dateInput').value);
    const today = new Date();

    // Basic validation
    if (!name || !email || !phoneNumber || !selectedDate) {
        alert("Please fill in all fields.");
        return;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Phone number validation (10 digits)
    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(phoneNumber)) {
        alert("Please enter a valid phone number (10 digits).");
        return;
    }

    // Date validation
    if (selectedDate < today) {
        alert("Please select a date that is today or in the future.");
        return;
    }

    // Display success message
    document.getElementById('message').innerText = `See you on ${selectedDate.toLocaleDateString()}`;
});