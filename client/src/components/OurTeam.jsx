export default () => {
  const team = [
    {
      avatar:
        "http://res.cloudinary.com/dgcmq62on/image/upload/v1706523074/gp7mvjaggjqdmetp1h0o.jpg",
      name: "Kartik Bhatt",
      title: "Blockchain Developer",
      desc: "Blockchain Innovator, Tech Enthusiast, Distributed Ledger Expert",
      company: "PayPal",
      linkedin: "https://www.linkedin.com/in/kartik-bhatt-2b9b2b256/"
    },
    {
      avatar:
        "http://res.cloudinary.com/dgcmq62on/image/upload/v1706522680/wxg7j7ql8bdwlbdjpnqx.jpg",
      name: "Bikram Narayan Dhanraj",
      title: "Frontend and Backend Developer",
      desc: "Creative Designer, Maestro of Frontend and Backend Development",
      company: "PayPal",
      linkedin: "https://www.linkedin.com/in/bikram-narayan/"
    },
    {
      avatar:
        "http://res.cloudinary.com/dgcmq62on/image/upload/v1706523103/ilobzhcojeqrke0quvk8.jpg",
      name: "Jenil Jain",
      title: "Frontend Developer",
      desc: "Frontend Architect, Frontend Development Prodigy",
      company: "Amazon",
      linkedin: "https://www.linkedin.com/in/jenil-jain-484095267/"
    },
  ];

  return (
    <section className="enhanced-team-section">
      <div className="enhanced-team-container">
        <div className="enhanced-team-header">
          <div className="enhanced-team-badge">
            <span className="enhanced-team-icon">👥</span>
            <span className="enhanced-team-text">Meet Our Amazing Team</span>
          </div>
          <h2 className="enhanced-team-title">The Coffee Dating Architects</h2>
          <p className="enhanced-team-subtitle">
            Meet the passionate innovators behind Coffee Dates - a diverse team of experts 
            brewing the perfect blend of technology, creativity, and human connection.
          </p>
        </div>
        
        <div className="simple-team-grid">
          {team.map((member, idx) => (
            <div key={idx} className="simple-team-card">
              <div className="simple-member-image">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="simple-member-photo"
                />
              </div>
              
              <div className="simple-member-info">
                <h3 className="simple-member-name">{member.name}</h3>
                <p className="simple-member-title">{member.title}</p>
                
                {member.company && (
                  <div className="company-badge">
                    <span className="company-text">{member.company}</span>
                  </div>
                )}
                
                <p className="simple-member-description">{member.desc}</p>
                
                <a href={member.linkedin} className="simple-linkedin-btn" aria-label="LinkedIn">
                  <svg className="simple-linkedin-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};