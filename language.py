import os
from dotenv import load_dotenv
import openai

# get the API key from the .env file

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")