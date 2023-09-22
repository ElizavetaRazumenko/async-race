/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable max-len */
/* eslint-disable comma-dangle */
import './rendering.css';
import { carInnerCode, carInnerCodeWinners } from './carCode';
import { IRendering } from '../../types/types';
export class Rendering implements IRendering {
    public startRendering(): (HTMLElement | HTMLElement[])[] {
        const body = document.querySelector('body')!;
        const togglerContainerArray: HTMLElement[] = this.toggleButtonsBlock(body);
        const main = this.createMain(body);
        const carCreatorElements: HTMLElement[] = this.carCreatorBlock(main);
        const garageInfo: HTMLElement = this.createPharagraphElement('garage-info', 'Garage (0)');
        const pageNumber: HTMLElement = this.createPharagraphElement('page-number page-number-garage', 'Page 1');
        main.append(garageInfo, pageNumber);
        const trackContainer = this.createTrackContainer(main);
        const paginationContainer = this.createpaginationButtons(main);
        const winnerPageElements = this.createWinners(body);
        this.createWinnerNotification(body);
        return [
            togglerContainerArray,
            main,
            winnerPageElements,
            carCreatorElements,
            garageInfo,
            trackContainer,
            paginationContainer,
        ];
    }

    private toggleButtonsBlock(element: HTMLElement): HTMLElement[] {
        const container = this.createDivElement('toggler-container');
        const garageToggle = this.createDivElement('toggler garage-toggle button-disabled', 'to garage');
        const winnersToggle = this.createDivElement('toggler winners-toggle', 'to winners');
        container.append(garageToggle, winnersToggle);
        element.append(container);
        return [garageToggle, winnersToggle];
    }

    private carCreatorBlock(element: HTMLElement): HTMLElement[] {
        const container = this.createDivElement('creator-container');
        const containerForCreate = this.createDivElement('input-creator-container');
        const inputCreateCarText = this.createInputElement('text-for-creator input-create', 'text');
        const inputCreateCarColor = this.createInputElement('color-for-creator input-create', 'color');
        const buttonForCreate = this.createDivElement('button button-create', 'create');
        containerForCreate.append(inputCreateCarText, inputCreateCarColor, buttonForCreate);
        const containerForUpdate = this.createDivElement('input-creator-container');
        const inputUpdateCarText = this.createInputElement('text-for-creator input-updator', 'text');
        const inputUpdateCarColor = this.createInputElement('color-for-creator input-updator', 'color');
        const buttonForUpdate = this.createDivElement('button button-update button-disabled', 'update');
        containerForUpdate.append(inputUpdateCarText, inputUpdateCarColor, buttonForUpdate);
        const containerForButtons = this.createDivElement('buttons-container');
        const buttonRace = this.createDivElement('button button-race', 'race');
        const buttonReset = this.createDivElement('button button-race button-reset button-disabled', 'reset');
        const buttonGenerate = this.createDivElement('button button-generate', 'generate cars');
        containerForButtons.append(buttonRace, buttonReset, buttonGenerate);
        container.append(containerForCreate, containerForUpdate, containerForButtons);
        element.append(container);
        return [
            inputCreateCarText,
            inputCreateCarColor,
            buttonForCreate,
            inputUpdateCarText,
            inputUpdateCarColor,
            buttonForUpdate,
            buttonRace,
            buttonReset,
            buttonGenerate,
        ];
    }

    private createTrackContainer(element: HTMLElement): HTMLElement {
        const container = this.createDivElement('track-container');
        element.append(container);
        return container;
    }

    public createTrack(element: HTMLElement, carColor = '#000000', carModelName = 'Audi Q3'): HTMLElement {
        const track = this.createDivElement('track');
        const navigationCarContainer = this.createDivElement('navigation-container');
        const buttonSelect = this.createDivElement('button button-select', 'select');
        const buttonRemove = this.createDivElement('button button-remove', 'remove');
        const carModel = this.createPharagraphElement('car-model', carModelName);
        navigationCarContainer.append(buttonSelect, buttonRemove, carModel);
        const carLineContainer = this.createDivElement('car-line-container');
        const buttonA = this.createDivElement('button button-A', 'On');
        const buttonB = this.createDivElement('button button-B button-disabled', 'Off');
        const car = this.createDivElement('car');
        car.innerHTML = carInnerCode;
        car.children[0].children[1].setAttribute('fill', carColor);
        const flag = this.createDivElement('flag');
        carLineContainer.append(buttonA, buttonB, car, flag);
        track.append(navigationCarContainer, carLineContainer);
        element.append(track);
        return track;
    }

