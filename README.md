# Solid Stream Aggregator Demonstration

This is a demonstration repository for the [Solid Stream Aggregator](https://github.com/argahsuknesib/solid-stream-aggregator) for the completion of the 
SolidLab Research's Challenge [84](https://github.com/solidLabResearch/challenges/issues/84).

### Pre-requisites
**NOTE** : The community solid server only works with the LTS releases of NodeJS.

- Clone this repository.
```bash
git clone https://github.com/argahsuknesib/ssa-demo/
```

## Setup

### Setting up the solid pods with the data.
For the demonstration, we use the [DAHCC dataset](https://dahcc.idlab.ugent.be/dataset.html) which is an anonymized dataset of patients who lived in UGent's homlab. 
Each patient owns a solid pod to themselves. We use four patients for the demonstration.
The /scripts/data folder contains the data to spin up the solid pod for each patient with the DAHCC dataset.

To spin up the solid pods, run the following command from the root of the repository.
```bash
npm run start-solid-server
```
This will generate the solidpod for the patients at http://localhost:3000/ . For example, the solid pod for the patient 1 will be at, http://localhost:3000/dataset_participant1/

The /data/ folder contains the dataset for the patients.

### Aggregation over the solid pods.
Spun up a new instance of the terminal.
Build the project by running the following command from the root of the repository.
```bash
npm run build
```
To start the solid stream aggregator, run the following command from the root of the repository.
```bash
npm run start aggregation
```
The solid stream aggregator spuns up an HTTP express server at http://localhost:8080/.

 The server exposes the following endpoints for the demonstration,
- /averageHRPatient1
- /averageHRPatient2

For example, the query for passed when requesting the endpoint /averageHRPatient1 is,
```sparql
PREFIX saref: <https://saref.etsi.org/core/> 
PREFIX dahccsensors: <https://dahcc.idlab.ugent.be/Homelab/SensorsAndActuators/>
PREFIX : <https://rsp.js/>
REGISTER RStream <output> AS
SELECT (AVG(?o) AS ?averageHR1)
FROM NAMED WINDOW :w1 ON STREAM <http://localhost:3000/dataset_participant1/data/> [RANGE 10 STEP 2]
      WHERE{
            WINDOW :w1 { ?s saref:hasValue ?o .
                        ?s saref:relatesToProperty dahccsensors:wearable.bvp .}
            }
```
Once the solid stream aggregator is running, request one of the endpoints to instantiate the query with this command and start the aggregation.

```bash
curl http://localhost:8080/averageHRPatient1
```

The aggregation has started, and the results are being written to the 
http://localhost:3000/aggregation_pod/

**NOTE** : The writing the aggregation stream to the aggregation pod might take some time due to the Naive Algorithm of rebalancing and can slow up the solid pod.


### Reading the aggregation results.

The aggregation results are written to a LDP container the aggregation pod at http://localhost:3000/aggregation_pod/data/ . Each aggregation event is an LDP resource.

The aggregated result is then visualised by the SolidLab Research Challenge [85](https://github.com/solidLabResearch/challenges/issues/85).

## License
Copyright (c) Kushagra Singh Bisen 2023 - . All rights reserved. 

## Contact 
Mail kushagrasingh.bisen@ugent.be if you have any questions.