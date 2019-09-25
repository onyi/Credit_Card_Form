import * as cardType from '../components/credit_card_type';

export const getCardTypeByNumber = (cardNum) => {

    if(cardNum.toString().match(/^4/g) !== null){
        return cardType.visa;
    }
    else if(cardNum.toString().match(/^(3[4|7])/g) !== null){
        return cardType.amEx;
    }else{
        //Add more logic in the future
        return cardType.unknown
    }


}