class VoiceFeedback {
    constructor() {
        this.synth = window.speechSynthesis;
        this.enabled = localStorage.getItem('voiceFeedbackEnabled') === 'true';
        this.rate = 1;
        this.pitch = 1;
        this.volume = 1;
    }

    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('voiceFeedbackEnabled', this.enabled);
        return this.enabled;
    }

    speak(text) {
        if (!this.enabled || !this.synth) return;

        // Cancel current speech
        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = this.rate;
        utterance.pitch = this.pitch;
        utterance.volume = this.volume;

        this.synth.speak(utterance);
    }

    announceColor(name, hex) {
        this.speak(`Detected color: ${name}`);
    }

    announceAction(action) {
        this.speak(action);
    }
}

export default new VoiceFeedback();
