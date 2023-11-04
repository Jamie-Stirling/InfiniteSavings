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
    // always add before the final "is typing" element
    history.insertBefore(historyItem, history.lastElementChild);
    history.appendChild(historyItem);
    
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
    // call api at /chatbot, post messages
    // first get the message from the textarea
    let data = {"messages": messages};

    fetch('/chatbot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            // add the message to the history
            messages.push(data);
            addMessage(data.content, false);
            // enable send button
            document.querySelector('#send').disabled = false;
        })
        .catch((error) => {
            console.error('Error:', error);
            // enable send button
            document.querySelector('#send').disabled = false;
        }
    );
}