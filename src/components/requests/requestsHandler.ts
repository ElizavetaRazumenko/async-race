/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Utils } from '../utils/utils';
import { Rendering } from '../rendering/rendering';
import { RequestsSender } from './requestsSender';
// eslint-disable-next-line object-curly-newline
import { typeCar, typeCarCeator, dataResponseStartDriving, typeWinnerCeator, IRequestsHandler } from '../../types/types';

export class RequestsHandler extends Rendering implements IRequestsHandler {
    baseURL: string;

    trackContainer: HTMLElement;

    garageCount: HTMLElement;

    arrayOfCars: typeCar[];

    utils: Utils;

    numberOfCars: number;

    numberOfWinners: number;

    pageNumber: number;

    pageNumberWinners: number;

    winnerElementsArray: HTMLElement[];

    winnersCount: HTMLElement;

    tableContainerRows: HTMLElement;

    requestSender: RequestsSender;

    winnersButtonPrev: HTMLElement;

    winnersButtonNext: HTMLElement;

    winnersPageElement: HTMLElement;

    constructor(arrayOfElements: (HTMLElement | HTMLElement[])[]) {
        super();
        this.baseURL = 'http://127.0.0.1:3000';
        this.trackContainer = arrayOfElements[5] as HTMLElement;
        this.garageCount = arrayOfElements[4] as HTMLElement;
        this.winnerElementsArray = arrayOfElements[2] as HTMLElement[];
        this.tableContainerRows = this.winnerElementsArray[3].lastChild as HTMLElement;
        this.winnersCount = this.winnerElementsArray[1] as HTMLElement;
        this.winnersPageElement = this.winnerElementsArray[2] as HTMLElement;
        this.winnersButtonPrev = this.winnerElementsArray[5] as HTMLElement;
        this.winnersButtonNext = this.winnerElementsArray[6] as HTMLElement;
        this.arrayOfCars = [];
        this.numberOfCars = 0;
        this.numberOfWinners = 0;
        this.pageNumber = 1;
        this.pageNumberWinners = 1;
        this.utils = new Utils();
        this.requestSender = new RequestsSender(this.baseURL);
    }

    public async getCars(page = 1): Promise<void> {
        this.pageNumber = page;
        const queryParams = [['_page', `${page}`], ['_limit', '7']];
        const data = await this.requestSender.getArray('garage', queryParams);
        if (data) {
            this.arrayOfCars = data[0] as typeCar[];
            this.numberOfCars = +data[1];
            this.utils.updateCarCounts(this.garageCount, this.numberOfCars);
            this.trackContainer.innerHTML = '';
            this.arrayOfCars.forEach((car: typeCar) => {
                const currentTrack = super.createTrack(this.trackContainer, car.color, car.name);
                currentTrack.setAttribute('data-id', `${car.id}`);
            });
        }
    }

    public async createCar(textValue: string, colorValue: string): Promise<void> {
        const car: typeCarCeator = {
            name: textValue,
            color: colorValue,
        };
        await this.requestSender.post('garage', car);
        await this.getCars(this.pageNumber);
    }

    public async createHundredCars(arrayOfHundredcars: typeCarCeator[]): Promise<void> {
        await Promise.all(
            arrayOfHundredcars.map((car) => {
                return this.requestSender.post('garage', car);
            }),
        ).then(async () => {
            await this.getCars(this.pageNumber);
        });
    }

    public async updateCar(trackId: number, carModel: string, carColor: string): Promise<void> {
        const carIndex = this.arrayOfCars.findIndex((car) => {
            return car.id === trackId;
        });
        const carId = trackId;
        this.arrayOfCars[carIndex].name = carModel;
        this.arrayOfCars[carIndex].color = carColor;
        const car = {
            name: carModel,
            color: carColor,
        };
        await this.requestSender.put('garage', `${carId}`, car);
        await this.getCars(this.pageNumber);
    }

    public async deleteCar(track: HTMLElement): Promise<void> {
        let carId: string;
        if (track.dataset.id) {
            carId = track.dataset.id;
            const winner = await this.requestSender.get('winners', +carId) as (typeWinnerCeator | undefined);
            await this.requestSender.delete('garage', `${carId}`);
            if (winner) {
                await this.deleteWinner(+carId);
                await this.getWinners(this.pageNumberWinners);
            }
            await this.getCars(this.pageNumber);
        }
    }

    public async drivingMode(Id: number, status: string): Promise<boolean | dataResponseStartDriving> {
        const queryParams = [['id', `${Id}`], ['status', `${status}`]];
        if (status === 'drive') {
            const response = await this.requestSender.patchAbort('engine', queryParams);
            return response;
        }
        const dataResponse: dataResponseStartDriving = await this.requestSender.patch('engine', queryParams) as dataResponseStartDriving;
        return dataResponse;
    }

