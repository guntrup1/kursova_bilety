// Посилання на елементи
const ticketCountInput = document.getElementById('ticketCount'); // Поле для введення кількості білетів
const themeOptions = document.querySelectorAll('input[name="themeOption"]'); // Варіанти вибору теми
const manualThemeContainer = document.getElementById('manualThemeContainer'); // Контейнер для ручного введення теми
const manualThemeInput = document.getElementById('manualTheme'); // Поле для введення теми вручну
const repeatOptions = document.querySelectorAll('input[name="repeatOption"]'); // Варіанти дозволу повторення питань
const difficultyOptions = document.querySelectorAll('input[name="difficultyOption"]'); // Варіанти вибору рівнів складності
const difficultyLevelSelect = document.getElementById('difficultyLevel'); // Випадаючий список для вибору рівнів складності
const fileInputsDiv = document.getElementById('fileInputs'); // Контейнер для полів завантаження файлів
const singleFileContainer = document.getElementById('singleFileContainer'); // Контейнер для завантаження одного файлу
const singleFileInput = document.getElementById('singleFile'); // Поле для завантаження одного файлу
const singleFileQuestionsInput = document.getElementById('singleFileQuestions'); // Поле для введення кількості питань з одного файлу
const generateButton = document.getElementById('generateTickets'); // Кнопка для генерації білетів
const outputDiv = document.getElementById('output'); // Контейнер для виводу результатів

// Рівні складності
const difficultyLevels = {
    easy: ["Легкий"], // Легкий рівень
    easyMedium: ["Легкий", "Середній"], // Легкий і середній рівні
    easyMediumHard: ["Легкий", "Середній", "Важкий"] // Легкий, середній та важкий рівні
};

// Слухачі для вибору теми
themeOptions.forEach(option => {
    option.addEventListener('change', () => {
        manualThemeContainer.style.display = option.value === "manual" ? "block" : "none"; // Відображення або приховування поля для ручного введення теми
        validateForm(); // Перевірка валідності форми
    });
});

// Слухачі для вибору розподілу питань
difficultyOptions.forEach(option => {
    option.addEventListener('change', () => {
        if (option.id === "withDifficulty" && option.checked) {
            document.getElementById('difficultyContainer').style.display = "block"; // Показати секцію для рівнів складності
            singleFileContainer.style.display = "none"; // Приховати секцію для одного файлу
        } else {
            document.getElementById('difficultyContainer').style.display = "none"; // Приховати секцію для рівнів складності
            singleFileContainer.style.display = "block"; // Показати секцію для одного файлу
        }
        validateForm(); // Перевірка валідності форми
    });
});

// Динамічне додавання полів для рівнів складності
difficultyLevelSelect.addEventListener('change', () => {
    fileInputsDiv.innerHTML = ""; // Очищення попередніх полів
    const selectedLevels = difficultyLevels[difficultyLevelSelect.value]; // Отримання вибраних рівнів складності

    if (selectedLevels) {
        selectedLevels.forEach(level => {
            const fileGroup = document.createElement('div'); // Контейнер для одного рівня складності

            const fileLabel = document.createElement('label'); // Мітка для файлу
            fileLabel.textContent = `Файл для рівня "${level}":`;
            fileGroup.appendChild(fileLabel);

            const fileInput = document.createElement('input'); // Поле для завантаження файлу
            fileInput.type = "file";
            fileInput.accept = ".txt";
            fileInput.setAttribute("data-level", level);
            fileGroup.appendChild(fileInput);

            const questionCountLabel = document.createElement('label'); // Мітка для кількості питань
            questionCountLabel.textContent = `Кількість питань для рівня "${level}":`;
            fileGroup.appendChild(questionCountLabel);

            const questionCountInput = document.createElement('input'); // Поле для введення кількості питань
            questionCountInput.type = "number";
            questionCountInput.min = "1";
            questionCountInput.setAttribute("data-level", level);
            fileGroup.appendChild(questionCountInput);

            fileInputsDiv.appendChild(fileGroup); // Додавання контейнера у DOM

            fileInput.addEventListener("change", validateForm); // Перевірка після завантаження файлу
            questionCountInput.addEventListener("input", validateForm); // Перевірка після введення кількості питань
        });
    }

    validateForm(); // Перевірка форми після змін
});

