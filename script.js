
        const stageCount = 7;
        let currentStage = 1;
        let currentQuestionIndex = 0;
        let playerHealth = 10;
        let enemyHealth = 10;
        let timeLeft = 15;
        let timerInterval;

        function createStageButtons() {
            const container =document.getElementById("stageButtons");
            container.style.display = "flex"; // 横並びにする
            container.style.justifyContent = "center"; // 中央寄せ
            container.style.gap = "10px"; // ボタン間の間隔

            for (let i = 1; i <= stageCount; i++) {
                let btn = document.createElement("button");
                btn.classList.add("stage-button");
                btn.textContent = i;

                btn.onclick = () => loadStage(i);
                container.appendChild(btn);
            }
        }

        function loadStage(stage) {
            document.body.style.background = getStageColor(stage);
            document.body.style.backgroundSize = "cover"; // 画面全体に表示
            document.body.style.backgroundRepeat = "no-repeat"; // 繰り返さない
            document.body.style.backgroundPosition = "center center"; // 中央に配置
            document.body.style.backgroundAttachment = "fixed"; // スクロールしても背景固定
            currentStage = stage;
            playerHealth = 10;
            enemyHealth = 10;
            timeLeft = 15;
            document.getElementById("timer").textContent = timeLeft;
            updateHealthBars();
            document.getElementById("homeScreen").classList.remove("active");
            document.getElementById("quizScreen").classList.add("active");
            
            // ステージの質問をランダム化
            shuffleQuestions(stage);

            displayQuestion(0);
        }

        // 質問をランダムにシャッフルする関数
        function shuffleQuestions(stage) {
             // ステージの質問リストをシャッフル
            let questions = quizData[stage];
            for (let i = questions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [questions[i], questions[j]] = [questions[j], questions[i]];
            }
        }

        function displayQuestion(questionIndex) {
            if (questionIndex >= quizData[currentStage].length) {
                alert("ステージクリア！");
                goHome();
                return;
            }
            
            clearInterval(timerInterval);
            timeLeft = 15;
            document.getElementById("timer").textContent = timeLeft;
            
            // 正解・不正解の表示を消す
            const resultMessage = document.getElementById("resultMessage");
            resultMessage.textContent = "";

            const explanation = document.getElementById("explanation");
            explanationMessage.textContent = "";

            const questionData = quizData[currentStage][questionIndex];
            if (!questionData || !questionData.question) {
                return; // 空の問題なら何もしない
            }

            // 「問題：」の形式で表示
            document.getElementById("questionText").innerHTML = `<strong>問題：</strong> ${questionData.question}`;

            const choicesContainer = document.getElementById("choices");
            choicesContainer.innerHTML = "";

            questionData.choices.forEach(choice => {
                let button = document.createElement("button");
                button.classList.add("choice-button");
                button.textContent = choice;
                button.onclick = () => checkAnswer(choice, questionData.answer, questionIndex);
                choicesContainer.appendChild(button);
            });

            startTimer(questionIndex);
        }

        function startTimer(questionIndex) {
            timerInterval = setInterval(() => {
                timeLeft--;
                document.getElementById("timer").textContent = timeLeft;
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    checkAnswer("", quizData[currentStage][questionIndex].answer, questionIndex);
                }
            }, 1000);
        }

        // 正誤判定
        function checkAnswer(selected, correct, questionIndex) {
            clearInterval(timerInterval);
            const resultMessage = document.getElementById("resultMessage");
            const questionData = quizData[currentStage][questionIndex];

            if (selected === correct) {
                // 正解なら
                resultMessage.textContent = "正解！"; // 正解表示
                resultMessage.style.color = "green"; // 緑色で表示
                enemyHealth--;
                //　敵の体力が０になったら
                if (enemyHealth === 0) {
                    alert("ステージクリア！"); // ゲームクリアで表示
                    goHome(); // ホームに戻る
                    return;
                }
            } else {
                //　不正解なら
                resultMessage.textContent = "不正解！"; // 不正解表示
                resultMessage.style.color = "red"; // 赤色で表示
                playerHealth--;
                //　プレイヤーの体力が０になったら
                if (playerHealth === 0) {
                    alert("ゲームオーバー！"); //　ゲームオーバーで表示
                    loadStage(currentStage);
                    return;
                }
            }

            // 解説の表示（`explanation` があれば表示する）
            if (questionData.explanation) {
                explanationMessage.textContent = `解説：${questionData.explanation}`;
                explanationMessage.style.color = "black";
            } 

            updateHealthBars();
            setTimeout(()=> displayQuestion(questionIndex + 1), 1500);
        }

        function updateHealthBars() {
            document.getElementById("playerHealth").style.width = (playerHealth * 10) + "%";
            document.getElementById("enemyHealth").style.width = (enemyHealth * 10) + "%";
            document.getElementById("playerHealthText").textContent = playerHealth;
            document.getElementById("enemyHealthText").textContent = enemyHealth;
        }

        // 各ステージカラー
        function getStageColor(stage) {
            const backgrounds = [
                "url('imagesbg1.jpg')", // ステージ1：貧困
                "url('imagesbg2.jpg')", // ステージ2：教育
                "url('imagesbg3.jpg')", // ステージ3：人権
                "url('imagesbg4.jpg')", // ステージ4：防災
                "url('imagesbg5.jpg')", // ステージ5：医療
                "url('imagesbg6.jpg')", // ステージ6：人口
                "url('imagesbg7.jpg')"  // ステージ7：環境
                ];
            return backgrounds[(stage - 1) % backgrounds.length];
        }

        function goHome() {
            document.body.style.backgroundImage = "none"; // 背景画像をリセット
            document.body.style.background = "white";
            document.body.style.backgroundSize = "";
            document.body.style.backgroundRepeat = "";
            document.body.style.backgroundPosition = "";
            document.body.style.backgroundAttachment = "";

            document.getElementById("quizScreen").classList.remove("active");
            document.getElementById("homeScreen").classList.add("active");
        }

        createStageButtons();