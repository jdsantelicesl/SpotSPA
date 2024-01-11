from dotenv import load_dotenv
import os
import json
from flask import Flask, request, redirect, render_template, session, jsonify
from flask_cors import CORS
from datetime import datetime

from spot_api import *

# logged = False

clock = datetime.now()

load_dotenv()

app = Flask(__name__)
CORS(app)
app.secret_key = os.getenv("SECRET_KEY")

@app.before_request
def before_request():
    previous_time = None

    with open("cleanup.json", "r") as json_file:
        try:
            data = json.load(json_file)
            previous_time = data["previous"]
        except:
            previous_time = round(clock.hour + (clock.minute/60), 2)
            with open("cleanup.json", "w") as write:
                data = {"previous": previous_time}
                json.dump(data, write, indent=4)
    
    current_time = round(clock.hour + (clock.minute/60), 2)

    if (current_time < previous_time) or (current_time - previous_time >= 1):
        with open("tokens.json", "w") as json_file:
            # Write an empty JSON object to clear the file
            json.dump({}, json_file)

        with open("cleanup.json", "w") as json_file:
            # Set current time as prev
            data = {"previous":current_time}
            json.dump(data, json_file, indent=4)


@app.route("/userLog")
def userLog():
    unpack = redUser()
    url = unpack[0]
    state = unpack[1]
    data = {"url": url, "state": state}
    return jsonify(data)


@app.route("/callback")
def callback():
    data = getToken()
    state = data[0]
    token = data[1]
    print("firstState: ", state)
    print("firstToken: ", token)
    
    data = {}

    with open("tokens.json", "r") as json_file:
        try:
            data = json.load(json_file) #read past data as to not delete by overwrite
        except:
            data = {}

    data[state] = {
        "token": token
    }

    with open("tokens.json", "w") as json_file:
        json.dump(data, json_file, indent=4)

    return redirect("http://192.168.1.16:3000/redirect")


@app.route("/getToken/<state>")
def retToken(state):
    print("state: ", state)
    data = {}
    with open("tokens.json", "r") as json_file:
        data = json.load(json_file)

    token = data[state]
    print("unpacked token: ", token)

    return jsonify(token)


@app.route("/")
def index():
    return "success"


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8888, debug=True)
