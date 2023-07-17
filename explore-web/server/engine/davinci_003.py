import openai
import tiktoken

from .base import BaseEngine

encoding = tiktoken.encoding_for_model("text-davinci-003")

class DAVINCI_003(BaseEngine):
    def __init__(self, prompt, presence_penalty=1, temperature=0.1, top_p=1, best_of=1, frequency_penalty=0.2, max_tokens=512):
      self.completion = openai.Completion.create(
        model="text-davinci-003",
        presence_penalty=presence_penalty,
        temperature=temperature,
        top_p=top_p,
        best_of=best_of,
        frequency_penalty=frequency_penalty,
        max_tokens=max_tokens,
        prompt=prompt)

    def get_message(self):
      return self.completion.choices[0].text

    def get_token_count(self, message):
      return len(encoding.encode(message))      