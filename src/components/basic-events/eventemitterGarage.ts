/* eslint-disable prettier/prettier */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable max-len */
import { RequestsHandler } from '../requests/requestsHandler';
import { Utils } from '../utils/utils';
import {
    typeCarCeator, dataResponseStartDriving, carCoordsType, IEventsGarage,
} from '../../types/types';
import { AnimationCars } from '../animation/animation';

export class EventsGarage extends RequestsHandler implements IEventsGarage {
    togglerContainerArray: HTMLElement[];

    winnersContainerArray: HTMLElement[];

    buttonToGarage: HTMLElement;

    buttonToWinners: HTMLElement;

    garageView: HTMLElement;

    winnersView: HTMLElement;

    carCreatorUtils: HTMLElement[];

    buttonCreate: HTMLElement;

    buttonUpdate: HTMLElement;

    buttonRace: HTMLElement;

    buttonReset: HTMLElement;

    buttonGenerateCars: HTMLElement;

    trackContainer: HTMLElement;

    garageCount: HTMLElement;

    pageNumberGarage: HTMLElement;

    selectedCarTrack: HTMLElement | null;

    buttonPrevGarage: HTMLElement;

    buttonNextGarage: HTMLElement;

    inputCreateText: HTMLInputElement;

    inputCreateColor: HTMLInputElement;

    inputUpdateText: HTMLInputElement;

    inputUpdateColor: HTMLInputElement;

    utils: Utils;

    constructor(arrayOfElements: (HTMLElement | HTMLElement[])[]) {
        super(arrayOfElements);
        this.togglerContainerArray = arrayOfElements[0] as HTMLElement[];
        this.buttonToGarage = this.togglerContainerArray[0];
        this.buttonToWinners = this.togglerContainerArray[1];
        this.garageView = arrayOfElements[1] as HTMLElement;
        this.winnersContainerArray = arrayOfElements[2] as HTMLElement[];
        this.winnersView = this.winnersContainerArray[0] as HTMLElement;
        this.carCreatorUtils = arrayOfElements[3] as HTMLElement[];
        this.inputCreateText = this.carCreatorUtils[0] as HTMLInputElement;
        this.inputCreateColor = this.carCreatorUtils[1] as HTMLInputElement;
        this.buttonCreate = this.carCreatorUtils[2];
        this.inputUpdateText = this.carCreatorUtils[3] as HTMLInputElement;
        this.inputUpdateColor = this.carCreatorUtils[4] as HTMLInputElement;
        this.buttonUpdate = this.carCreatorUtils[5];
        this.buttonRace = this.carCreatorUtils[6];
        this.buttonReset = this.carCreatorUtils[7];
        this.buttonGenerateCars = this.carCreatorUtils[8];
        this.trackContainer = arrayOfElements[5] as HTMLElement;
        this.garageCount = arrayOfElements[4] as HTMLElement;
        this.pageNumberGarage = this.garageCount.nextElementSibling as HTMLElement;
        this.selectedCarTrack = null;
        this.buttonPrevGarage = this.trackContainer.nextElementSibling?.firstChild as HTMLElement;
        this.buttonNextGarage = this.trackContainer.nextElementSibling?.lastChild as HTMLElement;
        this.utils = new Utils();
    }

    public createEventListeners(): void {
        this.createToggleView();
        this.eventButtonCreateCar();
        this.eventRenderCar();
        this.eventButtonOnTrack();
        this.eventUpdateButton();
        this.eventButtonGenerateCars();
        this.eventPaginationNext();
        this.eventPaginationPrev();
        this.eventButtonRace();
    }

    private createToggleView(): void {
        this.buttonToGarage.onclick = () => {
            this.garageView.classList.remove('hidden');
            this.winnersView.classList.add('hidden');
            this.buttonToGarage.classList.add('button-disabled');
            this.buttonToWinners.classList.remove('button-disabled');
            sessionStorage.setItem('Garage', 'on');
        };

        this.buttonToWinners.onclick = async () => {
            if (!this.buttonToWinners.classList.contains('button-disabled')) {
                this.garageView.classList.add('hidden');
                this.winnersView.classList.remove('hidden');
                this.buttonToWinners.classList.add('button-disabled');
                this.buttonToGarage.classList.remove('button-disabled');
                sessionStorage.setItem('Garage', 'off');
                await super.getWinners(this.pageNumberWinners);
            }
        };
    }

