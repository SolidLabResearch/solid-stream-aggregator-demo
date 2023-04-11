import {SinglePodAggregator} from "./SinglePodAggregator";

const QueryEngine = require('@comunica/query-sparql-link-traversal').QueryEngine;
const linkTraversalEngine = new QueryEngine();

export class AggregatorInstantiator {
    public latestMinutes: number;
    public currentTime: any;
    public solidServerURL: string;
    public query: string;

    constructor(continuousQuery: string, latestMinutes: number, serverURL: string) {
        this.latestMinutes = latestMinutes;
        this.currentTime = new Date();
        this.solidServerURL = serverURL;
        this.query = continuousQuery;
        this.discoverLIL(this.solidServerURL).then((result: void) => {
            console.log(`The process to discover LILs has been started.`);
        });
    }

    async discoverLIL(solidServerURL: string) {
        const bindingStream = await linkTraversalEngine.queryBindings(`
            PREFIX tree: <https://w3id.org/tree#>
            PREFIX ldp: <http://www.w3.org/ns/ldp#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            SELECT ?LIL WHERE {
                <${solidServerURL}> ldp:contains ?pod .
                ?pod ldp:contains ?LIL .
                ?LIL rdf:type tree:Node .
            }
            `, {
            sources: [`${solidServerURL}`]
        });

        bindingStream.on('data', async (bindings: any) => {
            await this.instantiateAggregator(bindings.get('LIL').value, this.query);
        });
    }


    async instantiateAggregator(LILContainer: string, query: string) {
        new SinglePodAggregator(LILContainer, query, 'ws://localhost:8080/', "2022-11-07T09:27:17.5890", "2028-11-07T09:27:17.5890", LILContainer);

        /**
         * This code is used to test the aggregator with a fixed time interval. But for the demo, for simplicity we hardcode the time interval to basically get all of the data.
        new SinglePodAggregator(LILContainer, query, 'ws://localhost:8080/', new Date(this.currentTime - this.latestMinutes), this.currentTime, LILContainer); 
         */

    }

}
