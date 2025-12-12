# 🎯 Quick Command Reference

## Remove Huddle Dependencies

Run this in PowerShell from the client directory:

```powershell
cd client
npm uninstall @huddle01/react
Remove-Item package-lock.json -ErrorAction SilentlyContinue
Remove-Item pnpm-lock.yaml -ErrorAction SilentlyContinue  
Remove-Item yarn.lock -ErrorAction SilentlyContinue
npm install
```

## Start Development Servers

### Option 1: Automated (Windows)
```bash
# From Coffee-Dates directory
.\start-webrtc.bat
```

### Option 2: Manual

**Backend:**
```powershell
cd backend
npm install  # First time only
npm start    # Runs on http://localhost:5000
```

**Frontend:**
```powershell
cd client
npm install  # First time only
npm start    # Runs on http://localhost:3000
```

## Test Video Calling

1. **Open browser:** `http://localhost:3000/video-call`
2. **Copy your User ID** (shown on page)
3. **Open second tab:** `http://localhost:3000/video-call`
4. **Enter first user's ID** in "Recipient's User ID"
5. **Enter a name** in "Recipient's Name"
6. **Click "Start Video Call"**
7. **Accept call** in first tab

## Integration Examples

### Add to Routes

```jsx
// App.jsx or your routing file
import HomeWebRTC from './pages/Home/HomeWebRTC';

<Route path="/video-call" element={<HomeWebRTC />} />
```

### Direct Component Usage

```jsx
import WebRTCVideoCall from './component-d/WebRTCVideoCall';

function MyPage() {
  return (
    <WebRTCVideoCall
      currentUserId={currentUser.id}
      recipientUserId={matchedUser.id}
      recipientName={matchedUser.name}
    />
  );
}
```

## Troubleshooting Commands

### Check if backend is running
```powershell
Test-NetConnection localhost -Port 5000
```

### Check if frontend is running
```powershell
Test-NetConnection localhost -Port 3000
```

### View running Node processes
```powershell
Get-Process -Name node
```

### Kill all Node processes (if stuck)
```powershell
Stop-Process -Name node -Force
```

### Clear npm cache (if issues)
```powershell
npm cache clean --force
```

### Reinstall everything
```powershell
# Backend
cd backend
Remove-Item node_modules -Recurse -Force
npm install

# Frontend
cd ..\client
Remove-Item node_modules -Recurse -Force
npm install
```

## Production Build

```powershell
cd client
npm run build
```

## Environment Variables

No additional environment variables needed for WebRTC!

The implementation uses free public STUN/TURN servers.

For production, consider:
- Setting up your own TURN server
- Updating `client/src/utils/webrtcConfig.js`

## File Locations

| Component | Path |
|-----------|------|
| Video Call UI | `client/src/pages/Home/HomeWebRTC.jsx` |
| Video Component | `client/src/component-d/WebRTCVideoCall.jsx` |
| Peer Video | `client/src/component-d/Video.jsx` |
| Config | `client/src/utils/webrtcConfig.js` |
| Signaling Server | `backend/server.js` |

## Documentation

- `WEBRTC_README.md` - Complete guide
- `MIGRATION_GUIDE.md` - Migration steps
- `IMPLEMENTATION_SUMMARY.md` - Quick overview
- `HUDDLE_REMOVAL_COMPLETE.md` - Removal checklist

## Need Help?

Check browser console (F12) for errors:
- Red errors = something broke
- Socket connection = backend communication
- ICE candidates = WebRTC connection process

Common fixes:
1. Ensure both servers are running
2. Clear browser cache (Ctrl+Shift+Del)
3. Check camera/mic permissions
4. Try different browser (Chrome recommended)

---

**Coffee Dates - WebRTC Edition** ☕📞
