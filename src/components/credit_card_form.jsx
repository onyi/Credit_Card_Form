import React, {useState, useEffect} from 'react';

import visa from '../images/iconfinder_Visa-Curved_70599.png'; // Tell Webpack this JS file uses this image
import discover from '../images/iconfinder_Discover-Curved_70605.png'; // Tell Webpack this JS file uses this image
import master from '../images/iconfinder_Mastercard-Curved_70593.png'; // Tell Webpack this JS file uses this image
import amEx from '../images/iconfinder_American-Express-Curved_70583.png'; // Tell Webpack this JS file uses this image

import * as cardType from './credit_card_type';

import {getCardTypeByNumber} from '../utils/helper';

import {debounce} from '../utils/debounce'; 

import * as cardErrors from './credit_card_form_errors';

import {
    checkNumber,
    checkCvv2,
    checkMonth,
    checkYear,
    checkName,
    checkCurrYear,
    checkMonthByCurrYear
} from '../components/validators'

function CreditCardForm(){

    const [ cardInfo, setCardInfo ] = useState({
        name: "",
        cardNum: "",
        cvv: "",
        expMonth: "",
        expYear: ""
    });

    const [ errors, setErrors ] = useState({
        name: "",
        cardNum: "",
        cvv: "",
        expMonth: "",
        expYear: ""
    })

    const [ cvvLength, setCvvLength] = useState(3);
    const [ cardLength, setCardLength] = useState(16);
    const [ type, setType] = useState(cardType.unknown);

    const handleSubmit = (e) => {
        e.preventDefault(); 
        // Submit cardInfo object to API endpoint, and either process to next step or display error based on API result 

        //axios.post()

        console.log(`Handle Submit`);


        if( Object.values(errors).every( error => error === "" ) && Object.values(cardInfo).every( ele => ele !== "" ) ){
            console.log(`Contains Credit Card info without error, ready to submit data`);
        }
    }

    const handleCardNumber = (num) => {
        num = clearNumberFormat(num);
        if(type === cardType.visa){
            return num.toString().split("").map( (el, idx) => (idx+1) % 4 === 0 ? el+" " : el  ).join("").trim();
        }
        else if(type === cardType.amEx){
           return num.toString().split("").map( (el, idx) => 
                (idx+1) === 4 || (idx+1) === 10 ? el+" " : el  ).join("").trim();
        }else{
            return num;
        }
    }

    const setCardType = (num) => {
        num = clearNumberFormat(num);
        let newType = getCardTypeByNumber(num);
        setType(newType);
        if(type === cardType.visa){
            setCardLength(16);
            setCvvLength(3);
        }
        else if(type === cardType.amEx){
            setCardLength(15);
            setCvvLength(4);
        }
        // add more credit card type in the future
        return newType;
    }

    const clearNumberFormat = (num) => {
        return num.toString().replace(/[ ]/g, "");
    }

    const update = (e) => {
        e.preventDefault();
        //Logic to check card number, cvv, month, and year
        let val = e.currentTarget.value;
        let inputName = e.currentTarget.name;
        let update = true; //determine whether component input field should update

        // console.log(`Card Type: ${type}, CVV: ${cvvLength}, Num Length: ${cardLength}`);
        
        //Filter out invalid input for numeric only input fields
        if(["cardNum", "expMonth", "expYear", "cvv"].includes(inputName)){
            if(val && !checkNumber(clearNumberFormat(val))){
                return;
            }
        }
        let newCardType = cardType.unknown;
        if(inputName === "cardNum"){  //Determine what Credit Card type is based on Card Number
            // debugger;
            newCardType = setCardType(val); //Get Credit Card type based on current Credit Card number input value
            //When Card type changed, should also trigger CVV check
            if(cardInfo.cvv && !checkCvv2(cardInfo.cvv, newCardType) ) {
                errors.cvv = `CVV should be ${cvvLength} integers!`;
                // update = false;
            }
        }

        switch(inputName){
            case "name":
                if(val && !checkName(val.trim())) {
                    errors.name = cardErrors.nameError;
                    // update = false;
                } else{
                    errors.name = "";
                }
                break;
            case "cardNum": 
                // if(val && !checkNumber(clearNumberFormat(val) ) ) {
                //     errors.cardNum = cardErrors.invalidCardFormat;
                //     update = false;
                // }

                if(val && newCardType === cardType.unknown){
                    errors.cardNum = `Your Credit Card is unsupported`;
                }
                else{
                    errors.cardNum = ``;
                }
                
                if(clearNumberFormat(val).length > cardLength) { // if card number is already at the maximum length, do not update
                    update = false;
                }else{
                    if(cardInfo.cvv && !checkCvv2(cardInfo.cvv, type) ) {
                        // console.log(`Invalid CVV`);
                        errors.cvv = `CVV should be ${cvvLength} integers!`;
                    }else{
                        errors.cvv = "";
                    }
                }

                val = handleCardNumber(val); //helper method to format number string with space according to card type
                break;
            case "cvv":
                if(val && !checkCvv2(val, type) ) {
                    errors.cvv = `CVV should be ${cvvLength} integers!`;
                    // update = false;
                }else{
                    errors.cvv = "";
                }
                break;
            case "expYear":
                checkMonthYear(cardInfo.expMonth, val);
                break;
            case "expMonth":
                checkMonthYear(val, cardInfo.expYear);
                break;
            default: 
                break;
        }

        if(update){
            setCardInfo({ ...cardInfo, [inputName]: val});
            setErrors( { ...errors } );
        }else{
            setErrors( {...errors });
        }
        // console.log(`State: ${JSON.stringify(cardInfo)}`)
    }

    //Helper method to check Month and Year together because sometimes they are depending on each other
    const checkMonthYear = (month, year) => {
        let hasError = false;

        if(year && ! checkYear(year) ) {
            errors.expYear = cardErrors.expYear;
            // update = false;
        }else{
            errors.expYear = "";
        }

        if(checkCurrYear(year)){ //if it is current year
            if(month && !checkMonthByCurrYear(month)){
                hasError = true;
                errors.expMonth = cardErrors.pastMonth;
            }
        }
        else{ // else, just check month normally
            if( month && !checkMonth(month) ) {
                errors.expMonth = cardErrors.expMonth;
                hasError = true;
                // update = false;
            }
        }
        if(!hasError){
            errors.expMonth = "";
        }
        return hasError;
    }


    const {name, cardNum, cvv, expMonth, expYear} = cardInfo;

    return (
        <div className="ccform-body">
            <form className="ccform-content " onSubmit={handleSubmit}>
                <div className="ccform-row">
                    <span>Enter your credit card information</span>
                </div>

                <div className="ccform-row">
                    <input type="text" name="name" value={name} placeholder="Name" 
                        className="form-control ccform__input"
                        onChange={update}></input>
                </div>

                { errors.name && 
                        <div className="ccform-error">
                            <span>{errors.name}</span>
                        </div>
                }

                <div className="ccform-row">
                    <input type="text" name="cardNum" value={cardNum} placeholder="Card Number" 
                        className={`form-control ccform__input ${errors.cardNum && "is-invalid"}`}
                        onChange={update}></input>
                </div>

                { errors.cardNum && 
                        <div className="ccform-error">
                            <span>{errors.cardNum}</span>
                        </div>
                }

                <div className="ccform-row">
                    <input type="text" name="cvv" maxLength={cvvLength} value={cvv} placeholder="CVV2" 
                        className={`form-control ccform__input  ${errors.cvv && "is-invalid"}`} onChange={update}></input>
                </div>

                { errors.cvv && 
                    <div className="ccform-error">
                        <span>{errors.cvv}</span>
                    </div>
                }

                <div className="ccform-row ccdate row">

                    <div className="col-xs-2">
                        <input type="text" name="expMonth" maxLength="2" value={expMonth} placeholder="Exp. Month" 
                        className={`form-control ccform__input  ${errors.expMonth && "is-invalid"}`} onChange={update}></input>
                    </div>
                    <div className="col-xs-2">
                        <input type="text" maxLength="2" name="expYear" value={expYear} placeholder="Exp. Year" 
                        className={`form-control ccform__input  ${errors.expYear && "is-invalid"}`} onChange={update}></input>
                    </div>

                </div>

                { errors.expYear && 
                        <div className="ccform-error">
                            <span>{errors.expYear}</span>
                        </div>
                }


                { errors.expMonth && 
                        <div className="ccform-error">
                            <span>{errors.expMonth}</span>
                        </div>
                }


                <div className="ccform-row ccimages">
                    <img className={`ccimages__image ${type === cardType.visa && "ccimages__image--selected"}`} alt="visa" src={visa}></img>
                    {/* <img className={`ccimages__image ${type === cardType.discover && "ccimages__image--selected"}`} alt="discover" src={discover}></img>
                    <img className={`ccimages__image ${type === cardType.master && "ccimages__image--selected"}`} alt="master" src={master}></img> */}
                    <img className={`ccimages__image ${type === cardType.amEx && "ccimages__image--selected"}`} alt="amEx" src={amEx}></img>
                </div>
                
                <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
            </form>

        </div>
    )

}


export default CreditCardForm;