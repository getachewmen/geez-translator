// App.jsx - Mobile-Optimized Geez Verb Translation App
import { useState, useEffect, useRef } from "react";
import { dictionary } from "./data/dictionary.js";
import { guides } from "./data/guides.js";
import "./App.css";

export default function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [relatedWords, setRelatedWords] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("translate");
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [guideCategory, setGuideCategory] = useState("all");
  
  const searchContainerRef = useRef(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("geez-recent-searches");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed);
        }
      }
    } catch (error) {
      console.error("Error loading recent searches:", error);
      setRecentSearches([]);
    }
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Update suggestions when input changes
  useEffect(() => {
    if (input.trim().length > 0) {
      const matchedVerbs = dictionary.filter(verb => 
        verb?.geez?.toLowerCase().includes(input.toLowerCase()) ||
        verb?.amharic?.toLowerCase().includes(input.toLowerCase()) ||
        verb?.english?.toLowerCase().includes(input.toLowerCase())
      ).slice(0, isMobile ? 5 : 8);
      setSuggestions(matchedVerbs);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [input, isMobile]);

  // Find all meanings for a Geez verb
  const findAllMeanings = (geezVerb) => {
    if (!geezVerb || !dictionary) return [];
    return dictionary.filter(verb => verb?.geez === geezVerb);
  };

  // Enhanced related words finder
  const findRelatedWords = (currentVerb) => {
    if (!currentVerb || !dictionary) return [];
    
    const currentText = `${currentVerb.amharic || ''} ${currentVerb.english || ''}`.toLowerCase();
    
    const related = dictionary.filter(verb => {
      if (!verb || verb.geez === currentVerb.geez) return false;
      
      const verbText = `${verb.amharic || ''} ${verb.english || ''}`.toLowerCase();
      const similarity = calculateEnhancedSimilarity(currentText, verbText);
      
      return similarity > 0.2;
    })
    .sort((a, b) => {
      const aSimilarity = calculateEnhancedSimilarity(currentText, `${a.amharic || ''} ${a.english || ''}`.toLowerCase());
      const bSimilarity = calculateEnhancedSimilarity(currentText, `${b.amharic || ''} ${b.english || ''}`.toLowerCase());
      return bSimilarity - aSimilarity;
    })
    .slice(0, isMobile ? 4 : 8);
    
    return related;
  };

  // Enhanced similarity calculation
  const calculateEnhancedSimilarity = (text1, text2) => {
    const words1 = extractMeaningfulWords(text1);
    const words2 = extractMeaningfulWords(text2);
    
    if (words1.length === 0 || words2.length === 0) return 0;
    
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  };

  // Improved keyword extraction
  const extractMeaningfulWords = (text) => {
    if (!text) return [];
    
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
      'የ', 'እና', 'በ', 'ከ', 'ወደ', 'ለ', 'አለ', 'ውስጥ', 'ላይ', 'ነው', 'ና', 'ማ', 'ው', 'ን', 'ት', 'ዎ', 'ው', 'ም', 'እ', 'ይ', 'ኦ', 'ል', 'ብ'
    ]);
    
    return text
      .split(/[\s,.;!?()–—]+/)
      .filter(word => word && word.length > 1 && !stopWords.has(word.toLowerCase()))
      .map(word => word.toLowerCase().replace(/[^a-zA-Z\u1200-\u137F]/g, ''))
      .filter(word => word.length > 0);
  };

  // Main search function
  const searchVerb = () => {
    if (!input.trim()) {
      setResult({ error: true, message: "Please enter a Geez verb" });
      setRelatedWords([]);
      return;
    }

    setLoading(true);
    setShowSuggestions(false);
    
    setTimeout(() => {
      try {
        const allMeanings = findAllMeanings(input.trim());
        
        if (allMeanings.length === 0) {
          setResult({ notFound: true });
          setRelatedWords([]);
        } else {
          const resultData = allMeanings.length > 1 ? allMeanings : allMeanings[0];
          setResult(resultData);
          
          const related = findRelatedWords(allMeanings[0]);
          setRelatedWords(related);
          
          const updatedSearches = [
            allMeanings[0], 
            ...recentSearches.filter(item => item?.geez !== allMeanings[0]?.geez)
          ].slice(0, isMobile ? 4 : 6);
          setRecentSearches(updatedSearches);
          
          try {
            localStorage.setItem("geez-recent-searches", JSON.stringify(updatedSearches));
          } catch (storageError) {
            console.warn("Could not save to localStorage:", storageError);
          }
        }
      } catch (error) {
        console.error("Search error:", error);
        setResult({ error: true, message: "An error occurred during search" });
      } finally {
        setLoading(false);
      }
    }, isMobile ? 300 : 400);
  };

  // Handle suggestion click
  const handleSuggestionClick = (verb) => {
    if (!verb?.geez) return;
    
    setInput(verb.geez);
    const allMeanings = findAllMeanings(verb.geez);
    const resultData = allMeanings.length > 1 ? allMeanings : allMeanings[0];
    setResult(resultData);
    setShowSuggestions(false);
    
    const related = findRelatedWords(allMeanings[0]);
    setRelatedWords(related);
    
    const updatedSearches = [
      allMeanings[0], 
      ...recentSearches.filter(item => item?.geez !== verb.geez)
    ].slice(0, isMobile ? 4 : 6);
    setRecentSearches(updatedSearches);
    
    try {
      localStorage.setItem("geez-recent-searches", JSON.stringify(updatedSearches));
    } catch (error) {
      console.warn("Could not save to localStorage:", error);
    }
  };

  // Handle related word click
  const handleRelatedWordClick = (verb) => {
    if (!verb?.geez) return;
    
    setInput(verb.geez);
    const allMeanings = findAllMeanings(verb.geez);
    const resultData = allMeanings.length > 1 ? allMeanings : allMeanings[0];
    setResult(resultData);
    setShowSuggestions(false);
    
    const newRelated = findRelatedWords(allMeanings[0]);
    setRelatedWords(newRelated);
  };

  // Handle recent search click
  const handleRecentSearchClick = (verb) => {
    if (!verb?.geez) return;
    
    setInput(verb.geez);
    const allMeanings = findAllMeanings(verb.geez);
    const resultData = allMeanings.length > 1 ? allMeanings : allMeanings[0];
    setResult(resultData);
    setShowSuggestions(false);
    
    const related = findRelatedWords(allMeanings[0]);
    setRelatedWords(related);
  };

  // Handle keyboard events
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchVerb();
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (input.trim().length > 0 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  // Clear search
  const clearSearch = () => {
    setInput("");
    setResult(null);
    setShowSuggestions(false);
    setRelatedWords([]);
  };

  // Safe rendering helper functions
  const renderSingleMeaning = (verb) => {
    if (!verb) return null;
    
    return (
      <div className="result-card">
        <div className="verb-header">
          <h2>{verb.geez || "N/A"}</h2>
          <div className="verb-details">
            <span className="detail-item">Root: {verb.root || "N/A"}</span>
            <span className="detail-item">Type: {verb.verbType || "N/A"}</span>
            <span className="detail-item">Starts with: {verb.rootLetter || "N/A"}</span>
          </div>
        </div>
        
        <div className="translations">
          <div className="translation-row">
            <span className="lang-label">Amharic:</span>
            <span className="translation-text">{verb.amharic || "N/A"}</span>
          </div>
          <div className="translation-row">
            <span className="lang-label">English:</span>
            <span className="translation-text">{verb.english || "N/A"}</span>
          </div>
          <div className="translation-row">
            <span className="lang-label">Oromiffa:</span>
            <span className="translation-text">{verb.oromiffa || "N/A"}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderMultipleMeanings = (meanings) => {
    if (!Array.isArray(meanings) || meanings.length === 0) return null;
    
    return (
      <div className="result-card multiple-meanings">
        <div className="verb-header">
          <h2>{meanings[0]?.geez || "N/A"}</h2>
          <div className="meanings-count">
            {meanings.length} meanings found
          </div>
          <div className="verb-details">
            <span className="detail-item">Root: {meanings[0]?.root || "N/A"}</span>
            <span className="detail-item">Type: {meanings[0]?.verbType || "N/A"}</span>
            <span className="detail-item">Starts with: {meanings[0]?.rootLetter || "N/A"}</span>
          </div>
        </div>
        
        <div className="meanings-container">
          {meanings.map((meaning, index) => (
            <div key={index} className="meaning-block">
              <div className="translations">
                <div className="translation-row">
                  <span className="lang-label">Amharic:</span>
                  <span className="translation-text">{meaning.amharic || "N/A"}</span>
                </div>
                <div className="translation-row">
                  <span className="lang-label">English:</span>
                  <span className="translation-text">{meaning.english || "N/A"}</span>
                </div>
                <div className="translation-row">
                  <span className="lang-label">Oromiffa:</span>
                  <span className="translation-text">{meaning.oromiffa || "N/A"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Guide-related functions
  const getCategories = () => {
    const categories = [...new Set(guides.map(guide => guide.category))];
    return ["all", ...categories];
  };

  const getFilteredGuides = () => {
    if (guideCategory === "all") return guides;
    return guides.filter(guide => guide.category === guideCategory);
  };

  const renderGuideCard = (guide) => {
    return (
      <div 
        key={guide.id} 
        className="guide-card"
        onClick={() => setSelectedGuide(guide)}
      >
        <div className="guide-header">
          <span className="guide-icon">{guide.icon}</span>
          <div className="guide-title-section">
            <h3>{guide.title}</h3>
            <p className="guide-subtitle">{guide.subtitle}</p>
          </div>
        </div>
        <div className="guide-meta">
          <span className={`guide-level ${guide.level}`}>{guide.level}</span>
          <span className="guide-category">{guide.category}</span>
        </div>
        <p className="guide-preview">
          {guide.content.substring(0, 100)}...
        </p>
        <div className="guide-arrow">→</div>
      </div>
    );
  };

  const renderGuideDetail = (guide) => {
    return (
      <div className="guide-detail">
        <button 
          className="back-button"
          onClick={() => setSelectedGuide(null)}
        >
          ← {isMobile ? "Back" : "Back to Guides"}
        </button>
        
        <div className="guide-detail-header">
          <span className="guide-icon-large">{guide.icon}</span>
          <div>
            <h1>{guide.title}</h1>
            <p className="guide-subtitle">{guide.subtitle}</p>
          </div>
        </div>

        <div className="guide-content">
          <div className="guide-section">
            <h3>መግቢያ</h3>
            <p>{guide.content}</p>
            {guide.englishContent && (
              <div className="english-translation">
                <strong>English:</strong> {guide.englishContent}
              </div>
            )}
          </div>

          {/* Render pronouns table if exists */}
          {guide.pronouns && (
            <div className="guide-section">
              <h3>የመራሕያን ዝርዝር</h3>
              <div className="pronouns-table">
                <div className="table-header">
                  <span>ግእዝ</span>
                  <span>አማርኛ</span>
                  <span>English</span>
                </div>
                {guide.pronouns.map((pronoun, index) => (
                  <div key={index} className="table-row">
                    <span className="geez-text">{pronoun.geez}</span>
                    <span>{pronoun.amharic}</span>
                    <span>{pronoun.english}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Render classifications if exists */}
          {guide.classifications && (
            <div className="guide-section">
              <h3>የክፍፍል ዓይነቶች</h3>
              {guide.classifications.map((classification, index) => (
                <div key={index} className="classification-group">
                  <h4>{classification.type}</h4>
                  <ul>
                    {classification.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Render functions if exists */}
          {guide.functions && (
            <div className="guide-section">
              <h3>የአገልግሎት ዓይነቶች</h3>
              {guide.functions.map((func, index) => (
                <div key={index} className="function-item">
                  <h4>{func.title}</h4>
                  <p><strong>መግለጫ:</strong> {func.description}</p>
                  <div className="example-box">
                    <strong>ምሳሌ:</strong> {func.example}
                    <br />
                    <strong>ትርጉም:</strong> {func.translation}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Render conjugation examples if exists */}
          {guide.conjugation && (
            <div className="guide-section">
              <h3>{guide.conjugation.title}</h3>
              <div className="conjugation-table">
                <div className="table-header">
                  <span>መራሒ</span>
                  <span>ግሥ ቅርፅ</span>
                  <span>ትርጉም</span>
                </div>
                {guide.conjugation.examples.map((example, index) => (
                  <div key={index} className="table-row">
                    <span>{example.pronoun}</span>
                    <span className="geez-text">{example.form}</span>
                    <span>{example.meaning}</span>
                  </div>
                ))}
              </div>
              
              {guide.rules && (
                <div className="conjugation-rules">
                  <h4>ህጎች:</h4>
                  <ul>
                    {guide.rules.map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Render object pronouns if exists */}
          {guide.objectPronouns && (
            <div className="guide-section">
              <h3>ገቢር መራሕያን</h3>
              <div className="pronouns-table">
                <div className="table-header">
                  <span>ግእዝ</span>
                  <span>አማርኛ</span>
                  <span>English</span>
                </div>
                {guide.objectPronouns.map((pronoun, index) => (
                  <div key={index} className="table-row">
                    <span className="geez-text">{pronoun.geez}</span>
                    <span>{pronoun.amharic}</span>
                    <span>{pronoun.english}</span>
                  </div>
                ))}
              </div>
              
              {guide.examples && (
                <div className="examples-section">
                  <h4>ምሳሌዎች:</h4>
                  {guide.examples.map((example, index) => (
                    <div key={index} className="example-box">
                      {example}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Render prepositions if exists */}
          {guide.prepositions && (
            <div className="guide-section">
              <h3>መስተዋድዳን ቀለማት</h3>
              <div className="prepositions-grid">
                {guide.prepositions.map((prep, index) => (
                  <div key={index} className="preposition-item">
                    <span className="geez-text">{prep.geez}</span>
                    <span>{prep.amharic}</span>
                    <span className="english">{prep.english}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <header>
        <h1>ግእዝ አቋም → Translation App</h1>
        <p className="subtitle">Discover the meanings of Geez verbs and learn grammar</p>
      </header>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'translate' ? 'active' : ''}`}
          onClick={() => setActiveTab('translate')}
        >
          {isMobile ? "🔍 ትርጉም" : "🔍 ትርጉም (Translation)"}
        </button>
        <button 
          className={`tab-button ${activeTab === 'guides' ? 'active' : ''}`}
          onClick={() => setActiveTab('guides')}
        >
          {isMobile ? "📚 መራህያን" : "📚 መራህያን (Guides)"}
        </button>
      </div>

      {/* Translation Tab Content */}
      {activeTab === 'translate' && (
        <div className="search-section">
          <div className="input-group">
            <div className="search-container" ref={searchContainerRef}>
              <input 
                type="text" 
                placeholder="ግእዝ ግስ አስገባ (Enter Geez verb)" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={handleInputFocus}
                className="search-input"
                aria-label="Enter Geez verb to translate"
                enterKeyHint="search"
              />
              {input && (
                <button 
                  onClick={clearSearch} 
                  className="clear-button"
                  aria-label="Clear search"
                  type="button"
                >
                  ✕
                </button>
              )}
              
              {showSuggestions && suggestions.length > 0 && (
                <div className="suggestions-dropdown">
                  {suggestions.map((verb, index) => (
                    <div
                      key={index}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(verb)}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <span className="suggestion-geez">{verb.geez || "N/A"}</span>
                      {!isMobile && (
                        <span className="suggestion-meaning">{verb.amharic || "N/A"}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <button 
              onClick={searchVerb} 
              disabled={loading}
              className="search-button"
              type="button"
            >
              {loading ? (
                <>{isMobile ? "⏳" : "⏳ Searching..."}</>
              ) : (
                <>{isMobile ? "🔍" : "🔍 Translate"}</>
              )}
            </button>
          </div>
          
          {/* Related Words Section */}
          {relatedWords.length > 0 && (
            <div className="related-words-section">
              <h3>
                {isMobile ? "📚 ተዛማጅ" : "📚 ተዛማጅ ቃላት (Related Words)"}
              </h3>
              <div className={`related-words-grid ${isMobile ? 'mobile-grid' : ''}`}>
                {relatedWords.map((verb, index) => (
                  <button 
                    key={index}
                    className="related-word-card"
                    onClick={() => handleRelatedWordClick(verb)}
                    type="button"
                  >
                    <div className="related-geez">{verb.geez || "N/A"}</div>
                    {!isMobile && (
                      <div className="related-meaning">{verb.amharic || "N/A"}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Recent Searches */}
          {recentSearches.length > 0 && !result && (
            <div className="recent-searches-section">
              <h3>
                {isMobile ? "🕒 የቅርብ" : "🕒 የቅርብ ጊዜ ፍለጋ (Recent Searches)"}
              </h3>
              <div className={`recent-searches-grid ${isMobile ? 'mobile-grid' : ''}`}>
                {recentSearches.map((verb, index) => (
                  <button 
                    key={index}
                    className="recent-search-card"
                    onClick={() => handleRecentSearchClick(verb)}
                    type="button"
                  >
                    {verb.geez || "N/A"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error Messages */}
          {result && result.error && (
            <div className="message-box error">
              <span className="icon">⚠️</span>
              <p>{result.message}</p>
            </div>
          )}

          {result && result.notFound && (
            <div className="message-box not-found">
              <span className="icon">❌</span>
              <p>ግስ '{input}' አልተገኘም</p>
              <p className="hint">Verb not found in dictionary</p>
            </div>
          )}

          {/* Single Meaning Result */}
          {result && !result.notFound && !result.error && !Array.isArray(result) && 
            renderSingleMeaning(result)
          }

          {/* Multiple Meanings Result */}
          {result && Array.isArray(result) && 
            renderMultipleMeanings(result)
          }
        </div>
      )}

      {/* Guides Tab Content */}
      {activeTab === 'guides' && (
        <div className="guides-section">
          {!selectedGuide ? (
            <>
              <div className="guides-header">
                <h2>ግእዝ ሰዋስው መማሪያ</h2>
                <p>የግእዝ ቋንቋ ሰዋስው እና መራሕያን ይማሩ</p>
              </div>

              {/* Category Filter */}
              <div className="category-filter">
                <label>ምድብ ምረጥ:</label>
                <select 
                  value={guideCategory} 
                  onChange={(e) => setGuideCategory(e.target.value)}
                  className="category-select"
                >
                  {getCategories().map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'ሁሉም' : category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Guides Grid */}
              <div className="guides-grid">
                {getFilteredGuides().map(guide => renderGuideCard(guide))}
              </div>
            </>
          ) : (
            renderGuideDetail(selectedGuide)
          )}
        </div>
      )}
      
      <footer>
        <p>@2024 Geez Translator. All rights reserved.</p>
        <p>Developed by Dn Getachew Menberu</p>
      </footer>
    </div>
  );
}