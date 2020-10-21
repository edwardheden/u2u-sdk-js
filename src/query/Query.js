import Status from "../Status.js";
import Hbar from "../Hbar.js";
import Executable from "../Executable.js";
import TransactionId from "../transaction/TransactionId.js";
import {
    Query as ProtoQuery,
    TransactionBody as ProtoTransactionBody,
    ResponseType as ProtoResponseType,
    ResponseCodeEnum,
} from "@hashgraph/proto";
import MaxQueryPaymentExceeded from "../MaxQueryPaymentExceeded.js";
import Long from "long";

/**
 * @typedef {import("../channel/Channel.js").default} Channel
 */

/**
 * @namespace proto
 * @typedef {import("@hashgraph/proto").IQuery} proto.IQuery
 * @typedef {import("@hashgraph/proto").IQueryHeader} proto.IQueryHeader
 * @typedef {import("@hashgraph/proto").ITransaction} proto.ITransaction
 * @typedef {import("@hashgraph/proto").IResponse} proto.IResponse
 * @typedef {import("@hashgraph/proto").IResponseHeader} proto.IResponseHeader
 * @typedef {import("@hashgraph/proto").ITransactionBody} proto.ITransactionBody
 * @typedef {import("@hashgraph/proto").ResponseCodeEnum} proto.ResponseCodeEnum
 */

/**
 * @typedef {import("../account/AccountId.js").default} AccountId
 * @typedef {import("../client/Client.js").ClientOperator} ClientOperator
 */

/**
 * @type {Map<ProtoQuery["query"], (query: proto.IQuery) => Query<*>>}
 */
export const QUERY_REGISTRY = new Map();

/**
 * Base class for all queries that can be submitted to Hedera.
 *
 * @abstract
 * @template OutputT
 * @augments {Executable<proto.IQuery, proto.IResponse, OutputT>}
 */
export default class Query extends Executable {
    constructor() {
        super();

        /** @type {?TransactionId} */
        this._paymentTransactionId = null;

        /** @type {proto.ITransaction[]} */
        this._paymentTransactions = [];

        /** @type {AccountId[]} */
        this._paymentTransactionNodeIds = [];

        /** @type {number} */
        this._nextPaymentTransactionIndex = 0;

        /** @type {?Hbar} */
        this._queryPayment = null;

        /** @type {?Hbar} */
        this._maxQueryPayment = null;

        /**
         * Explicit node account ID. If set, this query will be executed on this node and not chose a node
         * from the client's network.
         *
         * @type {?AccountId}
         */
        this._nodeId = null;
    }

    /**
     * @template T
     * @param {Uint8Array} bytes
     * @returns {Query<T>}
     */
    static fromBytes(bytes) {
        const query = ProtoQuery.decode(bytes);

        if (query.query == null) {
            throw new Error("(BUG) query.query was not set in the protobuf");
        }

        const fromProtobuf = /** @type {(query: proto.IQuery) => Query<T>} */ (QUERY_REGISTRY.get(
            query.query
        ));

        if (fromProtobuf == null) {
            throw new Error(
                `(BUG) Query.fromBytes() not implemented for type ${query.query}`
            );
        }

        return fromProtobuf(query);
    }

    /**
     * @returns {Uint8Array}
     */
    toBytes() {
        return ProtoQuery.encode(this._makeRequest()).finish();
    }

    /**
     * @returns {?AccountId}
     */
    getNodeAccountId() {
        return this._nodeId;
    }

    /**
     * Set the account ID of the node that will be used to submit this
     * query to the network.
     *
     * This node must exist in the network on the client that is used to later
     * execute this query.
     *
     * @param {AccountId} nodeId
     * @returns {this}
     */
    setNodeAccountId(nodeId) {
        this._nodeId = nodeId;

        return this;
    }

    /**
     * Set an explicit payment amount for this query.
     *
     * The client will submit exactly this amount for the payment of this query. Hedera
     * will not return any remainder.
     *
     * @param {Hbar} queryPayment
     * @returns {this}
     */
    setQueryPayment(queryPayment) {
        this._queryPayment = queryPayment;

        return this;
    }

