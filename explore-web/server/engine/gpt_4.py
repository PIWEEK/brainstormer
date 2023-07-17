import openai
import tiktoken

from .base import BaseEngine

encoding = tiktoken.encoding_for_model("gpt-4")

prompt_template = """
# Brainstorming session

This document keeps track of possible ideas for a brainstorming session.

## Ideas format

The ideas list is a well formed CSV document. Where the columns will be separated by the character `|` like:

title | description | keywords
First title | First description | First keywords
Second title | Second description | Second keywords

The document will have a list of ideas and every idea will have the columns "title" with a name for the idea and "description" with the idea description and "keywords" with a list of three key concepts of the idea.   The "keywords" will be separated by " · ", like in this example: "Music · Concert · Hits".

## Ideas for: {topic}

{user_inputs_text}

### Selected ideas
{previous_text}

{question_text}

title | description | keywords
"""

previous_text_template = """
title | description | keywords
{}
"""

user_input_template = """
IMPORTANT: We want {}.
"""

more_items_template = """
## Crazier ideas

This are the next 5 ideas. But way crazier:

title | description | keywords
"""

summary_prompt = """
# Ideas for: {topic}

## Selected ideas

{current_text}

---

## Pros and cons for every idea

### {first_option}

Pros:
- """ 

class GPT_4(BaseEngine):
    def next_prompt(self, topic, previous, user_inputs):
        previous_list = ""
        previous_text = ""
        if previous and len(previous) > 0:
            previous_list = ", ".join(["\"{}\"".format(p.split("|")[0].strip()) for p in previous]) 
            previous_text = previous_text_template.format("\n".join(previous))

        user_inputs_text = ""
        if user_inputs and len(user_inputs) > 0:
            user_inputs_text = user_input_template.format(",".join(user_inputs))

        if previous_list:
            question_text = "The next best 5 ideas that based combine ideas from {} are:".format(previous_list)
        else:
            question_text = "The next best 5 ideas are:"

        return prompt_template.format(
            topic=topic.upper(),
            previous_text=previous_text,
            question_text=question_text,
            user_inputs_text=user_inputs_text)

    def more_prompt(self, topic, previous, current, user_inputs):
        prompt = self.next_prompt(topic, previous, user_inputs) + \
            "\n".join(current) + "\n" + more_items_template

        return prompt

    def format_summary_prompt(self, topic, first_option, current):
      return summary_prompt.format(
        topic=topic,
        current_text="\n".join(current),
        first_option=first_option)

    def next(self, topic, previous, user_inputs):
      prompt = self.next_prompt(topic, previous, user_inputs)

      messages = [{
        "role": "user",
        "content": prompt
      }]

      completion = openai.ChatCompletion.create(
        model="gpt-4",
        presence_penalty=1,
        temperature=0.6,
        top_p=1,
        frequency_penalty=1,
        max_tokens=512,
        messages=messages)

      print("=======================================")
      print(messages)
      print("=======================================")
      print(completion.choices[0].message.content)
      print("=======================================")

      num_request_tokens = 0
      for message in messages:
          num_request_tokens += 3 + len(encoding.encode(message["content"]))
      num_request_tokens += 3  # every reply is primed with <|start|>assistant<|message|>\n",

      return {
        "tokens": num_request_tokens + len(encoding.encode(completion.choices[0].message.content)),
        "message": completion.choices[0].message.content
      }

    def more(self, topic, previous, current, user_inputs):
      prompt = self.more_prompt(topic, previous, current, user_inputs)

      messages = [{
        "role": "user",
        "content": prompt
      }]

      completion = openai.ChatCompletion.create(
        model="gpt-4",
        presence_penalty=1,
        temperature=0.1,
        top_p=1,
        frequency_penalty=0.2,
        max_tokens=512,
        messages=messages)

      print("=======================================")
      print(messages)
      print("=======================================")
      print(completion.choices[0].message.content)
      print("=======================================")

      num_request_tokens = 0
      for message in messages:
          num_request_tokens += 3 + len(encoding.encode(message["content"]))
      num_request_tokens += 3  # every reply is primed with <|start|>assistant<|message|>\n",

      return {
        "tokens": num_request_tokens + len(encoding.encode(completion.choices[0].message.content)),
        "message": completion.choices[0].message.content
      }

    def summary(self, topic, first_option, current):
      prompt = self.format_summary_prompt(topic, first_option, current)

      messages = [{
        "role": "user",
        "content": prompt
      }]

      completion = openai.ChatCompletion.create(
        model="gpt-4",
        presence_penalty=2,
        temperature=0.5,
        top_p=1,
        frequency_penalty=0,
        max_tokens=512,
        messages=messages)

      print("SUMMARY PROMPT 1")
      print("=======================================")
      print(messages)
      print("=======================================")
      print(completion.choices[0].message.content)
      print("=======================================")

      num_tokens = 0
      for message in messages:
          num_tokens += 3 + len(encoding.encode(message["content"]))
      num_tokens += 3  # every reply is primed with <|start|>assistant<|message|>\n",

      num_tokens += len(encoding.encode(completion.choices[0].message.content))

      prompt = prompt + completion.choices[0].message.content

      messages = [{
        "role": "user",
        "content": prompt + "\n## Summary\n"
      }]

      completion = openai.ChatCompletion.create(
        model="gpt-4",
        presence_penalty=1,
        temperature=0.1,
        top_p=1,
        frequency_penalty=0.2,
        max_tokens=512,
        messages=messages)

      print("SUMMARY PROMPT 2")
      print("=======================================")
      print(messages)
      print("=======================================")
      print(completion.choices[0].message.content)
      print("=======================================")

      for message in messages:
          num_tokens += 3 + len(encoding.encode(message["content"]))
      num_tokens += 3  # every reply is primed with <|start|>assistant<|message|>\n",

      num_tokens += len(encoding.encode(completion.choices[0].message.content))

      result = prompt + completion.choices[0].message.content

      return {
        "tokens": num_tokens,
        "message": result.split("---")[1].strip()
      }

      
