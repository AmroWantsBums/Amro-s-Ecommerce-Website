// Wait for the DOM to fully load before running the script
document.addEventListener('DOMContentLoaded', () => {
    const enterButton = document.getElementById('enterButton'); // Get the button to enter
    const textElements = document.querySelectorAll('.text'); // Select all text elements
    const ferrariHorse = document.getElementById('ferrariHorse'); // Get the Ferrari horse image
    const videoContainer = document.getElementById('videoContainer'); // Get the video container
    const backgroundVideo = document.getElementById('backgroundVideo'); // Get the background video
    const audio = document.getElementById('engineStartupAudio'); // Get the engine startup audio
    const backgroundAudio = document.getElementById('backgroundAudio'); // Get the background audio


    // Add a click event to the enter button
    enterButton.addEventListener('click', () => {
        // Fade out all text elements
        textElements.forEach(element => {
            element.style.opacity = 0; 
            element.style.transition = 'opacity 0.5s ease'; // Smooth transition for opacity
        });

        // Fade out the Ferrari horse image and the enter button
        ferrariHorse.style.opacity = 0; 
        ferrariHorse.style.transition = 'opacity 0.5s ease'; 
        enterButton.style.opacity = 0; 
        enterButton.style.transition = 'opacity 0.5s ease'; 

        // Start playing the background audio
        backgroundAudio.play();
        backgroundAudio.volume = 0.7; // Set volume for the background audio
        
        // After 1 second, animate the Ferrari text
        setTimeout(() => {
            ferrariText.style.transition = 'transform 1s ease'; // Smooth transform transition
            ferrariText.style.transform = 'translate(0px, 100px) rotate(-45deg) scale(2.6)'; // Move and scale the text
        }, 1000);

        // After 2.6 seconds, fade out the Ferrari text
        setTimeout(() => {
            ferrariText.style.opacity = 0; 
            ferrariText.style.transition = 'opacity 1s ease'; // Smooth transition for opacity
        }, 2600); 

        // After 3 seconds, show the video container and play the background video
        setTimeout(() => {
            videoContainer.style.display = 'block';
            backgroundVideo.play();
        }, 3000);

        // After 8.2 seconds, play the engine startup audio
        setTimeout(() => {
            audio.play();        
            audio.volume = 1; // Set volume to max for the startup sound
        }, 8200)


        // When the background video ends, redirect to the gallery page
        backgroundVideo.addEventListener('ended', () => {
            window.location.href = `./Gallery/Gallery.html`; // Change to gallery page
        });
    });
});
