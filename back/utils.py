def add_tokens(token_count, metadata):
    metadata["tokenCount"] += token_count

def parse_current(data):
    current = []
    if data.get('current', None):
        current = ["{}|{}|{}".format(i["title"], i["description"], i["keywords"]) for i in data['current']]
    return current

def parse_saved(data):
    result = []
    if data.get('saved', None):
        result = ["{}|{}|{}".format(i["title"], i["description"], i["keywords"]) for i in data['saved']]
    return result

def parse_liked(data):
    result = []
    if data.get('liked', None):
        result = ["{}|{}|{}".format(i["title"], i["description"], i["keywords"]) for i in data['liked']]
    return result

def parse_disliked(data):
    result = []
    if data.get('disliked', None):
        result = ["{}|{}|{}".format(i["title"], i["description"], i["keywords"]) for i in data['disliked']]
    return result

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

def parse_result(result):
    lines = result.split("\n")
    result = [{"title": a.strip(), "description": b.strip(), "keywords": c.strip()} for a, b, c in [line.split("|") for line in lines if line.strip()]]
    return result