    private eventRenderCar(): void {
        window.onload = async () => {
            const pageNumber = Number(sessionStorage.getItem('pageNumber'));
            const pageNumberWinners = Number(sessionStorage.getItem('pageNumberWinners'));
            if (!pageNumber) {
                await super.getCars();
                this.pageNumberGarage.textContent = 'Page 1';
                const maxPageNumber = Math.ceil(this.numberOfCars / 7);
                if (maxPageNumber > this.pageNumber) {
                    this.buttonNextGarage.classList.remove('button-disabled');
                }
            } else {
                await super.getCars(pageNumber);
                this.pageNumberGarage.textContent = `Page ${pageNumber}`;
                if (pageNumber > 1) {
                    this.buttonPrevGarage.classList.remove('button-disabled');
                }
                const maxPageNumber = Math.ceil(this.numberOfCars / 7);
                if (maxPageNumber > pageNumber) {
                    this.buttonNextGarage.classList.remove('button-disabled');
                }
            }
            const garageView = sessionStorage.getItem('Garage');
            if (garageView === 'off') {
                this.garageView.classList.add('hidden');
                this.winnersView.classList.remove('hidden');
                this.buttonToWinners.classList.add('button-disabled');
                this.buttonToGarage.classList.remove('button-disabled');
            }
            if (!pageNumberWinners) {
                await super.getWinners();
            } else {
                await super.getWinners(pageNumberWinners);
            }
        };
    }

    private eventButtonCreateCar(): void {
        this.buttonCreate.onclick = async () => {
            let carModel: string = this.inputCreateText.value;
            if (carModel === '') {
                carModel = this.utils.getCarModel();
            }
            const selectedColor: string = this.inputCreateColor.value;
            await super.createCar(carModel, selectedColor);
            this.inputCreateText.value = '';
            this.inputCreateColor.value = '#000000';
            const maxPageNumber = Math.ceil(this.numberOfCars / 7);
            if (maxPageNumber > this.pageNumber) {
                this.buttonNextGarage.classList.remove('button-disabled');
            }
        };
    }

    private eventButtonOnTrack(): void {
        this.trackContainer.onclick = async (e) => {
            const trgt = e.target as HTMLElement;
            if (trgt.classList.contains('button-select')) {
                this.eventButtonSelect(trgt);
            } else if (trgt.classList.contains('button-remove')) {
                await this.eventButtonRemove(trgt);
            } else if (trgt.classList.contains('button-A')) {
                if (!trgt.classList.contains('button-disabled')) {
                    await this.eventButtonA(trgt);
                }
            }
        };
    }

    private async eventButtonRemove(trgt: HTMLElement): Promise<void> {
        const track = trgt.parentElement?.parentElement as HTMLElement;
        await super.deleteCar(track);
        if (this.arrayOfCars.length === 0 && this.pageNumber > 1) {
            await super.getCars(this.pageNumber - 1);
            sessionStorage.setItem('pageNumber', `${this.pageNumber}`);
        }
        if (this.pageNumber === 1) {
            this.buttonPrevGarage.classList.add('button-disabled');
            this.pageNumberGarage.textContent = `Page ${this.pageNumber}`;
        }
        const maxPageNumber = Math.ceil(this.numberOfCars / 7);
        if (maxPageNumber === this.pageNumber) {
            this.buttonNextGarage.classList.add('button-disabled');
        }
    }

