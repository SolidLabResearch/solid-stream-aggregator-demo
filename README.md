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
The /scripts/data/ folder contains the data to spin up the solid pod for each patient with the DAHCC dataset.

To spin up the solid pods, run the following command from the root of the repository.
```bash
npm run start-solid-server
```
This will generate the solidpod for the patients at http://localhost:3000/ . For example, the solid pod for the patient 1 will be at, http://localhost:3000/dataset_participant1/

The /data/ folder contains the dataset for the patients.

### Loading up the data in the solid pods.

After the solid pods are setup, we would like to load some test data to aggregate over. The dataset we are using is the [DAHCC dataset](https://dahcc.idlab.ugent.be/dataset.html). For simplicity, we have mapped a portion of the DAHCC dataset to .n3 files. To get the dataset, clone the repository with,

```bash
git clone https://github.com/argahsuknesib/dahcc-heartrate.git
```

To loadup the data, we use the LDES in Solid Observations Replay repository.

Clone the repository with,
```bash
git clone https://github.com/SolidLabResearch/LDES-in-SOLID-Semantic-Observations-Replay
```

Go to the /engine/ folder and install the dependencies with,
```bash
cd engine && npm install
```
Edit the `src/config/replay_properties.json` file by adding the location of the folder in the "datasetFolders" field where you cloned the /dahcc-heartrate/ repository. Add the location of the solid pod's /data/ folder in the "lilURL" field.

For exmaple, 

`"lilURL" : "http://localhost:3000/dataset_participant1/data/"`

Start the engine with 
```bash
npm start
```
The output should look similar to the following:

```shell
> challenge-16---replay---backend---typescript@1.0.0 start

> tsc && node dist/app.js`

{port: [Getter], loglevel: [Getter], logname: [Getter], datasetFolders: [Getter], credentialsFileName: [Getter], lilURL: [Getter], treePath: [Getter], chunkSize: [Getter], bucketSize: [Getter], targetResourceSize: [Getter], default: {port: '3001', loglevel: 'info', logname: 'WEB API', datasetFolders: C:\\nextcloud\\development\\challenge16-replay\\main\\Challenge 16 - Replay - Backend - Typescript\\data', credentialsFileName: null, lilURL: 'http://localhost:3000/test/', treePath: 'https://saref.etsi.org/core/hasTimestamp', chunkSize: 10, bucketSize: 10, targetResourceSize: 1024}}

2022-12-08T14:58:54.612Z [WEB API] info: Express is listening at http://localhost:3001
```
REMARK: Should you receive following error message

```shell
`src/algorithms/Naive.ts:66:51 - error TS2345: Argument of type 'import("C:/temp/CLEAN3/ldes-in-solid-semantic-observations-replay/engine/node_modules/@inrupt/solid-client-authn-node/dist/Session").Session' is not assignable to parameter of type 'import("C:/temp/CLEAN3/ldes-in-solid-semantic-observations-replay/engine/node_modules/@treecg/versionawareldesinldp/node_modules/@inrupt/solid-client-authn-node/dist/Session").Session'.
 Types have separate declarations of a private property 'clientAuthentication'.

66     const comm = session ? new SolidCommunication(session) : new LDPCommunication();
```

Please delete the folder `node_modules\@treecg\versionawareldesinldp\node_modules\@inrupt`. 
This is due to conflicting dependencies and 
should be resolved once the `versionawareldesinldp` package has been refactored.

### Starting the webapp to load

The webapp is a simple vue app that allows you to load the data into the solid pods. To start the webapp, run the following command from the root of the repository.
```bash
cd webapp && npm install && npm run dev
```

Open the webapp, select a dataset to be loaded. Click on, `Load selected dataset`.

Then click on, 'Sort observation subjects' followed by `Submit remaining observations`.

The data will be loaded up in the solid pod.


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

 The server exposes the following endpoint for the demonstration,
- /averageHRPatient1

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
 
This code is copyrighted by [Ghent University - imec](https://www.ugent.be/ea/idlab/en) and released under the [MIT Licence](./LICENCE)

## Contact 
Mail kushagrasingh.bisen@ugent.be if you have any questions.