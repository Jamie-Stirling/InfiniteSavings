let expandToggle = false;
let messages = [{
    "role": "assistant",
    "content": "Hi, I'm WishBot! I can help you save for your wishes."
}];
// on load, add the initial messages
window.onload = function() {
    for (let i = 0; i < messages.length; i++) {
        let message = messages[i];
        addMessage(message.content, message.role == "user");
    }
}
function expand(event) {
    // change plus to minus
    if (!expandToggle){
        document.querySelector('.chatbox label[for="more"] i.fa-plus').style.display = 'none';
        document.querySelector('.chatbox label[for="more"] i.fa-minus').style.display = 'inline-block';
        // show more box
        document.querySelector('.more-box').style.display = null;
    } else {
        document.querySelector('.chatbox label[for="more"] i.fa-plus').style.display = 'inline-block';
        document.querySelector('.chatbox label[for="more"] i.fa-minus').style.display = 'none';
        // hide more box
        document.querySelector('.more-box').style.display = 'none';
    }
    expandToggle = !expandToggle;
}

async function addMessage(text, isUser) {
    let history = document.querySelector('.history');
    let historyItem = document.createElement('div');
    historyItem.classList.add('history-item');
    if (isUser) {
        historyItem.classList.add('right');
    } else {
        historyItem.classList.add('left');
    }
    let historyItemText = document.createElement('div');
    historyItemText.classList.add('history-item-text');
    historyItemText.innerText = text;
    historyItem.appendChild(historyItemText);
    // always add before the final "is typing" element
    history.insertBefore(historyItem, history.lastElementChild);
    
}

function sendChatMessage(event) {
    // call api at /chatbot, post messages
    // first get the message from the textarea
    let userText = document.querySelector('#message').value;
    if (userText == "") {
        return;
    }
    messages.push({"content": userText, "role": "user"});
    // clear the textarea
    document.querySelector('#message').value = "";
    // add the message to the history
    addMessage(userText, true);

    // disable send button while we await a response
    document.querySelector('#send').disabled = true;
    // also set the "is typing" element to visible
    document.querySelector('.istyping').style.display = null;
    let data = {"messages": messages};

    fetch('/chatbot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(async data => {
           
            // run filtering step
            let filtered = filterJSON(data.content);
            let filteredMessage = filtered[0];
            let json = filtered[1];

            console.log('Success:', data);
            messages.push({"content": filteredMessage, "role": "assistant"});
            addMessage(filteredMessage, false);

            document.querySelector('#send').disabled = false;
            document.querySelector('.istyping').style.display = 'none';

            if (json !== null) {
                // send to backend
                await fetch('/add_wish', {
                    "method": "POST",
                    "headers": {
                        "Content-Type": "application/json"
                    },
                    "body": JSON.stringify(json)
                });
                let rawHTML = `
                    <div class="history-item-text">
                        I've added <span class="item">${json.item}</span> to your wishlist.<br>
                        It costs <span class="cost">${json.currency}${json.cost}</span>.<br>
                        You've already saved <span class="already-saved">${json.currency}${json.already_saved}</span>.
                    </div>`;
                let history = document.querySelector('.history');
                let historyItem = document.createElement('div');
                historyItem.innerHTML = rawHTML;
                historyItem.classList.add('history-item');
                historyItem.classList.add('left');
                history.insertBefore(historyItem, history.lastElementChild);
                // add a corresponding message to the messages array
                messages.push({"content": historyItem.text, "role": "assistant"});
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            // enable send button
            document.querySelector('#send').disabled = false;
        }
    );
}

// function to filter out JSON from a string, returning the filtered message and the json separately
// returns a tuple of (filtered message, json)
function filterJSON(message) {
    let json = null;
    let filteredMessage = message;
    // search for curly braces
    let start = message.indexOf('{');
    let end = message.indexOf('}');

    if (start != -1 && end != -1) {
        // there is a json object in the message
        json = JSON.parse(message.substring(start, end + 1));
        filteredMessage = message.substring(0, start);
    }
    return [filteredMessage, json];
}

