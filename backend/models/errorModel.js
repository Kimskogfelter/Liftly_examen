// egen klass med namnet HttpError som tar egenskaper genom extends Error som redan finns i javascript
// tex. message och errorCode
// constructor är en funktion som körs när ett nytt error skapas
// super anropar Error klassens konstruktor och gör att message sparas
// this.code lägger till en egen egenskap som heter code, gör det möjligt att skilja på feltyper tex. 404, 500
export class HttpError extends Error {

    constructor(message, errorCode) {
        super(message);
        this.code = errorCode;
    }
}