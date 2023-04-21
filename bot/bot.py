import telebot
import os
import openai
import json

from functools import partial

#TODO: read from env
openai.organization = os.getenv('BRAINSTORMER_OPENAI_ORG')
openai.api_key = os.getenv('BRAINSTORMER_OPENAI_KEY')

BOT_TOKEN=os.getenv('BOT_TOKEN')

COMMANDS = { 
    'help'        : 'Gives you information about the available commands',
    'topic'       : 'Set the ideas topic',
    'debug'       : 'Get the session debug info',
    'yes'         : 'Accept last suggested option',
    'no'          : 'Deny last suggested option'
}

IDEA_PROMPT = """
You need the user to suggest an idea and then stop the conversation.  You only speak JSON, do not write normal text. If you detect the user has an idea include it in the JSON response in the attribute "idea" and finish the conversation saying thanks.
"""

BRAINSTORMING_SESSION_PROMPT="""
# Brainstorming session
This document keeps track of possible ideas for a brainstorming session.

## Ideas format
The ideas list is a well formed CSV document. Where the columns will be separated by the character `|` like:
title | description
First title | First description
Second title | Second description

The document will have a list of ideas and every idea will have the columns "title" with a name for the idea and "description" with the idea description.

## Ideas for: {topic}

{user_inputs_text}

### Selected ideas
{previous_text}

{question_text}
title | description

"""

DEBUG_TEMPLATE="""
Topic: {}

Current list of pending ideas:
{}

Current list of bad ideas:
{}

Current list of good ideas:
{}"""

PREVIOUS_TEXT_TEMPLATE = """
title | description
{}
"""

SUMMARY_PROMPT="""
# Ideas for: {topic}
## Selected ideas
{current_text}
---
## Pros and cons for every idea
### {first_option}
Pros:
- """

class UserData:
  def __init__(self):
    self._user_data = {}

  def clear(self, id):
    self._user_data[id] = {
      'topic': None,
      'extra': [],
      'good': [],
      'bad': [],
      'options': []
    }    

  def add_topic(self, id, topic):
    self._user_data[id] = {
      'topic': topic,
      'extra': [],
      'good': [],
      'bad': [],
      'options': []
    }

  def debug(self, id):
    user = self._user_data[id]
    return DEBUG_TEMPLATE.format(user['topic'], "\n".join(user['options']), "\n".join(user['bad']), "\n".join(user['good']))    
  
  def current_option(self, id):
    return self._user_data.get(id)['options'][0]

  def get_user(self, id):
    return self._user_data.get(id)

  def get_topic(self, id):
    return self._user_data.get(id, {}).get('topic')

  def accept_current_option(self, id, extra_text=""):
    user = self.get_user(id)
    if (user['options']):
      option = user['options'].pop(0)
      user['good'].append(option)
      if extra_text:
        user['extra'].append(extra_text)

  def deny_current_option(self, id):
    user = self.get_user(id)
    if (user['options']):
      option = user['options'].pop(0)
      user['bad'].append(option)

  def has_options(self, id):
    user = self.get_user(id)
    return len(user['options']) > 0

  def prompt(self, id):
    user = self.get_user(id)
    previous_list = ""

    previous_text = ""
    if user['good']:
      previous_list = ", ".join(["\"{}\"".format(p.split("|")[0].strip()) for p in user['good']])
      previous_text = PREVIOUS_TEXT_TEMPLATE.format("\n".join(user['good']))

    user_inputs_text = ""
    if user['extra']:
      user_inputs_text = ",".join(user['extra'])

    if previous_list:
        question_text = "The next best 5 ideas that based combine ideas from {} are:".format(previous_text)
    else:
        question_text = "The next best 5 ideas are:"

    prompt = BRAINSTORMING_SESSION_PROMPT.format(
      topic=user['topic'], 
      user_inputs_text=user_inputs_text,
      previous_text=previous_text,
      question_text=question_text)

    print ("prompt", prompt)

    completion = openai.Completion.create(
        model="text-davinci-003",
        presence_penalty=1,
        temperature=0.6,
        top_p=1,
        best_of=1,
        frequency_penalty=1,
        max_tokens=512,
        prompt=prompt)

    # user['options'] = completion.choices[0].text.split("\n")[1:]
    lines = completion.choices[0].text.split("\n")
    user['options'] = [a.strip() + " | " + b.strip() for a, b in [line.split("|") for line in lines if line.strip()]]
    return user['options']

user_data = UserData()
bot = telebot.TeleBot(BOT_TOKEN)

@bot.message_handler(commands=['help'])
def help(message):
  user_id = message.chat.id
  help_text = "The following commands are available: \n"
  for key in COMMANDS:  # generate help text out of the commands dictionary defined at the top
    help_text += "/" + key + ": "
    help_text += COMMANDS[key] + "\n"
  bot.send_message(user_id, help_text)  # send the generated help page


