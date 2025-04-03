// AI Engine for Adaptive Social Interaction Responses
class AIEngine {
    constructor() {
        this.personalities = {
            assertive: {
                responses: {
                    positive: ["I appreciate your perspective.", "That's a valid point.", "Let's explore that idea further."],
                    negative: ["I must disagree.", "That approach won't work.", "We need to reconsider this."]
                },
                tone: "direct"
            },
            collaborative: {
                responses: {
                    positive: ["Great idea! How can we build on that?", "I like where you're going with this.", "Let's work together on this."],
                    negative: ["Maybe we could find a middle ground?", "What if we tried a different approach?", "Let's discuss alternatives."]
                },
                tone: "supportive"
            },
            analytical: {
                responses: {
                    positive: ["The data supports your suggestion.", "That's a logically sound approach.", "This aligns with our metrics."],
                    negative: ["The numbers don't support this.", "We should analyze this further.", "There might be flaws in this reasoning."]
                },
                tone: "factual"
            }
        };
        this.difficultyLevels = ['Novice', 'Intermediate', 'Expert'];
    }

    generateResponse(playerAction, personalityType = 'random', difficulty = 1) {
        // Validate difficulty
        difficulty = Math.max(0, Math.min(2, difficulty));
        
        // Select personality
        let personality;
        if (personalityType === 'random') {
            const types = Object.keys(this.personalities);
            personality = this.personalities[types[Math.floor(Math.random() * types.length)]];
        } else {
            personality = this.personalities[personalityType] || this.personalities.assertive;
        }

        // Determine response type based on player action
        const responseType = this.analyzeAction(playerAction);
        const possibleResponses = personality.responses[responseType];
        const baseResponse = possibleResponses[Math.floor(Math.random() * possibleResponses.length)];

        // Adjust based on difficulty
        let fullResponse = baseResponse;
        if (difficulty > 0) {
            fullResponse += this.addComplexity(difficulty);
        }

        return {
            text: fullResponse,
            personality: personalityType === 'random' ? 'mixed' : personalityType,
            difficulty: this.difficultyLevels[difficulty],
            followUp: this.generateFollowUp(difficulty)
        };
    }

    analyzeAction(action) {
        // Simple sentiment analysis (in a real app, would use NLP)
        const positiveKeywords = ['agree', 'support', 'yes', 'great'];
        const negativeKeywords = ['disagree', 'reject', 'no', 'bad'];
        
        const actionLower = action.toLowerCase();
        if (positiveKeywords.some(word => actionLower.includes(word))) {
            return 'positive';
        }
        if (negativeKeywords.some(word => actionLower.includes(word))) {
            return 'negative';
        }
        return Math.random() > 0.5 ? 'positive' : 'negative';
    }

    addComplexity(level) {
        const complexities = [
            "",
            " Could you elaborate on your thinking?",
            " What are the potential implications of this approach?"
        ];
        return complexities[level];
    }

    generateFollowUp(difficulty) {
        if (difficulty < 1) return null;
        
        const followUps = [
            "How would you handle objections to this?",
            "What alternative approaches have you considered?",
            "How does this align with our overall goals?"
        ];
        return followUps[Math.floor(Math.random() * followUps.length)];
    }
}

module.exports = new AIEngine();