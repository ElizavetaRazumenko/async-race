/* eslint-disable max-len */
import { EventsWinners } from '../basic-events/eventemitterWinners';
import { arrayOfElements } from '../../index';
import { IAnimationCars } from '../../types/types';

export class AnimationCars implements IAnimationCars {
    car: HTMLElement;

    duration: number;

    distance: number;

    animationStep: number;

    startAnimationTime: number;

    onRace: boolean;

    eventWinners: EventsWinners;

    static Winner: HTMLElement | null;

    static Duration = new Map();

    constructor(trgt: HTMLElement, ms: number, length: number, onRace: boolean) {
        this.car = trgt;
        this.duration = ms;
        this.distance = length;
        this.animationStep = 0;
        this.startAnimationTime = 0;
        this.onRace = onRace;
        this.eventWinners = new EventsWinners(arrayOfElements);
    }

    public driving(): void {
        AnimationCars.Winner = null;
        this.startAnimationTime = new Date().getTime();
        AnimationCars.Duration.set(this.duration, this.duration);
        this.step();
    }

    private step(): void {
        const currentTime = new Date().getTime();
        const progress = (currentTime - this.startAnimationTime) / this.duration;
        const translate = progress * this.distance;
        this.car.style.transform = `translateX(${translate}px)`;
        if (progress < 1) {
            this.animationStep = requestAnimationFrame(this.step.bind(this));
        }
        if (progress >= 1) {
            cancelAnimationFrame(this.animationStep);
            if (!AnimationCars.Winner && this.onRace) {
                const buttonReset = document.querySelector('.button-reset') as HTMLElement;
                buttonReset.classList.remove('button-disabled');

                this.determineTheWinner();
            }
        }
    }

    private determineTheWinner(): void {
        AnimationCars.Winner = this.car;
        const carTrack = this.car.parentElement?.parentElement as HTMLElement;
        const carId = carTrack.dataset.id as string;
        this.eventWinners.eventCreateWinner(carId, this.duration / 1000);
        this.loggingTheWinner();
    }

    public stopAnimation(): void {
        cancelAnimationFrame(this.animationStep);
    }

    public returnOnStartPosition(startX: number, carWidth = 120): void {
        this.car.style.transform = `translateX(${startX - carWidth}px)`;
    }

    private loggingTheWinner(): void {
        const winnerNotify = document.querySelector('.winner-notification') as HTMLElement;
        const carModel = this.car.parentElement?.previousSibling?.lastChild as HTMLElement;
        winnerNotify.textContent = `${carModel.textContent} arrived first in ${this.duration / 1000}s.\n
        Click to continue`;
        winnerNotify.classList.remove('hidden');
        const body = document.querySelector('body') as HTMLElement;
        body.onclick = () => {
            winnerNotify.classList.add('hidden');
            body.onclick = null;
        };
    }
}
