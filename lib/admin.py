import json
import os

from elevenlabs import ElevenLabs
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from posthog.ai.langchain import CallbackHandler
from langchain_core.prompts import ChatPromptTemplate
import posthog

load_dotenv()

client = ElevenLabs(
    api_key=os.getenv("ELEVENLABS_API_KEY"),
)

posthog.project_api_key = "phc_AVLiYfG0b9qFCkIPAuRPfQJ2IkxlP8Im6mhyjtaIv6p"
posthog.host = "https://us.i.posthog.com"
callback_handler = CallbackHandler(client=posthog, privacy_mode=False)  # optional


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
    simplified_transcript = json.dumps(
        [
            {
                "role": item.role,
                "message": item.message,
            }
            for item in transcript
        ]
    )

    return conversation, transcript, simplified_transcript


def generate_notes(simplified_transcript: str, file_name: str):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(script_dir, "..", "output_test", file_name)

    # Verify file exists
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"PDF file not found at: {file_path}")

    pitch_deck_markdown = open(file_path).read()

    system_prompt = f"""
    This is the transcript of a conversation between a founder and a VC:
    {simplified_transcript}

    This is the parsed pitch deck of the company:
    {pitch_deck_markdown}
    """

    user_prompt = """
    Extract and summarize all key facts about the company from the conversation:

    # Quick Facts
    - Company name:
    - One-line description:
    - Location:
    - Industry:
    - Revenue status:
    - User status:

    # Team
    - Founders' backgrounds and experience
    - Key personality traits and impressions
    - Vision and goals
    
    # Problem
    - Target audience and pain points
    - Market size and scope
    - Current solutions and their limitations

    # Product
    - Core solution and functionality
    - Key differentiators
    - Technical details (if relevant)

    # Go-to-Market
    - Sales strategy and channels
    - Pricing model
    - Customer acquisition approach
    - Business model and revenue streams

    # Traction
    - Current metrics and growth
    - Key milestones achieved
    - Customer/user feedback
    - Financial performance

    # Funding
    - Current fundraising details
    - Previous funding history
    - Use of funds
    - Terms (if discussed)

    # Next Steps
    - Key dates and deadlines
    - Follow-up items
    - Action items for both parties

    Mention any additional key insights or red flags from the conversation. If any sections above aren't covered in the conversation, omit them.

    Respond with the final output of the notes only do not add any commentary or anything else.
    """

    # Save prompts to files for debugging
    with open("system_prompt.txt", "w") as f:
        f.write(system_prompt)
    with open("user_prompt.txt", "w") as f:
        f.write(user_prompt)

    prompts = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]

    notes = get_gemini_2_0_flash().invoke(
        prompts, config={"callbacks": [callback_handler]}
    )
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

    answer = get_gemini_2_0_flash().invoke(
        prompts, config={"callbacks": [callback_handler]}
    )
    return answer.content


if __name__ == "__main__":
    conversation_id = "6ZFBqkcULB1CNd8Beo3n"
    conversation, transcript, simplified_transcript = get_conversation(conversation_id)
    conversation_dict = conversation.model_dump()

    save_path = "conversation.json"
    with open(save_path, "w") as f:
        json.dump(conversation_dict, f, indent=2)

    notes = generate_notes(simplified_transcript, "cleo.md")
    with open("notes.txt", "w") as f:
        f.write(notes)

    answer = chat_to_transcript(
        simplified_transcript,
        "Write a short and casual follow-up email. The email should [recap important points and say thanks]",
    )
    print("answer", answer, end="\n\n")
