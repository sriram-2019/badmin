"use client";

import { useEffect, useState } from "react";
import { Play, ThumbsUp, MessageCircle, ExternalLink, X } from "lucide-react";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  uploadDate: string;
}

export default function Youtube() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  // ⚠️ Direct API key (use env for production!)
  const API_KEY = "AIzaSyBrcIudpRiOW-bJvltZb4chZ2Jo_7oHvVg";
  const UPLOADS_PLAYLIST_ID = "UUZuMQ8UqMtKi0YH40lPi-5g";

  const fetchVideos = async (pageToken?: string) => {
    setLoading(true);
    try {
      let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=9&playlistId=${UPLOADS_PLAYLIST_ID}&key=${API_KEY}`;
      if (pageToken) {
        url += `&pageToken=${pageToken}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      const newVideos = data.items.map((item: any) => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        thumbnail:
          item.snippet.thumbnails?.high?.url ||
          item.snippet.thumbnails?.medium?.url ||
          item.snippet.thumbnails?.default?.url,
        uploadDate: new Date(item.snippet.publishedAt).toLocaleDateString(),
      }));

      setVideos((prev) => [...prev, ...newVideos]);
      setNextPageToken(data.nextPageToken || null);
    } catch (err) {
      console.error("Failed to fetch YouTube playlist items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const VideoCard: React.FC<{ video: Video }> = ({ video }) => {
    return (
      <div
        className="group cursor-pointer transition-all duration-300 hover:scale-[1.02]"
        onClick={() => setSelectedVideo(video)}
      >
        <div className="relative overflow-hidden rounded-xl bg-gray-900 aspect-video mb-3">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-red-600 rounded-full p-4 transform scale-90 group-hover:scale-100 transition-transform duration-300">
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </div>
          </div>
        </div>
        <h3 className="text-gray-900 font-semibold text-base leading-tight mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {video.title}
        </h3>
        <p className="text-gray-500 text-sm">{video.uploadDate}</p>
        <div className="flex items-center space-x-4 text-gray-500 text-sm mt-1">
          <div className="flex items-center space-x-1">
            <ThumbsUp className="w-3 h-3" />
            <span>—</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle className="w-3 h-3" />
            <span>—</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Channel Banner */}
      <div className="relative">
        <div className="h-48 md:h-64 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
          <div className="absolute inset-0 bg-black/40"></div>
          <img
            src="\img\banner.jpg"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-end space-x-6">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
                  <img
                    src="/img/logo.jpeg"
                    alt="Channel Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-white">
                  <h1 className="text-2xl md:text-4xl font-bold mb-2">
                   ASA  Badminton Club
                  </h1>
                  <div className="flex items-center space-x-4 text-sm md:text-base opacity-90">
                   
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {videos.length === 0 && loading && (
          <p className="text-center text-gray-600">Loading videos...</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
             {videos.map((video, index) => (
  <VideoCard
    key={`${video.id}-${index}`} // ensures uniqueness
    video={video}
  />
))}

     
       


        </div>

        {/* Load More Button */}
        {nextPageToken && (
          <div className="text-center">
            <button
              onClick={() => fetchVideos(nextPageToken)}
              className="inline-flex items-center space-x-3 bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              disabled={loading}
            >
              <span>{loading ? "Loading…" : "Load More Videos"}</span>
              <ExternalLink className="w-5 h-5" />
            </button>
            <p className="text-gray-500 text-sm mt-3">
              Click to view more videos on YouTube
            </p>
          </div>
        )}
      </div>
{/* Video Modal */}
{selectedVideo && (
  <div className="fixed inset-0 bg-black/70 z-50 p-4 flex justify-center">
    <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-lg max-h-[90vh] overflow-auto">
      
      {/* Scrollable Content */}
      <div className="flex flex-col">
        {/* Close Button at Top */}
        <div className="flex justify-end p-2">
          <button
            onClick={() => setSelectedVideo(null)}
            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-all duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Iframe */}
        <div className="aspect-video">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
            title={selectedVideo.title}
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        </div>

        {/* Title + Bottom Close */}
        <div className="p-4 flex justify-between items-center">
          <h3 className="font-semibold text-lg">{selectedVideo.title}</h3>
          <button
            onClick={() => setSelectedVideo(null)}
            className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300"
          >
            <X className="w-4 h-4" />
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  </div>
)}


    </div>
  );
}
