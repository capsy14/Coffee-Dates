# ☕ Coffee Dating DApp: Coffee Dates

Welcome to **Coffee Dates**, the innovative dating platform where your love for coffee meets the power of blockchain technology! Our app combines the pleasure of discovering exceptional coffees with the excitement of meaningful connections, all on a secure, decentralized platform.

## 🌟 What is Coffee Dates?

Coffee Dates is a unique decentralized application (DApp) that blends coffee culture with modern dating. Built on blockchain technology, our platform ensures transparency, security, and privacy while helping coffee enthusiasts connect and share virtual coffee dates. Whether you're a coffee connoisseur or someone seeking genuine connections over a cup of joe, we've got you covered.

## ✨ Key Features

### 🎬 **Native WebRTC Video Calling**
- **Peer-to-peer video calling** using native browser WebRTC APIs
- **No third-party dependencies** - complete control and privacy
- **Real-time signaling** via Socket.IO for seamless connections
- **Coffee-themed UI** with warm, inviting design
- **Low latency** connections for high-quality video dates

### ☕ **Coffee Marketplace**
- Explore an extensive range of coffees from around the world
- From aromatic blends to rare single-origin beans
- Curated selection for every coffee enthusiast
- Blockchain-powered transactions on Sepolia testnet

### 💬 **Real-Time Chat**
- Decentralized messaging with Gun.js
- Peer-to-peer chat without centralized servers
- Secure and private conversations
- Share your coffee journey with potential matches

### 📸 **Share Memories**
- Upload and share photos via IPFS (Pinata)
- Decentralized, encrypted photo storage
- Create lasting memories of your coffee dates
- Privacy-focused sharing

### 📧 **Email Invitations**
- Send coffee date invitations directly
- Schedule virtual or in-person meetups
- Automated email notifications
- Calendar integration ready

### 🔒 **Privacy First**
- Decentralized architecture
- Your data, your control
- Blockchain-secured transactions
- End-to-end encrypted communications

## 📸 Screenshots

