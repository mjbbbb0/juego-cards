export class Random {

    constructor(seed) {

        this.seed = seed;

    }


    next() {

        this.seed =
            (this.seed * 1664525 + 1013904223)
            % 4294967296;


        return this.seed / 4294967296;

    }


    nextInt(min, max) {

        return Math.floor(
            this.next() * (max - min + 1)
        ) + min;

    }


    chance(probability) {

        return this.next() < probability;

    }


    pick(array) {

        if (array.length === 0) {

            return null;

        }


        const index =
            this.nextInt(
                0,
                array.length - 1
            );


        return array[index];

    }

}