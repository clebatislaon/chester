// scripts.js
document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    document.getElementById('home-link').addEventListener('click', showSection.bind(null, 'home'));
    document.getElementById('calendar-link').addEventListener('click', showSection.bind(null, 'calendar'));
    document.getElementById('music-link').addEventListener('click', showSection.bind(null, 'music'));

    // Calendar functionality
    let calendar;
    let calendarEl = document.getElementById('calendar-container');
    if (calendarEl) {
        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            events: JSON.parse(localStorage.getItem('calendarEvents') || '[]'),
            editable: true,
            eventClick: function(info) {
                let event = info.event;
                let action = prompt("Enter 'edit' to modify the event, or 'delete' to remove it:");
                
                if (action === 'edit') {
                    let newTitle = prompt("Edit event title:", event.title);
                    let newStart = prompt("Edit start date (YYYY-MM-DD):", event.start.toISOString().split('T')[0]);
                    
                    if (newTitle !== null && newStart !== null) {
                        event.setProp('title', newTitle);
                        event.setStart(newStart);
                        saveEvents();
                    }
                } else if (action === 'delete') {
                    if (confirm("Are you sure you want to delete this event?")) {
                        event.remove();
                        saveEvents();
                    }
                }
            }
        });
        calendar.render();
    }

    document.getElementById('add-event').addEventListener('click', function() {
        let title = prompt("Enter event title:");
        let start = prompt("Enter start date (YYYY-MM-DD):");
        if (title && start) {
            calendar.addEvent({
                title: title,
                start: start
            });
            saveEvents();
        }
    });

    function saveEvents() {
        let events = calendar.getEvents().map(e => ({
            title: e.title,
            start: e.start.toISOString()
        }));
        localStorage.setItem('calendarEvents', JSON.stringify(events));
    }

    // Music player functionality
    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('play-pause');
    const prevTrackBtn = document.getElementById('prev-track');
    const nextTrackBtn = document.getElementById('next-track');
    const volumeControl = document.getElementById('volume-control');
    const fileUpload = document.getElementById('file-upload');
    const playlist = document.createElement('ul');
    playlist.className = 'playlist mt-3';
    document.getElementById('music-player').appendChild(playlist);

    let tracks = [
        { name: "Track 1", src: "path/to/track1.mp3" },
        { name: "Track 2", src: "path/to/track2.mp3" },
        { name: "Track 3", src: "path/to/track3.mp3" }
    ];
    
    let currentTrackIndex = 0;

    function loadTrack(index) {
        audioPlayer.src = tracks[index].src;
        audioPlayer.load();
        updatePlaylist();
    }

    function updatePlaylist() {
        playlist.innerHTML = '';
        tracks.forEach((track, index) => {
            const li = document.createElement('li');
            li.textContent = track.name;
            li.className = index === currentTrackIndex ? 'active' : '';
            li.addEventListener('click', () => {
                currentTrackIndex = index;
                loadTrack(currentTrackIndex);
                audioPlayer.play();
            });
            playlist.appendChild(li);
        });
    }

    loadTrack(currentTrackIndex);

    playPauseBtn.addEventListener('click', function() {
        if (audioPlayer.paused) {
            audioPlayer.play();
        } else {
            audioPlayer.pause();
        }
    });

    prevTrackBtn.addEventListener('click', function() {
        currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        loadTrack(currentTrackIndex);
        audioPlayer.play();
    });

    nextTrackBtn.addEventListener('click', function() {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        loadTrack(currentTrackIndex);
        audioPlayer.play();
    });

    volumeControl.addEventListener('input', function() {
        audioPlayer.volume = this.value / 100;
    });

    fileUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const fileURL = URL.createObjectURL(file);
            tracks.push({ name: file.name, src: fileURL });
            updatePlaylist();
        }
    });

    function showSection(sectionId) {
        document.querySelectorAll('main > section').forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById(sectionId).style.display = 'block';
        if (sectionId === 'calendar' && calendar) {
            calendar.render();
        }
    }

    // Automatically play the first track when the page loads
    audioPlayer.play().catch(e => console.log("Auto-play prevented. User interaction required."));
});