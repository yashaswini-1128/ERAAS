"""
agent.py
--------
The REASON step of the Perceive -> Reason -> Act -> Reflect loop.

Uses the Gemini API (Google AI Studio) via the current `google-genai` SDK
to classify an incident's severity against a fixed rubric, and to produce
a short human-readable reasoning string. Gemini has a genuine free tier
(rate-limited, no card required), which makes it a good choice for
development/coursework use.

This is the module your report/viva should point to as the "agentic AI
core" -- everything else in the project supports this step. The synopsis
lists "Claude / GPT-4 + LangGraph" as the AI core -- Gemini is used here
as a free-tier-friendly drop-in; the architecture is model-agnostic, so
swapping to a different provider later only means changing this file.
"""

import json
from pydantic import BaseModel
from google import genai
from google.genai import types
from config import settings

_client = genai.Client(api_key=settings.google_api_key)

# If you get a "model not found" error, run list_available_models() at the
# bottom of this file to see what's currently available to your key --
# Google renames/retires model versions periodically.
MODEL_NAME = "gemini-flash-lite-latest"

SEVERITY_RUBRIC = """
Critical: Immediate life risk, more than 5 casualties, or structural collapse. Target SLA: under 5 minutes.
High: 1-5 casualties, hazardous materials involved, or escalation risk within 30 minutes. Target SLA: under 10 minutes.
Medium: Property damage or public disruption, no life risk. Target SLA: under 20 minutes.
Low: Minor incidents, informational alerts, routine matters. Target SLA: under 60 minutes.
""".strip()

CLASSIFICATION_PROMPT_TEMPLATE = """You are an emergency dispatch severity classification agent.
Classify the incident below using ONLY this rubric:

{rubric}

Incident type: {incident_type}
Description: {description}
"""

class AgentResponse(BaseModel):
    severity: str
    reasoning: str
    recommended_action: str



def classify_incident(description: str, incident_type: str) -> dict:
    """
    Calls Gemini to classify a single incident's severity.

    Returns a dict: {"severity": ..., "reasoning": ..., "recommended_action": ...}
    """
    prompt = CLASSIFICATION_PROMPT_TEMPLATE.format(
        rubric=SEVERITY_RUBRIC, incident_type=incident_type, description=description
    )

    response = _client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
        config=types.GenerateContentConfig(
            max_output_tokens=1024,
            temperature=0.2,
            thinking_config=types.ThinkingConfig(thinking_budget=0),
            response_mime_type="application/json",
            response_schema=AgentResponse,
        ),
    )

    if not response.text:
        raise ValueError("Agent returned empty response")
    
    result = json.loads(response.text)
    
    if result.get("severity") not in {"Critical", "High", "Medium", "Low"}:
        # In case the model deviates despite the schema
        result["severity"] = "Medium" # safe fallback or raise ValueError

    return result


def list_available_models():
    """
    Utility: prints every model your API key currently has access to.
    Run this (python -c "from agent import list_available_models; list_available_models()")
    if MODEL_NAME above starts throwing a not-found error.
    """
    for m in _client.models.list():
        print(m.name)


if __name__ == "__main__":
    # Quick manual test -- run this file directly to sanity check your API key
    # before wiring the agent into the full loop.
    test_result = classify_incident(
        description="Fire reported at a residential complex in Zone 3 - Koramangala",
        incident_type="fire",
    )
    print(json.dumps(test_result, indent=2))