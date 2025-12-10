"""
Fetch all tracks from a Spotify playlist and find top YouTube result for each track.
Saves CSV: playlist_with_youtube.csv
"""

import os
import csv
import time
import pandas as pd
from googleapiclient.discovery import build
import spotipy
from spotipy.oauth2 import SpotifyOAuth

# --------- USER CONFIG ---------
SPOTIFY_CLIENT_ID = "YOUR_SPOTIFY_CLIENT_ID"
SPOTIFY_CLIENT_SECRET = "YOUR_SPOTIFY_CLIENT_SECRET"
SPOTIFY_REDIRECT_URI = "http://localhost:8888/callback"  # must match app settings
PLAYLIST_ID = "YOUR_PLAYLIST_ID"  # e.g. "37i9..." from the spotify playlist url
YOUTUBE_API_KEY = "YOUR_YOUTUBE_API_KEY"
OUTPUT_CSV = "playlist_with_youtube.csv"
# -------------------------------

# Scopes needed to read playlists (private playlists require playlist-read-private)
SCOPE = "playlist-read-private playlist-read-collaborative"

def get_spotify_client():
    sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
        client_id=SPOTIFY_CLIENT_ID,
        client_secret=SPOTIFY_CLIENT_SECRET,
        redirect_uri=SPOTIFY_REDIRECT_URI,
        scope=SCOPE,
        show_dialog=True
    ))
    return sp

def fetch_all_playlist_tracks(sp, playlist_id):
    results = sp.playlist_items(playlist_id, fields="next,items(track(name,artists(name),external_urls,href,uri,external_ids))", additional_types=['track'])
    tracks = []
    while True:
        for item in results['items']:
            track = item.get('track')
            if not track:
                continue
            name = track.get('name')
            artists = [a['name'] for a in track.get('artists', [])]
            artist = artists[0] if artists else ''
            spotify_url = track.get('external_urls', {}).get('spotify', '')
            tracks.append({
                'track_name': name,
                'artist': artist,
                'spotify_url': spotify_url
            })
        if results.get('next'):
            results = sp.next(results)
        else:
            break
    return tracks

def youtube_search_top(youtube, query):
    # Search for videos only, order by relevance (default)
    req = youtube.search().list(
        q=query,
        part="snippet",
        maxResults=1,
        type="video",
        fields="items(id(videoId),snippet(title))"
    )
    res = req.execute()
    items = res.get('items', [])
    if not items:
        return None
    video_id = items[0]['id']['videoId']
    return f"https://www.youtube.com/watch?v={video_id}"

def main():
    # sanity check
    if "YOUR_SPOTIFY_CLIENT_ID" in SPOTIFY_CLIENT_ID or "YOUR_YOUTUBE_API_KEY" in YOUTUBE_API_KEY:
        raise SystemExit("Please set your Spotify and YouTube API credentials in the script.")

    sp = get_spotify_client()
    print("Fetching playlist tracks from Spotify...")
    tracks = fetch_all_playlist_tracks(sp, PLAYLIST_ID)
    print(f"Found {len(tracks)} tracks.")

    # build youtube client
    youtube = build("youtube", "v3", developerKey=YOUTUBE_API_KEY)

    results = []
    for i, t in enumerate(tracks, start=1):
        q = f"{t['track_name']} {t['artist']}"
        print(f"[{i}/{len(tracks)}] Searching YouTube for: {q}")
        try:
            yt_url = youtube_search_top(youtube, q)
            # simple throttling to be polite on API
            time.sleep(0.1)
        except Exception as e:
            print("YouTube API error:", e)
            yt_url = None
        results.append({
            'track_name': t['track_name'],
            'artist': t['artist'],
            'spotify_url': t['spotify_url'],
            'youtube_url': yt_url or ''
        })

    # Save CSV
    df = pd.DataFrame(results)
    df.to_csv(OUTPUT_CSV, index=False, encoding='utf-8-sig')
    print("Saved results to", OUTPUT_CSV)
    print(df.head())

if __name__ == "__main__":
    main()
