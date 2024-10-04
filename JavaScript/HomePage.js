document.addEventListener('DOMContentLoaded', () => {
    const enterButton = document.getElementById('enterButton');
    const textElements = document.querySelectorAll('.text');
    const ferrariHorse = document.getElementById('ferrariHorse');
    const videoContainer = document.getElementById('videoContainer');
    const backgroundVideo = document.getElementById('backgroundVideo');
    const audio = document.getElementById('engineStartupAudio');
    const backgroundAudio = document.getElementById('backgroundAudio');



    enterButton.addEventListener('click', () => {
        textElements.forEach(element => {
            element.style.opacity = 0; 
            element.style.transition = 'opacity 0.5s ease';
        });

        ferrariHorse.style.opacity = 0; 
        ferrariHorse.style.transition = 'opacity 0.5s ease';
        enterButton.style.opacity = 0; 
        enterButton.style.transition = 'opacity 0.5s ease';
        backgroundAudio.play();
           
        backgroundAudio.volume = 0.7;
        
        setTimeout(() => {
            ferrariText.style.transition = 'transform 1s ease'; // Set transition for transform
            ferrariText.style.transform = 'translate(0px, 100px) rotate(-45deg) scale(2.6)';
        }, 1000);

        setTimeout(() => {
            ferrariText.style.opacity = 0; 
            ferrariText.style.transition = 'opacity 1s ease'; 
        }, 2600); 

        setTimeout(() => {
            videoContainer.style.display = 'block';
            backgroundVideo.play();
        }, 3000);

        setTimeout(() => {
            audio.play();        
            audio.volume = 1;
        }, 8200)


        backgroundVideo.addEventListener('ended', () => {
            //window.location.href = `./Gallery/Gallery.html`;
        });
    });
});
