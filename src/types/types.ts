/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
export type typeCar = {
    name: string;
    color: string;
    id: number;
};

export type typeCarCeator = {
    name: string;
    color: string;
};

export type dataResponseStartDriving = {
    velocity: number;
    distance: number;
};

export type carCoordsType = {
    start: number;
    finish: number;
    distance: number;
};

export type typeWinnerCeator = {
    id: number;
    wins: number;
    time: number;
};

export type typeWinner = {
    id: number;
    num: number;
    color: string;
    model: string;
    wins: number;
    time: number;
};

export type typeWinnerPut = {
    wins: number;
    time: number;
};

export interface IUtils {
    carsMark: string[];
    carPostfix: string[];
    getRandomNum(): number;
    getCarModel(): string;
    getRandomColor(): string;
    updateCarCounts(garageCount: HTMLElement, carsNumber: number): void;
    updateWinnerCounts(winnerCount: HTMLElement, winnersNumber: number): void;
    getDistance(car: HTMLElement, flag: HTMLElement): carCoordsType;
}

export interface IEventsGarage {
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
    utils: IUtils;
    createEventListeners(): void;
}

export interface IEventsWinners {
    winnerElementsArray: HTMLElement[];
    winnersTableHeader: HTMLElement;
    buttonWins: HTMLElement;
    buttonTime: HTMLElement;
    eventCreateWinner(id: string, time: number): Promise<void>;
    initializationWinners(): void;
}

export interface IAnimationCars {
    car: HTMLElement;
    duration: number;
    distance: number;
    animationStep: number;
    startAnimationTime: number;
    onRace: boolean;
    eventWinners: IEventsWinners;
    driving(): void;
    stopAnimation(): void;
    returnOnStartPosition(startX: number, carWidth: number): void;
}

export interface IRendering {
    startRendering(): (HTMLElement | HTMLElement[])[];
    createTrack(element: HTMLElement, carColor: string, carModelName: string): HTMLElement;
    createTableRow(
        element: HTMLElement,
        rowNum: number,
        color: string,
        model: string,
        wins: number,
        time: number
    ): HTMLElement;
}

export interface IRequestsSender {
    domen: string;
    controller: AbortController;
    get(url: string, id: number): Promise<typeCar | typeWinnerCeator | undefined>;
    getArray(url: string, queryParams: string[][]): Promise<(string | typeCar[] | typeWinnerCeator[])[] | undefined>;
    post(url: string, objParams: typeCarCeator | typeWinnerCeator): Promise<void>;
    put(url: string, id: string, objParams: typeCarCeator | typeWinnerPut): Promise<void>;
    delete(url: string, id: string): Promise<void>;
    patch(url: string, queryParams: string[][]): Promise<dataResponseStartDriving | undefined>;
    patchAbort(url: string, queryParams: string[][]): Promise<boolean>;
}

export interface IRequestsHandler {
    baseURL: string;
    trackContainer: HTMLElement;
    garageCount: HTMLElement;
    arrayOfCars: typeCar[];
    utils: IUtils;
    numberOfCars: number;
    numberOfWinners: number;
    pageNumber: number;
    pageNumberWinners: number;
    winnerElementsArray: HTMLElement[];
    winnersCount: HTMLElement;
    tableContainerRows: HTMLElement;
    requestSender: IRequestsSender;
    winnersButtonPrev: HTMLElement;
    winnersButtonNext: HTMLElement;
    winnersPageElement: HTMLElement;
    getCars(page: number): Promise<void>;
    createCar(textValue: string, colorValue: string): Promise<void>;
    createHundredCars(arrayOfHundredcars: typeCarCeator[]): Promise<void>;
    updateCar(trackId: number, carModel: string, carColor: string): Promise<void>;
    deleteCar(track: HTMLElement): Promise<void>;
    drivingMode(Id: number, status: string): Promise<boolean | dataResponseStartDriving>;
    getWinners(page: number, sort: string, order: string): Promise<void>;
    createWinner(idWinner: number, timeCar: number): Promise<void>;
    updateWinner(winnerId: number, winsWin: number, timeWin: number): Promise<void>;
    deleteWinner(winnerId: number): Promise<void>;
    paginationWinners(winnersNum: number, pageNumber: number): Promise<void>;
    paginationGarage(pageNum: number): Promise<void>;
    winnersSort(elem: HTMLElement): Promise<void>;
    bestTimeSort(elem: HTMLElement): Promise<void>;
}
