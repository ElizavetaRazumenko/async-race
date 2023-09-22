/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
import { IUtils, carCoordsType } from '../../types/types';
export class Utils implements IUtils {
    carsMark: string[];

    carPostfix: string[];

    constructor() {
        this.carsMark = [
            'BMW',
            'Volvo',
            'Lada',
            'Volkswagen',
            'Toyota',
            'Skoda',
            'Renault',
            'Peugeot',
            'Opel',
            'Citroen',
        ];
        this.carPostfix = ['Qashqai', 'Patrol', 'S60', 'S90', 'XC40', 'X6', 'Z4', 'Camry', 'RAV4', 'Fortuner'];
    }

    public getRandomNum(): number {
        const randomNum = Math.random() * 10;
        return Math.floor(randomNum);
    }

    public getCarModel(): string {
        return `${this.carsMark[this.getRandomNum()]} ${this.carPostfix[this.getRandomNum()]}`;
    }

    public getRandomColor(): string {
        const colorString = '0123456789abcdef';
        let hashtag = '#';
        for (let i = 0; i < 6; i += 1) {
            hashtag += colorString[Math.floor(Math.random() * colorString.length)];
        }
        return hashtag;
    }

    public updateCarCounts(garageCount: HTMLElement, carsNumber: number): void {
        garageCount.textContent = `Garage (${carsNumber})`;
    }

    public updateWinnerCounts(winnerCount: HTMLElement, winnersNumber: number): void {
        winnerCount.textContent = `Winners (${winnersNumber})`;
    }

    public getDistance(car: HTMLElement, flag: HTMLElement): carCoordsType {
        const carCoordsOnStart = car.getBoundingClientRect().left;
        const carCoordsOnFinish = flag.getBoundingClientRect().right - 15;
        const length = Math.round(carCoordsOnFinish - carCoordsOnStart);
        return {
            start: carCoordsOnStart,
            finish: carCoordsOnFinish,
            distance: length,
        };
    }
}
