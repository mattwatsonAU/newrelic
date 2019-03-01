import requests
import json

### Setup variables
apiKey='' # Admin API Key
dashboardId='' # Dashboard ID found at the end of its URL e.g. https://insights.newrelic.com/accounts/12345/dashboards/50 dashboardID is 50
outputFile=''+'.json' # File name for the output json file


## Do not modify below this line

url = 'https://api.newrelic.com/v2/dashboards/'+dashboardId+'.json'
headers = {'content-type': 'application/json','X-Api-Key': apiKey}
dashboard=requests.get(url, headers=headers).json()
with open(outputFile, 'w') as outfile:
    json.dump(dashboard, outfile)