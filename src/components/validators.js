
import * as cardType from '../components/credit_card_type';

export const checkNumber = (input) => {
    return input.toString().match(/^[\d]{1,}$/) !== null;
}

export const checkCvv2 = (input, type) => {
    switch(type){
        case cardType.amEx:
            return input.toString().match(/^[0-9]{4}$/g) !== null;
        case cardType.visa:
            return input.toString().match(/^[0-9]{3}$/g) !== null;
        default: 
            return checkNumber(input);
    }

}


export const checkMonth = (input) => {
    return input.toString().match(/^([0]?[1-9]{1}|[1][012])$/g) !== null;
}

export const checkYear = (input) => {
    // year is gonna be two digit in this case
    let currYear = new Date().getFullYear().toString().substr(-2);
    return input.toString().match(/^[0-9]{2}$/g) !== null && parseInt(input) >= currYear;
}


export const checkName = (input) => {
    return input.toString().match(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g) !== null;
}


export const checkCurrYear = (input) => {
    let currYear = new Date().getFullYear().toString().substr(-2);
    return input === currYear;
}

export const checkMonthByCurrYear = (input) => {
    let currMonth = new Date().getMonth() + 1;
    console.log(`input: ${parseInt(input)}, currMonth: ${currMonth}`);
    return parseInt(input) >= currMonth;
}