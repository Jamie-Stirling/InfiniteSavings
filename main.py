import flask
from flask import Flask

from language import normal_chat_response

app = Flask(__name__)

saving_goals = [
    {
        "item": "Bike",
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
    if flask.request.content_type != "application/json":
        return "error", 400
    
    # get the messages from the request
    goal_data = flask.request.get_json()

    if goal_data.currency == "pounds" or goal_data.currency == "pound":
        goal_data.currency = "£"
    elif goal_data.currency == "dollars" or goal_data.currency == "dollar":
        goal_data.currency = "$"
    elif goal_data.currency == "euros" or goal_data.currency == "euro":
        goal_data.currency = "€"

    saving_goals.append(goal_data)

    return "success", 200