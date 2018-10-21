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
            ${data.map((details,index)=>`<section class="card-list-row  field-set">
                 <div>   <label>CITY CARD</label></div>
                <div class="dsp-inb card-info">
                    <span class="card-type ${details.type}"></span>
                    <span class="card-number">${details.cardNumber}</span>
                </div>
                <div class="dsp-inb action-container">
                    <a href="./enterCardDetails.html?id=${details.id}" class="action-item edit">EDIT</a>
                    <a href="javascript:void(0)" onclick ="deleteCard(${details.id})" class="action-item delete">DELETE</a>
                </div>
                
            </section>`)}</div>`
            return markup
        }
        function getDataFromSession(){
            return JSON.parse(sessionStorage.getItem("cardDetails"))
        }
        function deleteCard(id){
            var completeData = getDataFromSession();
            var data = filterData(id,completeData);
            completeData.splice(data.idx,1);
            saveDataInSession(completeData);
            if(completeData.length){
                displayList(completeData);
            }
            else{
                window.location.href = './enterCardDetails.html'
            }
        }
        function saveDataInSession(data){
            sessionStorage.setItem("cardDetails",JSON.stringify(data));
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