    public async getWinners(page = 1, sort = 'id', order = 'ASC'): Promise<void> {
        this.pageNumberWinners = page;
        sessionStorage.setItem('pageNumberWinners', `${this.pageNumberWinners}`);
        this.winnersPageElement.textContent = `Page ${this.pageNumberWinners}`;
        const queryParams = [['_page', `${page}`], ['_limit', '10'], ['_sort', `${sort}`], ['_order', `${order}`]];
        const response = await this.requestSender.getArray('winners', queryParams);
        if (response) {
            const winners = response[0] as typeWinnerCeator[];
            if (winners.length === 0 && this.pageNumberWinners > 1) {
                console.log('Попали');
                await this.getWinners(this.pageNumberWinners - 1);
            }
            this.numberOfWinners = +response[1];
            this.utils.updateWinnerCounts(this.winnersCount, this.numberOfWinners);
            this.tableContainerRows.innerHTML = '';
            const carInfo = await Promise.all(winners.map((item) => {
                return this.requestSender.get('garage', item.id);
            })) as typeCar[];
            winners.forEach((winner: typeWinnerCeator, index) => {
                const car = carInfo.find((item) => item.id === winner.id) as typeCar;
                const currentRow = super.createTableRow(
                    this.tableContainerRows,
                    ((this.pageNumberWinners - 1) * 10 + index + 1),
                    car.color,
                    car.name,
                    winner.wins,
                    winner.time,
                );
                currentRow.setAttribute('data-id-win', `${winner.id}`);
            });
            await this.paginationWinners(this.numberOfWinners, this.pageNumberWinners);
        }
    }

    public async createWinner(idWinner: number, timeCar: number): Promise<void> {
        const winner: typeWinnerCeator = {
            id: idWinner,
            wins: 1,
            time: timeCar,
        };
        const winnerInfo = await this.requestSender.get('winners', idWinner) as (typeWinnerCeator | undefined);
        if (winnerInfo && winnerInfo.id) {
            if (winnerInfo.time > timeCar) {
                await this.updateWinner(idWinner, winnerInfo.wins + 1, timeCar);
            } else {
                await this.updateWinner(idWinner, winnerInfo.wins + 1, winnerInfo.time);
            }
        } else {
            await this.requestSender.post('winners', winner);
        }
        await this.getWinners(this.pageNumberWinners);
    }

    public async updateWinner(winnerId: number, winsWin: number, timeWin: number): Promise<void> {
        const winner = {
            wins: winsWin,
            time: timeWin,
        };
        await this.requestSender.put('winners', `${winnerId}`, winner);
    }

    public async deleteWinner(winnerId: number): Promise<void> {
        await this.requestSender.delete('winners', `${winnerId}`);
    }

    public async paginationWinners(winnersNum: number, pageNumber: number): Promise<void> {
        if (winnersNum > pageNumber * 10) {
            this.winnersButtonNext.classList.remove('button-disabled');
        } else if (pageNumber > 1) {
            this.winnersButtonPrev.classList.remove('button-disabled');
        } else if (pageNumber === 1) {
            this.winnersButtonPrev.classList.add('button-disabled');
        }

        this.winnersButtonNext.onclick = async () => {
            if (!this.winnersButtonNext.classList.contains('button-disabled')) {
                const maxPageNumber = Math.ceil(winnersNum / 10);
                if (maxPageNumber === pageNumber + 1) {
                    this.winnersButtonNext.classList.add('button-disabled');
                }
                await this.getWinners(pageNumber + 1);
            }
        };

        this.winnersButtonPrev.onclick = async () => {
            if (!this.winnersButtonPrev.classList.contains('button-disabled')) {
                if (pageNumber - 1 === 1) {
                    this.winnersButtonPrev.classList.add('button-disabled');
                }
                await this.getWinners(pageNumber - 1);
            }
        };
    }

    public async paginationGarage(pageNum: number): Promise<void> {
        this.pageNumber = pageNum;
        this.getCars(this.pageNumber);
    }

    public async winnersSort(elem: HTMLElement): Promise<void> {
        if (elem.classList.contains('ASC')) {
            await this.getWinners(this.pageNumberWinners, 'wins', 'ASC');
        } else {
            await this.getWinners(this.pageNumberWinners, 'wins', 'DESC');
        }
    }

    public async bestTimeSort(elem: HTMLElement): Promise<void> {
        if (elem.classList.contains('ASC')) {
            await this.getWinners(this.pageNumberWinners, 'time', 'ASC');
        } else {
            await this.getWinners(this.pageNumberWinners, 'time', 'DESC');
        }
    }
}
