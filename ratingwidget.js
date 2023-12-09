class RatingWidget extends HTMLElement {
    static observedAttributes = ["numstars", "color"];
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
                color: var(--star-color-select, #ede100);   
            }
            
            #rating-form:not(:checked) > #stars > label:hover,
            #rating-form:not(:checked) > #stars > label:hover ~ label {
                color: var(--star-color, #ac8700);  
            }
        </style>
        <form id="rating-form" action="https://httpbin.org/post" method="POST">
            <label for="rating">How satisfied are you?</label>
            <input type="hidden" name="question" value="How satisfied are you?">
            <input type="hidden" name="sentBy" value="js">
            <div id="stars">
            </div>
            <button type="button">Submit</button>
            <output></output>
        </form>
        `;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'color') {
            let hexColorSelect;
            let hexColor;
            switch (newValue.toLowerCase()) {
                case 'red':
                    hexColorSelect = '#ff0000';
                    hexColor = '#cc0000'; // Darker shade of red
                    break;
                case 'orange':
                    hexColorSelect = '#ffa500';
                    hexColor = '#cc7a00'; // Darker shade of orange
                    break;
                case 'yellow':
                    hexColorSelect = '#ede100';
                    hexColor = '#ac8700'; // Darker shade of yellow
                    break;
                case 'green':
                    hexColorSelect = '#008000';
                    hexColor = '#004d00'; // Darker shade of green
                    break;
                case 'blue':
                    hexColorSelect = '#0000ff';
                    hexColor = '#000099'; // Darker shade of blue
                    break;
                case 'purple':
                    hexColorSelect = '#800080';
                    hexColor = '#600060'; // Darker shade of purple
                    break;
                case 'brown':
                    hexColorSelect = '#a52a2a';
                    hexColor = '#7d1f1f'; // Darker shade of brown
                    break;
                case 'black':
                    hexColorSelect = '#000000';
                    hexColor = '#333333'; // Darker shade of black
                    break;
                default:
                    hexColorSelect = '#ac8700';
                    hexColor = '#ede100'; // Default to a darker shade of yellow if an invalid color is provided
            }
            this.style.setProperty('--star-color-select', hexColorSelect);
            this.style.setProperty('--star-color', hexColor);
            // this.style.setProperty('')
        }
        else if(name === 'numstars') {
            customElements.whenDefined('rating-widget').then(() => {
                const stars = this.shadowRoot.querySelector('#stars');
                stars.innerHTML = `<input type="radio" id="star5" name="rating" value="5" required />
                <label for="star5"> 5 </label>
                <input type="radio" id="star4" name="rating" value="4" required/>
                <label for="star4"> 4 </label>
                <input type="radio" id="star3" name="rating" value="3" required/>
                <label for="star3"> 3 </label>
                <input type="radio" id="star2" name="rating" value="2" required/>
                <label for="star2"> 2 </label>
                <input type="radio" id="star1" name="rating" value="1" required/>
                <label for="star1"> 1</label>`;
            } );
        }
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