def suggest_next_option(user_id, prompt=False):
  if not user_data.has_options(user_id) or prompt:
    user_data.prompt(user_id)
  
  option = user_data.current_option(user_id)
  bot.send_message(user_id, option + " (/yes /no)")

@bot.message_handler(commands=['restart'])
def restart(message):  
  user_id = message.chat.id
  user_data.clear(user_id)


@bot.message_handler(commands=['topic'])
def set_topic(message):  
  user_id = message.chat.id
  user_data.add_topic(user_id, message.text.replace("/topic", "").strip())
  suggest_next_option(user_id)


@bot.message_handler(commands=['finish'])
def set_topic(message):  
  user_id = message.chat.id
  user = user_data.get_user(user_id)
  topic = user_data.get_topic(user_id)
  current_text = ""
  first_option = ""
  if user['good']:
    current_text = user['good'][-1]
    first_option = user['good'][-1].split("|")[0]

  prompt = SUMMARY_PROMPT.format(topic=topic, first_option=first_option, current_text=current_text)

  completion = openai.Completion.create(
          model="text-davinci-003",
          presence_penalty=2,
          temperature=0.5,
          top_p=1,
          best_of=1,
          frequency_penalty=0,
          max_tokens=512,
          prompt=prompt)

  prompt = prompt + completion.choices[0].text + "\n## Summary\n"

  completion = openai.Completion.create(
        model="text-davinci-003",
        presence_penalty=1,
        temperature=0.1,
        top_p=1,
        best_of=1,
        frequency_penalty=0.2,
        max_tokens=512,
        prompt=prompt)

  result = prompt + completion.choices[0].text
  bot.send_message(user_id, result.split("---")[1].strip())  
  user_data.clear(user_id)
  

def process_option(option, options, message):
  user_id = message.chat.id
  response = message.text
  if message.text == 'yes':
    user_data.add_good(user_id, option)
  else:
    user_data.add_bad(user_id, option)

  if not options:
    options = user_data.prompt(user_id)

  option = options.pop(0)
  bot.send_message(message.chat.id, option)
  bot.register_next_step_handler(message, partial(process_option, option, options))

@bot.message_handler(commands=['yes'])
def accept_option(message):  
  user_id = message.chat.id
  user_data.accept_current_option(user_id, message.text.replace("/yes", ""))
  suggest_next_option(user_id, True)
  print(user_data.get_user(user_id))


@bot.message_handler(commands=['no'])
def deny_option(message):  
  user_id = message.chat.id
  user_data.deny_current_option(user_id)
  suggest_next_option(user_id)


@bot.message_handler(commands=['debug'])
def debug(message):  
	user_id = message.chat.id
	bot.reply_to(message, user_data.debug(user_id))


#Handle all other messages
@bot.message_handler(func=lambda m: True)
def general_messages(message):
  # bot.send_message(message.chat.id, "Unknown command")
  # help(message)
  user_id = message.chat.id
  topic = user_data.get_topic(user_id)

  if not topic:
    messages = [
      {"role": "assistant", "content": IDEA_PROMPT},
      {"role": "user", "content": message.text}
    ]
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
        temperature=0.1
    )

    content = response["choices"][0]["message"].content

    print(content)

    try:
      content = json.loads(content)
      if content.get("idea"):
        user_data.add_topic(user_id, content.get("idea"))
        suggest_next_option(user_id)
      elif not content.get("end_conversation"):
        bot.send_message(user_id, content.get("message"))
      else:
        user_data.add_topic(user_id, message.text)
        suggest_next_option(user_id)

    except ValueError as err:
      bot.send_message(user_id, content)

  else:
    response = openai.Completion.create(
      model="text-davinci-003",
      prompt="""
Classify the following text as: 
- "affirmative": if the user is saying yes, ok, or something similar
- "negative": if the user is saying no, or something similar
- "idea": if the users is suggesting to speak about a new topic or is interested on it. Include an attribute idea with the topic.
- "unknown": if you don't understand what the user says

The output must be a valid json including a message explaining to the user what you understood and why you made that decision.

An output example:
```
{{
    "classification": "affirmative",
    "message": "I understood that you said 'sure', which is an affirmative answer."
}}
```

Text: "{}"
""".format(message.text),
      temperature=0.1,
      max_tokens=256,
      top_p=1,
      frequency_penalty=0,
      presence_penalty=0
    )

    content = response["choices"][0]["text"]

    print("content", content)

    try:
      content = json.loads(content)
      classification = content.get("classification")
      print("classification", classification)
      if classification == "affirmative" or content.get("affirmative"):
        accept_option(message)
      elif classification == "negative" or content.get("nevagite"):
        deny_option(message)
      elif classification == "idea":
        user_data.add_topic(user_id, message.text)
        bot.send_message(user_id, content.get("message"))
        suggest_next_option(user_id)        
      else:
        bot.send_message(user_id, content.get("message"))

    except ValueError as err:
      bot.send_message(user_id, content)

bot.polling()