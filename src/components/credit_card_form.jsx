import React, {Component, useState} from 'react';

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

class CreditCardForm extends React.Component {

    constructor(props){
        super(props);
        this.state = (
            {
                cardInfo: 
                    {
                        name: "",
                        cardNum: "",
                        cvv: "",
                        expMonth: "",
                        expYear: ""
                    },
                errors: {
                    name: "",
                    cardNum: "",
                    cvv: "",
                    expMonth: "",
                    expYear: ""
                },
            
            }
        );

        this.cvvLength = 3;
        this.cardLength = 16;
        this.type = cardType.unknown;
        this.update = this.update.bind(this);
        if(props.submitCallback){
            this.handleSubmit = props.submitCallback;
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setCardType = this.setCardType.bind(this);

    }

    handleSubmit(e){
        e.preventDefault(); 
        // Submit cardInfo object to API endpoint, and either process to next step or display error based on API result 

        //axios.post()

        console.log(`Handle Submit`);
    }

    handleCardNumber(num){
        num = this.clearNumberFormat(num);
        if(this.type === cardType.visa){
            return num.toString().split("").map( (el, idx) => (idx+1) % 4 === 0 ? el+" " : el  ).join("").trim();
        }
        else if(this.type === cardType.amEx){
           return num.toString().split("").map( (el, idx) => 
                (idx+1) === 4 || (idx+1) === 10 ? el+" " : el  ).join("").trim();
        }else{
            return num;
        }
    }

    setCardType(num){
        num = this.clearNumberFormat(num);
        this.type = getCardTypeByNumber(num);
        if(this.type === cardType.visa){
            this.cardLength = 16;
            this.cvvLength = 3;
        }
        else if(this.type === cardType.amEx){
            this.cardLength = 15;
            this.cvvLength = 4;
        }
        // add more credit card type in the future
    }

    clearNumberFormat(num){
        return num.toString().replace(/[ ]/g, "");

    }

    update(e){
        e.preventDefault();
        //Logic to check card number, cvv, month, and year
        let val = e.currentTarget.value;
        let name = e.currentTarget.name;
        let update = true; //determine whether component input field should update

        let errors = this.state.errors;

        // console.log(`Card Type: ${this.type}, CVV: ${this.cvvLength}, Num Length: ${this.cardLength}`);
        
        //Filter out invalid input for numeric only input fields
        if(["cardNum", "expMonth", "expYear", "cvv"].includes(name)){
            if(val && !checkNumber(this.clearNumberFormat(val))){
                return;
            }
        }

        if(name === "cardNum"){  //Determine what Credit Card type is based on Card Number
            this.setCardType(val);
            //When Card type changed, should also trigger CVV check
            if(this.state.cardInfo.cvv && !checkCvv2(this.state.cardInfo.cvv, this.type) ) {
                errors.cvv = `CVV should be ${this.cvvLength} integers!`;
                // update = false;
            }
        }

        switch(name){
            case "name":
                if(val && !checkName(val.trim())) {
                    errors.name = cardErrors.nameError;
                    // update = false;
                } else{
                    errors.name = "";
                }
                break;
            case "cardNum": 
                // if(val && !checkNumber(this.clearNumberFormat(val) ) ) {
                //     errors.cardNum = cardErrors.invalidCardFormat;
                //     update = false;
                // }
                if(val && this.type === cardType.unknown){
                    errors.cardNum = `Your Credit Card is unsupported`;
                }
                else{
                    errors.cardNum = ``;
                }
                
                if(this.clearNumberFormat(val).length > this.cardLength) { // if card number is already at the maximum length, do not update
                    update = false;
                }

                val = this.handleCardNumber(val); //helper method to format number string with space according to card type
                break;
            case "cvv":
                if(val && !checkCvv2(val, this.type) ) {
                    errors.cvv = `CVV should be ${this.cvvLength} integers!`;
                    // update = false;
                }else{
                    errors.cvv = "";
                }
                break;
            case "expYear":
                if(val && ! checkYear(val) ) {
                    errors.expYear = cardErrors.expYear;
                    // update = false;
                }else{
                    errors.expYear = "";

                }
                break;
            case "expMonth":
                let hasError = false;
                if(checkCurrYear(this.state.cardInfo.expYear)){ //if it is current year
                    if(val && !checkMonthByCurrYear(val)){
                        hasError = true;
                        errors.expMonth = cardErrors.pastMonth;
                    }
                }
                if( val && ! checkMonth(val) ) {
                    errors.expMonth = cardErrors.expMonth;
                    hasError = true;
                    // update = false;
                }
                if(!hasError){
                    errors.expMonth = "";
                }

                break;
            default: 
                break;
        }


        let cardInfo = this.state.cardInfo;
        if(update){
            cardInfo[name] = val;
            this.setState({
                cardInfo,
                errors
            });
        }else{
            this.setState({
                errors
            });
        }
        // console.log(`State: ${JSON.stringify(this.state.cardInfo)}`)

    }

    doSomthing(){
        console.log(`Do Something`);
    }

    render(){
        const {name, cardNum, cvv, expMonth, expYear} = this.state.cardInfo;

        return (
            <div className="ccform-body">
                <form className="ccform-content " onSubmit={this.handleSubmit}>
                    <div className="ccform-row">
                        <span>Enter your credit card information</span>
                    </div>

                    <div className="ccform-row">
                        <input type="text" name="name" value={name} placeholder="Name" 
                            className="form-control ccform__input"
                            onChange={this.update}></input>
                    </div>

                    { this.state.errors.name ? 
                            <div className="ccform-error">
                                <span>{this.state.errors.name}</span>
                            </div>
                        : ""}

                    <div className="ccform-row">
                        <input type="text" name="cardNum" value={cardNum} placeholder="Card Number" 
                            className={`form-control ccform__input ${this.state.errors.cardNum ? "is-invalid": ""}`}
                            onChange={this.update}></input>
                    </div>

                    { this.state.errors.cardNum ? 
                            <div className="ccform-error">
                                <span>{this.state.errors.cardNum}</span>
                            </div>
                        : ""}

                    <div className="ccform-row">
                        <input type="text" name="cvv" maxLength={this.cvvLength} value={cvv} placeholder="CVV2" 
                            className={`form-control ccform__input  ${this.state.errors.cvv ? "is-invalid": ""}`} onChange={this.update}></input>
                    </div>

                    { this.state.errors.cvv ? 
                            <div className="ccform-error">
                                <span>{this.state.errors.cvv}</span>
                            </div>
                        : ""}

                    <div className="ccform-row ccdate row">

                        <div className="col-xs-2">
                            <input type="text" name="expMonth" maxLength="2" value={expMonth} placeholder="Exp. Month" 
                            className={`form-control ccform__input  ${this.state.errors.expMonth ? "is-invalid": ""}`} onChange={this.update}></input>
                        </div>
                        <div className="col-xs-2">
                            <input type="text" maxLength="2" name="expYear" value={expYear} placeholder="Exp. Year" 
                            className={`form-control ccform__input  ${this.state.errors.expYear ? "is-invalid": ""}`} onChange={this.update}></input>
                        </div>

                    </div>

                    { this.state.errors.expYear ? 
                            <div className="ccform-error">
                                <span>{this.state.errors.expYear}</span>
                            </div>
                        : ""}


                    { this.state.errors.expMonth ? 
                            <div className="ccform-error">
                                <span>{this.state.errors.expMonth}</span>
                            </div>
                        : ""}


                    <div className="ccform-row ccimages">
                        <img className={`ccimages__image ${this.type === cardType.visa ? "ccimages__image--selected" : ""}`} alt="visa" src={visa}></img>
                        {/* <img className={`ccimages__image ${this.type === cardType.discover ? "ccimages__image--selected" : ""}`} alt="discover" src={discover}></img>
                        <img className={`ccimages__image ${this.type === cardType.master ? "ccimages__image--selected" : ""}`} alt="master" src={master}></img> */}
                        <img className={`ccimages__image ${this.type === cardType.amEx ? "ccimages__image--selected" : ""}`} alt="amEx" src={amEx}></img>
                    </div>
                    
                    <button type="submit" className="btn btn-primary" onClick={this.handleSubmit}>Submit</button>
                </form>

            </div>
        )


    }

}


export default CreditCardForm;