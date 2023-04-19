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

This document keeps track of possible ideas.

The ideas will be stored in a well formed CSV document. Where the columns will be separated by the character |.

The document will have a list of ideas and every idea will have the columns "title" with a name for the idea and "description" with the idea description.

For example with the topic: "Activities with children for a rainy day" an example list of ideas could be:

```
title | description
Indoor Treasure Hunt | Create a treasure hunt with clues and small prizes hidden throughout the house. Children will have a great time searching for the hidden treasure and solving the clues.
DIY Playdough | Make homemade playdough with flour, salt, water, and food coloring. Kids will love mixing the ingredients together and then playing with the colorful playdough.
Movie Marathon | Choose a few of your favorite movies and have a movie marathon with the kids. Don't forget the popcorn and snacks!
```
## New Ideas for {}

{}

{}

title | description
"""

previous_text_template = """
Given this list of already selected ideas we want to elaborate on:
title | description
{}
"""

# Endpoint for generating text with OpenAI's GPT-3
@app.route('/next', methods=['POST'])
@cross_origin()
def generate():
    data = request.get_json()

    topic = data['topic']

    previous = []
    if "previous" in data:
        previous = ["{}|{}".format(i["title"], i["description"]) for i in data['previous']]

    previous_list = ", ".join(["\"{}\"".format(p.split("|")[0].strip()) for p in previous]) if previous and len(previous) > 1 else None

    previous_text = previous_text_template.format("\n".join(previous)) if previous and len(previous) > 1 else ""

    if previous and len(previous) > 1:
        question_text = "The next best 5 ideas that based combine ideas from {} are:".format(previous_list)
    else:
        question_text = "The next best 5 ideas are:"

    prompt = prompt_template.format(topic, previous_text, question_text)

    completion = openai.Completion.create(
        model="text-davinci-003",
        presence_penalty=1,
        temperature=0.6,
        top_p=1,
        best_of=1,
        frequency_penalty=1,
        max_tokens=512,
        prompt=prompt)
    
    print(completion.choices[0].text)

    result = [{"title": a.strip(), "description": b.strip()} for a, b in [line.split("|") for line in completion.choices[0].text.split("\n")]]

    # Return the generated text as a JSON response
    return jsonify({"result": result})

if __name__ == '__main__':
    app.run(debug=True)