    /**
     * Set the maximum payment allowable for this query.
     *
     * @param {Hbar} maxQueryPayment
     * @returns {this}
     */
    setMaxQueryPayment(maxQueryPayment) {
        this._maxQueryPayment = maxQueryPayment;

        return this;
    }

    /**
     * @param {import("../client/Client.js").default<Channel, *>} client
     * @returns {Promise<Hbar>}
     */
    getCost(client) {
        if (this._paymentTransactionNodeIds.length == 0) {
            this._setPaymentNodeIds(client);
        }

        if (COST_QUERY.length != 1) {
            throw new Error("CostQuery has not been loaded yet");
        }

        return COST_QUERY[0](this).execute(client);
    }

    /**
     * @returns {TransactionId}
     */
    _getTransactionId() {
        if (this._paymentTransactionId == null) {
            throw new Error(
                "Query.PaymentTransactionId was not set duration executation"
            );
        }

        return this._paymentTransactionId;
    }

    /**
     * @protected
     * @returns {boolean}
     */
    _isPaymentRequired() {
        return true;
    }

    /**
     * @override
     * @template ChannelT
     * @template MirrorChannelT
     * @param {import("../client/Client.js").default<ChannelT, MirrorChannelT>} client
     * @returns {void}
     */
    _setPaymentNodeIds(client) {
        if (
            this._paymentTransactions.length !== 0 ||
            !this._isPaymentRequired()
        ) {
            return;
        }

        // generate payment transactions if one was
        // not set and payment is required

        const operator = client._operator;

        if (operator == null) {
            throw new Error(
                "`client` must have an `operator` or an explicit payment transaction must be provided"
            );
        }

        this._paymentTransactions = [];
        this._paymentTransactionNodeIds = [];

        this._paymentTransactionId = TransactionId.generate(operator.accountId);

        if (this._nodeId == null) {
            const size = client._getNumberOfNodesForTransaction();
            for (let i = 0; i < size; i += 1) {
                this._paymentTransactionNodeIds.push(client._getNextNodeId());
            }
        } else {
            this._paymentTransactionNodeIds.push(this._nodeId);
        }
    }

    /**
     * @template MirrorChannelT
     * @param {import("../client/Client.js").default<Channel, MirrorChannelT>} client
     * @returns {Promise<void>}
     */
    async _beforeExecute(client) {
        if (
            this._paymentTransactions.length != 0 ||
            !this._isPaymentRequired()
        ) {
            return;
        }

        const operator = client._operator;

        if (operator == null) {
            throw new Error(
                "`client` must have an `operator` or an explicit payment transaction must be provided"
            );
        }

        // let cost = new Hbar(2);
        let cost =
            this._queryPayment != null
                ? this._queryPayment
                : client.maxQueryPayment;

        if (this._queryPayment == null) {
            const actualCost = await this.getCost(client);

            if (cost.toTinybars() > actualCost.toTinybars()) {
                throw new MaxQueryPaymentExceeded(cost, actualCost);
            }

            cost = actualCost;
        }

        if (this._paymentTransactionNodeIds.length == 0) {
            this._setPaymentNodeIds(client);
        }

        for (const node of this._paymentTransactionNodeIds) {
            this._paymentTransactions.push(
                await _makePaymentTransaction(
                    /** @type {import("../transaction/TransactionId.js").default} */ (this
                        ._paymentTransactionId),
                    node,
                    operator,
                    /** @type {Hbar} */ (cost)
                )
            );
        }
    }

    /**
     * @abstract
     * @internal
     * @param {proto.IResponse} response
     * @returns {proto.IResponseHeader}
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _mapResponseHeader(response) {
        throw new Error("not implemented");
    }

    /**
     * @protected
     * @returns {proto.IQueryHeader}
     */
    _makeRequestHeader() {
        /** @type {proto.IQueryHeader} */
        let header = {};

        if (this._isPaymentRequired() && this._paymentTransactions.length > 0) {
            header = {
                responseType: ProtoResponseType.ANSWER_ONLY,
                payment: this._paymentTransactions[
                    this._nextPaymentTransactionIndex
                ],
            };
        }

        return header;
    }

