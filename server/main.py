from dotenv import load_dotenv
import os
from requests import post, get
import json
from urllib.parse import urlencode, quote
from flask import Flask, request, redirect, url_for, render_template, session, jsonify
from flask_cors import CORS

from spot_api import *

logged = False

load_dotenv()

app = Flask(__name__)
CORS(app)
app.secret_key = os.getenv("SECRET_KEY")


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
            data = json.load(json_file)  # Store the token in the session
        except:
            data = {}

    data[state] = token

    with open("tokens.json", "w") as json_file:
        json.dump(data, json_file, indent=4)

    return redirect("http://localhost:3000/top/logged")


@app.route("/getToken/<state>")
def retToken(state):
    print("state: ", state)
    data = {}
    with open("tokens.json", "r") as json_file:
        data = json.load(json_file)

    token = data[state]
    print("token: ", token)

    send_data = {"token": token}
    return send_data














@app.route("/search")
def search():
    if logged == True:
        token = session.get("token")
        session["user_id"] = get_details(token)
        return render_template("search.html")
    else:
        return redirect("/userLog")


@app.route("/library")
def library():
    return render_template("library.html")


@app.route("/get_playlists")
def get_playlists():
    token = session.get("token")
    data = []
    data.append(get_user_playlist(token, 50, 0))  # Append to the list
    data.append(get_user_playlist(token, 50, 50))  # Append to the list
    playlists = {}

    user_id = session.get("user_id")

    for idx, playlist_data in enumerate(data):
        for number, item in enumerate(data[idx]["items"]):
            if item["owner"]["id"] == user_id:
                playlists[item["name"]] = {
                    "id": item["id"],
                    "image": item["images"][0]["url"],
                }
    print(playlists)
    return jsonify(playlists)


@app.route("/getData/<type>/<time_range>")
def getData(type, time_range):
    token = session.get("token")
    result = get_user_top(token, type, time_range, "100", "0")
    return jsonify(result)


if __name__ == "__main__":
    app.run(port=8888, debug=True)
