import { useState, useEffect, useRef } from "react";
import { searchByGeez, getSuggestions } from "./services/dictionaryApi.js";
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

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("geez-recent-searches");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setRecentSearches(parsed);
      }
    } catch (error) {
      console.error("Error loading recent searches:", error);
    }
  }, []);

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

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (input.trim().length > 0) {
        const limit = isMobile ? 5 : 8;
        const response = await getSuggestions(input, limit);
        if (response.success) {
          setSuggestions(response.data);
          setShowSuggestions(true);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };
    const timeoutId = setTimeout(fetchSuggestions, 200);
    return () => clearTimeout(timeoutId);
  }, [input, isMobile]);

  const findAllMeanings = async (geezVerb) => {
    if (!geezVerb) return [];
    const response = await searchByGeez(geezVerb);
    return response.success ? response.data : [];
  };

  const calculateEnhancedSimilarity = (text1, text2) => {
    const extractWords = (text) => {
      if (!text) return [];
      const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
      return text.split(/[\s,.;!?()–—]+/)
        .filter(word => word && word.length > 1 && !stopWords.has(word.toLowerCase()))
        .map(word => word.toLowerCase());
    };
    
    const words1 = extractWords(text1);
    const words2 = extractWords(text2);
    if (words1.length === 0 || words2.length === 0) return 0;
    
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  };

  const findRelatedWords = async (currentVerb) => {
    if (!currentVerb) return [];
    const searchTerms = `${currentVerb.amharic || ''} ${currentVerb.english || ''}`;
    const words = searchTerms.split(' ').filter(w => w.length > 2);
    if (words.length === 0) return [];
    
    const response = await getSuggestions(words[0], isMobile ? 10 : 15);
    if (!response.success) return [];
    
    const currentText = searchTerms.toLowerCase();
    return response.data
      .filter(verb => verb?.geez !== currentVerb.geez)
      .map(verb => ({
        ...verb,
        similarity: calculateEnhancedSimilarity(currentText, `${verb.amharic || ''} ${verb.english || ''}`.toLowerCase())
      }))
      .filter(verb => verb.similarity > 0.2)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, isMobile ? 4 : 8);
  };

  const searchVerb = async () => {
    if (!input.trim()) {
      setResult({ error: true, message: "Please enter a Geez verb" });
      setRelatedWords([]);
      return;
    }

    setLoading(true);
    setShowSuggestions(false);
    
    try {
      const allMeanings = await findAllMeanings(input.trim());
      if (allMeanings.length === 0) {
        setResult({ notFound: true });
        setRelatedWords([]);
      } else {
        setResult(allMeanings.length > 1 ? allMeanings : allMeanings[0]);
        const related = await findRelatedWords(allMeanings[0]);
        setRelatedWords(related);
        
        const updatedSearches = [allMeanings[0], ...recentSearches.filter(item => item?.geez !== allMeanings[0]?.geez)].slice(0, isMobile ? 4 : 6);
        setRecentSearches(updatedSearches);
        try {
          localStorage.setItem("geez-recent-searches", JSON.stringify(updatedSearches));
        } catch (e) {
          console.warn("Could not save to localStorage:", e);
        }
      }
    } catch (error) {
      console.error("Search error:", error);
      setResult({ error: true, message: "An error occurred during search" });
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = async (verb) => {
    if (!verb?.geez) return;
    setInput(verb.geez);
    setLoading(true);
    try {
      const allMeanings = await findAllMeanings(verb.geez);
      setResult(allMeanings.length > 1 ? allMeanings : allMeanings[0]);
      setShowSuggestions(false);
      const related = await findRelatedWords(allMeanings[0]);
      setRelatedWords(related);
      const updatedSearches = [allMeanings[0], ...recentSearches.filter(item => item?.geez !== verb.geez)].slice(0, isMobile ? 4 : 6);
      setRecentSearches(updatedSearches);
      try {
        localStorage.setItem("geez-recent-searches", JSON.stringify(updatedSearches));
      } catch (e) {
        console.warn("Could not save to localStorage:", e);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRelatedWordClick = async (verb) => {
    if (!verb?.geez) return;
    setInput(verb.geez);
    setLoading(true);
    try {
      const allMeanings = await findAllMeanings(verb.geez);
      setResult(allMeanings.length > 1 ? allMeanings : allMeanings[0]);
      setShowSuggestions(false);
      const newRelated = await findRelatedWords(allMeanings[0]);
      setRelatedWords(newRelated);
    } finally {
      setLoading(false);
    }
  };

  const handleRecentSearchClick = async (verb) => {
    if (!verb?.geez) return;
    setInput(verb.geez);
    setLoading(true);
    try {
      const allMeanings = await findAllMeanings(verb.geez);
      setResult(allMeanings.length > 1 ? allMeanings : allMeanings[0]);
      setShowSuggestions(false);
      const related = await findRelatedWords(allMeanings[0]);
      setRelatedWords(related);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>ግእዝ አቋም → Translation App</h1>
        <p className="subtitle">Discover the meanings of Geez verbs and learn grammar</p>
      </header>

      <div className="tab-navigation">
        <button className={`tab-button ${activeTab === 'translate' ? 'active' : ''}`} onClick={() => setActiveTab('translate')}>
          {isMobile ? "🔍 ትርጉም" : "🔍 ትርጉም (Translation)"}
        </button>
        <button className={`tab-button ${activeTab === 'guides' ? 'active' : ''}`} onClick={() => setActiveTab('guides')}>
          {isMobile ? "📚 መራህያን" : "📚 መራህያን (Guides)"}
        </button>
      </div>

      {activeTab === 'translate' && (
        <div className="search-section">
          <div className="input-group">
            <div className="search-container" ref={searchContainerRef}>
              <input 
                type="text" 
                placeholder="ግእዝ ግስ አስገባ (Enter Geez verb)" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchVerb()}
                onFocus={() => input.trim().length > 0 && suggestions.length > 0 && setShowSuggestions(true)}
                className="search-input"
              />
              {input && <button onClick={() => { setInput(""); setResult(null); setShowSuggestions(false); setRelatedWords([]); }} className="clear-button">✕</button>}
              
              {showSuggestions && suggestions.length > 0 && (
                <div className="suggestions-dropdown">
                  {suggestions.map((verb, index) => (
                    <div key={index} className="suggestion-item" onClick={() => handleSuggestionClick(verb)} onMouseDown={(e) => e.preventDefault()}>
                      <span className="suggestion-geez">{verb.geez || "N/A"}</span>
                      <span className="suggestion-meaning">{verb.amharic || "N/A"}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <button onClick={searchVerb} disabled={loading} className="search-button">
              {loading ? (isMobile ? "⏳" : "⏳ Searching...") : (isMobile ? "🔍" : "🔍 Translate")}
            </button>
          </div>
          
          {relatedWords.length > 0 && (
            <div className="related-words-section">
              <h3>{isMobile ? "📚 ተዛማጅ" : "📚 ተዛማጅ ቃላት (Related Words)"}</h3>
              <div className={`related-words-grid ${isMobile ? 'mobile-grid' : ''}`}>
                {relatedWords.map((verb, index) => (
                  <button key={index} className="related-word-card" onClick={() => handleRelatedWordClick(verb)}>
                    <div className="related-geez">{verb.geez || "N/A"}</div>
                    <div className="related-meaning">{verb.amharic || "N/A"}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {recentSearches.length > 0 && !result && (
            <div className="recent-searches-section">
              <h3>{isMobile ? "🕒 የቅርብ" : "🕒 የቅርብ ጊዜ ፍለጋ (Recent Searches)"}</h3>
              <div className={`recent-searches-grid ${isMobile ? 'mobile-grid' : ''}`}>
                {recentSearches.map((verb, index) => (
                  <button key={index} className="recent-search-card" onClick={() => handleRecentSearchClick(verb)}>
                    {verb.geez || "N/A"}
                  </button>
                ))}
              </div>
            </div>
          )}

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

          {result && !result.notFound && !result.error && !Array.isArray(result) && (
            <div className="result-card">
              <div className="verb-header">
                <h2>{result.geez || "N/A"}</h2>
                <div className="verb-details">
                  <span className="detail-item">Root: {result.root || "N/A"}</span>
                  <span className="detail-item">Type: {result.verbType || "N/A"}</span>
                  <span className="detail-item">Starts with: {result.rootLetter || "N/A"}</span>
                </div>
              </div>
              <div className="translations">
                <div className="translation-row">
                  <span className="lang-label">Amharic:</span>
                  <span className="translation-text">{result.amharic || "N/A"}</span>
                </div>
                <div className="translation-row">
                  <span className="lang-label">English:</span>
                  <span className="translation-text">{result.english || "N/A"}</span>
                </div>
                <div className="translation-row">
                  <span className="lang-label">Oromiffa:</span>
                  <span className="translation-text">{result.oromiffa || "N/A"}</span>
                </div>
              </div>
            </div>
          )}

          {result && Array.isArray(result) && (
            <div className="result-card multiple-meanings">
              <div className="verb-header">
                <h2>{result[0]?.geez || "N/A"}</h2>
                <div className="meanings-count">{result.length} meanings found</div>
                <div className="verb-details">
                  <span className="detail-item">Root: {result[0]?.root || "N/A"}</span>
                  <span className="detail-item">Type: {result[0]?.verbType || "N/A"}</span>
                  <span className="detail-item">Starts with: {result[0]?.rootLetter || "N/A"}</span>
                </div>
              </div>
              <div className="meanings-container">
                {result.map((meaning, index) => (
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
          )}
        </div>
      )}

      {activeTab === 'guides' && (
        <div className="guides-section">
          {!selectedGuide ? (
            <>
              <div className="guides-header">
                <h2>ግእዝ ሰዋስው መማሪያ</h2>
                <p>የግእዝ ቋንቋ ሰዋስው እና መራሕያን ይማሩ</p>
              </div>
              <div className="category-filter">
                <label>ምድብ ምረጥ:</label>
                <select value={guideCategory} onChange={(e) => setGuideCategory(e.target.value)} className="category-select">
                  {["all", ...new Set(guides.map(g => g.category))].map(cat => (
                    <option key={cat} value={cat}>{cat === 'all' ? 'ሁሉም' : cat}</option>
                  ))}
                </select>
              </div>
              <div className="guides-grid">
                {guides.filter(g => guideCategory === "all" || g.category === guideCategory).map(guide => (
                  <div key={guide.id} className="guide-card" onClick={() => setSelectedGuide(guide)}>
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
                    <p className="guide-preview">{guide.content.substring(0, 100)}...</p>
                    <div className="guide-arrow">→</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="guide-detail">
              <button className="back-button" onClick={() => setSelectedGuide(null)}>
                ← {isMobile ? "Back" : "Back to Guides"}
              </button>
              <div className="guide-detail-header">
                <span className="guide-icon-large">{selectedGuide.icon}</span>
                <div>
                  <h1>{selectedGuide.title}</h1>
                  <p className="guide-subtitle">{selectedGuide.subtitle}</p>
                </div>
              </div>
              <div className="guide-content">
                <div className="guide-section">
                  <h3>መግቢያ</h3>
                  <p>{selectedGuide.content}</p>
                  {selectedGuide.englishContent && (
                    <div className="english-translation">
                      <strong>English:</strong> {selectedGuide.englishContent}
                    </div>
                  )}
                </div>
                {selectedGuide.pronouns && (
                  <div className="guide-section">
                    <h3>የመራሕያን ዝርዝር</h3>
                    <div className="pronouns-table">
                      <div className="table-header">
                        <span>ግእዝ</span>
                        <span>አማርኛ</span>
                        <span>English</span>
                      </div>
                      {selectedGuide.pronouns.map((pronoun, index) => (
                        <div key={index} className="table-row">
                          <span className="geez-text">{pronoun.geez}</span>
                          <span>{pronoun.amharic}</span>
                          <span>{pronoun.english}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
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
