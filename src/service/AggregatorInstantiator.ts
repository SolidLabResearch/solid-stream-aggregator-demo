import { SinglePodAggregator } from "./SinglePodAggregator";
import { Logger, ILogObj } from "tslog";
import { RSPQLParser } from "rsp-js";
const QueryEngine = require('@comunica/query-sparql-link-traversal').QueryEngine;
import { LDPCommunication } from "@treecg/versionawareldesinldp";
const parser = new RSPQLParser();
const linkTraversalEngine = new QueryEngine();

export class AggregatorInstantiator {
    public latestMinutes: number;
    public currentTime: any;
    public solidServerURL: string;
    public query: string;
    public logger: Logger<ILogObj>;
    public stream_name: string;
    public session: any;

    /**
     * Creates an instance of AggregatorInstantiator.
     * @param {string} continuousQuery
     * @param {number} latestMinutes
     * @param {string} serverURL
     * @memberof AggregatorInstantiator
     */
    constructor(continuousQuery: string, latestMinutes: number, serverURL: string) {
        this.latestMinutes = latestMinutes;
        this.currentTime = new Date();
        this.solidServerURL = serverURL;
        this.query = continuousQuery;
        this.logger = new Logger();
        this.stream_name = parser.parse(this.query).s2r[0].stream_name;
        this.instantiateAggregator(this.stream_name).then(() => {
            this.logger.info(`Aggregator for ${this.stream_name} started`);
        });
    }

    async start_aggregator(stream_name: string) {
        const has_matches = await linkTraversalEngine.queryBoolean(`
        PREFIX ldes: <https://w3id.org/ldes#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX tree: <https://w3id.org/tree#>
        ASK {
            <${stream_name}> rdf:type tree:Node .
        }
        `);
        if (has_matches) {
            await this.instantiateAggregator(stream_name);
        }
        else {
            this.logger.error(`The stream ${stream_name} doesn't point to an LDES Event Stream`);
        }
    }

    /**
     * Instantiates the aggregator for each LDES in LDP compliant solid pod.
     *
     * @param {string} LILContainer
     * @param {string} query
     * @memberof AggregatorInstantiator
     */
    async instantiateAggregator(stream_name: string) {
        // new SinglePodAggregator(stream_name, this.query, 'ws://localhost:8080/', new Date(this.currentTime - this.latestMinutes), this.currentTime, this.latestMinutes, this.session);
        /**
         * The following line is for testing purposes only for historical data.
         */
        new SinglePodAggregator(stream_name, this.query, 'ws://localhost:8080/', "2022-11-07T09:27:17.5890", "2024-11-07T09:27:17.5890", stream_name);
    }

}