    private async eventButtonA(trgt: HTMLElement): Promise<void> {
        const track = trgt.parentElement?.parentElement as HTMLElement;
        const id = track.dataset.id as string;
        const dataResponse = await super.drivingMode(+id, 'started') as dataResponseStartDriving;
        if (dataResponse) {
            const buttonB = trgt.nextElementSibling as HTMLElement;
            this.buttonsTogglerOnMoving(trgt, buttonB, true);
            const animationDuration = Math.round(dataResponse.distance / dataResponse.velocity);
            const carParent = track.lastChild as HTMLElement;
            const car = carParent.children[2] as HTMLElement;
            const flag = carParent.children[3] as HTMLElement;
            const carCoords = this.utils.getDistance(car, flag);
            const movingCar = new AnimationCars(car, animationDuration, carCoords.distance, false);
            movingCar.driving();
            buttonB.onclick = async () => {
                await super.drivingMode(+id, 'stopped');
                movingCar.stopAnimation();
                movingCar.returnOnStartPosition(carCoords.start);
                this.buttonsTogglerOnMoving(trgt, buttonB, false);
                buttonB.onclick = null;
            };
            const needToMove = await super.drivingMode(+id, 'drive');
            if (!needToMove) {
                await super.drivingMode(+id, 'stopped');
                movingCar.stopAnimation();
                buttonB.onclick = () => {
                    movingCar.returnOnStartPosition(carCoords.start);
                    this.buttonsTogglerOnMoving(trgt, buttonB, false);
                    buttonB.onclick = null;
                };
            }
        }
    }

    private async eventButtonRace(): Promise<void> {
        this.buttonRace.onclick = async () => {
            if (!this.buttonRace.classList.contains('button-disabled')) {
                this.buttonRace.classList.add('button-disabled');
                const trackes = this.trackContainer.children;
                const carsId: number[] = [];
                const trackesArray: HTMLElement[] = [];
                for (let i = 0; i < trackes.length; i += 1) {
                    const track = trackes[i] as HTMLElement;
                    if (track.dataset.id) {
                        carsId.push(+track.dataset.id);
                        trackesArray.push(track);
                    }
                }
                const dataResponses = await Promise.all(
                    carsId.map((car) => {
                        return super.drivingMode(car, 'started');
                    }),
                ) as dataResponseStartDriving[];
                this.createObjectsRaseAnimation(dataResponses, trackesArray, carsId);
            }
        };
    }

    private createObjectsRaseAnimation(
        dataResponses: (dataResponseStartDriving | false)[],
        trackesArray: HTMLElement[],
        carsId: number[],
    ): void {
        const movingCarArray: AnimationCars[] = [];
        const carCoordsArray: carCoordsType[] = [];
        dataResponses.forEach(async (response, index) => {
            if (response) {
                const animationDuration = Math.round(response.distance / response.velocity);
                const carParent = trackesArray[index].lastChild as HTMLElement;
                const car = carParent.children[2] as HTMLElement;
                const flag = carParent.children[3] as HTMLElement;
                const carCoords = this.utils.getDistance(car, flag);
                carCoordsArray.push(carCoords);
                const movingCar = new AnimationCars(car, animationDuration, carCoords.distance, true);
                movingCarArray.push(movingCar);
                movingCar.driving();
                const needToMove = await super.drivingMode(carsId[index], 'drive');
                if (!needToMove) {
                    movingCar.stopAnimation();
                    this.resetOnClick(movingCarArray, carsId, carCoordsArray, needToMove);
                }
            }
        });
        this.resetOnClick(movingCarArray, carsId, carCoordsArray, true);
    }

    private resetOnClick(
        movingCarArray: AnimationCars[],
        carsId: number[],
        carCoordsArray: carCoordsType[],
        needToMove: boolean,
    ): void {
        this.buttonReset.onclick = async () => {
            if (!this.buttonReset.classList.contains('button-disabled')) {
                if (needToMove) {
                    movingCarArray.forEach(async (movingCar, index) => {
                        this.buttonReset.classList.add('button-disabled');
                        this.buttonRace.classList.remove('button-disabled');
                        await super.drivingMode(carsId[index], 'stopped');
                        movingCar.stopAnimation();
                        movingCar.returnOnStartPosition(carCoordsArray[index].start);
                        this.buttonReset.onclick = null;
                    });
                } else {
                    movingCarArray.forEach(async (item, i) => {
                        this.buttonReset.classList.add('button-disabled');
                        this.buttonRace.classList.remove('button-disabled');
                        await super.drivingMode(carsId[i], 'stopped');
                        item.returnOnStartPosition(carCoordsArray[i].start);
                        this.buttonReset.onclick = null;
                    });
                }
            }
        };
    }