// Перевірка форми
function validateForm() {
    const ticketCount = ticketCountInput.value.trim(); // Кількість білетів
    const themeManual = document.getElementById('themeManual').checked; // Перевірка, чи обрано ручну тему
    const isUsingDifficulty = document.getElementById('withDifficulty').checked; // Перевірка, чи використовується поділ на рівні складності

    // Перевірка кількості білетів
    if (!ticketCount || ticketCount <= 0) {
        generateButton.disabled = true; // Вимкнути кнопку, якщо значення некоректне
        return;
    }

    // Перевірка введення теми вручну
    if (themeManual && !manualThemeInput.value.trim()) {
        generateButton.disabled = true; // Вимкнути кнопку, якщо тема не введена
        return;
    }


    // Якщо вибрано розподіл за рівнями складності
    if (isUsingDifficulty) {
        const difficultyLevel = difficultyLevelSelect.value; // Вибраний рівень складності
        const fileInputs = fileInputsDiv.querySelectorAll('input[type="file"]'); // Поля для завантаження файлів
        const questionCounts = fileInputsDiv.querySelectorAll('input[type="number"]'); // Поля для введення кількості питань
        const allFilesUploaded = [...fileInputs].every(input => input.files.length > 0); // Перевірка, чи всі файли завантажені
        const allCountsEntered = [...questionCounts].every(input => input.value.trim() && input.value > 0); // Перевірка, чи введені всі кількості питань
        generateButton.disabled = !(difficultyLevel && allFilesUploaded && allCountsEntered); // Вимкнення кнопки, якщо дані некоректні
    } 
    // Якщо всі питання з одного файлу
    else {
        const singleFileUploaded = singleFileInput.files.length > 0; // Перевірка, чи завантажено файл
        const singleFileQuestions = singleFileQuestionsInput.value.trim(); // Перевірка введеної кількості питань
        generateButton.disabled = !(singleFileUploaded && singleFileQuestions > 0); // Вимкнення кнопки, якщо дані некоректні
    }

}


// Завантаження питань із файлів для рівнів складності
async function loadQuestionsForLevels(levels) {
    const questionData = {}; // Об'єкт для зберігання питань та тем для кожного рівня

    for (const level of levels) {
        const fileInput = document.querySelector(`input[data-level="${level}"]`); // Поле завантаження файлу для конкретного рівня
        if (!fileInput || fileInput.files.length === 0) {
            console.warn(`Файл для рівня ${level} не завантажений.`); // Попередження, якщо файл не завантажений
            continue;
        }

        const file = fileInput.files[0]; // Отримуємо файл
        try {
            const text = await file.text(); // Зчитуємо текст з файлу
            const lines = text.trim().split('\n').map(line => line.trim()); // Розбиваємо текст на рядки і обрізаємо пробіли

            if (lines.length === 0) {
                console.warn(`Файл для рівня ${level} пустий.`); // Попередження, якщо файл пустий
                continue;
            }

            const theme = lines[0] || "Тема відсутня"; // Перший рядок використовується як тема, якщо вона є
            const questions = lines.slice(1).filter(line => line !== ""); // Усі наступні рядки вважаються питаннями

            if (questions.length === 0) {
                console.warn(`У файлі для рівня ${level} відсутні питання.`); // Попередження, якщо немає питань
                continue;
            }

            questionData[level] = { theme, questions }; // Зберігаємо тему та питання для рівня
        } catch (error) {
            console.error(`Помилка при обробці файлу для рівня ${level}:`, error); // Логування помилки
        }
    }

    console.log("Завантажені питання для рівнів:", questionData); // Повний лог завантажених даних
    return questionData; // Повертаємо об'єкт із питаннями
}



