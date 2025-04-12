document.addEventListener('DOMContentLoaded', function() {
    const tabaccoTab = document.getElementById('tabacco-tab');
    const shishaTab = document.getElementById('shisha-tab');
    const tabaccoContent = document.getElementById('tabacco-content');
    const shishaContent = document.getElementById('shisha-content');

    // タブ切り替えの動作（遅延を含めてopacityのアニメーションを正常に表示させる）
    function showContent(contentToShow, contentToHide) {
        contentToHide.style.opacity = '0';
        setTimeout(() => {
            contentToHide.style.display = 'none';
            contentToShow.style.display = 'block';
            setTimeout(() => {
                contentToShow.style.opacity = '1';
            }, 10); // 少し遅延を入れてopacityを変更（10ms）
        }, 500); // opacityのトランジション時間と一致（500ms）
    }

    tabaccoTab.addEventListener('click', function() {
        showContent(tabaccoContent, shishaContent);
    });

    shishaTab.addEventListener('click', function() {
        showContent(shishaContent, tabaccoContent);
    });

    // 初期表示設定
    tabaccoContent.style.display = 'block';
    tabaccoContent.style.opacity = '1';
    shishaContent.style.display = 'none';
});