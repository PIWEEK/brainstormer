import openai
import os
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

app = Flask(__name__)

CORS(app)

# Set up OpenAI API credentials
openai.organization = os.getenv('BRAINSTORMER_OPENAI_ORG')
openai.api_key = os.getenv('BRAINSTORMER_OPENAI_KEY')

prompt_template = """
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

previous_text_template = """
title | description
{}
"""

user_input_template = """
IMPORTANT: We want {}.
"""

more_items_template = """
## Crazier ideas

This are the next 5 ideas. But way crazier:

title | description
"""

def parse_current(data):
    current = []
    if data.get('current', None):
        current = ["{}|{}".format(i["title"], i["description"]) for i in data['current']]

    return current

def parse_previous(data):
    previous = []
    if data.get('previous', None):
        previous = ["{}|{}".format(i["title"], i["description"]) for i in data['previous']]

    return previous
    
def parse_user_inputs(data):
    user_inputs = []
    if data.get("previous", None):
        user_inputs = ["\"{}\" {}".format(i["title"], i["input"]) for i in data['previous'] if i.get("input", None)]
    return user_inputs
    
def next_prompt(topic, previous, user_inputs):
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

    prompt = prompt_template.format(
        topic=topic.upper(),
        previous_text=previous_text,
        question_text=question_text,
        user_inputs_text=user_inputs_text)

    return prompt

def more_prompt(topic, previous, current, user_inputs):
    prompt = next_prompt(topic, previous, user_inputs) + \
        "\n".join(current) + "\n" + more_items_template

    return prompt

def parse_result(completion):
    lines = completion.choices[0].text.split("\n")
    result = [{"title": a.strip(), "description": b.strip()} for a, b in [line.split("|") for line in lines if line.strip()]]
    return result

# Endpoint for generating text with OpenAI's GPT-3
@app.route('/next', methods=['POST'])
@cross_origin()
def generate():
    data = request.get_json()
    topic = data['topic']

    previous = parse_previous(data)
    user_inputs = parse_user_inputs(data)
    prompt = next_prompt(topic, previous, user_inputs)

    completion = openai.Completion.create(
        model="text-davinci-003",
        presence_penalty=1,
        temperature=0.6,
        top_p=1,
        best_of=1,
        frequency_penalty=1,
        max_tokens=512,
        prompt=prompt)

    print("=======================================")
    print(prompt)
    print("=======================================")
    print(completion.choices[0].text)
    print("=======================================")

    result = parse_result(completion)

    # Return the generated text as a JSON response
    return jsonify({"result": result})

@app.route('/more', methods=['POST'])
@cross_origin()
def generate_more():
    data = request.get_json()
    topic = data['topic']

    current = parse_current(data)
    previous = parse_previous(data)
    user_inputs = parse_user_inputs(data)
    prompt = more_prompt(topic, previous, current, user_inputs)

    completion = openai.Completion.create(
        model="text-davinci-003",
        presence_penalty=1,
        temperature=0.6,
        top_p=1,
        best_of=1,
        frequency_penalty=1,
        max_tokens=512,
        prompt=prompt)

    print("=======================================")
    print(prompt)
    print("=======================================")
    print(completion.choices[0].text)
    print("=======================================")

    result = parse_result(completion)

    # Return the generated text as a JSON response
    return jsonify({"result": result})

if __name__ == '__main__':
    app.run(debug=True)


