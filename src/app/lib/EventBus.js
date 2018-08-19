import Listenable from './Listenable';

class EventBus extends Listenable() {}

const eventBus = new EventBus();

export default eventBus;
