/* eslint-disable no-new */
import { Rendering } from './components/rendering/rendering';
import { EventsGarage } from './components/basic-events/eventemitterGarage';
import { EventsWinners } from './components/basic-events/eventemitterWinners';

export const arrayOfElements = new Rendering().startRendering();
new EventsGarage(arrayOfElements).createEventListeners();
new EventsWinners(arrayOfElements).initializationWinners();
