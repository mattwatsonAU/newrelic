import csv
import json
import requests

apiKey = ''

with open('import.csv') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    next(csv_reader, None)
    for row in csv_reader:
        data = {}
        data['name'] = row[0]
        data['frequency'] = int(row[1])
        data['uri'] = row[2]
        data['locations'] = [row[3]]
        data['type'] = "browser"
        data['status'] = "enabled"
        data['slaThreshold'] = "5.0"
        print(data)
        url = 'https://synthetics.newrelic.com/synthetics/api/v3/monitors'
        headers = {'content-type': 'application/json','X-Api-Key': apiKey}
        response = requests.post(url, headers=headers, json=data)
        print(response.text)