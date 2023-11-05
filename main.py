import flask
from flask import Flask

from language import normal_chat_response

app = Flask(__name__)

saving_goals = [
    {
        "name": "Bike",
        "cost": 80,
        "already_saved": 0,
        "currency": "£"
    }
]

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

@app.route("/wishlist", methods=["GET"])
def wishlist():
    return flask.render_template("wishlist.nj", saving_goals=saving_goals)

# route to create new saving goal
@app.route("/add_wish", methods=["POST"])
def add_goal():
    # get the messages from the request
    goal_data = flask.request.get_json()

    saving_goals.append(goal_data)

    return "success", 200