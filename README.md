# Solid Stream Aggregator Demonstration

This is a demonstration repository for the [Solid Stream Aggregator](https://github.com/argahsuknesib/solid-stream-aggregator) for the completion of the
SolidLab Research's Challenge [84](https://github.com/solidLabResearch/challenges/issues/84).

### Pre-requisites

**NOTE** : The community solid server only works with the LTS releases of NodeJS.

1. Clone this repository.

   ```bash
   git clone https://github.com/argahsuknesib/solid-stream-aggregator-demo/
   ```

2. Install the dependencies from the root of the repository.

   ```bash
   npm install
   ```

3. Install the Community Solid Server.
   **NOTE**: Install the Community Solid Server globally instead of locally. 
   Installing the Community Solid Server will cause component.js issues in the `node_modules` folder.

   ```bash
   npm install -g @solid/community-server
   ```

## Setup

### Setting up the Solid pods with the data.

For the demonstration, we use the [DAHCC dataset](https://dahcc.idlab.ugent.be/dataset.html) 
which is an anonymized dataset of patients who lived in UGent's HomeLab.
Each patient owns a Solid pod to themselves. 
We use four patients for the demonstration.
The `/scripts/data/` folder contains the data to spin up the Solid pod for each patient with 
the [DAHCC dataset](https://dahcc.idlab.ugent.be/dataset.html)

To spin up the Solid pods, run the following command from the root of the repository.

 ```bash
 npm run start-solid-server
 ```

This will generate the Solid pod for the patients at http://localhost:3000/. 
For example, the Solid pod for the patient 1 will be at http://localhost:3000/dataset_participant1/.

The `/data/` folder contains the dataset for the patients.

### Loading up the data in the Solid pods

After the Solid pods are set up, 
we would like to load some test data to aggregate over. 
The dataset we are using is the [DAHCC dataset](https://dahcc.idlab.ugent.be/dataset.html). 
For simplicity, we have mapped a portion of the DAHCC dataset to N3 files
in [this repository](https://github.com/argahsuknesib/dahcc-heartrate).

1. To get the dataset clone this repository with

   ```bash
   git clone https://github.com/argahsuknesib/dahcc-heartrate.git
   ```

2. To load up the data, 
   we use the [LDES in Solid Observations Replay repository](https://github.com/SolidLabResearch/LDES-in-SOLID-Semantic-Observations-Replay).
   Clone the repository with

   ```bash
   git clone https://github.com/SolidLabResearch/LDES-in-SOLID-Semantic-Observations-Replay
   ```
3. Go to the `engine` folder and install the dependencies with

   ```bash
   cd engine && npm install
   ```

4. Edit the `src/config/replay_properties.json` file by adding the location of the folder in the "datasetFolders" field 
   where you cloned the `dahcc-heartrate` repository. 
   Add the location of the Solid pod's `data` folder in the "lilURL" field.

   For example,
   ```
   "lilURL" : "http://localhost:3000/dataset_participant1/data/"
   ```

5. Start the engine with

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

### Starting the webapp to load

The webapp is a simple vue app that allows you to load the data into the Solid pods. 

1. To start the webapp, run the following command from the root of the repository.

   ```bash
   cd webapp && npm install && npm run dev
   ```

2. Open the webapp, select a dataset to be loaded. Click on the `Load selected dataset` button.

3. Click on `Get Observation Subjects` button to get the observation subjects from the dataset.

4. Click on the `Sort observation subjects` button.
5. Click on the `submit next observation`  button 3 times, till you see the replayer count as 3.
   Now the pod will have 3 observations.

6. Click on the `Submit remaining observations` button to submit the rest. 
   The data will be loaded up in the Solid pod.

### Aggregation over the Solid pods

Open a new instance of the terminal.

1. Build the project by running the following command from the root of the repository.

   ```bash
   npm run build
   ```
2. Install the Community Solid Server locally by running the following command from the root of the repository.

   ```bash
   npm install --save-dev @solid/community-server
   ```

3. To start the Solid stream aggregator, run the following command from the root of the repository.

   ```bash
   npm run start aggregation
   ```

   The Solid stream aggregator starts an HTTP express server at http://localhost:8080/.
   The server exposes the `/averageHRPatient1` endpoint for the demonstration.
   When this doing a GET request to this endpoint the following SPARQL query is executed

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

4. Once the Solid stream aggregator is running, 
   request the endpoint to instantiate the query to start the aggregation.

   ```bash
   curl http://localhost:8080/averageHRPatient1
   ```

   The aggregation has started, and the results are being written to the
   http://localhost:3000/aggregation_pod/

**NOTE**: The writing of the aggregation stream to the aggregation pod might take some time due to the 
Naive Algorithm of rebalancing and can slow down the Solid pod.

### Reading the aggregation results

The aggregation results are written to a LDP container the aggregation pod at http://localhost:3000/aggregation_pod/data/ . 
Each aggregation event is an LDP resource.
The aggregated result is then visualised by the 
SolidLab Challenge [85](https://github.com/solidLabResearch/challenges/issues/85).

## License

This code is copyrighted by [Ghent University - imec](https://www.ugent.be/ea/idlab/en) and 
released under the [MIT Licence](./LICENCE)

## Contact

For any questions, please contact [Kush](mailto:kushagrasingh.bisen@ugent.be).