// Генерація PDF для рівнів складності
function generatePDFForLevels(ticketCount, questionData, mainTheme) {
    const docDefinition = {
        content: [] // Масив для зберігання вмісту PDF-документу
    };

    // Перевірка, чи вистачає питань для всіх білетів
    for (const level in questionData) {
        const { questions } = questionData[level];
        const questionCountInput = document.querySelector(`input[data-level="${level}"][type="number"]`);
        const requiredQuestions = questionCountInput ? parseInt(questionCountInput.value, 10) * ticketCount : 0;

        if (questions.length < requiredQuestions) {
            alert(`Недостатньо питань для рівня: ${level}. Потрібно ${requiredQuestions}, а доступно ${questions.length}.`);
            return; // Зупиняємо генерацію, якщо питань недостатньо
        }
    }

    for (let i = 0; i < ticketCount; i++) {
        docDefinition.content.push({
            text: `Варіант №${i + 1}`, // Номер варіанта
            style: 'header',
            margin: [0, 10, 0, 10]
        });

        if (mainTheme) {
            docDefinition.content.push({
                text: `Тема: ${mainTheme}`, // Основна тема, якщо задана вручну
                style: 'subheader',
                margin: [0, 0, 0, 10]
            });
        }

        for (const level in questionData) {
            const { theme, questions } = questionData[level];
            const questionCountInput = document.querySelector(`input[data-level="${level}"][type="number"]`);
            const questionCount = questionCountInput ? parseInt(questionCountInput.value, 10) : 0;

            if (isNaN(questionCount) || questionCount <= 0) {
                console.warn(`Невірна кількість питань для рівня: ${level}`); // Попередження про некоректну кількість питань
                continue;
            }

            const selectedQuestions = questions.splice(0, questionCount);

            if (selectedQuestions.length < questionCount) {
                console.warn(`Недостатньо питань для рівня: ${level}`); // Попередження, якщо питань не вистачає
            }

            docDefinition.content.push({
                text: `Рівень складності: ${level}`, // Назва рівня складності
                style: 'subheader',
                margin: [0, 5, 0, 5]
            });

            selectedQuestions.forEach((question, idx) => {
                docDefinition.content.push({ text: `${idx + 1}. ${question}` }); // Додаємо питання до PDF
            });

            docDefinition.content.push({ text: '', margin: [0, 10, 0, 10] }); // Відступ між рівнями складності
        }

        if (i < ticketCount - 1) {
            docDefinition.content.push({ text: '', pageBreak: 'after' }); // Розрив сторінки між білетами
        }
    }

    pdfMake.createPdf(docDefinition).download("bilety_levels.pdf"); // Завантажуємо PDF-документ
}







// Функція випадкового вибору питань з урахуванням унікальності

function getRandomQuestions(questions, count) {
    if (!questions || questions.length === 0) {
        console.warn("Масив питань пустий!"); // Попередження, якщо масив питань пустий
        return [];
    }

    if (count > questions.length) {
        console.warn(`Недостатньо питань: запитано ${count}, доступно ${questions.length}`); // Попередження про недостатню кількість питань
        count = questions.length; // Використовувати всі доступні питання
    }

    const selected = questions.splice(0, count); // Вибрати перші доступні питання і видалити їх із масиву
    return selected;
}






// Слухач для кнопки генерації
generateButton.addEventListener('click', async () => {
    const ticketCount = parseInt(ticketCountInput.value); // Отримання кількості білетів
    const isUsingDifficulty = document.getElementById('withDifficulty').checked; // Чи використовується поділ на рівні складності
    const themeManual = document.getElementById('themeManual').checked; // Чи обрана ручна тема
    const preventRepeats = document.querySelector('input[name="repeatOption"]:checked').value === "no"; // Чи заборонено повторення питань
    const mainTheme = themeManual ? manualThemeInput.value.trim() : ""; // Тема білета

    if (isUsingDifficulty) {
        const levels = difficultyLevels[difficultyLevelSelect.value]; // Отримання вибраних рівнів складності
        const questionData = await loadQuestionsForLevels(levels); // Завантаження питань для рівнів складності

        generatePDFForLevels(ticketCount, questionData, mainTheme, preventRepeats); // Генерація PDF для рівнів складності
    } else {
        const singleFile = singleFileInput.files[0]; // Файл із питаннями
        const singleFileQuestions = parseInt(singleFileQuestionsInput.value); // Кількість питань
        const text = await singleFile.text(); // Зчитування тексту з файлу
        const lines = text.trim().split('\n'); // Розбивання тексту на рядки
        const themeFromFile = lines[0] || "Тема відсутня"; // Тема із файлу
        const questions = lines.slice(1); // Питання з другого рядка

        generatePDFForSingleFile(ticketCount, questions, singleFileQuestions, mainTheme || themeFromFile); // Генерація PDF для одного файлу
    }
});


