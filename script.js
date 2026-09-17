
let history = [];

let predictionCount = 0;

let predictions = {
    Camera: {},
    Messages: {},
    Music: {},
    Settings: {}
};


/* =========================
   RECORD USER INTERACTION
   ========================= */

function recordAction(action) {

    console.log("Clicked:", action);

    // Check possible mis-touch before learning the new action
    checkMistouch(action);

    // Record interaction
    history.push(action);

    document.getElementById("interactionCount").innerText =
        history.length;

    document.getElementById("liveAIStatus").innerText =
        "AI LEARNING";

    document.getElementById("liveAIMessage").innerText =
        "Analyzing your interaction pattern...";

    // Learn the sequence
    if (history.length >= 2) {

        let previous = history[history.length - 2];

        if (!predictions[previous][action]) {
            predictions[previous][action] = 0;
        }

        predictions[previous][action]++;
    }

    // Show interaction history
    document.getElementById("historyText").innerText =
        history.join(" → ");

    // Make prediction
    makePrediction(action);
}


/* =========================
   AI PREDICTION
   ========================= */

function makePrediction(currentAction) {

    let nextActions = predictions[currentAction];

    let bestAction = null;
    let highestCount = 0;

    // Find most likely next action
    for (let action in nextActions) {

        if (nextActions[action] > highestCount) {

            highestCount = nextActions[action];
            bestAction = action;
        }
    }

    // Remove previous prediction highlight
    document.querySelectorAll(".buttons button")
        .forEach(button => {
            button.classList.remove("predicted");
        });

    if (bestAction) {

        let total = 0;

        for (let action in nextActions) {
            total += nextActions[action];
        }

        let confidence = Math.round(
            (highestCount / total) * 100
        );

        // Highlight predicted button
        let predictedButton =
            document.getElementById(bestAction);

        if (predictedButton) {
            predictedButton.classList.add("predicted");
        }

        // Show prediction
        document.getElementById("predictionText").innerText =
            "Next likely action: ⭐ " +
            bestAction +
            " | Confidence: " +
            confidence +
            "%";

        // Update Next Action Card
        let nextActionName =
            document.getElementById("nextActionName");

        let nextActionConfidence =
            document.getElementById("nextActionConfidence");

        let nextActionCard =
            document.querySelector(".next-action-card");

        if (nextActionName) {
            nextActionName.innerText = bestAction;
        }

        if (nextActionConfidence) {
            nextActionConfidence.innerText =
                confidence + "% confidence";
        }

        if (nextActionCard) {
            nextActionCard.classList.add("active");
        }

        // Update AI Explanation
        let explanationText =
            document.getElementById("explanationText");

        if (explanationText) {

            explanationText.innerText =
                "The system learned that " +
                currentAction +
                " is followed by " +
                bestAction +
                ". Observed pattern count: " +
                highestCount;
        }

        // Update confidence bar
        document.getElementById("confidenceBar")
            .style.width = confidence + "%";

        document.getElementById("confidenceText")
            .innerText = confidence + "%";

        // Update learning status
        document.getElementById("learningStatus")
            .innerText =
            "🧠 Pattern detected and interface adapted";

        // Update LIVE AI status
        document.getElementById("liveAIStatus")
            .innerText =
            "AI PREDICTION READY";

        document.getElementById("liveAIMessage")
            .innerText =
            "Next action: " + bestAction;

        // Update prediction statistics
        predictionCount++;

        document.getElementById("predictionCount")
            .innerText = predictionCount;

        document.getElementById("accuracyValue")
            .innerText = confidence + "%";

        document.getElementById("aiStatus")
            .innerText = "Active";

    } else {

        // No prediction yet
        document.getElementById("predictionText")
            .innerText =
            "Learning your interaction pattern...";

        // Reset confidence
        document.getElementById("confidenceBar")
            .style.width = "0%";

        document.getElementById("confidenceText")
            .innerText = "0%";

        // Reset Next Action Card
        let nextActionName =
            document.getElementById("nextActionName");

        let nextActionConfidence =
            document.getElementById("nextActionConfidence");

        let nextActionCard =
            document.querySelector(".next-action-card");

        if (nextActionName) {
            nextActionName.innerText = "Waiting...";
        }

        if (nextActionConfidence) {
            nextActionConfidence.innerText =
                "No prediction yet";
        }

        if (nextActionCard) {
            nextActionCard.classList.remove("active");
        }

        // Reset AI Explanation
        let explanationText =
            document.getElementById("explanationText");

        if (explanationText) {

            explanationText.innerText =
                "Waiting for enough interaction data...";
        }

        // Update learning status
        document.getElementById("learningStatus")
            .innerText =
            "🧠 Learning your interaction pattern...";

        document.getElementById("aiStatus")
            .innerText = "Learning";

        // Update LIVE AI status
        document.getElementById("liveAIStatus")
            .innerText = "AI LEARNING";

        document.getElementById("liveAIMessage")
            .innerText =
            "Building your interaction pattern...";
    }
}


