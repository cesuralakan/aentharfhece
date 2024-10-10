    const wordList = ["bilgisayar", "klavye", "fare", "ekran"]; // Kelimeleri burada tanımlayın
    let currentWordIndex = 0;
    let currentWord = [];

    function initializeGame() {
        // Harf kutularını ve boşlukları başlat
        const lettersDiv = document.getElementById('letters');
        const underscoresDiv = document.getElementById('underscores');
        const wordStatusDiv = document.getElementById('wordStatus');
        lettersDiv.innerHTML = '';
        underscoresDiv.innerHTML = '';
        document.getElementById('congratsMessage').style.display = 'none';
        document.getElementById('restartButton').style.display = 'none';

        // İlk kelimeyi al
        currentWord = wordList[currentWordIndex].split(''); 

        // Harfleri karışık sırada göster
        let shuffledWord = currentWord.slice().sort(() => 0.5 - Math.random());

        // Harf kutuları oluşturuluyor
        shuffledWord.forEach((letter, index) => {
            const letterBox = document.createElement('div');
            letterBox.classList.add('letter-box');
            letterBox.textContent = letter;
            letterBox.setAttribute('draggable', true);
            letterBox.setAttribute('id', `letter-${index}`);
            letterBox.addEventListener('dragstart', handleDragStart);
            lettersDiv.appendChild(letterBox);
        });

        // Kutucuklar oluşturuluyor
        currentWord.forEach((_, index) => {
            const underscoreBox = document.createElement('div');
            underscoreBox.classList.add('underscore-box');
            underscoreBox.setAttribute('data-index', index);
            underscoreBox.addEventListener('dragover', handleDragOver);
            underscoreBox.addEventListener('drop', handleDrop);
            underscoresDiv.appendChild(underscoreBox);
        });

        // Toplam kaç kelime olduğunu ve hangi kelimede olduğunu göster
        wordStatusDiv.textContent = `Kelime: ${currentWordIndex + 1}/${wordList.length}`;

        // Her kelime değiştiğinde next.mp3 çal
        document.getElementById('nextSound').play();
    }

    // Drag işlemi başlatma
    function handleDragStart(e) {
        e.dataTransfer.setData('text', e.target.id);
    }

    // Altı çizgili kutuya sürüklerken
    function handleDragOver(e) {
        e.preventDefault();
    }

    // Sürükleyip bıraktıktan sonra
    function handleDrop(e) {
        e.preventDefault();
        const draggedLetterId = e.dataTransfer.getData('text');
        const draggedLetter = document.getElementById(draggedLetterId).textContent;
        const targetIndex = e.target.getAttribute('data-index');

        if (draggedLetter === currentWord[targetIndex]) {
            // Doğru harf ise yeşile döner ve doğru ses efekti çalınır
            e.target.textContent = draggedLetter;
            e.target.classList.add('correct');
            document.getElementById(draggedLetterId).style.visibility = 'hidden';
            document.getElementById('correctSound').play();
        } else {
            // Yanlış harf ise kırmızıya döner ve yanlış ses efekti çalınır
            document.getElementById(draggedLetterId).classList.add('incorrect');
            document.getElementById('wrongSound').play();
            setTimeout(() => {
                document.getElementById(draggedLetterId).classList.remove('incorrect');
            }, 1000);
        }

        // Kelimenin tamamı doğruysa bir sonraki kelimeye geç
        checkWordCompletion();
    }

    // Tüm harfler doğruysa bir sonraki kelimeye geçiş
    function checkWordCompletion() {
        const underscoresDiv = document.getElementById('underscores');
        const filledLetters = underscoresDiv.querySelectorAll('.correct');
        if (filledLetters.length === currentWord.length) {
            currentWordIndex++;
            if (currentWordIndex < wordList.length) {
                currentWord = wordList[currentWordIndex].split('');
                setTimeout(() => initializeGame(), 1000);
            } else {
                // Tüm sorular bitince "Tebrikler" mesajı ve "Yeniden Oyna" düğmesi göster
                document.getElementById('congratsMessage').style.display = 'block';
                document.getElementById('restartButton').style.display = 'block';
            }
        }
    }

    // Oyunu yeniden başlatmak için fonksiyon
    function restartGame() {
        currentWordIndex = 0;
        currentWord = wordList[currentWordIndex].split('');
        initializeGame();
    }

    // Oyunu başlat
    initializeGame();