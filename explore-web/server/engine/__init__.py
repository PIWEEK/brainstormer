import openai
import os

from .gpt_4 import GPT_4
from .davinci_003 import DAVINCI_003

# Set up OpenAI API credentials
openai.organization = os.getenv('BRAINSTORMER_OPENAI_ORG')
openai.api_key = os.getenv('BRAINSTORMER_OPENAI_KEY')

def select_engine(engine="gpt-4", *args, **kwargs):
    return GPT_4(*args, **kwargs)
    if engine == "gpt-4":
        return GPT_4(*args, **kwargs)  
    else:
        return DAVINCI_003(*args, **kwargs)