    /**
     * @abstract
     * @internal
     * @param {proto.IQueryHeader} header
     * @returns {proto.IQuery}
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _onMakeRequest(header) {
        throw new Error("not implemented");
    }

    /**
     * @override
     * @internal
     * @returns {proto.IQuery}
     */
    _makeRequest() {
        /** @type {proto.IQueryHeader} */
        let header = {};

        if (this._isPaymentRequired() && this._paymentTransactions != null) {
            header = {
                payment: this._paymentTransactions[
                    this._nextPaymentTransactionIndex
                ],
                responseType: ProtoResponseType.ANSWER_ONLY,
            };
        }

        return this._onMakeRequest(header);
    }

    /**
     * @override
     * @internal
     * @param {proto.IResponse} response
     * @returns {Status}
     */
    _mapResponseStatus(response) {
        const { nodeTransactionPrecheckCode } = this._mapResponseHeader(
            response
        );

        return Status._fromCode(
            nodeTransactionPrecheckCode != null
                ? nodeTransactionPrecheckCode
                : ResponseCodeEnum.OK
        );
    }

    /**
     * @template ChannelT
     * @template MirrorChannelT
     * @param {import("../client/Client.js").default<ChannelT, MirrorChannelT>} client
     * @returns {AccountId}
     */
    _getNodeAccountId(client) {
        if (this._paymentTransactionNodeIds.length > 0) {
            // if there are payment transactions,
            // we need to use the node of the current payment transaction
            return this._paymentTransactionNodeIds[
                this._nextPaymentTransactionIndex
            ];
        }

        if (this._nodeId != null) {
            // free queries with an explicit node
            return this._nodeId;
        }

        if (client == null) {
            throw new Error(
                "requires a client to pick the next node ID for a query"
            );
        }

        // otherwise just pick the next node in the round robin
        // this is hit for free queries without an explicit node
        return client._getNextNodeId();
    }

    /**
     * @override
     * @protected
     * @returns {void}
     */
    _advanceRequest() {
        if (this._isPaymentRequired() && this._paymentTransactions.length > 0) {
            // each time we move our cursor to the next transaction
            // wrapping around to ensure we are cycling
            this._nextPaymentTransactionIndex =
                (this._nextPaymentTransactionIndex + 1) %
                this._paymentTransactions.length;
        }
    }
}

/**
 * @param {TransactionId} paymentTransactionId
 * @param {AccountId} nodeId
 * @param {ClientOperator} operator
 * @param {Hbar} paymentAmount
 * @returns {Promise<proto.ITransaction>}
 */
export async function _makePaymentTransaction(
    paymentTransactionId,
    nodeId,
    operator,
    paymentAmount
) {
    /**
     * @type {proto.ITransactionBody}
     */
    const body = {
        transactionID: paymentTransactionId._toProtobuf(),
        nodeAccountID: nodeId._toProtobuf(),
        transactionFee: new Hbar(1).toTinybars(),
        transactionValidDuration: {
            seconds: Long.fromNumber(120),
        },
        cryptoTransfer: {
            transfers: {
                accountAmounts: [
                    {
                        accountID: operator.accountId._toProtobuf(),
                        amount: paymentAmount.negated().toTinybars(),
                    },
                    {
                        accountID: nodeId._toProtobuf(),
                        amount: paymentAmount.toTinybars(),
                    },
                ],
            },
        },
    };

    const bodyBytes = ProtoTransactionBody.encode(body).finish();
    const signature = await operator.transactionSigner(bodyBytes);

    return {
        bodyBytes,
        sigMap: {
            sigPair: [
                {
                    pubKeyPrefix: operator.publicKey.toBytes(),
                    ed25519: signature,
                },
            ],
        },
    };
}

/**
 * @type {((query: Query<*>) => import("./CostQuery.js").default<*>)[]}
 */
export const COST_QUERY = [];
