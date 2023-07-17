from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from engine import select_engine
from prompts import *

app = Flask(__name__)

CORS(app)

@app.route('/api/next', methods=['POST'])
@cross_origin()
def generate():
    data = request.get_json()
    topic = data['topic']
    metadata = data['metadata']
    engine = data.get("engine", "gpt-4")

    previous = parse_previous(data)
    user_inputs = parse_user_inputs(data)
    prompt = next_prompt(topic, previous, user_inputs)

    completion = select_engine(engine=engine, prompt=prompt)

    print("=======================================")
    print(prompt)
    print("=======================================")
    print(completion.get_message())
    print("=======================================")

    add_tokens(completion.get_token_count(prompt), metadata)
    add_tokens(completion.get_token_count(completion.get_message()), metadata)

    result = parse_result(completion.get_message())

    # Return the generated text as a JSON response
    return jsonify({"metadata": metadata,
                    "result": result})

@app.route('/api/more', methods=['POST'])
@cross_origin()
def generate_more():
    data = request.get_json()
    metadata = data['metadata']
    topic = data['topic']
    engine = data.get("engine", "gpt-4")
    current = parse_current(data)
    previous = parse_previous(data)
    user_inputs = parse_user_inputs(data)
    prompt = more_prompt(topic, previous, current, user_inputs)

    completion = select_engine(engine=engine, prompt=prompt)

    print("=======================================")
    print(prompt)
    print("=======================================")
    print(completion.get_message())
    print("=======================================")

    add_tokens(completion.get_token_count(prompt), metadata)
    add_tokens(completion.get_token_count(completion.get_message()), metadata)

    result = parse_result(completion.get_message())

    # Return the generated text as a JSON response
    return jsonify({"metadata": metadata,
                    "result": result})

@app.route('/api/summary', methods=['POST'])
@cross_origin()
def generate_summary():
    data = request.get_json()
    topic = data['topic']
    metadata = data['metadata']
    engine = data.get("engine", "gpt-4")

    current = parse_current_summary(data)
    first_option = parse_first_option(data)
    prompt = format_summary_prompt(topic, first_option, current)

    completion = select_engine(engine=engine,
        prompt=prompt,
        presence_penalty=2,
        temperature=0.5,
        top_p=1,
        frequency_penalty=0,
        max_tokens=512)

    add_tokens(completion.get_token_count(prompt), metadata)
    add_tokens(completion.get_token_count(completion.get_message()), metadata)

    print("SUMMARY PROMPT 1")
    print("=======================================")
    print(prompt)
    print("=======================================")
    print(completion.get_message())
    print("=======================================")

    prompt = prompt + completion.get_message() + "\n## Summary\n"

    completion = select_engine(engine=engine,
        prompt=prompt,
        presence_penalty=1,
        temperature=0.1,
        top_p=1,
        frequency_penalty=0.2,
        max_tokens=512)

    print("SUMMARY PROMPT 2")
    print("=======================================")
    print(prompt)
    print("=======================================")
    print(completion.get_message())
    print("=======================================")

    add_tokens(completion.get_token_count(prompt), metadata)
    add_tokens(completion.get_token_count(completion.get_message()), metadata)

    result = prompt + completion.get_message()
    result = result.split("---")[1].strip()

    # Return the generated text as a JSON response
    return jsonify({"metadata": metadata,
                    "result": result})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
