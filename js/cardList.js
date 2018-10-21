var deleteCard=null;
(function(){
    const containerEl = document.getElementsByClassName("card-list-container")[0];
    const cardListing = (function(){
        function displayList(data){
            var html = createHTML(data);
            containerEl.innerHTML = html;
        }
        function createHTML(data){
            const markup = `<div>
            ${Object.keys(data).map((details,index)=>`<section class="card-list-row  field-set">
                 <div>   <label>CITY CARD</label></div>
                <div class="dsp-inb card-info">
                    <span class="card-type ${data[details].type}"></span>
                    <span class="card-number">${data[details].cardNumber}</span>
                </div>
                <div class="dsp-inb action-container">
                    <a href="./enterCardDetails.html?id=${details}" class="action-item edit">EDIT</a>
                    <a href="javascript:void(0)" onclick ="deleteCard(${details})" class="action-item delete">DELETE</a>
                </div>
                
            </section>`)}</div>`
            return markup
        }
        function getDataFromSession(){
            return JSON.parse(sessionStorage.getItem("cardDetails"))
        }
        function deleteCard(id){
            var completeData = getDataFromSession();
            delete completeData[id];
            saveDataInSession(completeData);
            if(Object.keys(completeData).length){
                displayList(completeData);
            }
            else{
                window.location.href = './enterCardDetails.html'
            }
        }
        function saveDataInSession(data){
            sessionStorage.setItem("cardDetails",JSON.stringify(data));
        }
   
        return {
            displayList:displayList,
            getDataFromSession:getDataFromSession,
            deleteCard:deleteCard
        }
    }())
    const savedData = cardListing.getDataFromSession();
    if(savedData){
        cardListing.displayList(savedData);
    }
    else{
        window.location.href = './enterCardDetails.html'
    }
    deleteCard = cardListing.deleteCard;
}())
