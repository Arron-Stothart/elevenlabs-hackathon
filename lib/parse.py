from dotenv import load_dotenv
from pyzerox import zerox
import os
import asyncio
from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import BaseModel

load_dotenv()
os.environ["GEMINI_API_KEY"] = os.getenv("GEMINI_API_KEY")


def get_gemini_2_0_flash():
    return ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=3,
        api_key=os.environ.get("GEMINI_API_KEY"),
    )


# Define main async entrypoint
async def parse_pdf(filepath: str) -> str:
    # Extract filename from full path
    filename = os.path.basename(filepath)

    # Use the root persistence directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.join(script_dir, "..")
    file_path = os.path.join(root_dir, "persistence", "data", "files", filename)
    output_dir = os.path.join(root_dir, "persistence", "data", "output")

    # Ensure output directory exists
    os.makedirs(output_dir, exist_ok=True)

    # Verify file exists
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"PDF file not found at: {file_path}")

    result = await zerox(
        cleanup=True,  # Clean temp files after processing
        concurrency=10,  # Number of concurrent processes
        file_path=file_path,  # Path to PDF
        maintain_format=False,  # Don't maintain format between pages
        model="gemini/gemini-2.0-flash",  # Using Gemini model defined above
        output_dir=output_dir,  # Where to save output
        temp_dir=None,  # Use system default temp dir
        custom_system_prompt=None,  # Override zerox system prompt
        select_pages=None,  # pages list
    )

    # Format the pages with their index
    formatted_text = ""
    for page in result.pages:
        formatted_text += f"#Page {page.page} {{\n{page.content}}}\n\n"

    # data = {
    #     "company_name": "Cleo",
    #     "company_description": "Cleo is a financial wellness platform that helps people manage their money better.",
    #     "location": "London, UK",
    #     "industry": "Financial Wellness",
    #     "has_revenue": True,
    #     "has_users": True,
    #     "funding_round": "Series A",
    # }

    return formatted_text


def get_structured_values(formatted_text):
    system_prompt = formatted_text
    user_prompt = """
    You are tasked with extracting specific fields from a pitch deck of a company.
    Please analyze the content and extract the following information.
    """
    prompts = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt + " "},
    ]

    class Structure(BaseModel):
        company_name: str
        company_description: str
        location: str
        industry: str
        has_revenue: bool
        has_users: bool

    user_input_structured = (
        get_gemini_2_0_flash().with_structured_output(Structure).invoke(prompts)
    )

    return user_input_structured


def get_company_facts(formatted_text):
    system_prompt = formatted_text
    user_prompt = """
    Extract and summarize all key facts about the company from this pitch deck. Include:

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
    - Founders
    
    Format as a clear, bulleted list. Do not add any commentary or anything else.
    """
    prompts = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt + " "},
    ]

    facts = get_gemini_2_0_flash().invoke(prompts)
    return facts.content


if __name__ == "__main__":
    print("Parsing PDF...")
    result = asyncio.run(parse_pdf("cleo.pdf"))
    print("Done parsing PDF.")
    print("Structuring values...")
    structured_values = get_structured_values(result)
    print("Done structuring values.")
    print("Getting company facts...")
    company_facts = get_company_facts(result)
    print("Done getting company facts.")
    print("Structured Values:")
    print(structured_values)
    print("\nCompany Facts:")
    print(company_facts)
