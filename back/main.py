from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from engine import select_engine
from utils import *

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
    saved = parse_saved(data)
    liked = parse_liked(data)
    disliked = parse_disliked(data)

    engine = select_engine(engine=engine)
    completion = engine.next(topic, previous, user_inputs, saved, liked, disliked)

    result = parse_result(completion["message"])
    add_tokens(completion["tokens"], metadata)

    # Return the generated text as a JSON response
    return jsonify({"metadata": metadata,
                    "result": result})

@app.route('/api/keyword', methods=['POST'])
@cross_origin()
def keyword():
    data = request.get_json()
    topic = data['topic']
    metadata = data['metadata']
    engine = data.get("engine", "gpt-4")

    keyword = data['keyword']
    saved = parse_saved(data)
    liked = parse_liked(data)
    disliked = parse_disliked(data)

    engine = select_engine(engine=engine)
    completion = engine.keyword(topic, keyword, saved, liked, disliked)

    result = parse_result(completion["message"])
    add_tokens(completion["tokens"], metadata)

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
    saved = parse_saved(data)
    liked = parse_liked(data)
    disliked = parse_disliked(data)

    engine = select_engine(engine=engine)
    completion = engine.more(topic, previous, current, user_inputs, saved, liked, disliked)

    result = parse_result(completion["message"])
    add_tokens(completion["tokens"], metadata)

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

    engine = select_engine(engine=engine)
    completion = engine.summary(topic, first_option, current)

    add_tokens(completion["tokens"], metadata)

    # Return the generated text as a JSON response
    return jsonify({"metadata": metadata,
                    # TODO: check this no parse
                    "result": completion["message"]})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
