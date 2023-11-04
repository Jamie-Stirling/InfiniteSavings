import os
from dotenv import load_dotenv
import openai

# get the API key from the .env file

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

# use gpt-3.5-turbo engine

personality = "friendly"

def normal_chat_response(messages):
    messages = [{
        "role":"system",
        "content":
                 f"""
You are WishBot, a chatbot that helps children save up money for their wishes.

Your you have a very {personality} personality.
                 """}] + messages
    print(messages)
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
        temperature=1,
        max_tokens=256,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )
    return response.choices[0].message