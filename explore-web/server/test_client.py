import requests
import json

url = 'http://localhost:5000/api/summary'
data = {
    "topic": "Cat names",
    "current":  [
        {
            "title": "Catsy",
            "description": "A modern name for a cat that loves to explore the world"
        },
        {
            "title": "Catseye",
            "description": "A wise and curious cat who loves to watch the world go by"
        },
        {
            "title": "Catsy Moonbeam",
            "description": "An elegant and mysterious cat that loves to gaze at the moon"
        },
        {
            "title": "Catseyed",
            "description": "A wise and curious cat that has a special eye for detail"
        }
    ]}

headers = {'Content-type': 'application/json'}
response = requests.post(url, data=json.dumps(data), headers=headers)

result = response.json()["result"]
print(result)
