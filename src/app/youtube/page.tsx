"use client";
import React from 'react';
import { Play, ThumbsUp, MessageCircle, ExternalLink } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  uploadDate: string;
  views: string;
  likes: string;
  comments: string;
}

const mockVideos: Video[] = [
  {
    id: '1',
    title: 'Mariah the Scientist: Rainy Days/Burning Blue | The Tonight Show Starring Jimmy Fallon',
    thumbnail: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
    duration: '04:08',
    uploadDate: '9/17/2023',
    views: '21K Views',
    likes: '1.6K Likes',
    comments: '137 Comments'
  },
  {
    id: '2',
    title: '#MariahTheScientist performs "Burning Blue" off her new album HEARTS SOLD SEPARATELY!',
    thumbnail: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg',
    duration: '03:42',
    uploadDate: '9/17/2023',
    views: '5.5K Views',
    likes: '108 Likes',
    comments: '7 Comments'
  },
  {
    id: '3',
    title: '#SylvesterStallone explains how the iconic #Rocky steps scene came together! #FallonTonight',
    thumbnail: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg',
    duration: '01:11',
    uploadDate: '9/17/2023',
    views: '8.4K Views',
    likes: '123 Likes',
    comments: '8 Comments'
  },
  {
    id: '4',
    title: 'Jimmy Fallon Interviews Celebrity Guest About New Movie',
    thumbnail: 'https://images.pexels.com/photos/1181248/pexels-photo-1181248.jpeg',
    duration: '12:45',
    uploadDate: '9/16/2023',
    views: '45K Views',
    likes: '2.1K Likes',
    comments: '234 Comments'
  },
  {
    id: '5',
    title: 'Musical Performance: Artist Performs Hit Single Live',
    thumbnail: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',
    duration: '05:23',
    uploadDate: '9/15/2023',
    views: '89K Views',
    likes: '4.2K Likes',
    comments: '567 Comments'
  },
  {
    id: '6',
    title: 'Comedy Sketch: Hilarious Game Show Parody',
    thumbnail: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
    duration: '08:17',
    uploadDate: '9/14/2023',
    views: '156K Views',
    likes: '7.8K Likes',
    comments: '891 Comments'
  },
  {
    id: '7',
    title: 'Thank You Notes: Jimmy Thanks Viewers for Amazing Week',
    thumbnail: 'https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg',
    duration: '06:34',
    uploadDate: '9/13/2023',
    views: '67K Views',
    likes: '3.4K Likes',
    comments: '234 Comments'
  },
  {
    id: '8',
    title: 'Celebrity Plays Fun Game with Jimmy Fallon',
    thumbnail: 'https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg',
    duration: '09:12',
    uploadDate: '9/12/2023',
    views: '123K Views',
    likes: '5.6K Likes',
    comments: '445 Comments'
  },
  {
    id: '9',
    title: 'Weekend Update Style Segment About Current Events',
    thumbnail: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg',
    duration: '11:28',
    uploadDate: '9/11/2023',
    views: '234K Views',
    likes: '9.1K Likes',
    comments: '678 Comments'
  }
];

const VideoCard: React.FC<{ video: Video }> = ({ video }) => {
  return (
    <div className="group cursor-pointer transition-all duration-300 hover:scale-[1.02]">
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
        <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm font-medium">
          {video.duration}
        </div>
      </div>
      <h3 className="text-gray-900 font-semibold text-base leading-tight mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
        {video.title}
      </h3>
      <p className="text-gray-500 text-sm mb-1">{video.uploadDate}</p>
      <div className="flex items-center space-x-4 text-gray-500 text-sm">
        <span>{video.views}</span>
        <div className="flex items-center space-x-1">
          <ThumbsUp className="w-3 h-3" />
          <span>{video.likes}</span>
        </div>
        <div className="flex items-center space-x-1">
          <MessageCircle className="w-3 h-3" />
          <span>{video.comments}</span>
        </div>
      </div>
    </div>
  );
};

const YouTubeChannel: React.FC = () => {
  const handleLoadMore = () => {
    window.open('https://www.youtube.com/@fallontonight', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Channel Banner */}
      <div className="relative">
        <div className="h-48 md:h-64 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
          <div className="absolute inset-0 bg-black/40"></div>
          <img
            src="https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg"
            alt="Channel Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-end space-x-6">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
                  <img
                    src="https://images.pexels.com/photos/1181248/pexels-photo-1181248.jpeg"
                    alt="Channel Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-white">
                  <h1 className="text-2xl md:text-4xl font-bold mb-2">The Tonight Show Starring Jimmy Fallon</h1>
                  <div className="flex items-center space-x-4 text-sm md:text-base opacity-90">
                    <span>32M Subscribers</span>
                    <span>•</span>
                    <span>12K Videos</span>
                    <span>•</span>
                    <span>18B Views</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {mockVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center">
          <button
            onClick={handleLoadMore}
            className="inline-flex items-center space-x-3 bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <span>Load More Videos</span>
            <ExternalLink className="w-5 h-5" />
          </button>
          <p className="text-gray-500 text-sm mt-3">
            Click to view more videos on YouTube
          </p>
        </div>
      </div>
    </div>
  );
};

export default YouTubeChannel;