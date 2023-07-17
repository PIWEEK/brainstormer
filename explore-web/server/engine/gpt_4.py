import openai
import tiktoken

from .base import BaseEngine

encoding = tiktoken.encoding_for_model("gpt-4")

class GPT_4(BaseEngine):
    def __init__(self, prompt, presence_penalty=1, temperature=0.1, top_p=1, best_of=1, frequency_penalty=0.2, max_tokens=512):
      messages = [{
        "role": "user",
        "content": prompt
      }]

      self.completion = openai.ChatCompletion.create(
        model="gpt-4",
        presence_penalty=presence_penalty,
        temperature=temperature,
        top_p=top_p,
        frequency_penalty=frequency_penalty,
        max_tokens=max_tokens,
        messages=messages)

    def get_message(self):
      return self.completion.choices[0].message.content

    def get_token_count(self, message):
      return len(encoding.encode(message))