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

In absence of any other information, you should ask the user what they want to save up for.

When it's clear the user has a specific item in mind, you should ask them how much they need to save up for it if they haven't already told you.

They may have already saved up some money, so be sure to ask that first unless they've already told you.

Once you know how much they already have and need to save up, output a single line: {{"item":<item>, "cost":<cost>, "already_saved":<already saved>, "currency":<currency>}} in JSON.
                 """}] + messages
    print(messages)
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=messages,
        temperature=1,
        max_tokens=256,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )
    return response.choices[0].message