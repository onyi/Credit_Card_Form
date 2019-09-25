import React from 'react';
import ReactDOM from 'react-dom';

import {shallow, mount, render} from 'enzyme';

import CreditCardForm from '../components/credit_card_form';

import sinon from 'sinon';
                                                                                                        
// import renderer from 'react-test-renderer'; 

// import  {render} from '@testing-library/react';

import * as cardErrors from '../components/credit_card_form_errors';


describe('Credit Card Form component', () => {

    // 
    it('Renders the Credit Card form properly', () => {

        const form = shallow(<CreditCardForm/>);
        expect(form.contains("Enter your credit card information")).toEqual(true);

    })


    it('Test Credit Card number input and should contains no error', () => {

        const form = mount(<CreditCardForm />);

        const cardNumInput = form.find({name: "cardNum" })
        cardNumInput.instance().value = "34567"
        cardNumInput.simulate('change');
        form.update();

        expect(form.state().cardInfo.cardNum).toEqual(`3456 7`);

        cardNumInput.instance().value = "444"
        cardNumInput.simulate('change');
        form.update();
        expect(form.state().cardInfo.cardNum).toEqual(`444`);

    })

    it('Test CVV2 input and should contains no error', () => {

        const form = mount(<CreditCardForm />);

        const cvvInput = form.find({name: "cvv" });
        cvvInput.instance().value = "123";
        cvvInput.simulate('change');
        form.update();

        expect(form.state().cardInfo.cvv).toEqual(`123`);

    })


    it('Test Credit Card number input and should display error', () => {

        const form = mount(<CreditCardForm />);
        
        // form.find({name: "cardNum" }).simulate('change', {
        //     preventDefault: () => {}, 
        //     // target: {value: '111111'},
        //     currentTarget: {
        //         value: `111111`,
        //         name: `cardNum`
        //     }
        // });

        const cardNumInput = form.find({name: "cardNum" });
        cardNumInput.instance().value = 11111;
        cardNumInput.simulate('change');
        // form.instance().forceUpdate();
        form.update();

        expect(form.state().errors.cardNum === `Your Credit Card is unsupported` ).toEqual(true);
    })



    it('Test Credit Card expiration year', () => {

        const form = mount(<CreditCardForm />);

        const expYearInput = form.find({name: "expYear" });
        expYearInput.instance().value = 19;
        expYearInput.simulate('change');
        // form.instance().forceUpdate();
        form.update();

        expect(parseInt( form.state().cardInfo.expYear) ).toEqual(19);
    })


    it('Test Credit Card expiration year with past year and should show error', () => {

        const form = mount(<CreditCardForm />);

        const expYearInput = form.find({name: "expYear" });
        expYearInput.instance().value = 17;
        expYearInput.simulate('change');
        // form.instance().forceUpdate();
        form.update();
        expect(form.state().errors.expYear === cardErrors.expYear ).toEqual(true);
    })



    it('Test Credit Card expiration year with past year and the web page should shows error under the input field', () => {

        const form = mount(<CreditCardForm />);

        const expYearInput = form.find({name: "expYear" });
        expYearInput.instance().value = 17;
        expYearInput.simulate('change');
        // form.instance().forceUpdate();
        form.update();

        // console.log(`Form Error count: ${form.find( {className: "ccform-error" }).length > 0}`);

        expect(form.find( {className: "ccform-error" }).length > 0).toEqual(true);

        expect(form.contains(cardErrors.expYear) ).toEqual(true);
    })

    it('Test Credit Card expiration month', () => {

        const form = mount(<CreditCardForm />);

        const expMonthInput = form.find({name: "expMonth" });
        expMonthInput.instance().value = 11;
        expMonthInput.simulate('change');
        // form.instance().forceUpdate();
        form.update();

        expect(parseInt( form.state().cardInfo.expMonth) ).toEqual(11);
    })


    it('Test Credit Card expiration month with invalid input', () => {
        const form = mount(<CreditCardForm />);

        const expMonthInput = form.find({name: "expMonth" });
        expMonthInput.instance().value = 99;
        expMonthInput.simulate('change');
        // form.instance().forceUpdate();
        form.update();

        expect(form.state().errors.expMonth === cardErrors.expMonth ).toEqual(true);

        expect(form.contains(cardErrors.expMonth) ).toEqual(true);


    })

    //Not Working???
    it(`Test Submit button and it should do nothing`, () => {
        
        const testCallback = () => {
            console.log(`Hello World`);
        }

        const form = mount(<CreditCardForm submitCallback={testCallback}/>);


        // const clickCallback = sinon.spy();

        // const form = mount(<CreditCardForm />);
        const handleSubmit = spyOn(form.instance(), 'testCallback');
                
        const submitButton = form.find( {type: "submit"});
        // submitButton.simulate('click');
        // submitButton.prop('onClick', { preventDefault: () => {} })();
        submitButton.simulate('click', { preventDefault: () => {} });
        // form.update();
        // form.instance().forceUpdate();    

        

        expect(clickCallback).toHaveBeenCalled();
        // sinon.assert.called(clickCallback);

    })

    
})

