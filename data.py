import os
import json
import us
import pandas as pd

data_df= pd.DataFrame("static\data\new_data.csv")
input_json = os.path.join('static\data', 'us-states.geojson')
output_json = os.path.join('static\data', 'us-states_new.geojson')

def GetSummary(qState,qSummary):
    state = us.states.lookup(qState)
    state_abbrv = state.abbr
    print(state_abbrv)
    #run summary on your original data and get Average_Severity and State_Count
    # if qSummary=='SV': return(Average_Severity) 
    # if qSummary=='SC': return(State_Count)
    return 'anything'
    
def SaveModified(clean_data):
    with open (output_json,"w") as f:
        json.dump(clean_data, f)
        
def CleanGeoJson():
    datachanged = False
    if os.path.exists(input_json):
        with open (input_json) as f:
            data = f.read()
            clean_data = data.replace('\xfe','').replace('\xff','').replace('\x00','').replace('\r','').replace('\n','')
            print(type(clean_data))
            clean_data = json.loads(clean_data)
            
    if 'dict' in str(type(clean_data)):
        if 'features' in clean_data:
            if 'list' in str(type(clean_data['features'])):
                c=0
                for index in range(len(clean_data['features'])):
                    if 'properties' in clean_data['features'][index]:
                        statename = clean_data['features'][index]['properties']['name']
                        clean_data['features'][index]['properties']['severity'] = GetSummary(statename,"SV")
                        #clean_data['features'][index]['properties']['state_count'] = GetSummary(statename,"SC")
                        #datachanged = True​
             
#if datachanged: SaveModified(clean_data)​
CleanGeoJson()
print("Done")