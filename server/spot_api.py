# This script can run synchronously to load user data. Debug can be set to true

from dotenv import load_dotenv
import os
import base64
from requests import post, get
import json
from urllib.parse import urlencode, quote
from flask import Flask, request, redirect, url_for, render_template
import random
import string


def redUser():
    load_dotenv()
    client_id = os.getenv("CLIENT_ID")  # Not user specific, but specific to project
    client_secret = os.getenv("CLIENT_SECRET")

    redirect_uri = "http://192.168.1.16:8888/callback"

    alphabet = string.ascii_letters + string.digits
    random_string = "".join(
        random.choice(alphabet) for _ in range(12)
    )  # Generates a 12-character string
    state = random_string  # replace with your state value
    scope = " ".join(
        [
            "ugc-image-upload",
            "user-read-playback-state",
            "user-modify-playback-state",
            "user-read-currently-playing",
            "app-remote-control",
            "streaming",
            "playlist-read-private",
            "playlist-read-collaborative",
            "playlist-modify-private",
            "playlist-modify-public",
            "user-follow-modify",
            "user-follow-read",
            "user-read-playback-position",
            "user-top-read",
            "user-read-recently-played",
            "user-library-modify",
            "user-library-read",
            "user-read-email",
            "user-read-private",
        ]
    )

    # Step 1: Redirect the user to the authorization page

    url = "https://accounts.spotify.com/authorize"
    url += "?response_type=code"  # Change this to 'code'
    url += "&client_id=" + quote(client_id)
    url += "&scope=" + quote(scope)
    url += "&redirect_uri=" + quote(redirect_uri)
    url += "&state=" + quote(state)

    print("url created: ")
    print(url)
    return url, state


def getToken():
    load_dotenv()
    client_id = os.getenv("CLIENT_ID")  # Not user specific, but specific to project
    client_secret = os.getenv("CLIENT_SECRET")

    redirect_uri = "http://192.168.1.16:8888/callback"

    code = request.args.get("code")
    state = request.args.get("state")

    # Step 2: Request an access token

    token_url = "https://accounts.spotify.com/api/token"
    token_data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": redirect_uri,
        "client_id": client_id,
        "client_secret": client_secret,
    }
    response = post(token_url, data=token_data)
    print("token response: ", response)
    token_info = response.json()

    token = token_info["access_token"]  # Here's your access token
    print(token)
    print("Expires in: ")
    return state, token


def get_auth_header(token):
    return {"Authorization": "Bearer " + token}


def get_details(token):
    url = "https://api.spotify.com/v1/me"
    headers = get_auth_header(token)

    result = get(url, headers=headers)
    json_result = json.loads(result.content)["id"]
    if len(json_result) == 0:
        print("Error")
        return None

    return json_result


def search_for_artist(token, artist_name):
    url = "https://api.spotify.com/v1/search"
    headers = get_auth_header(token)
    query = f"q={artist_name}&type=artist&limit=1"

    query_url = url + "?" + query
    result = get(query_url, headers=headers)
    print("result:")
    print(result)
    json_result = json.loads(result.content)["artists"]["items"]
    if len(json_result) == 0:
        print("No artist found")
        return None

    return json_result[0]


def get_songs_by_artist(token, artist_id):
    url = f"https://api.spotify.com/v1/artists/{artist_id}/top-tracks?country=US"
    headers = get_auth_header(token)
    result = get(url, headers=headers)
    json_result = json.loads(result.content)["tracks"]
    return json_result


def search_for_song(token, song_name):
    url = "https://api.spotify.com/v1/search"
    headers = get_auth_header(token)
    query = f"q={song_name}&type=track&limit=1"

    query_url = url + "?" + query
    result = get(query_url, headers=headers)
    json_result = json.loads(result.content)["tracks"]["items"]
    if len(json_result) == 0:
        print("song")
        return None

    return json_result[0]


def queue_song(token, song_id):  # need auth token
    url = f"https://api.spotify.com/v1/me/player/queue"
    headers = get_auth_header(token)
    params = {"uri": "spotify:track:" + song_id}
    result = post(url, headers=headers, params=params)
    # print(result.status_code)
    return result


def get_user_top(token, type, timeRange, limit, offset):  # need auth token
    # type: tracks or artists, timeRange: medium_term, limit: number, offset: number, all strings

    url = f"https://api.spotify.com/v1/me/top/{type}"
    headers = get_auth_header(token)
    query = f"time_range={timeRange}&limit={limit}&offset={offset}"

    query_url = url + "?" + query
    print(query_url)
    result = get(query_url, headers=headers)
    print("result: ")
    print(result)
    json_result = json.loads(result.content)
    if len(json_result) == 0:
        print("None found")
        return None

    return json_result


def get_user_playlist(token, limit, offset):
    url = f"https://api.spotify.com/v1/me/playlists?offset={offset}&limit={limit}"
    headers = get_auth_header(token)
    result = get(url, headers=headers)
    json_result = json.loads(result.content)
    if len(json_result) == 0:
        print("None found")
        return None

    return json_result
