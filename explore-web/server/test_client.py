import requests
import json

url = 'http://localhost:5000/next'
data = {
    "topic": "Rat names",
}

headers = {'Content-type': 'application/json'}
response = requests.post(url, data=json.dumps(data), headers=headers)

print(response.json())
