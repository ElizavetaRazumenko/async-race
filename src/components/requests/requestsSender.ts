/* eslint-disable max-len */
/* eslint-disable prettier/prettier */
/* eslint-disable object-curly-newline */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { typeCar, typeCarCeator, typeWinnerCeator, typeWinnerPut, dataResponseStartDriving, IRequestsSender } from '../../types/types';

export class RequestsSender implements IRequestsSender {
    domen: string;

    controller: AbortController;

    constructor(url: string) {
        this.domen = url;
        this.controller = new AbortController();
    }

    public async get(url: string, id: number): Promise<typeCar | typeWinnerCeator | undefined> {
        try {
            const response = await fetch(`${this.domen}/${url}/${id}`);
            const data: typeCar | typeWinnerCeator = await response.json();
            return data;
        } catch (e) {
            console.log(e);
        }
    }

    public async getArray(
        url: string,
        queryParams: string[][],
    ): Promise<(string | typeCar[] | typeWinnerCeator[])[] | undefined> {
        try {
            const query = `?${queryParams.map((item) => `${item[0]}=${item[1]}`).join('&')}`;
            const response = await fetch(`${this.domen}/${url}${query}`);
            const data: typeCar[] | typeWinnerCeator[] = await response.json();
            const headerTotalCount = response.headers.get('X-Total-Count')!;
            return [data, headerTotalCount];
        } catch (e) {
            console.log(e);
        }
    }

    public async post(url: string, objParams: typeCarCeator | typeWinnerCeator): Promise<void> {
        try {
            await fetch(`${this.domen}/${url}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(objParams),
            });
        } catch (e) {
            console.log(e);
        }
    }

    public async put(url: string, id: string, objParams: typeCarCeator | typeWinnerPut): Promise<void> {
        try {
            await fetch(`${this.domen}/${url}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(objParams),
            });
        } catch (e) {
            console.log(e);
        }
    }

    public async delete(url: string, id: string): Promise<void> {
        try {
            await fetch(`${this.domen}/${url}/${id}`, {
                method: 'DELETE',
            });
        } catch (e) {
            console.log(e);
        }
    }

    public async patch(url: string, queryParams: string[][]): Promise<dataResponseStartDriving | undefined> {
        const query = `?${queryParams.map((item) => `${item[0]}=${item[1]}`).join('&')}`;
        let dataResponse: dataResponseStartDriving;
        try {
            const response = await fetch(`${this.domen}/${url}${query}`, {
                method: 'PATCH',
            });
            dataResponse = await response.json();
            return dataResponse;
        } catch (e) {
            console.log(e);
        }
    }

    public async patchAbort(url: string, queryParams: string[][]): Promise<boolean> {
        const query = `?${queryParams.map((item) => `${item[0]}=${item[1]}`).join('&')}`;
        try {
            const response = await fetch(`${this.domen}/${url}${query}`, {
                method: 'PATCH',
                signal: this.controller.signal,
            });
            if (response.status === 500) {
                return false;
            }
        } catch (e) {
            console.log(e);
        }
        return true;
    }
}
