document.addEventListener('DOMContentLoaded', function () {
    filterImages('all');
});

function filterImages(category) {
    const images = document.querySelectorAll('.kuvat');

    // Piilota kaikki kuvat
    images.forEach(img => {
        img.style.display = 'none';
    });

    // Näytä kuvat valitun kategorian perusteella
    if (category === 'all') {
        images.forEach(img => {
            img.style.display = 'block';
        });
    } else {
        const filteredImages = document.querySelectorAll(`.kuvat[data-category="${category}"]`);
        filteredImages.forEach(img => {
            img.style.display = 'block';
        });
    }
}

function setActiveTab(selectedTab) {
    // Poista 'active-tab' luokka kaikilta välilehdiltä
    document.querySelectorAll('.ylätekstit label').forEach(label => {
        label.classList.remove('active-tab');
    });

    // Lisää 'active-tab' luokka valitulle välilehdelle
    selectedTab.classList.add('active-tab');
}