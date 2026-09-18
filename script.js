let history = [];
let demoRunning = false;
let demoTimer = null;
let predictionCount = 0;

let predictions = {
    Camera: {},
    Messages: {},
    Music: {},
    Settings: {}
};


// =============================
// SAFE TEXT UPDATE
// =============================

function updateText(id, text) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = text;
    }
}


// =============================
// UPDATE CONFIDENCE BAR
// =============================

function updateConfidence(value) {
    const bar = document.getElementById("confidenceBar");
    const text = document.getElementById("confidenceText");

    value = Math.max(0, Math.min(100, value));

    if (bar) {
        bar.style.width = value + "%";
    }

    if (text) {
        text.textContent = value + "%";
    }
}


// =============================
// UPDATE DEMO PROGRESS
// =============================

function updateDemoProgress(percent, stage) {
    const progressBar = document.getElementById("demoProgressBar");
    const progressText = document.getElementById("demoProgressText");
    const stageText = document.getElementById("demoStage");

    if (progressBar) {
        progressBar.style.width = percent + "%";
    }

    if (progressText) {
        progressText.textContent = percent + "%";
    }

    if (stageText) {
        stageText.textContent = stage;
    }
}


// =============================
// UPDATE LEARNING STAGES
// =============================

function updateLearningStages(stageNumber) {
    const stages = [
        document.getElementById("stage1"),
        document.getElementById("stage2"),
        document.getElementById("stage3")
    ];

    stages.forEach((stage, index) => {
        if (!stage) return;

        stage.classList.remove("active", "completed");

        if (index + 1 < stageNumber) {
            stage.classList.add("completed");
        } else if (index + 1 === stageNumber) {
            stage.classList.add("active");
        }
    });
}


// =============================
// GET SMART INTERACTION BUTTONS
// =============================

function getAppButtons() {
    return document.querySelectorAll(
        "#Camera, #Messages, #Music, #Settings"
    );
}


// =============================
// CLEAR ALL PREDICTION HIGHLIGHTS
// =============================

function clearPredictionHighlight() {
    getAppButtons().forEach(button => {
        button.classList.remove("predicted");
        button.removeAttribute("aria-current");

        // Remove focus from previously selected buttons
        button.blur();
    });
}


// =============================
// HIGHLIGHT ONLY ONE BUTTON
// =============================

function highlightPredictedButton(action) {
    // First remove every existing highlight
    clearPredictionHighlight();

    const predictedButton = document.getElementById(action);

    if (predictedButton) {
        predictedButton.classList.add("predicted");
        predictedButton.setAttribute("aria-current", "true");
    }
}


// =============================
// RECORD USER ACTION
// =============================

function recordAction(action) {
    // Clear old prediction before recording a new action
    clearPredictionHighlight();

    if (!predictions[action]) {
        predictions[action] = {};
    }

    checkMistouch(action);

    if (history.length > 0) {
        const previousAction = history[history.length - 1];

        if (!predictions[previousAction]) {
            predictions[previousAction] = {};
        }

        if (!predictions[previousAction][action]) {
            predictions[previousAction][action] = 0;
        }

        predictions[previousAction][action]++;
    }

    history.push(action);

    updateText("interactionCount", history.length);
    updateText("historyText", history.join(" → "));

    updateText("liveAIStatus", "🧠 Learning");

    updateText(
        "liveAIMessage",
        "Understanding your interaction pattern..."
    );

    makePrediction(action);
}


// =============================
// PREDICT NEXT ACTION
// =============================

function makePrediction(currentAction) {
    const learnedActions = predictions[currentAction];

    if (
        !learnedActions ||
        Object.keys(learnedActions).length === 0
    ) {
        updateText("nextActionName", "Learning...");

        updateText(
            "nextActionConfidence",
            "Waiting for more interactions"
        );

        updateText(
            "predictionText",
            "AI is learning your interaction pattern."
        );

        updateText(
            "explanationText",
            "Perform more actions to improve prediction accuracy."
        );

        updateConfidence(0);

        updateText(
            "learningStatus",
            "Collecting interaction data"
        );

        updateText("aiStatus", "Learning");

        clearPredictionHighlight();

        return;
    }

    let bestAction = null;
    let highestCount = 0;
    let totalCount = 0;

    for (const action in learnedActions) {
        totalCount += learnedActions[action];

        if (learnedActions[action] > highestCount) {
            highestCount = learnedActions[action];
            bestAction = action;
        }
    }

    if (!bestAction || totalCount === 0) {
        clearPredictionHighlight();
        return;
    }

    const confidence = Math.round(
        (highestCount / totalCount) * 100
    );

    // Highlight ONLY the current predicted action
    highlightPredictedButton(bestAction);

    updateText(
        "nextActionName",
        bestAction
    );

    updateText(
        "nextActionConfidence",
        confidence + "% confidence"
    );

    updateText(
        "predictionText",
        "Next predicted action: " + bestAction
    );

    updateText(
        "explanationText",
        "Based on your previous interactions, AI predicts " +
        bestAction +
        " after " +
        currentAction +
        "."
    );

    updateConfidence(confidence);

    updateText(
        "learningStatus",
        "Pattern detected"
    );

    updateText(
        "aiStatus",
        "Active"
    );

    predictionCount++;

    updateText(
        "predictionCount",
        predictionCount
    );

    updateText(
        "accuracyValue",
        confidence + "%"
    );

    updateText(
        "liveAIStatus",
        "🔮 Prediction Ready"
    );

    updateText(
        "liveAIMessage",
        bestAction +
        " is likely to be your next action."
    );
}


