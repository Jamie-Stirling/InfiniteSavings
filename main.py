import flask
from flask import Flask


app = Flask(__name__)

# route index to wishbot/index.html
@app.route("/")
def index():
    return flask.send_file("static/wishbot/index.html")