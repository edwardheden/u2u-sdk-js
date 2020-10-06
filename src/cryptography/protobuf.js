import { KeyList, PrivateKey, PublicKey } from "@hashgraph/cryptography";

/**
 * @namespace proto
 * @typedef {import("@hashgraph/proto").IKey} proto.IKey
 * @typedef {import("@hashgraph/proto").IKeyList} proto.IKeyList
 */

/**
 * @typedef {import("@hashgraph/cryptography").Key} Key
 */

/**
 * @param {Key} key
 * @returns {proto.IKey}
 */
export function keyToProtobuf(key) {
    if (key instanceof PrivateKey) {
        key = key.publicKey;
    }

    if (key instanceof PublicKey) {
        return {
            ed25519: key.toBytes(),
        };
    }

    if (key instanceof KeyList) {
        return {
            keyList: keyListToProtobuf(key),
        };
    }

    throw new Error(
        `(BUG) keyToProtobuf: unsupported key type: ${key.constructor.name}`
    );
}

/**
 * @param {KeyList} list
 * @returns {proto.IKeyList}
 */
export function keyListToProtobuf(list) {
    const keys = [];

    for (const key of list) {
        keys.push(keyToProtobuf(key));
    }

    return {
        keys,
    };
}

/**
 * @param {proto.IKey} key
 * @returns {KeyList | PublicKey}
 */
export function keyFromProtobuf(key) {
    if (key.ed25519 != null && key.ed25519.byteLength > 0) {
        return PublicKey.fromBytes(key.ed25519);
    }

    if (key.thresholdKey != null && key.thresholdKey.threshold != null) {
        const kl =
            key.thresholdKey.keys != null
                ? keyListFromProtobuf(key.thresholdKey.keys)
                : new KeyList();

        kl.threshold = key.thresholdKey.threshold;

        return kl;
    }

    if (key.keyList != null) {
        return keyListFromProtobuf(key.keyList);
    }

    throw new Error(
        `(BUG) keyFromProtobuf: not implemented key case: ${JSON.stringify(
            key
        )}`
    );
}

/**
 * @param {proto.IKeyList} keys
 * @returns {KeyList}
 */
export function keyListFromProtobuf(keys) {
    if (keys.keys == null) {
        return new KeyList();
    }

    return KeyList.from(keys.keys, keyFromProtobuf);
}
