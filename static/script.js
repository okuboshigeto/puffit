document.addEventListener('DOMContentLoaded', function() {
    const tabaccoTab = document.getElementById('tabacco-tab');
    const shishaTab = document.getElementById('shisha-tab');
    const tabaccoContent = document.getElementById('tabacco-content');
    const shishaContent = document.getElementById('shisha-content');

    tabaccoTab.addEventListener('click', function() {
        tabaccoContent.style.display = 'block';
        shishaContent.style.display = 'none';
    });

    shishaTab.addEventListener('click', function() {
        shishaContent.style.display = 'block';
        tabaccoContent.style.display = 'none';
    });

    // 初期表示設定
    tabaccoContent.style.display = 'block';
    shishaContent.style.display = 'none';
});