// =============================
// DETECT POSSIBLE MIS-TOUCH
// =============================

function checkMistouch(action) {
    const alertBox = document.getElementById("mistouchAlert");

    if (!alertBox || history.length === 0) {
        return;
    }

    const previousAction = history[history.length - 1];
    const learnedActions = predictions[previousAction];

    if (
        !learnedActions ||
        Object.keys(learnedActions).length === 0
    ) {
        alertBox.style.display = "none";
        return;
    }

    let expectedAction = null;
    let highestCount = 0;

    for (const nextAction in learnedActions) {
        if (learnedActions[nextAction] > highestCount) {
            highestCount = learnedActions[nextAction];
            expectedAction = nextAction;
        }
    }

    if (expectedAction && action !== expectedAction) {
        alertBox.style.display = "block";

        updateText(
            "mistouchText",
            "You usually select " +
            expectedAction +
            " after " +
            previousAction +
            "."
        );
    } else {
        alertBox.style.display = "none";
    }
}


// =============================
// ONE-HANDED MODE
// =============================

function toggleOneHanded() {
    const container = document.querySelector(".container");
    const button = document.getElementById("oneHandedToggle");

    if (!container || !button) {
        return;
    }

    container.classList.toggle("one-handed");
    button.classList.toggle("active");

    if (container.classList.contains("one-handed")) {
        button.textContent = "📱 One-Handed Mode: ON";
    } else {
        button.textContent = "📱 One-Handed Mode: OFF";
    }
}


// =============================
// RESET PROTOTYPE
// =============================

function resetPrototype(keepDemoRunning = false) {
    if (demoTimer) {
        clearTimeout(demoTimer);
        demoTimer = null;
    }

    if (!keepDemoRunning) {
        demoRunning = false;

        updateText(
            "demoButton",
            "▶ Start Demo"
        );
    }

    history = [];
    predictionCount = 0;

    predictions = {
        Camera: {},
        Messages: {},
        Music: {},
        Settings: {}
    };

    updateText("interactionCount", "0");
    updateText("predictionCount", "0");
    updateText("accuracyValue", "0%");
    updateText("aiStatus", "Ready");

    updateText(
        "historyText",
        "No interactions yet"
    );

    updateText(
        "nextActionName",
        "Waiting..."
    );

    updateText(
        "nextActionConfidence",
        "No prediction yet"
    );

    updateText(
        "predictionText",
        "Start interacting to generate predictions."
    );

    updateText(
        "explanationText",
        "AI will learn your interaction patterns."
    );

    updateText(
        "learningStatus",
        "Waiting for data"
    );

    updateText(
        "liveAIStatus",
        "🟢 Ready"
    );

    updateText(
        "liveAIMessage",
        "AI is ready to learn your behavior."
    );

    updateConfidence(0);

    const alertBox = document.getElementById("mistouchAlert");

    if (alertBox) {
        alertBox.style.display = "none";
    }

    // Remove all green highlights
    clearPredictionHighlight();

    updateDemoProgress(
        0,
        "Waiting to start demo..."
    );

    updateLearningStages(1);
}


// =============================
// START AI DEMONSTRATION
// =============================

function startDemo() {
    if (demoRunning) {
        return;
    }

    demoRunning = true;

    resetPrototype(true);

    updateText(
        "demoButton",
        "⏳ Demo Running..."
    );

    updateDemoProgress(
        0,
        "🧠 AI is preparing to learn..."
    );

    updateLearningStages(1);

    updateText(
        "liveAIStatus",
        "🧠 AI Learning"
    );

    updateText(
        "liveAIMessage",
        "AI is learning your touch behavior..."
    );

    const demoActions = [
        "Camera",
        "Music",
        "Camera",
        "Music",
        "Camera",
        "Music"
    ];

    let index = 0;

    function playNextAction() {
        if (!demoRunning) {
            return;
        }

        if (index >= demoActions.length) {
            demoRunning = false;
            demoTimer = null;

            updateDemoProgress(
                100,
                "✅ Pattern learned successfully!"
            );

            updateLearningStages(4);

            updateText(
                "demoButton",
                "✅ Pattern Learned"
            );

            updateText(
                "liveAIStatus",
                "🟢 Pattern Learned"
            );

            updateText(
                "liveAIMessage",
                "Pattern learned: Music frequently follows Camera."
            );

            updateText(
                "explanationText",
                "AI detected a repeated Camera → Music interaction pattern."
            );

            updateText(
                "predictionText",
                "Final prediction: Music after Camera."
            );

            updateText(
                "learningStatus",
                "Pattern learned successfully"
            );

            updateText(
                "aiStatus",
                "Ready"
            );

            return;
        }

        const action = demoActions[index];

        recordAction(action);

        index++;

        const progress = Math.round(
            (index / demoActions.length) * 100
        );

        if (index <= 2) {
            updateLearningStages(1);

            updateDemoProgress(
                progress,
                "🧠 Learning interaction patterns..."
            );
        } else if (index <= 4) {
            updateLearningStages(2);

            updateDemoProgress(
                progress,
                "🔮 Predicting next action..."
            );
        } else {
            updateLearningStages(3);

            updateDemoProgress(
                progress,
                "✨ Adapting interface..."
            );
        }

        demoTimer = setTimeout(
            playNextAction,
            1200
        );
    }

    playNextAction();
}


// =============================
// PAGE INITIALIZATION
// =============================

document.addEventListener(
    "DOMContentLoaded",
    function() {
        resetPrototype();
    }
);
