// Dictionary API Service
// This service provides an abstraction layer for dictionary data
// Can be easily switched to use a real API endpoint in the future

import { dictionary as localDictionary } from '../data/dictionary.js';

// Configuration
const API_CONFIG = {
  // Set to true to use mock API (simulates network delay)
  // Set to false to use local data directly
  useMockApi: true,
  
  // Simulated network delay in milliseconds
  networkDelay: 300,
  
  // Future: Add real API endpoint here
  // apiEndpoint: 'https://api.geez-dictionary.com/v1'
};

/**
 * Simulates network delay for mock API calls
 */
const simulateNetworkDelay = () => {
  return new Promise(resolve => {
    setTimeout(resolve, API_CONFIG.networkDelay);
  });
};

/**
 * Search for verbs by Geez text
 * @param {string} geezText - The Geez verb to search for
 * @returns {Promise<Array>} Array of matching verbs
 */
export const searchByGeez = async (geezText) => {
  if (API_CONFIG.useMockApi) {
    await simulateNetworkDelay();
  }
  
  try {
    // Future: Replace with actual API call
    // const response = await fetch(`${API_CONFIG.apiEndpoint}/search?geez=${geezText}`);
    // return await response.json();
    
    const results = localDictionary.filter(verb => 
      verb?.geez === geezText.trim()
    );
    
    return {
      success: true,
      data: results,
      count: results.length
    };
  } catch (error) {
    console.error('Error searching dictionary:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

/**
 * Get autocomplete suggestions
 * @param {string} query - Search query
 * @param {number} limit - Maximum number of results
 * @returns {Promise<Array>} Array of suggestions
 */
export const getSuggestions = async (query, limit = 8) => {
  if (API_CONFIG.useMockApi) {
    await simulateNetworkDelay();
  }
  
  try {
    const results = localDictionary.filter(verb => 
      verb?.geez?.toLowerCase().includes(query.toLowerCase()) ||
      verb?.amharic?.toLowerCase().includes(query.toLowerCase()) ||
      verb?.english?.toLowerCase().includes(query.toLowerCase())
    ).slice(0, limit);
    
    return {
      success: true,
      data: results,
      count: results.length
    };
  } catch (error) {
    console.error('Error getting suggestions:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

/**
 * Get all dictionary entries (paginated)
 * @param {number} page - Page number
 * @param {number} pageSize - Items per page
 * @returns {Promise<Object>} Paginated results
 */
export const getAllVerbs = async (page = 1, pageSize = 50) => {
  if (API_CONFIG.useMockApi) {
    await simulateNetworkDelay();
  }
  
  try {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = localDictionary.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: paginatedData,
      pagination: {
        page,
        pageSize,
        total: localDictionary.length,
        totalPages: Math.ceil(localDictionary.length / pageSize)
      }
    };
  } catch (error) {
    console.error('Error getting all verbs:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

/**
 * Get verbs by root letter
 * @param {string} rootLetter - Root letter to filter by
 * @returns {Promise<Array>} Array of matching verbs
 */
export const getVerbsByRootLetter = async (rootLetter) => {
  if (API_CONFIG.useMockApi) {
    await simulateNetworkDelay();
  }
  
  try {
    const results = localDictionary.filter(verb => 
      verb?.rootLetter === rootLetter
    );
    
    return {
      success: true,
      data: results,
      count: results.length
    };
  } catch (error) {
    console.error('Error getting verbs by root letter:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

/**
 * Get verbs by type
 * @param {string} verbType - Verb type to filter by
 * @returns {Promise<Array>} Array of matching verbs
 */
export const getVerbsByType = async (verbType) => {
  if (API_CONFIG.useMockApi) {
    await simulateNetworkDelay();
  }
  
  try {
    const results = localDictionary.filter(verb => 
      verb?.verbType === verbType
    );
    
    return {
      success: true,
      data: results,
      count: results.length
    };
  } catch (error) {
    console.error('Error getting verbs by type:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

/**
 * Search with advanced filters
 * @param {Object} filters - Search filters
 * @returns {Promise<Array>} Array of matching verbs
 */
export const advancedSearch = async (filters) => {
  if (API_CONFIG.useMockApi) {
    await simulateNetworkDelay();
  }
  
  try {
    let results = [...localDictionary];
    
    // Apply filters
    if (filters.geez) {
      results = results.filter(verb => 
        verb?.geez?.toLowerCase().includes(filters.geez.toLowerCase())
      );
    }
    
    if (filters.amharic) {
      results = results.filter(verb => 
        verb?.amharic?.toLowerCase().includes(filters.amharic.toLowerCase())
      );
    }
    
    if (filters.english) {
      results = results.filter(verb => 
        verb?.english?.toLowerCase().includes(filters.english.toLowerCase())
      );
    }
    
    if (filters.rootLetter) {
      results = results.filter(verb => 
        verb?.rootLetter === filters.rootLetter
      );
    }
    
    if (filters.verbType) {
      results = results.filter(verb => 
        verb?.verbType === filters.verbType
      );
    }
    
    return {
      success: true,
      data: results,
      count: results.length
    };
  } catch (error) {
    console.error('Error in advanced search:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

// Export configuration for external access
export const getApiConfig = () => ({ ...API_CONFIG });

// Export function to update configuration
export const updateApiConfig = (newConfig) => {
  Object.assign(API_CONFIG, newConfig);
};
