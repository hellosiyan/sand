import eventBus from './lib/EventBus';

const state = {
    events: eventBus,
    movementDisabled: false,
    activatedLetters: '',
    targetLetters: '',
    headingHome: false,
    isStoneActivating: false,
    hasShownOutOfBoundsMessage: false,
};

export default state;
