import React, { useState } from "react";
import { toast } from "react-toastify";

const SafeVideoCallPage = () => {
  const [projectId, setProjectId] = useState("2hHNjpYUlb9boxKto2Rw4p0RdcsA0PVl");
  const [roomId, setRoomId] = useState("");
  const [displayName, setDisplayName] = useState("Guest");
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    toast.info("Video calling feature is currently under maintenance");
    setTimeout(() => {
      setIsConnecting(false);
      toast.error("Unable to connect to video service. Please try again later.");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-8 px-4" style={{backgroundColor: '#ECE4CF'}}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-700 mb-4">
            ☕ Coffee Date Video Call
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-6">
            Connect with your coffee companion in a cozy virtual space
          </p>
          
          <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-200">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm md:text-base font-medium text-gray-700">
              System Maintenance
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Video Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
              📹 Video Call Area
            </h2>
            
            <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center mb-6">
              <div className="text-center">
                <div className="text-6xl mb-4">📹</div>
                <p className="text-gray-500 text-lg">Camera Preview</p>
                <p className="text-gray-400 text-sm">Video system loading...</p>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button className="bg-gray-300 text-gray-600 px-6 py-3 rounded-full font-semibold cursor-not-allowed">
                <span className="mr-2">📹</span>
                Camera
              </button>
              <button className="bg-gray-300 text-gray-600 px-6 py-3 rounded-full font-semibold cursor-not-allowed">
                <span className="mr-2">🎤</span>
                Microphone
              </button>
            </div>
          </div>

          {/* Controls Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
              🔧 Connection Settings
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="Your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Room ID
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="Enter room ID or use default"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Project ID
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="Project ID"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                />
              </div>

              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                style={{background: isConnecting ? undefined : 'linear-gradient(to right, #DEB887, #CD853F)'}}
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>{isConnecting ? '⏳' : '📞'}</span>
                  <span>{isConnecting ? 'Connecting...' : 'Start Video Call'}</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Status Message */}
        <div className="mt-12 text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">🚧</div>
              <div className="text-left">
                <h3 className="font-semibold text-yellow-800 mb-2">Video Call Service Notice</h3>
                <p className="text-yellow-700 text-sm leading-relaxed">
                  Our video calling feature is currently undergoing maintenance to provide you with the best experience. 
                  We apologize for any inconvenience and appreciate your patience as we work to improve our services.
                </p>
                <p className="text-yellow-600 text-xs mt-2">
                  Expected resolution: Please check back later or refresh the page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeVideoCallPage;