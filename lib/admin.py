import json
import os

from elevenlabs import ElevenLabs
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

client = ElevenLabs(
    api_key=os.getenv("ELEVENLABS_API_KEY"),
)


def get_gemini_2_0_flash():
    return ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=3,
        api_key=os.environ.get("GEMINI_API_KEY"),
    )


def get_conversation(conversation_id: str):
    conversation = client.conversational_ai.get_conversation(
        conversation_id=conversation_id,
    )
    transcript = conversation.transcript
    simplified_transcript = [
        {
            "role": item.role,
            "message": item.message,
        }
        for item in transcript
    ]

    return conversation, transcript, simplified_transcript


def generate_notes(simplified_transcript: list[dict]):
    system_prompt = f"""
    This is the transcript of a conversation between a founder and a VC:
    {simplified_transcript}

    You are a master note taker, specializing in summarizing conversations like a VC.
    """

    user_prompt = """
    Extract and summarize all key facts about the company from the conversation. Include:

    TLDR:
    Company name:
    Company description:
    Location:
    Industry:
    Has revenue:
    Has users:

    Market:
    - Market size and opportunity
    - Competitive landscape
    - Business model and revenue streams

    Customers:
    - Target customer segments
    - Customer pain points
    - Value proposition

    Traction:
    - Current metrics and growth
    - Financial projections
    - Funding history and current ask

    Team:
    - Founders background
    - Founders personality
    - Founders goals

    Mention any key insights or takeaways from the conversation. If any of the above points are not mentioned omit them.

    Format as a clear, bulleted list in markdown. Do not add any commentary or anything else.
    """

    prompts = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]

    notes = get_gemini_2_0_flash().invoke(prompts)
    return notes.content


def chat_to_transcript(simplified_transcript: str, user_prompt: str):
    system_prompt = f"""
    You are an expert chatbot specializing in analyzing conversations between a founder and a VC. The user of this product is a VC.

    Here is a transcript of a conversation to analyze:
    <transcript>
    {simplified_transcript}
    </transcript>

    Please provide clear, concise responses focused on extracting key information and insights from this conversation. Format your responses in a structured way that highlights the most important points.
    """

    user_prompt = f"""
    {user_prompt}
    """

    prompts = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]

    answer = get_gemini_2_0_flash().invoke(prompts)
    return answer.content


if __name__ == "__main__":
    conversation_id = "6ZFBqkcULB1CNd8Beo3n"
    conversation, transcript, simplified_transcript = get_conversation(conversation_id)
    conversation_dict = conversation.model_dump()

    save_path = "conversation.json"
    with open(save_path, "w") as f:
        json.dump(conversation_dict, f, indent=2)

    notes = generate_notes(simplified_transcript)
    with open("notes.txt", "w") as f:
        f.write(notes)

    answer = chat_to_transcript(
        simplified_transcript,
        "Write a short and casual follow-up email. The email should [recap important points and say thanks]",
    )
    print("answer", answer, end="\n\n")
