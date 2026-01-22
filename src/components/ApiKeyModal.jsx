import { useState, useEffect } from 'react';
import { setStoredApiKey, hasApiKey } from '../services/aiService';

const ApiKeyModal = ({ show, onClose }) => {
    const [apiKey, setApiKeyInput] = useState('');
    const [error, setError] = useState('');

    if (!show) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!apiKey.trim()) {
            setError('Please enter a valid API Key');
            return;
        }

        // Save the key
        setStoredApiKey(apiKey.trim());

        // Verify it was set
        if (hasApiKey()) {
            onClose(); // Close the modal
        } else {
            setError('Failed to save API Key');
        }
    };

    return (
        <div className="modal-overlay" style={{ zIndex: 2000 }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Enter Gemini API Key</h3>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <p style={{ marginBottom: '15px', color: '#666', lineHeight: '1.5' }}>
                            To use the AI features, you need a Google Gemini API key.
                            The key will be stored locally in your browser.
                        </p>

                        <label>API Key</label>
                        <input
                            type="text"
                            value={apiKey}
                            onChange={(e) => {
                                setApiKeyInput(e.target.value);
                                setError('');
                            }}
                            placeholder="AIzaSy..."
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                        />
                        {error && <p style={{ color: 'red', marginTop: '5px', fontSize: '14px' }}>{error}</p>}
                    </div>

                    <div className="instructions" style={{ marginTop: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
                        <h4 style={{ margin: '0 0 10px' }}>How to get an API Key:</h4>
                        <ol style={{ paddingLeft: '20px', margin: 0, color: '#444' }}>
                            <li style={{ marginBottom: '8px' }}>
                                Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>Google AI Studio</a>
                            </li>
                            <li style={{ marginBottom: '8px' }}>Sign in with your Google account</li>
                            <li style={{ marginBottom: '8px' }}>Click "Create API key"</li>
                            <li style={{ marginBottom: '8px' }}>Copy the key and paste it above</li>
                        </ol>
                    </div>

                    <div className="modal-actions" style={{ marginTop: '25px' }}>
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="save-btn">
                            Save API Key
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ApiKeyModal;
