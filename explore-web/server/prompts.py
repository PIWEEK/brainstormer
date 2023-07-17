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

def add_tokens(token_count, metadata):
    metadata["tokenCount"] += token_count

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

    return prompt_template.format(
        topic=topic.upper(),
        previous_text=previous_text,
        question_text=question_text,
        user_inputs_text=user_inputs_text)

def more_prompt(topic, previous, current, user_inputs):
    prompt = next_prompt(topic, previous, user_inputs) + \
        "\n".join(current) + "\n" + more_items_template

    return prompt

def parse_result(result):
    lines = result.split("\n")
    result = [{"title": a.strip(), "description": b.strip(), "keywords": c.strip()} for a, b, c in [line.split("|") for line in lines if line.strip()]]
    return result

def format_summary_prompt(topic, first_option, current):
    return summary_prompt.format(
        topic=topic,
        current_text="\n".join(current),
        first_option=first_option)