    private createpaginationButtons(element: HTMLElement): HTMLElement[] {
        const paginationContainer = this.createDivElement('pagination-container');
        const leftButton = this.createDivElement('button button-left button-disabled', 'prev');
        const rightButton = this.createDivElement('button button-right button-disabled', 'next');
        paginationContainer.append(leftButton, rightButton);
        element.append(paginationContainer);
        return [leftButton, rightButton];
    }

    private createWinners(element: HTMLElement): HTMLElement[] {
        const container = this.createDivElement('winners-container hidden');
        const winnersInfo = this.createPharagraphElement('winners-info', 'Winners (0)');
        const pageNumberWinners = this.createPharagraphElement('page-number page-number-winners', 'Page 1');
        const tableContainer = this.createDivElement('table-container');
        const tableHeader = this.createwinnersTableHeader(tableContainer);
        const tableContainerForRows = this.createDivElement('table-container-rows');
        tableContainer.append(tableContainerForRows);
        container.append(winnersInfo, pageNumberWinners, tableContainer);
        const paginationButtons: HTMLElement[] = this.createpaginationButtons(container);
        const buttonPrevWinners = paginationButtons[0];
        const buttonNextWinners = paginationButtons[1];
        element.append(container);
        return [
            container,
            winnersInfo,
            pageNumberWinners,
            tableContainer,
            tableHeader,
            buttonPrevWinners,
            buttonNextWinners,
        ];
    }

    private createwinnersTableHeader(element: HTMLElement): HTMLElement {
        const tableHeader = this.createDivElement('table-header');
        const arrayOfHeaderSells = [
            ['table-header-text table-number', 'Number'],
            ['table-header-text table-car', 'Car'],
            ['table-header-text table-name', 'Name'],
            ['table-header-text table-wins', 'Wins'],
            ['table-header-text table-best-time', 'Best time(s)'],
        ];
        arrayOfHeaderSells.forEach((item) => {
            tableHeader.append(this.createDivElement(item[0], item[1]));
        });
        element.append(tableHeader);
        return tableHeader;
    }

    public createTableRow(
        element: HTMLElement,
        rowNum: number,
        color: string,
        model: string,
        wins: number,
        time: number
    ): HTMLElement {
        const row = this.createDivElement('table-row');
        const arrayOfRowSells = [
            ['table-row-number', `${rowNum}`],
            ['table-row-car', ''],
            ['table-row-name', model],
            ['table-row-wins', `${wins}`],
            ['table-row-time', `${time.toFixed(2)}`],
        ];
        arrayOfRowSells.forEach((item, index) => {
            if (index === 1) {
                const car = this.createDivElement(item[0]);
                car.innerHTML = carInnerCodeWinners;
                car.children[0].children[1].setAttribute('fill', color);
                row.append(car);
            } else {
                row.append(this.createDivElement(item[0], item[1]));
            }
        });
        element.append(row);
        return row;
    }

    private createWinnerNotification(element: HTMLElement): void {
        const winner = this.createDivElement('winner-notification hidden', 'winner is');
        element.append(winner);
    }

    private createInputElement(classCss: string, type: string): HTMLElement {
        const input = document.createElement('input');
        input.className = classCss;
        input.type = type;
        return input;
    }

    private createDivElement(classCss: string, text?: string): HTMLElement {
        const div = document.createElement('div');
        div.className = classCss;
        if (text) {
            div.textContent = text;
        }
        return div;
    }

    private createPharagraphElement(classCss: string, content: string): HTMLElement {
        const p = document.createElement('p');
        p.className = classCss;
        p.textContent = content;
        return p;
    }

    private createMain(element: HTMLElement): HTMLElement {
        const main = document.createElement('main');
        main.className = 'main';
        element.append(main);
        return main;
    }
}
