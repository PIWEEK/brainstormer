import openai
import os
import tiktoken
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

app = Flask(__name__)

CORS(app)

# Set up OpenAI API credentials
openai.organization = os.getenv('BRAINSTORMER_OPENAI_ORG')
openai.api_key = os.getenv('BRAINSTORMER_OPENAI_KEY')

encoding = tiktoken.encoding_for_model("text-davinci-003")


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

def add_tokens(message, metadata):
    metadata["tokenCount"] += len(encoding.encode(message))

def parse_current(data):
    current = []
    if data.get('current', None):
        current = ["{}|{}|{}".format(i["title"], i["description"], i["keywords"]) for i in data['current']]
    return current

def parse_current_summary(data):
    current = []
    if data.get('current', None):
        current = ["{}: {}".format(i["title"], i["description"]) for i in data['current']]
    return current

def parse_first_option(data):
    first_option = ""
    if data.get('current', None):
        first_option = data['current'][0]['title']
    return first_option

def parse_previous(data):
    previous = []
    if data.get('previous', None):
        previous = ["{}|{}|{}".format(i["title"], i["description"], i["keywords"]) for i in data['previous']]

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
    result = [{"title": a.strip(), "description": b.strip(), "keywords": c.strip()} for a, b, c in [line.split("|") for line in lines if line.strip()]]
    return result

def format_summary_prompt(topic, first_option, current):
    return summary_prompt.format(
        topic=topic,
        current_text="\n".join(current),
        first_option=first_option
    )
    

@app.route('/', methods=['GET'])
def index():  # pragma: no cover
    content = get_file('index.html')
    return Response(content, mimetype="text/html")

# Endpoint for generating text with OpenAI's GPT-3
@app.route('/api/next', methods=['POST'])
@cross_origin()
def generate():
    data = request.get_json()
    topic = data['topic']
    metadata = data['metadata']

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

    add_tokens(prompt, metadata)
    add_tokens(completion.choices[0].text, metadata)

    result = parse_result(completion)

    # Return the generated text as a JSON response
    return jsonify({"metadata": metadata,
                    "result": result})

@app.route('/api/more', methods=['POST'])
@cross_origin()
def generate_more():
    data = request.get_json()
    metadata = data['metadata']
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

    add_tokens(prompt, metadata)
    add_tokens(completion.choices[0].text, metadata)

    result = parse_result(completion)

    # Return the generated text as a JSON response
    return jsonify({"metadata": metadata,
                    "result": result})

@app.route('/api/summary', methods=['POST'])
@cross_origin()
def generate_summary():
    data = request.get_json()
    topic = data['topic']
    metadata = data['metadata']

    current = parse_current_summary(data)
    first_option = parse_first_option(data)
    prompt = format_summary_prompt(topic, first_option, current)

    completion = openai.Completion.create(
        model="text-davinci-003",
        presence_penalty=2,
        temperature=0.5,
        top_p=1,
        best_of=1,
        frequency_penalty=0,
        max_tokens=512,
        prompt=prompt)

    print("SUMMARY PROMPT 1")
    print("=======================================")
    print(prompt)
    print("=======================================")
    print(completion.choices[0].text)
    print("=======================================")

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

    add_tokens(prompt, metadata)
    add_tokens(completion.choices[0].text, metadata)

    print("SUMMARY PROMPT 2")
    print("=======================================")
    print(prompt)
    print("=======================================")
    print(completion.choices[0].text)
    print("=======================================")

    add_tokens(prompt, metadata)
    add_tokens(completion.choices[0].text, metadata)

    result = prompt + completion.choices[0].text
    result = result.split("---")[1].strip()

    # Return the generated text as a JSON response
    return jsonify({"metadata": metadata,
                    "result": result})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