### Home Page
![Home Page](https://github.com/capsy14/Coffee-Dates/blob/main/client/public/assets/Hero%20Page.jpg)

### Buy Coffee
![Buy Coffee](https://github.com/capsy14/Coffee-Dates/blob/main/client/public/assets/Menu.jpg)

### Registration & Login
![Register](https://github.com/capsy14/Coffee-Dates/blob/main/client/public/assets/Register%20Page.jpg)
![Login](https://github.com/capsy14/Coffee-Dates/blob/main/client/public/assets/Login%20Page.jpg)

### Payment & Profiles
![Payment](https://github.com/capsy14/Coffee-Dates/blob/main/client/public/assets/Transactions.jpg)
![Profiles](https://github.com/capsy14/Coffee-Dates/blob/main/client/public/assets/Profiles.jpg)

### Chat & Video Calling
![Chat](https://github.com/capsy14/Coffee-Dates/blob/main/client/public/assets/Chat%20Page.jpg)
![Video Call](https://github.com/capsy14/Coffee-Dates/blob/main/client/public/assets/Video%20Calling.jpg)

### Share Memories
![Memories](https://github.com/capsy14/Coffee-Dates/blob/main/client/public/assets/Memories.jpg)

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose | Documentation |
|------------|---------|---------------|
| **Vite + React** | Lightning-fast build tool with React framework | [Vite](https://vitejs.dev/) • [React](https://reactjs.org/docs/) |
| **Tailwind CSS** | Utility-first CSS framework | [Tailwind](https://tailwindcss.com/docs) |
| **Canva** | Design assets and branding | [Canva](https://www.canva.com/) |

### Blockchain & Web3
| Technology | Purpose | Documentation |
|------------|---------|---------------|
| **Solidity** | Smart contract development | [Solidity](https://soliditylang.org) |
| **Hardhat** | Ethereum development environment | [Hardhat](https://hardhat.org/) |
| **Ethers.js** | Ethereum wallet & contract interaction | [Ethers.js](https://docs.ethers.io/v5/) |
| **Sepolia Testnet** | Ethereum test network | [Sepolia](https://hardhat.org/hardhat-network/) |

### Real-Time Communication
| Technology | Purpose | Documentation |
|------------|---------|---------------|
| **WebRTC** | Native peer-to-peer video calling | [WebRTC API](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API) |
| **Socket.IO** | Real-time bidirectional signaling | [Socket.IO](https://socket.io/docs/v4/) |
| **Gun.js** | Decentralized P2P chat database | [Gun.js](https://gun.eco/docs/) |

### Storage & IPFS
| Technology | Purpose | Documentation |
|------------|---------|---------------|
| **Pinata** | IPFS pinning service for photos | [Pinata](https://pinata.cloud/documentation) |

### Backend
| Technology | Purpose | Documentation |
|------------|---------|---------------|
| **Node.js** | JavaScript runtime environment | [Node.js](https://nodejs.org/en/docs/) |
| **Express** | Web application framework | [Express](https://expressjs.com/) |
| **MongoDB** | NoSQL database | [MongoDB](https://docs.mongodb.com/) |
| **Mongoose** | MongoDB object modeling | [Mongoose](https://mongoosejs.com/docs/) |
| **Email.js** | Email service for notifications | [Email.js](https://www.emailjs.com/docs/) |

## 🏗️ Architecture

### WebRTC Video Calling Flow
```
User A                    Signaling Server (Socket.IO)                User B
  |                                  |                                  |
  |------ Connect to Socket -------->|<------- Connect to Socket -------|
  |                                  |                                  |
  |--- Create Offer (SDP) ---------->|                                  |
  |                                  |------- Forward Offer ----------->|
  |                                  |                                  |
  |                                  |<------ Create Answer (SDP) ------|
  |<------ Forward Answer -----------|                                  |
  |                                  |                                  |
  |--- ICE Candidates -------------->|<------- ICE Candidates ----------|
  |<-------------------------------->|<-------------------------------->|
  |                                  |                                  |
  |<========== P2P Video/Audio Connection Established ================>|
```

### Blockchain Integration
- Smart contracts deployed on Sepolia testnet
- Ethers.js handles wallet connections and transactions
- Coffee purchases recorded on blockchain
- Transparent, immutable transaction history

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- MetaMask wallet extension
- Modern web browser with WebRTC support

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/capsy14/Coffee-Dates.git
   cd Coffee-Dates
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file with:
   # PORT=5000
   # MONGO_URI=your_mongodb_connection_string
   # JWT_SECRET=your_secret_key
   
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Access the Application**
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:5000`
   - Video Call Page: `http://localhost:3000/video-call`

### Environment Variables

**Backend (.env)**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/coffee-dates
JWT_SECRET=your_jwt_secret_here
EMAIL_SERVICE_ID=your_emailjs_service_id
EMAIL_TEMPLATE_ID=your_emailjs_template_id
EMAIL_PUBLIC_KEY=your_emailjs_public_key
```

**Frontend (.env)**
```env
VITE_PINATA_API_KEY=your_pinata_api_key
VITE_PINATA_SECRET_KEY=your_pinata_secret_key
VITE_CONTRACT_ADDRESS=your_deployed_contract_address
```

## 📱 Features Guide

### Video Calling
1. Navigate to `/video-call`
2. Copy your User ID (displayed at top)
3. Share your User ID with your coffee date
4. Enter their User ID in the "Recipient's User ID" field
5. Click "Start Video Call"
6. They accept the call
7. Enjoy your coffee date! ☕📹

### Chat
- Real-time messaging powered by Gun.js
- Fully decentralized P2P communication
- No message history stored on central servers

### Buy Coffee
- Browse coffee selection
- Connect MetaMask wallet
- Purchase using Sepolia ETH
- Transaction recorded on blockchain

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. **Fork the Repository**
2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit Your Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and conventions
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 👥 Team

| Name | Role | GitHub | Contributions |
|------|------|--------|---------------|
| **Bikram Dhanraj** | Frontend Lead | [@BikramNarayan](https://github.com/BikramNarayan) | Vite, Tailwind CSS, UI/UX, Email.js integration |
| **Jenil Jain** | Backend Lead | [@jeniljain2811](https://github.com/jeniljain2811) | Node.js, Express, MongoDB, REST API |
| **Kartik Bhatt** | Web3 & WebRTC Lead | [@capsy14](https://github.com/capsy14) | Solidity, Hardhat, WebRTC, Socket.IO, Gun.js, IPFS |

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- **Live Demo**: [coffee-dates.vercel.app](https://koffee-ka-chakkar01.vercel.app)
- **GitHub**: [github.com/capsy14/Coffee-Dates](https://github.com/capsy14/Coffee-Dates)
- **Report Issues**: [GitHub Issues](https://github.com/capsy14/Coffee-Dates/issues)

## 📞 Support

Need help? Have questions?
- Open an issue on GitHub
- Contact the team through our repository

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Group video calls
- [ ] AI-powered coffee recommendations
- [ ] NFT-based coffee collection cards
- [ ] Multi-language support
- [ ] Mainnet deployment

---

**Made with ☕ and ❤️ by the Coffee Dates Team**

*Brew Love, One Cup at a Time* 🌟

