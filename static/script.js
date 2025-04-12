document.addEventListener('DOMContentLoaded', function() {
    const tabaccoTab = document.getElementById('tabacco-tab');
    const shishaTab = document.getElementById('shisha-tab');
    const tabaccoContent = document.getElementById('tabacco-content');
    const shishaContent = document.getElementById('shisha-content');
    const toggleFormButton = document.getElementById('toggle-form');

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

    // シーシャのフォームのイベントリスナー
    const shishaForm = document.getElementById('shisha-form');
    shishaForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const flavorType = document.getElementById('flavor-type').value;
        const flavorName = document.getElementById('flavor-name').value;
        const flavorRating = document.getElementById('flavor-rating').value;
        const flavorComment = document.getElementById('flavor-comment').value;

        fetch('/submit-flavor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                flavorType: flavorType,
                flavorName: flavorName,
                flavorRating: flavorRating,
                flavorComment: flavorComment
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            // フォームをリセット
            shishaForm.reset();
            // フレーバー一覧を更新
            loadFlavors();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });

    // フレーバー一覧を取得して表示
    function loadFlavors() {
        fetch('/get-flavors')
            .then(response => response.json())
            .then(data => {
                const flavorList = document.getElementById('flavor-list');
                flavorList.innerHTML = ''; // 既存のリストをクリア

                data.forEach(flavor => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `カテゴリ: ${flavor[0]}, 名前: ${flavor[1]}, 評価: ${flavor[2]}, コメント: ${flavor[3]}`;
                    flavorList.appendChild(listItem);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // フォーム送信後にフレーバー一覧を更新
    shishaForm.addEventListener('submit', function() {
        loadFlavors();
    });

    // 初期ロード時にフレーバー一覧を表示
    loadFlavors();

    // フレーバータイプとフレーバー名の選択肢をロード
    function loadFlavorOptions() {
        fetch('/get-flavor-options')
            .then(response => response.json())
            .then(data => {
                const flavorTypeSelect = document.getElementById('flavor-type');
                const flavorNameSelect = document.getElementById('flavor-name');

                data.flavor_types.forEach(type => {
                    const option = document.createElement('option');
                    option.value = type[0];
                    option.textContent = type[1];
                    flavorTypeSelect.appendChild(option);
                });

                data.flavor_names.forEach(name => {
                    const option = document.createElement('option');
                    option.value = name[0];
                    option.textContent = name[1];
                    flavorNameSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    loadFlavorOptions();

    toggleFormButton.addEventListener('click', function() {
        if (shishaForm.style.display === 'none') {
            shishaForm.style.display = 'block';
            toggleFormButton.classList.add('active');
        } else {
            shishaForm.style.display = 'none';
            toggleFormButton.classList.remove('active');
        }
    });

    const stars = document.querySelectorAll('.star');
    const flavorRatingInput = document.getElementById('flavor-rating');

    stars.forEach(star => {
        star.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            flavorRatingInput.value = value;

            stars.forEach(s => {
                s.classList.remove('selected');
                s.textContent = '☆'; // デフォルトは空の星
            });
            this.classList.add('selected');
            this.textContent = '★'; // 選択された星は塗りつぶし
            let previousSibling = this.previousElementSibling;
            while (previousSibling) {
                previousSibling.classList.add('selected');
                previousSibling.textContent = '★'; // 左側の星も塗りつぶし
                previousSibling = previousSibling.previousElementSibling;
            }
        });

        star.addEventListener('mouseover', function() {
            stars.forEach(s => {
                s.classList.remove('hover');
                s.textContent = '☆'; // デフォルトは空の星
            });
            this.classList.add('hover');
            this.textContent = '★'; // ホバーした星は塗りつぶし
            let previousSibling = this.previousElementSibling;
            while (previousSibling) {
                previousSibling.classList.add('hover');
                previousSibling.textContent = '★'; // 左側の星も塗りつぶし
                previousSibling = previousSibling.previousElementSibling;
            }
        });

        star.addEventListener('mouseout', function() {
            stars.forEach(s => s.classList.remove('hover'));
        });
    });
});