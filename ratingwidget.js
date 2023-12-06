class RatingWidget extends HTMLElement {
    connectedCallback() {
        this.attachShadow({mode: 'open'});
        this.render();
        this.shadowRoot.querySelector('button').addEventListener('click', () => this.submitForm());
    }

    render() {
        this.shadowRoot.innerHTML = `
        <style>
            #rating-form {
                float: left;
            }
            
            #rating-form button, #rating-form output{
                display: block;
            }
            
            #rating-form > #stars {
                border: 1px black solid;
                height: 75px;
                width: 150px;
            }
            
            #rating-form:not(:checked) > #stars > input {
                display: none;
            }
            
            #rating-form:not(:checked) > #stars > label {
                float: right;
                width: 1em;
                overflow: hidden;
                white-space: nowrap;
                cursor: pointer;
                font-size: 30px;
                color: gray;
            }
            #rating-form:not(:checked) > #stars > label::before {
                content: '★';
            }
            
            #rating-form > #stars > input:checked ~ label {
                color: rgb(237, 225, 0);   
            }
            
            #rating-form:not(:checked) > #stars > label:hover,
            #rating-form:not(:checked) > #stars > label:hover ~ label {
                color: #ac8700;  
            }
        </style>
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
            <button type="button">Submit</button>
            <output></output>
        </form>
        `;
    }

    
    submitForm() {
        console.log(this.shadowRoot.getElementById('rating-form').getElementsByTagName('output')[0]);
        var form = this.shadowRoot.getElementById("rating-form");
            
        var formData = new FormData(form);
        var xhr = new XMLHttpRequest();
        xhr.open(form.method, form.action, true);
        xhr.setRequestHeader('X-Sent-By', 'JS');
        xhr.onload = function () {
            console.log(xhr.responseText);
            const rating = (parseInt(JSON.parse(xhr.responseText).form.rating));
            const output = form.getElementsByTagName("output")[0];
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
}

customElements.define('rating-widget', RatingWidget);