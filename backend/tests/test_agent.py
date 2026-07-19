import pytest
from agent import classify_incident
from unittest.mock import patch

@patch('agent._client.models.generate_content')
def test_classify_incident(mock_generate_content):
    class MockResponse:
        text = '{"severity": "High", "reasoning": "Test reasoning", "recommended_action": "Test action"}'
    
    mock_generate_content.return_value = MockResponse()
    
    result = classify_incident("Test incident", "fire")
    assert result["severity"] == "High"
    assert result["reasoning"] == "Test reasoning"
    assert result["recommended_action"] == "Test action"

@patch('agent._client.models.generate_content')
def test_classify_incident_fallback(mock_generate_content):
    class MockResponse:
        text = '{"severity": "Unknown", "reasoning": "Test reasoning", "recommended_action": "Test action"}'
    
    mock_generate_content.return_value = MockResponse()
    
    result = classify_incident("Test incident", "fire")
    # Should fallback to Medium if invalid severity is returned despite the schema
    assert result["severity"] == "Medium"