    private buttonsTogglerOnMoving(buttonA: HTMLElement, buttonB: HTMLElement, onMoving: boolean): void {
        if (onMoving) {
            buttonA.classList.add('button-disabled');
            buttonB.classList.remove('button-disabled');
            this.buttonRace.classList.add('button-disabled');
        } else {
            buttonA.classList.remove('button-disabled');
            buttonB.classList.add('button-disabled');
            this.buttonRace.classList.remove('button-disabled');
        }
    }

    private eventButtonSelect(trgt: HTMLElement): void {
        this.buttonUpdate.classList.remove('button-disabled');
        if (trgt.parentElement?.parentElement) {
            this.selectedCarTrack = trgt.parentElement?.parentElement;
            const carModel = this.selectedCarTrack.firstChild?.lastChild?.textContent;
            if (carModel) {
                this.inputUpdateText.value = carModel;
            }
            const car = this.selectedCarTrack.children[1].children[2] as HTMLElement;
            const carColor = car.children[0].children[1].getAttribute('fill');
            if (carColor) {
                this.inputUpdateColor.value = carColor;
            }
        }
    }

    private eventUpdateButton(): void {
        this.buttonUpdate.onclick = async () => {
            if (this.selectedCarTrack instanceof HTMLElement) {
                const carModel = this.inputUpdateText.value;
                const carColor = this.inputUpdateColor.value;
                const trackId = this.selectedCarTrack.dataset.id as string;
                await super.updateCar(+trackId, carModel, carColor);
                this.selectedCarTrack = null;
                this.inputUpdateText.value = '';
                this.inputUpdateColor.value = '#000000';
                this.buttonUpdate.classList.add('button-disabled');
            }
        };
    }

    private eventButtonGenerateCars(): void {
        this.buttonGenerateCars.onclick = async () => {
            const arrayOfHundredCars: typeCarCeator[] = [];
            for (let i = 0; i < 100; i += 1) {
                arrayOfHundredCars.push({ name: this.utils.getCarModel(), color: this.utils.getRandomColor() });
            }
            await super.createHundredCars(arrayOfHundredCars);
            this.buttonNextGarage.classList.remove('button-disabled');
        };
    }

    private eventPaginationNext(): void {
        this.buttonNextGarage.onclick = async () => {
            const maxPageNumber = Math.ceil(this.numberOfCars / 7);
            if (maxPageNumber > this.pageNumber) {
                await super.paginationGarage(this.pageNumber + 1);
                this.pageNumberGarage.textContent = `Page ${this.pageNumber}`;
                sessionStorage.setItem('pageNumber', `${this.pageNumber}`);
                if (maxPageNumber === this.pageNumber) {
                    this.buttonNextGarage.classList.add('button-disabled');
                }
                this.buttonPrevGarage.classList.remove('button-disabled');
                this.buttonUpdate.classList.add('button-disabled');
                this.inputUpdateText.value = '';
                this.inputUpdateColor.value = '#000000';
            }
        };
    }

    private eventPaginationPrev(): void {
        this.buttonPrevGarage.onclick = async () => {
            if (this.pageNumber > 1) {
                await super.paginationGarage(this.pageNumber - 1);
                this.pageNumberGarage.textContent = `Page ${this.pageNumber}`;
                sessionStorage.setItem('pageNumber', `${this.pageNumber}`);
                if (this.pageNumber === 1) {
                    this.buttonPrevGarage.classList.add('button-disabled');
                }
                this.buttonNextGarage.classList.remove('button-disabled');
                this.buttonUpdate.classList.add('button-disabled');
                this.inputUpdateText.value = '';
                this.inputUpdateColor.value = '#000000';
            }
        };
    }
}
