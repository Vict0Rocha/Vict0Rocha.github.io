// Aguarda o HTML ser completamente carregado para executar o script.
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SELEÇÃO DOS ELEMENTOS DO DOM ---
    const dom = {
        mainContainer: document.getElementById('main-container'),
        numberInput: document.getElementById('numberInput'),
        result: document.getElementById('result'),
        resultContainer: document.getElementById('resultContainer'),
        resultPlaceholder: document.getElementById('result-placeholder'),
        copyFeedback: document.getElementById('copyFeedback'),
        inputLabel: document.getElementById('inputLabel'),
        resultLabel: document.getElementById('resultLabel'),
        errorMessage: document.getElementById('error-message'),
        swapButton: document.getElementById('swap-button'),
        labelDecToBin: document.getElementById('label-decToBin'),
        labelBinToDec: document.getElementById('label-binToDec'),
        swapArrowSvg: document.getElementById('swap-arrow-svg'),
        themeToggleBtn: document.getElementById('theme-toggle'),
        themeIconLight: document.getElementById('theme-icon-light'),
        themeIconDark: document.getElementById('theme-icon-dark'),
        minRangeInput: document.getElementById('min-range'),
        maxRangeInput: document.getElementById('max-range'),
        drawButton: document.getElementById('draw-button'),
        drawResultArea: document.getElementById('draw-result-area'),
        drawResultLabel: document.getElementById('draw-result-label'),
        drawResultValue: document.getElementById('draw-result-value'),
        drawErrorMessage: document.getElementById('draw-error-message'),
        labelDrawDec: document.getElementById('label-draw-dec'),
        labelDrawBin: document.getElementById('label-draw-bin'),
        noRepeatCheckbox: document.getElementById('no-repeat-checkbox'),
        resetDrawButton: document.getElementById('reset-draw-button'),
        animationCheckbox: document.getElementById('animation-checkbox'),
        drawHistoryContainer: document.getElementById('draw-history-container'),
        historyToggleButton: document.getElementById('history-toggle-button'),
        historyToggleText: document.getElementById('history-toggle-text'),
        historyArrowIcon: document.getElementById('history-arrow-icon'),
        historyList: document.getElementById('history-list'),
        tabConverter: document.getElementById('tab-converter'),
        tabSorter: document.getElementById('tab-sorter'),
        panelConverter: document.getElementById('panel-converter'),
        panelSorter: document.getElementById('panel-sorter'),
        tabGame: document.getElementById('tab-game'),
        panelGame: document.getElementById('panel-game'),
        gameCardsContainer: document.getElementById('game-cards-container'),
        gameResultArea: document.getElementById('game-result-area'),
        gameResultNumber: document.getElementById('game-result-number'),
        gameResultBinary: document.getElementById('game-result-binary'),
        gameResetButton: document.getElementById('game-reset-button'),
        timerDisplay: document.getElementById('timer-display'),
        timerInputsContainer: document.getElementById('timer-inputs'),
        timerMinutesInput: document.getElementById('timer-minutes'),
        timerSecondsInput: document.getElementById('timer-seconds'),
        timerToggleBtn: document.getElementById('timer-toggle'),
        timerResetBtn: document.getElementById('timer-reset'),
        timerRepeatBtn: document.getElementById('timer-repeat'),
    };

    // --- 2. VARIÁVEIS DE ESTADO ---
    let isDecimalToBinary = true;
    let isDrawInDecimal = true;
    let drawnNumbersHistory = [];
    let timerInterval = null;
    let timeRemainingInMs = 0;
    let isTimerRunning = false;
    let lastTimerSetInMs = 0;

    // --- 3. FUNÇÕES DE CONVERSÃO ---
    const convert = { decToBin: (decStr) => { if (!/^\d+$/.test(decStr)) return ''; if (decStr === '0') return '0'; return BigInt(decStr).toString(2); }, binToDec: (binStr) => { if (!/^[01]+$/.test(binStr)) return ''; return BigInt('0b' + binStr).toString(); } };

    // --- 4. FUNÇÕES DE MANIPULAÇÃO DA UI (CONVERSOR) ---
    function updateUIForMode() { dom.swapArrowSvg.classList.toggle('rotate-180', !isDecimalToBinary); if (isDecimalToBinary) { dom.inputLabel.textContent = 'Insira o número Decimal:'; dom.resultLabel.textContent = 'Resultado em Binário'; dom.labelDecToBin.classList.add('dark:text-white', 'text-gray-900', 'font-semibold'); dom.labelDecToBin.classList.remove('font-medium'); dom.labelBinToDec.classList.remove('dark:text-white', 'text-gray-900', 'font-semibold'); dom.labelBinToDec.classList.add('font-medium'); } else { dom.inputLabel.textContent = 'Insira o número Binário:'; dom.resultLabel.textContent = 'Resultado em Decimal'; dom.labelBinToDec.classList.add('dark:text-white', 'text-gray-900', 'font-semibold'); dom.labelBinToDec.classList.remove('font-medium'); dom.labelDecToBin.classList.remove('dark:text-white', 'text-gray-900', 'font-semibold'); dom.labelDecToBin.classList.add('font-medium'); } dom.numberInput.value = ''; handleInput(); }
    function showError(message) { dom.errorMessage.textContent = message; dom.errorMessage.classList.remove('opacity-0'); }
    function clearError() { dom.errorMessage.classList.add('opacity-0'); }
    function handleInput() { let value = dom.numberInput.value; const regex = isDecimalToBinary ? /[^0-9]/g : /[^01]/g; if (regex.test(value)) { value = value.replace(regex, ''); dom.numberInput.value = value; } clearError(); if (value === '') { dom.result.textContent = ''; dom.resultPlaceholder.style.opacity = '1'; dom.resultContainer.classList.remove('cursor-pointer'); return; } dom.resultPlaceholder.style.opacity = '0'; try { const resultText = isDecimalToBinary ? convert.decToBin(value) : convert.binToDec(value); dom.result.textContent = resultText; dom.result.classList.add('animate-pulse-result'); setTimeout(() => dom.result.classList.remove('animate-pulse-result'), 500); dom.resultContainer.classList.add('cursor-pointer'); } catch (e) { showError('Número muito grande.'); } }
    function swapConversionMode() { isDecimalToBinary = !isDecimalToBinary; updateUIForMode(); }
    function copyResult() { if (!dom.result.textContent) return; navigator.clipboard.writeText(dom.result.textContent).then(() => { dom.copyFeedback.textContent = 'Resultado copiado!'; dom.copyFeedback.classList.remove('opacity-0'); setTimeout(() => dom.copyFeedback.classList.add('opacity-0'), 2000); }); }

    // --- 5. LÓGICA DO SELETOR DE TEMA ---
    function updateThemeUI(isDark) { dom.themeIconLight.classList.toggle('hidden', isDark); dom.themeIconDark.classList.toggle('hidden', !isDark); document.documentElement.classList.toggle('dark', isDark); }
    function toggleTheme() { const isCurrentlyDark = document.documentElement.classList.contains('dark'); const newThemeIsDark = !isCurrentlyDark; updateThemeUI(newThemeIsDark); localStorage.setItem('theme', newThemeIsDark ? 'dark' : 'light'); }

    // --- 6. LÓGICA DO SORTEADOR ---
    function resetDrawHistory() { drawnNumbersHistory = []; dom.drawResultArea.classList.add('hidden'); dom.drawErrorMessage.textContent = ''; dom.resetDrawButton.classList.add('hidden'); dom.drawHistoryContainer.classList.add('hidden'); updateHistoryList(); }
    function updateHistoryList() { dom.historyList.innerHTML = ''; drawnNumbersHistory.forEach(number => { const li = document.createElement('li'); li.textContent = `${number} (Binário: ${convert.decToBin(String(number))})`; li.className = 'text-gray-700 dark:text-gray-300 p-1 font-mono text-sm'; dom.historyList.appendChild(li); }); dom.historyToggleText.textContent = `Histórico (${drawnNumbersHistory.length})`; }
    function updateDrawUIForMode() { if (isDrawInDecimal) { dom.labelDrawDec.classList.add('dark:text-white', 'text-gray-900', 'font-semibold'); dom.labelDrawDec.classList.remove('font-medium', 'text-gray-500', 'dark:text-gray-400'); dom.labelDrawBin.classList.remove('dark:text-white', 'text-gray-900', 'font-semibold'); dom.labelDrawBin.classList.add('font-medium', 'text-gray-500', 'dark:text-gray-400'); } else { dom.labelDrawBin.classList.add('dark:text-white', 'text-gray-900', 'font-semibold'); dom.labelDrawBin.classList.remove('font-medium', 'text-gray-500', 'dark:text-gray-400'); dom.labelDrawDec.classList.remove('dark:text-white', 'text-gray-900', 'font-semibold'); dom.labelDrawDec.classList.add('font-medium', 'text-gray-500', 'dark:text-gray-400'); } resetDrawHistory(); }
    function displayDrawnNumber(number) { if (isDrawInDecimal) { dom.drawResultLabel.textContent = 'Resultado em Decimal:'; dom.drawResultValue.textContent = number; } else { dom.drawResultLabel.textContent = 'Resultado em Binário:'; dom.drawResultValue.textContent = convert.decToBin(String(number)); } }
    function drawNumber() { dom.drawErrorMessage.textContent = ''; const min = parseInt(dom.minRangeInput.value, 10); const max = parseInt(dom.maxRangeInput.value, 10); const noRepeat = dom.noRepeatCheckbox.checked; const animate = dom.animationCheckbox.checked; if (isNaN(min) || isNaN(max)) { dom.drawErrorMessage.textContent = 'Por favor, insira valores numéricos.'; return; } if (min >= max) { dom.drawErrorMessage.textContent = 'O valor mínimo deve ser menor que o máximo.'; return; } let finalDrawnNumber; if (noRepeat) { const rangeSize = max - min + 1; if (drawnNumbersHistory.length >= rangeSize) { dom.drawErrorMessage.textContent = 'Todos os números do intervalo já foram sorteados.'; return; } do { finalDrawnNumber = Math.floor(Math.random() * rangeSize) + min; } while (drawnNumbersHistory.includes(finalDrawnNumber)); } else { finalDrawnNumber = Math.floor(Math.random() * (max - min + 1)) + min; } dom.drawResultArea.classList.remove('hidden'); const processResult = () => { displayDrawnNumber(finalDrawnNumber); if (noRepeat) { drawnNumbersHistory.push(finalDrawnNumber); updateHistoryList(); dom.drawHistoryContainer.classList.remove('hidden'); dom.resetDrawButton.classList.remove('hidden'); } }; if (animate) { dom.drawButton.disabled = true; dom.drawButton.textContent = 'Sorteando...'; const animationDuration = 2500; const animationIntervalTime = 50; let animationInterval = setInterval(() => { const randomDisplayNumber = Math.floor(Math.random() * (max - min + 1)) + min; displayDrawnNumber(randomDisplayNumber); }, animationIntervalTime); setTimeout(() => { clearInterval(animationInterval); processResult(); dom.drawButton.disabled = false; dom.drawButton.textContent = 'Sortear Número'; }, animationDuration); } else { processResult(); } }

    // --- 7. LÓGICA DO JOGO DE ADIVINHAÇÃO ---
    const gameCardsData = [{ value: 16, numbers: [] }, { value: 8, numbers: [] }, { value: 4, numbers: [] }, { value: 2, numbers: [] }, { value: 1, numbers: [] }];
    function initializeGame() { gameCardsData.forEach(card => { card.numbers = []; for (let i = 1; i <= 31; i++) { if ((i & card.value) !== 0) { card.numbers.push(i); } } }); renderGameCards(); }
    function renderGameCards() { dom.gameCardsContainer.innerHTML = ''; gameCardsData.forEach(cardData => { const card = document.createElement('div'); card.className = 'game-card cursor-pointer p-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-center transition-all duration-200 hover:border-blue-500 dark:hover:border-blue-400 flex flex-col justify-start'; card.dataset.value = cardData.value; const valueText = document.createElement('p'); valueText.className = 'font-bold text-xl text-gray-800 dark:text-white mb-1'; valueText.innerHTML = `2<sup>${Math.log2(cardData.value)}</sup>`; card.appendChild(valueText); const numbersContainer = document.createElement('div'); numbersContainer.className = 'grid grid-cols-2 gap-1 text-xs text-gray-600 dark:text-gray-400'; cardData.numbers.forEach(num => { const numSpan = document.createElement('span'); numSpan.textContent = num; numbersContainer.appendChild(numSpan); }); card.appendChild(numbersContainer); card.addEventListener('click', toggleCardSelection); dom.gameCardsContainer.appendChild(card); }); }
    function toggleCardSelection(event) { const card = event.currentTarget; card.classList.toggle('bg-blue-100'); card.classList.toggle('dark:bg-blue-900'); card.classList.toggle('border-blue-500'); card.classList.toggle('dark:border-blue-400'); calculateGameResult(); }
    function calculateGameResult() { const selectedCards = document.querySelectorAll('.game-card.bg-blue-100'); let total = 0; selectedCards.forEach(card => { total += parseInt(card.dataset.value, 10); }); if (total > 0) { dom.gameResultArea.classList.remove('hidden'); dom.gameResultNumber.textContent = total; dom.gameResultBinary.textContent = `(Binário: ${convert.decToBin(String(total)).padStart(5, '0')})`; } else { dom.gameResultArea.classList.add('hidden'); } }
    function resetGame() { dom.gameResultArea.classList.add('hidden'); const selectedCards = document.querySelectorAll('.game-card.bg-blue-100'); selectedCards.forEach(card => { card.classList.remove('bg-blue-100', 'dark:bg-blue-900', 'border-blue-500', 'dark:border-blue-400'); }); }

    // --- 8. LÓGICA DE NAVEGAÇÃO POR ABAS ---
    function switchTab(targetTab) {
        const tabs = [dom.tabGame, dom.tabConverter, dom.tabSorter];
        const panels = [dom.panelGame, dom.panelConverter, dom.panelSorter];
        tabs.forEach((tab, index) => {
            const panel = panels[index];
            if (tab === targetTab) {
                tab.classList.add('text-blue-600', 'dark:text-blue-400');
                tab.classList.remove('text-gray-500', 'dark:text-gray-400', 'hover:text-gray-700', 'dark:hover:text-gray-200');
                panel.classList.remove('hidden');
            } else {
                tab.classList.remove('text-blue-600', 'dark:text-blue-400');
                tab.classList.add('text-gray-500', 'dark:text-gray-400', 'hover:text-gray-700', 'dark:hover:text-gray-200');
                panel.classList.add('hidden');
            }
        });
    }

    // --- 9. LÓGICA DO TEMPORIZADOR (CORRIGIDA) ---
    const synth = new Tone.Synth().toDestination();

    function formatTimerDisplay(ms) {
        if (ms < 0) ms = 0;
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    }

    function triggerAlarm() {
        synth.triggerAttackRelease("C5", "8n", Tone.now());
        synth.triggerAttackRelease("G5", "8n", Tone.now() + 0.2);
        dom.mainContainer.classList.add('shake');
        setTimeout(() => dom.mainContainer.classList.remove('shake'), 820);
    }

    function updateTimer() {
        timeRemainingInMs -= 1000;
        dom.timerDisplay.textContent = formatTimerDisplay(timeRemainingInMs);
        if (timeRemainingInMs <= 0) {
            clearInterval(timerInterval);
            triggerAlarm();
            resetTimer();
        }
    }

    function toggleTimer() {
        if (isTimerRunning) {
            // Pausar
            isTimerRunning = false;
            clearInterval(timerInterval);
            dom.timerToggleBtn.textContent = 'Continuar';
            dom.timerToggleBtn.classList.replace('bg-yellow-500', 'bg-green-600');
            dom.timerToggleBtn.classList.replace('hover:bg-yellow-600', 'hover:bg-green-700');
        } else {
            // Iniciar ou Continuar
            if (timeRemainingInMs <= 0) { // Iniciar do zero
                const minutes = parseInt(dom.timerMinutesInput.value, 10) || 0;
                const seconds = parseInt(dom.timerSecondsInput.value, 10) || 0;
                timeRemainingInMs = (minutes * 60 + seconds) * 1000;
                lastTimerSetInMs = timeRemainingInMs;
            }

            if (timeRemainingInMs > 0) {
                isTimerRunning = true;
                dom.timerToggleBtn.textContent = 'Pausar';
                dom.timerToggleBtn.classList.replace('bg-green-600', 'bg-yellow-500');
                dom.timerToggleBtn.classList.replace('hover:bg-green-700', 'hover:bg-yellow-600');
                dom.timerInputsContainer.classList.add('hidden');
                dom.timerDisplay.classList.remove('hidden');
                dom.timerRepeatBtn.disabled = true;

                // Exibe o tempo imediatamente antes de começar o intervalo
                dom.timerDisplay.textContent = formatTimerDisplay(timeRemainingInMs);
                timerInterval = setInterval(updateTimer, 1000);
            }
        }
    }

    function resetTimer() {
        isTimerRunning = false;
        clearInterval(timerInterval);
        timeRemainingInMs = 0;

        dom.timerInputsContainer.classList.remove('hidden');
        dom.timerDisplay.classList.add('hidden');
        dom.timerToggleBtn.textContent = 'Iniciar';
        dom.timerToggleBtn.classList.replace('bg-yellow-500', 'bg-green-600');
        dom.timerToggleBtn.classList.replace('hover:bg-yellow-600', 'hover:bg-green-700');

        dom.timerMinutesInput.value = 0;
        dom.timerSecondsInput.value = 0;

        if (lastTimerSetInMs > 0) {
            dom.timerRepeatBtn.disabled = false;
        }
    }

    function repeatTimer() {
        if (isTimerRunning || lastTimerSetInMs <= 0) return;

        resetTimer();
        timeRemainingInMs = lastTimerSetInMs;
        toggleTimer();
    }

    // --- 10. INICIALIZAÇÃO E EVENT LISTENERS ---
    dom.numberInput.addEventListener('input', handleInput);
    dom.swapButton.addEventListener('click', swapConversionMode);
    dom.labelDecToBin.addEventListener('click', () => { if (!isDecimalToBinary) swapConversionMode(); });
    dom.labelBinToDec.addEventListener('click', () => { if (isDecimalToBinary) swapConversionMode(); });
    dom.resultContainer.addEventListener('click', copyResult);
    dom.themeToggleBtn.addEventListener('click', toggleTheme);
    dom.drawButton.addEventListener('click', drawNumber);
    dom.labelDrawDec.addEventListener('click', () => { if (!isDrawInDecimal) { isDrawInDecimal = true; updateDrawUIForMode(); } });
    dom.labelDrawBin.addEventListener('click', () => { if (isDrawInDecimal) { isDrawInDecimal = false; updateDrawUIForMode(); } });
    dom.noRepeatCheckbox.addEventListener('change', resetDrawHistory);
    dom.resetDrawButton.addEventListener('click', resetDrawHistory);
    dom.minRangeInput.addEventListener('change', resetDrawHistory);
    dom.maxRangeInput.addEventListener('change', resetDrawHistory);
    dom.historyToggleButton.addEventListener('click', () => { dom.historyList.classList.toggle('hidden'); dom.historyArrowIcon.classList.toggle('rotate-180'); });
    dom.tabGame.addEventListener('click', () => switchTab(dom.tabGame));
    dom.tabConverter.addEventListener('click', () => switchTab(dom.tabConverter));
    dom.tabSorter.addEventListener('click', () => switchTab(dom.tabSorter));
    dom.gameResetButton.addEventListener('click', resetGame);
    dom.timerToggleBtn.addEventListener('click', toggleTimer);
    dom.timerResetBtn.addEventListener('click', resetTimer);
    dom.timerRepeatBtn.addEventListener('click', repeatTimer);

    // Ação inicial para mostrar os inputs do temporizador
    dom.timerDisplay.classList.add('hidden');
    dom.timerInputsContainer.classList.remove('hidden');

    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) { updateThemeUI(true); } else { updateThemeUI(false); }

    switchTab(dom.tabSorter);
    updateUIForMode();
    updateDrawUIForMode();
    initializeGame();
});
