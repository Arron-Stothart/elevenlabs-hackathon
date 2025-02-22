import os
import signal

from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
from elevenlabs.conversational_ai.conversation import Conversation, ConversationConfig
from elevenlabs.conversational_ai.default_audio_interface import DefaultAudioInterface

load_dotenv()

# agent_id = os.getenv("JUSTINE_AGENT_ID")
agent_id = os.getenv("OLIVER_AGENT_ID")
api_key = os.getenv("ELEVENLABS_API_KEY")

client = ElevenLabs(api_key=api_key)
company_facts = """
• Business Model and Revenue Streams:
  - Product referrals and lead generation
  - Financial activity analysis for targeted product referrals
  - Future: Pre-approved line of credit as credit card alternative

• Market Size and Opportunity:
  - £220M - £350M market opportunity (product referrals/lead gen)
  - £22+ yearly revenue per user, 10-15M potential customers
  - £200B+ UK credit card market opportunity

• Competitive Advantages:
  - Focus on banking experience vs building new bank
  - Integrates with existing banks
  - AI money assistant
  - Built-in virality
  - Product switching assistance
  - Multi-channel messaging
  - Owns customer data while banks handle infrastructure

• Team:
  - Entrepreneur First company
  - Contact: barney@meetcleo.com | +44 (0) 7876 377 209

• Traction (7 weeks post beta):
  - 272 bank connects
  - 27% week-on-week growth
  - 64% weekly user engagement
  - 5000 messages sent

• Financials:
  - £22+ projected yearly revenue per user
  - Funding details not provided
"""

dynamic_vars = {
    "user_name": "Barney",
    "company_name": "Cleo",
    "company_description": "An A.I. assistant for your money.",
    "has_revenue": False,
    "has_users": True,
    "company_facts": company_facts,
}


config = ConversationConfig(dynamic_variables=dynamic_vars)

conversation = Conversation(
    # API client and agent ID.
    client,
    agent_id,
    config=config,
    # Assume auth is required when API_KEY is set.
    requires_auth=bool(api_key),
    # Use the default audio interface.
    audio_interface=DefaultAudioInterface(),
    # Simple callbacks that print the conversation to the console.
    callback_agent_response=lambda response: print(f"Agent: {response}"),
    callback_agent_response_correction=lambda original, corrected: print(
        f"Agent correction: {corrected}"
    ),
    callback_user_transcript=lambda transcript: print(f"User: {transcript}"),
    # Uncomment if you want to see latency measurements.
    # callback_latency_measurement=lambda latency: print(f"Latency: {latency}ms"),
)

if __name__ == "__main__":
    conversation.start_session()
    signal.signal(signal.SIGINT, lambda sig, frame: conversation.end_session())
    conversation_id = conversation.wait_for_session_end()
    print(f"Conversation ID: {conversation_id}")
