import React, { useState } from "react";

export default function About() {
    return (
        <div className="About">
            <h1 className="headings">About</h1>
            <hr />
            <p className="sHeading">Getting Started</p>
            <p>
                Spotify Mixer is a website based on the Spotify APi. This means that
                users can see spotify data (such as popular songs, artists, etc), as
                well as user-specific data (your favorite songs, artists, etc).
                <br />
                <br />
                In order to see spotify data go to search.
                <br />
                <br />
                In order to see user-specific data (data specific to your Spotify
                account), go to log in.
            </p>
            <br />
            <br />
            <p className="sHeading">More about the website</p>
            <p>
                This website is based on the{" "}
                <a href="https://github.com/jdsantelicesl/SpotifyMixer_flask">
                    SpotifyMixer_flask
                </a>{" "}
                library, created by Juan Santelices.
                <br />
                <br />
                SpotifyMixer_flask uses the Spotify API and Auth 2.0 in order to access
                user-specific data from the spotify website.
            </p>
        </div>
    );
}
