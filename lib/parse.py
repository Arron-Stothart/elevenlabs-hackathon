from dotenv import load_dotenv
from pyzerox import zerox
import os
import json
import asyncio

load_dotenv()

### Model Setup (Use only Vision Models) Refer: https://docs.litellm.ai/docs/providers ###

# model = "gemini/gemini-1.5-flash-8b"
model = "gemini/gemini-2.0-flash"
os.environ["GEMINI_API_KEY"] = os.getenv("GEMINI_API_KEY")


# Define main async entrypoint
async def main():
    file_path = "annual_reports/GLN-IAR-Dec_22.pdf"

    output_dir = "./output_test"
    result = await zerox(
        cleanup=True,  # Clean temp files after processing
        concurrency=10,  # Number of concurrent processes
        file_path=file_path,  # Path to PDF
        maintain_format=False,  # Don't maintain format between pages
        model=model,  # Using Gemini model defined above
        output_dir=output_dir,  # Where to save output
        temp_dir=None,  # Use system default temp dir
        custom_system_prompt=None,  # Override zerox system prompt
        select_pages=list(range(1, 20)),  # pages 1 to 140
    )
    return result


if __name__ == "__main__":
    result = asyncio.run(main())
    print(result)
