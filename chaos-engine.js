// Chaos Challenge Engine
class ChaosEngine {
    constructor() {
        this.events = {
            social: [
                "Unexpected question from senior manager",
                "New team member joins the meeting late",
                "Technical difficulties with presentation",
                "Client changes requirements mid-discussion",
                "Cultural misunderstanding occurs",
                "Personal conflict arises between team members"
            ],
            environmental: [
                "Fire alarm goes off",
                "Power outage occurs",
                "Internet connection drops",
                "Room booking gets canceled"
            ],
            personal: [
                "You start feeling unwell",
                "You realize you prepared the wrong materials",
                "You get an urgent personal call",
                "You completely forget your main points"
            ]
        };
        this.difficultyLevels = ['Easy', 'Medium', 'Hard'];
    }

    generateChaos(type = 'random') {
        let selectedType = type;
        if (type === 'random') {
            const types = Object.keys(this.events);
            selectedType = types[Math.floor(Math.random() * types.length)];
        }

        const events = this.events[selectedType];
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        const difficulty = Math.floor(Math.random() * 3);

        return {
            type: selectedType,
            event: randomEvent,
            difficulty: this.difficultyLevels[difficulty],
            timestamp: new Date().toISOString(),
            points: (difficulty + 1) * 10 // More points for harder challenges
        };
    }

    calculateImpact(chaosEvent, playerResponseTime, responseQuality) {
        const difficultyMultiplier = this.difficultyLevels.indexOf(chaosEvent.difficulty) + 1;
        const timeFactor = Math.max(0, 1 - (playerResponseTime / 30)); // 30 second max response time
        const qualityFactor = responseQuality / 5; // 1-5 scale
        
        return Math.round(difficultyMultiplier * 10 * timeFactor * qualityFactor);
    }
}

module.exports = new ChaosEngine();