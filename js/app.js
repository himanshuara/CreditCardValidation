/*
Using revealing module pattern
 */
(function(){
    const cardTypeRegex = [{
            'regexComplete': '^4[0-9]{12}(?:[0-9]{3})?$',
            'regexTypeOnly':'^4',
            'type':'visa'
        },{
            'regexComplete': '^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$',
            'regexTypeOnly':'^5[1-5]',
            'type':'master'
        },{
            'regexComplete': '^3[47][0-9]{13}$',
            'regexTypeOnly':'^(34|37)',
            'type':'amex'
        }];
    const id = (new URLSearchParams(window.location.search)).get('id');
    const cardDetailForm = document.getElementsByName("card-details-form")[0];
    const cardDetailSubmitBtn = document.getElementsByName("card-details-submit")[0];
    const cardEl = document.getElementById("credit-card");
    const monthEl = document.getElementById("expiry-month");
    const yearEl = document.getElementById("expiry-year");
    const cvvEl = document.getElementById("card-cvv");
    var isFormValid = false;
    var cardType = null;
    const cardDetails = (function(){
        
        function getCardType(cardNumber,typeOnly){
            var type = null;
            for(let i=0,len=cardTypeRegex.length;i<len;i++){
                let reg = new RegExp(typeOnly ? cardTypeRegex[i].regexTypeOnly :cardTypeRegex[i].regexComplete)
                if(reg.test(cardNumber)){
                    type = cardTypeRegex[i].type;
                    break;
                }
            }
            return type;
        }
        function checkCardValidity(cardNumber){
            var creditCardType = getCardType(cardNumber);
            return {
                'isValid': !!creditCardType,
                'type':creditCardType
            }
        }
        function setCardTypeinDom(cardType){
            if(cardType){
                cardEl.nextElementSibling.classList.add(cardType)
            }
            else{
                cardEl.nextElementSibling.className = "card-type";
            }
        }
        function performDOMManipulationsOnValidation(isValid,cardType){
                monthEl.disabled = !isValid;
                yearEl.disabled = !isValid;
                cvvEl.disabled = !isValid;
                if(!isValid){
                    cardEl.parentNode.parentNode.classList.add("error");
                }
                else{
                    cardEl.parentNode.parentNode.classList.remove("error");
                }
        }
        function validateCard(e){
            var cardValidityDetails = checkCardValidity(e.target.value.replace(/\s/g, ''));
            isFormValid = cardValidityDetails.isValid;
            cardType = cardValidityDetails.type;
            performDOMManipulationsOnValidation(cardValidityDetails.isValid,cardValidityDetails.type);
            return cardValidityDetails.isValid;

        }
        function checkCardType(e){
            setCardTypeinDom(getCardType(e.target.value.replace(/\s/g, ''),true))
        }
        function getDataFromSession(){
            return JSON.parse(sessionStorage.getItem("cardDetails"))
        }
        function saveDataInSession(data){
            sessionStorage.setItem("cardDetails",JSON.stringify(data));
        }
        function createCardData(data,id){
            var cardData =null;
            if(id){
                cardData = filterData(Number(id),data);
                cardData.tuple.cardNumber = cardEl.value.replace(/\s/g, '');
                cardData.tuple.expiryMonth=monthEl.value === 'MM' ? null : monthEl.value;
                cardData.tuple.expiryYear = yearEl.value === 'YYYY' ? null : yearEl.value;
                cardData.tuple.type = cardType;
                data.splice(Number(cardData.idx), 1, cardData.tuple);
            }
            else{
                data = data ? data : [];
                cardData = {
                'id': data.length +1,
                'cardNumber': cardEl.value.replace(/\s/g, ''),
                'expiryMonth': monthEl.value === 'MM' ? null : monthEl.value,
                'expiryYear': yearEl.value === 'YYYY' ? null : yearEl.value,
                'type': cardType
            }
            data.push(cardData);
        }
            
            return data;
        }
        function submitCard(){
            if(!isFormValid){
                return isFormValid
            }
            var cardData = createCardData(getDataFromSession(),id)
            saveDataInSession(cardData);
            cardDetailForm.submit();
        }
        function filterData(id,data){
            var tuple;
            var idx=null
            for(let i=0,len=data.length;i<len;i++){
                if(id === data[i].id){
                    tuple = data[i];
                    idx =i;
                    break;
                }
            }
            return {
                tuple:tuple,
                idx:idx
            };
        }
        function displayData(id,data){
            var tuple = filterData(id,data).tuple;
            cardEl.value=tuple.cardNumber;
            monthEl.value=tuple.expiryMonth || "MM";
            yearEl.value=tuple.expiryYear || "YYYY";
            setCardTypeinDom(getCardType(tuple.cardNumber,true))
            cardEl.focus();
            cardEl.blur();
        }
        
        return{
            validateCard:validateCard,
            submitCard:submitCard,
            checkCardType:checkCardType,
            displayData:displayData,
            getDataFromSession:getDataFromSession
        }
    }())
    cardDetailSubmitBtn.addEventListener("click",cardDetails.submitCard)
    cardEl.addEventListener("blur",cardDetails.validateCard);
    cardEl.addEventListener("input",cardDetails.checkCardType);
    const data = cardDetails.getDataFromSession();
    if(data && id){
        cardDetails.displayData(Number(id),data);
    }

}())