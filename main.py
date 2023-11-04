import flask
from flask import Flask

from language import normal_chat_response

app = Flask(__name__)

# route index to wishbot/index.html
@app.route("/")
def index():
    return flask.send_file("static/wishbot/index.html")

# route to handle chatbot requests
@app.route("/chatbot", methods=["POST"])
def chatbot():
    # get the messages from the request
    messages = flask.request.get_json()["messages"]

    return normal_chat_response(messages)

    