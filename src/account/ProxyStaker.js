import AccountId from "./AccountId";
import Hbar from "../Hbar";
import proto from "@hashgraph/proto";
import BigNumber from "bignumber.js";

/**
 * An account, and the amount that it sends or receives during a cryptocurrency transfer.
 */
export default class ProxyStaker {
    /**
     * @private
     * @param {object} props
     * @param {AccountId} props.accountId
     * @param {number | string | Long | BigNumber | Hbar} props.amount
     */
    constructor(props) {
        /**
         * The Account ID that sends or receives cryptocurrency.
         *
         * @readonly
         */
        this.accountId = props.accountId;

        /**
         * The amount of tinybars that the account sends(negative)
         * or receives(positive).
         *
         * @readonly
         */
        this.amount =
            props.amount instanceof Hbar
                ? props.amount
                : new Hbar(props.amount);

        Object.freeze(this);
    }

    /**
     * @internal
     * @param {proto.IProxyStaker} transfer
     * @returns {ProxyStaker}
     */
    static _fromProtobuf(transfer) {
        return new ProxyStaker({
            accountId: AccountId._fromProtobuf(
                /** @type {proto.IAccountID} */ (transfer.accountID)
            ),
            amount: Hbar.fromTinybars((transfer.amount != null) ? transfer.amount : 0),
        });
    }

    /**
     * @internal
     * @returns {proto.IAccountAmount}
     */
    _toProtobuf() {
        return {
            accountID: this.accountId._toProtobuf(),
            amount: this.amount.toTinybars(),
        };
    }
}