/* =========================
   MIS-TOUCH DETECTION
   ========================= */

function checkMistouch(action) {

    // Need at least one previous action
    if (history.length < 1) {
        return;
    }

    let previousAction =
        history[history.length - 1];

    let nextActions =
        predictions[previousAction];

    let bestAction = null;
    let highestCount = 0;

    for (let next in nextActions) {

        if (nextActions[next] > highestCount) {

            highestCount = nextActions[next];
            bestAction = next;
        }
    }

    let alertBox =
        document.getElementById("mistouchAlert");

    if (!alertBox) {
        return;
    }

    if (bestAction && action !== bestAction) {

        alertBox.innerText =
            "⚠️ Did you mean " +
            bestAction +
            "?";

    } else {

        alertBox.innerText = "";
    }
}


/* =========================
   ONE-HANDED MODE
   ========================= */

function toggleOneHanded() {

    let container =
        document.querySelector(".container");

    let toggle =
        document.getElementById("oneHandedToggle");

    if (!container || !toggle) {
        return;
    }

    container.classList.toggle("one-handed");

    toggle.classList.toggle("active");

    if (container.classList.contains("one-handed")) {

        toggle.innerText = "ON";

    } else {

        toggle.innerText = "OFF";
    }
}


/* =========================
   HACKATHON DEMO MODE
   ========================= */

function startDemo() {

    // Reset previous demo
    history = [];

    predictionCount = 0;

    predictions = {

        Camera: {},
        Messages: {},
        Music: {},
        Settings: {}

    };

    // Reset statistics
    document.getElementById("interactionCount")
        .innerText = "0";

    document.getElementById("predictionCount")
        .innerText = "0";

    document.getElementById("accuracyValue")
        .innerText = "0%";

    document.getElementById("aiStatus")
        .innerText = "Learning";

    // Reset history
    document.getElementById("historyText")
        .innerText = "Starting demo...";

    // Reset prediction
    document.getElementById("predictionText")
        .innerText =
        "Learning your interaction pattern...";

    // Reset confidence
    document.getElementById("confidenceBar")
        .style.width = "0%";

    document.getElementById("confidenceText")
        .innerText = "0%";

    // Reset Next Action Card
    let nextActionName =
        document.getElementById("nextActionName");

    let nextActionConfidence =
        document.getElementById("nextActionConfidence");

    let nextActionCard =
        document.querySelector(".next-action-card");

    if (nextActionName) {
        nextActionName.innerText = "Waiting...";
    }

    if (nextActionConfidence) {
        nextActionConfidence.innerText =
            "No prediction yet";
    }

    if (nextActionCard) {
        nextActionCard.classList.remove("active");
    }

    // Reset AI Explanation
    let explanationText =
        document.getElementById("explanationText");

    if (explanationText) {

        explanationText.innerText =
            "Waiting for enough interaction data...";
    }

    // Reset live AI status
    document.getElementById("liveAIStatus")
        .innerText = "AI LEARNING";

    document.getElementById("liveAIMessage")
        .innerText =
        "Learning repeated touch behavior...";

    // Demo status
    document.getElementById("learningStatus")
        .innerText =
        "🎬 Demo running — AI is learning your pattern";

    // Remove predicted highlights
    document.querySelectorAll(".buttons button")
        .forEach(button => {
            button.classList.remove("predicted");
        });

    // Demo pattern
    let demoActions = [

        "Camera",
        "Music",
        "Camera",
        "Music",
        "Camera",
        "Music"

    ];

    let index = 0;

    // Play actions
    function playNextAction() {

        if (index >= demoActions.length) {

            document.getElementById("learningStatus")
                .innerText =
                "🧠 Pattern learned — Music predicted after Camera";

            document.getElementById("aiStatus")
                .innerText = "Ready";

            document.getElementById("liveAIStatus")
                .innerText = "AI READY";

            document.getElementById("liveAIMessage")
                .innerText =
                "Pattern learned successfully";

            return;
        }

        let action = demoActions[index];

        // Simulate interaction
        recordAction(action);

        index++;

        // Next action after 1.2 seconds
        setTimeout(
            playNextAction,
            1200
        );
    }

    // Start
    playNextAction();
}
