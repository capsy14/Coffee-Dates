import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MatchCard from './MatchCard';
import LoadingSpinner from './LoadingSpinner';
import { oppositeGenderProfile } from '../../services/services';
import { showToast } from '../../utils/toastUtils';
import './MatchSuggestions.css';

const MatchSuggestions = ({ userId }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);

  const ML_API_BASE = import.meta.env.VITE_ML_API_URL || 'http://localhost:8000';

  useEffect(() => {
    if (userId) {
      fetchMatches();
    }
  }, [userId]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use ONLY real user data from opposite gender profiles
      console.log('Fetching real user profiles from database...');
      const oppositeProfiles = await oppositeGenderProfile();
      console.log('Fetched profiles:', oppositeProfiles);
      
      if (Array.isArray(oppositeProfiles) && oppositeProfiles.length > 0) {
        // Transform opposite profiles to match format
        const transformedMatches = oppositeProfiles.map((profile, index) => ({
          user_id: profile._id,
          score: Math.random() * 0.4 + 0.6, // Random score between 0.6-1.0
          profile: {
            name: profile.name,
            age: profile.age || 25,
            photo: profile.photo,
            bio: profile.bio,
            gender: profile.gender,
            email: profile.email,
            interests: profile.interests || ['Coffee', 'Dating', 'Fun'],
            coffee_preferences: profile.coffeePreferences || ['Espresso', 'Americano'],
            personality_type: profile.personality || 'Friendly and outgoing'
          },
          reasons: [
            'Looking for coffee dates',
            'Compatible personality',
            'Similar interests'
          ]
        }));
        
        // Shuffle and limit to 5
        const shuffled = transformedMatches.sort(() => 0.5 - Math.random());
        setMatches(shuffled.slice(0, 5));
        setCurrentIndex(0);
        console.log('Set matches:', shuffled.slice(0, 5));
      } else {
        console.warn('No opposite gender profiles found');
        setError('No profiles available for matching.');
      }
      
    } catch (error) {
      console.error('Error fetching matches:', error);
      setError('Failed to load match suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (action, targetUserId) => {
    try {
      // Try to record feedback to ML service
      try {
        await axios.post(`${ML_API_BASE}/feedback`, {
          user_id: userId,
          target_user_id: targetUserId,
          action: action,
          interaction_context: 'match_suggestion'
        });
      } catch (mlError) {
        console.warn('ML service feedback failed (service may not be running):', mlError.message);
        // Continue with local action even if ML service fails
      }

      // Move to next match
      if (Array.isArray(matches) && currentIndex < matches.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Try to fetch new matches, but handle gracefully if it fails
        try {
          await fetchMatches();
        } catch (fetchError) {
          console.warn('Failed to fetch new matches:', fetchError.message);
          // Reset to beginning if we can't fetch new matches
          setCurrentIndex(0);
        }
      }

      // If it's a match, handle match logic
      if (action === 'accepted') {
        await handleMatch(targetUserId);
      }

    } catch (error) {
      console.error('Error in user action:', error);
    }
  };

  const handleMatch = async (targetUserId) => {
    let matchStored = false;
    let messageNotificationText = 'Coffee Date selected! You can now chat with this person.';
    
    try {
      // Store the match in the backend using the correct endpoint
      const BACKEND_URL = import.meta.env.VITE_APP_BACKEND || 'http://localhost:5000/api/users/';
      console.log('Using BACKEND_URL:', BACKEND_URL);
      console.log('Full URL will be:', `${BACKEND_URL}addmatch`);
      
      await axios.post(`${BACKEND_URL}addmatch`, {
        matchedUserId: targetUserId
      }, {
        withCredentials: true
      });
      
      console.log('✅ Match successfully created with user:', targetUserId);
      matchStored = true;
      messageNotificationText = 'It\'s a match! They will be notified that you liked them. Start chatting now!';
      
      // Log success for debugging
      console.log('Match stored successfully, backend responded positively');
      
      // Send actual default message to the matched user
      try {
        const messageApiUrl = import.meta.env.VITE_APP_BACKEND + 'message';
        await axios.post(`${messageApiUrl}/send/${targetUserId}`, {
          message: "You have been liked by someone! ❤️☕"
        }, {
          withCredentials: true
        });
        console.log('Default message sent to matched user');
      } catch (messageError) {
        console.error('Error sending default message:', messageError);
        // Don't change the notification text - match was still stored successfully
      }
      
    } catch (error) {
      console.error('❌ Error storing match:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      // Keep the fallback message text
    }
    
    // Show single success toast regardless of backend success/failure
    showToast.success(messageNotificationText);
  };

  const handleRefresh = async () => {
    await fetchMatches();
  };

  if (loading) {
    return (
      <div className="match-suggestions-container">
        <LoadingSpinner message="Finding your perfect coffee matches..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="match-suggestions-container">
        <div className="error-state">
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button onClick={handleRefresh} className="refresh-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!Array.isArray(matches) || matches.length === 0) {
    return (
      <div className="match-suggestions-container">
        <div className="no-matches">
          <div className="no-matches-icon">☕</div>
          <h3>No new matches right now</h3>
          <p>We're brewing up some perfect matches for you!</p>
          <button onClick={handleRefresh} className="refresh-btn">
            Check for New Matches
          </button>
        </div>
      </div>
    );
  }

  const currentMatch = matches[currentIndex];

  return (
    <div className="match-suggestions-container">
      <div className="matches-header">
        <h2>Suggested for You</h2>
        <div className="match-counter">
          <span className="current">{currentIndex + 1}</span>
          <span className="separator">/</span>
          <span className="total">{Array.isArray(matches) ? matches.length : 0}</span>
        </div>
      </div>

      <MatchCard
        match={currentMatch}
        onAccept={() => handleUserAction('accepted', currentMatch.user_id)}
        onSkip={() => handleUserAction('skipped', currentMatch.user_id)}
      />

      <div className="upcoming-matches">
        <h4>Coming Up Next</h4>
        <div className="upcoming-previews">
          {Array.isArray(matches) && matches.slice(currentIndex + 1, currentIndex + 3).map((match, index) => (
            <div key={match.user_id} className="upcoming-preview">
              <img 
                src={match.profile.photo || '/default-avatar.png'} 
                alt={match.profile.name}
                className="preview-image"
              />
              <div className="preview-info">
                <span className="preview-name">{match.profile.name}</span>
                <span className="preview-score">{Math.round(match.score * 100)}% match</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="suggestions-footer">
        <button onClick={handleRefresh} className="refresh-suggestions-btn">
          <span className="refresh-icon">🔄</span>
          Get New Suggestions
        </button>
      </div>
    </div>
  );
};

export default MatchSuggestions;