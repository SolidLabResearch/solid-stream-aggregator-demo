# Solid Stream Aggregator Demo

This is an example setup of the [Solid Stream Aggregator](https://github.com/argahsuknesib/solid-stream-aggregator) 
repository for completion of the [SolidLab Challenge 84](https://github.com/SolidLabResearch/Challenges/issues/84) .

## Setup

### Setting up the Solid Pods.
- We create one solid pod for each patient participant.
- Download the Community Solid Server's NPM package.
```bash
npm install -g @solid/community-server
```
- The multiSolidPod.json file contains the configuration for the Community Solid Server to create four solid pods for
the four patients and one as the aggregation pod.
- Run the Community Solid Server with the multiSolidPod.json file.
- The Community Solid Server's configuration we are using is the unsafe.json file which has no authentication enabled
and is only for testing purposes till long term authentication is implemented
  (see [here](https://github.com/SolidLabResearch/Challenges/issues/13))
```bash
npx community-solid-server --config ./src/pod/config/unsafe.json -f ./pod/ --seededPodConfigJson ./src/pod/multiSolidPod.json
```

Note: The community solid server works with LTS versions of node. If you are using a non LTS version of node, you may download the LTS version of node and use it to run the community solid server.

After this, the solid pods are created.

### Loading up the data to the solid pod.
- The datasets for the four patients are in the repository [here](https://github.com/argahsuknesib/dahcc-heartrate) .
- We use the [LDES in SOLID Semantic Observations Replay](https://github.com/SolidLabResearch/LDES-in-SOLID-Semantic-Observations-Replay)
to load up the datasets into the solid pods.
- Please follow the instructions in the 
[README.md file](https://github.com/SolidLabResearch/LDES-in-SOLID-Semantic-Observations-Replay/blob/main/README.md) 
of the repository to load up the data with the datasets 

Now, you have the solid pods loaded up with the data.

### Aggregation
- As the solid pods are located at http://localhost:3000/ , which is also the default solid server location of the
aggregator, in any case you will have to explicitly specify the solid server location in the CLI.
- Similarly, the aggregator is located at http://localhost:8080/ by default.
- You can also specify the latest minutes of events to be aggregated from the solid pod. By default, it is 30 minutes. 
This means that, the aggregator will only fetch and aggregate the events that are within the last 30 minutes from
the current time.
- The aggregator has two API endpoints, one for the average heart rate of the patient 1 (/averageHRPatient1)
and the other for the average heart rate of the patient 2 (/averageHRPatient3).
- When triggering the API endpoint, the aggregator will fetch the latest events from the solid pod, aggregate them and 
then publish the aggregated stream to the aggregation pod.

