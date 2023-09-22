/* eslint-disable max-len */
import { RequestsHandler } from '../requests/requestsHandler';
import { IEventsWinners } from '../../types/types';

export class EventsWinners extends RequestsHandler implements IEventsWinners {
    winnerElementsArray: HTMLElement[];

    winnersTableHeader: HTMLElement;

    buttonWins: HTMLElement;

    buttonTime: HTMLElement;

    constructor(arrayOfElements: (HTMLElement | HTMLElement[])[]) {
        super(arrayOfElements);
        this.winnerElementsArray = arrayOfElements[2] as HTMLElement[];
        this.winnersTableHeader = this.winnerElementsArray[4] as HTMLElement;
        this.buttonWins = this.winnersTableHeader.children[3] as HTMLElement;
        this.buttonTime = this.winnersTableHeader.children[4] as HTMLElement;
    }

    public async eventCreateWinner(id: string, time: number): Promise<void> {
        await super.createWinner(+id, time);
    }

    private winsSort(): void {
        this.buttonWins.onclick = async () => {
            this.buttonWins.classList.toggle('ASC');
            await super.winnersSort(this.buttonWins);
        };
    }

    private timeSort(): void {
        this.buttonTime.onclick = async () => {
            this.buttonTime.classList.toggle('ASC');
            await super.bestTimeSort(this.buttonTime);
        };
    }

    public initializationWinners(): void {
        this.winsSort();
        this.timeSort();
    }
}
