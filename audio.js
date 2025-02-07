document.addEventListener('DOMContentLoaded', () => {
    // Debug check for WaveSurfer
    if (!WaveSurfer) {
        console.error('WaveSurfer is not loaded');
        return;
    }
    console.log('WaveSurfer version:', WaveSurfer.VERSION);

    // Initialize WaveSurfer with enhanced visualization
    const wavesurfer = WaveSurfer.create({
        container: '#waveform',
        height: 128,
        waveColor: 'rgba(74, 144, 226, 0.5)',
        progressColor: 'rgba(99, 245, 170, 0.8)',
        cursorColor: '#ffffff',
        normalize: true,
        backend: 'WebAudio',
        responsive: true,
        barWidth: 3,
        barGap: 2,
        barRadius: 3,
        barHeight: 0.8,
        barMinHeight: 3,
        peaks: true,
        cursorWidth: 2,
        fillParent: true,
        interact: true,
        splitChannels: false,
        autoCenter: true,
        hideScrollbar: true,
        waveform: true,
        // Create gradient effect
        drawingEffect: (ctx, position, width, height) => {
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, 'rgba(99, 245, 170, 0.3)');  // Cyan top
            gradient.addColorStop(0.5, 'rgba(74, 144, 226, 0.5)'); // Blue middle
            gradient.addColorStop(1, 'rgba(147, 112, 219, 0.3)');  // Purple bottom
            ctx.fillStyle = gradient;
        }
    });

    // Get the audio element
    const audio = document.querySelector('#keplerAudio');

    // Load the audio file
    wavesurfer.load('./kepler_sonification.wav');

    // Add visual effects during playback
    wavesurfer.on('audioprocess', () => {
        const progress = wavesurfer.getCurrentTime() / wavesurfer.getDuration();
        updateVisualization(progress);
    });

    // Debug loading process
    wavesurfer.on('loading', (percent) => {
        console.log('Loading:', percent + '%');
    });

    wavesurfer.on('ready', () => {
        console.log('WaveSurfer is ready');
        // Add initial glow effect
        const container = document.querySelector('.waveform-container');
        container.style.boxShadow = '0 0 20px rgba(74, 144, 226, 0.3)';
    });

    // Basic audio sync with enhanced visual feedback
    audio.addEventListener('play', () => {
        wavesurfer.play();
        addPlayingEffect();
    });

    audio.addEventListener('pause', () => {
        wavesurfer.pause();
        removePlayingEffect();
    });

    audio.addEventListener('seeked', () => {
        const progress = audio.currentTime / audio.duration;
        wavesurfer.seekTo(progress);
    });

    // Visual enhancement functions
    function addPlayingEffect() {
        const container = document.querySelector('.waveform-container');
        container.style.boxShadow = '0 0 30px rgba(99, 245, 170, 0.4)';
        container.style.transition = 'box-shadow 0.3s ease';
    }

    function removePlayingEffect() {
        const container = document.querySelector('.waveform-container');
        container.style.boxShadow = '0 0 20px rgba(74, 144, 226, 0.3)';
    }

    function updateVisualization(progress) {
        const container = document.querySelector('.waveform-container');
        const hue = Math.floor(progress * 360);
        container.style.boxShadow = `0 0 30px rgba(99, 245, 170, ${0.3 + Math.sin(progress * Math.PI) * 0.2})`;
    }
});