// Генерація PDF для одного файлу
function generatePDFForSingleFile(ticketCount, questions, countPerTicket, theme) {
    const docDefinition = {
        content: [] // Контент для PDF
    };

    // Перевіряємо, чи вистачає питань для всіх білетів
    if (questions.length < ticketCount * countPerTicket) {
        alert("Недостатньо питань для створення заданої кількості білетів.");
        return;
    }

    // Очищуємо питання від порожніх рядків
    questions = questions.filter(q => q.trim() !== "");

    for (let i = 0; i < ticketCount; i++) {
        docDefinition.content.push({
            text: `Варіант №${i + 1}`, // Номер варіанта
            style: 'header',
            margin: [0, 10, 0, 10]
        });

        if (theme) {
            docDefinition.content.push({
                text: `Тема: ${theme}`, // Тема білета
                style: 'subheader',
                margin: [0, 0, 0, 10]
            });
        }

        // Отримуємо питання для поточного білета
        const selectedQuestions = questions.splice(0, countPerTicket);

        // Додаємо попередження, якщо питань менше, ніж потрібно
        if (selectedQuestions.length < countPerTicket) {
            docDefinition.content.push({
                text: `Попередження: у цьому білеті бракує питань (очікувалося ${countPerTicket}, отримано ${selectedQuestions.length})`,
                style: 'warning',
                margin: [0, 0, 0, 10]
            });
        }

        // Додаємо питання до PDF
        selectedQuestions.forEach((question, idx) => {
            docDefinition.content.push({ text: `${idx + 1}. ${question.trim()}`, margin: [0, 2, 0, 2] }); // Видаляємо зайві пробіли
        });

        // Додаємо розрив сторінки між білетами
        if (i < ticketCount - 1) {
            docDefinition.content.push({ text: '', pageBreak: 'after' });
        }
    }

    pdfMake.createPdf(docDefinition).download("bilety_single_file.pdf"); // Завантаження PDF
}


// Підключення слухачів для всіх елементів форми
ticketCountInput.addEventListener('input', validateForm); // Подія введення кількості білетів
manualThemeInput.addEventListener('input', validateForm); // Подія введення ручної теми
themeOptions.forEach(option => option.addEventListener('change', validateForm)); // Подія зміни вибору теми
difficultyOptions.forEach(option => option.addEventListener('change', () => {
    validateForm();
    updateFileInputVisibility(); // Оновлення видимості полів
}));
difficultyLevelSelect.addEventListener('change', validateForm); // Подія зміни рівня складності
singleFileInput.addEventListener('change', validateForm); // Подія завантаження файлу для "всі питання з одного файлу"
singleFileQuestionsInput.addEventListener('input', validateForm); // Подія введення кількості питань

// Оновлення видимості полів
function updateFileInputVisibility() {
    const isUsingDifficulty = document.getElementById('withDifficulty').checked; // Чи використовується поділ за рівнями складності
    document.getElementById('difficultyContainer').style.display = isUsingDifficulty ? "block" : "none"; // Показати/приховати контейнер для рівнів складності
    document.getElementById('singleFileContainer').style.display = isUsingDifficulty ? "none" : "block"; // Показати/приховати контейнер для одного файлу
}

// Виклик функції оновлення при завантаженні сторінки
updateFileInputVisibility();
validateForm();
