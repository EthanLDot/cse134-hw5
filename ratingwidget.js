const template = document.createElement('template');
template.innerHTML = `
    <form id="rating-form" action="https://httpbin.org/post" method="POST">
    <label for="rating">How satisfied are you?</label>
    <input type="hidden" name="question" value="How satisfied are you?">
    <input type="hidden" name="sentBy" value="js">
    <div id="stars">
        <input type="radio" id="star5" name="rating" value="5" required />
        <label for="star5"> 5 </label>
        <input type="radio" id="star4" name="rating" value="4" required/>
        <label for="star4"> 4 </label>
        <input type="radio" id="star3" name="rating" value="3" required/>
        <label for="star3"> 3 </label>
        <input type="radio" id="star2" name="rating" value="2" required/>
        <label for="star2"> 2 </label>
        <input type="radio" id="star1" name="rating" value="1" required/>
        <label for="star1"> 1</label>
    </div>
    <button type="button" onclick="submitForm()">Submit</button>
    <output></output>
    </form>`;

class RatingWidget extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: 'closed'});
        let clone = template.content.cloneNode(true);
        shadowRoot.append(clone);
    }
}

function submitForm() {
    const form = document.getElementById("rating-form");
    
    const formData = new FormData(form);
    const xhr = new XMLHttpRequest();
    xhr.open(form.method, form.action, true);
    xhr.setRequestHeader('X-Sent-By', 'JS');
    xhr.onload = function () {
        console.log(xhr.responseText);
        const rating = (parseInt(JSON.parse(xhr.responseText).form.rating));
        const output = document.getElementById("rating-form").getElementsByTagName("output")[0];
        if(rating >= 4){
            output.innerText = `Thanks for the ${rating}!`;
        }
        else
        {
            output.innerText = `Thanks for your feedback of ${rating} stars. We'll try to do better!`;
        }
    };

    xhr.onerror = function () {
        console.error("Request failed!!!");
    };

    xhr.send(formData);
}

customElements.define('rating-widget', RatingWidget);