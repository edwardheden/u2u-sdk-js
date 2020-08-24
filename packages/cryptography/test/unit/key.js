import PrivateKey from "../../src/PrivateKey.js";
import * as utf8 from "../../src/encoding/utf8.js";
import * as hex from "../../src/encoding/hex.js";
// import PublicKey from "../../src/PrivateKey.js";
// import Mnemonic from "../../src/Mnemonic.js";
// import BadKeyError from "../../src/BadKeyError.js";
// import * as assert from "assert";
// import KeyList from "../../src/PrivateKey.js";
// import * as utf8 from "../../src/utf8.js";

// key from hedera-sdk-java tests, not used anywhere
const privKeyBytes = Uint8Array.of(
    -37,
    72,
    75,
    -126,
    -114,
    100,
    -78,
    -40,
    -15,
    44,
    -29,
    -64,
    -96,
    -23,
    58,
    11,
    -116,
    -50,
    122,
    -15,
    -69,
    -113,
    57,
    -55,
    119,
    50,
    57,
    68,
    -126,
    83,
    -114,
    16
);

const privateKey = PrivateKey.fromBytes(privKeyBytes);

const privKeyStr =
    "302e020100300506032b657004220420db484b828e64b2d8f12ce3c0a0e93a0b8cce7af1bb8f39c97732394482538e10";
const privAndPubKeyStr =
    "db484b828e64b2d8f12ce3c0a0e93a0b8cce7af1bb8f39c97732394482538e10e0c8ec2758a5879ffac226a13c0c516b799e72e35141a0dd828f94d37988a4b7";
const rawPrivKeyStr =
    "db484b828e64b2d8f12ce3c0a0e93a0b8cce7af1bb8f39c97732394482538e10";

const pubKeyBytes = Uint8Array.of(
    -32,
    -56,
    -20,
    39,
    88,
    -91,
    -121,
    -97,
    -6,
    -62,
    38,
    -95,
    60,
    12,
    81,
    107,
    121,
    -98,
    114,
    -29,
    81,
    65,
    -96,
    -35,
    -126,
    -113,
    -108,
    -45,
    121,
    -120,
    -92,
    -73
);

// const pubKeyStr =
//     "302a300506032b6570032100e0c8ec2758a5879ffac226a13c0c516b799e72e35141a0dd828f94d37988a4b7";
// const rawPubKeyStr =
//     "e0c8ec2758a5879ffac226a13c0c516b799e72e35141a0dd828f94d37988a4b7";

const message = utf8.encode("hello, world");

const signature = new Uint8Array([
    157,
    4,
    191,
    237,
    123,
    170,
    151,
    200,
    13,
    41,
    166,
    174,
    72,
    192,
    216,
    150,
    206,
    132,
    99,
    167,
    234,
    12,
    22,
    25,
    125,
    85,
    165,
    99,
    199,
    57,
    150,
    239,
    6,
    43,
    42,
    223,
    80,
    127,
    65,
    108,
    16,
    132,
    34,
    192,
    49,
    15,
    198,
    251,
    33,
    136,
    110,
    17,
    206,
    61,
    227,
    233,
    81,
    215,
    165,
    96,
    73,
    116,
    63,
    7,
]);

// generated by hedera-keygen-java, not used anywhere
// const mnemonic = Mnemonic.fromString(
//     "inmate flip alley wear offer often piece magnet surge toddler submit right radio absent pear floor belt raven price stove replace reduce plate home"
// );
// const mnemonicKey =
//     "302e020100300506032b657004220420853f15aecd22706b105da1d709b4ac05b4906170c2b9c7495dff9af49e1391da";

// root key generated by the iOS wallet, not used anywhere
// const iosWalletMnemonic = Mnemonic.fromString(
//     "tiny denial casual grass skull spare awkward indoor ethics dash enough flavor good daughter early hard rug staff capable swallow raise flavor empty angle"
// );

// private key for "default account", should be index 0
const iosWalletPrivKey =
    "5f66a51931e8c99089472e0d70516b6272b94dd772b967f8221e1077f966dbda2b60cf7ee8cf10ecd5a076bffad9a7c7b97df370ad758c0f1dd4ef738e04ceb6";

const iosWalletKeyBytes = hex.decode(iosWalletPrivKey);
const iosWalletPrivKeyBytes = iosWalletKeyBytes.subarray(0, 32);
const iosWalletPubKeyBytes = iosWalletKeyBytes.subarray(32);

// root key generated by the Android wallet, also not used anywhere
// const androidWalletMnemonic = Mnemonic.fromString(
//     "ramp april job flavor surround pyramid fish sea good know blame gate village viable include mixed term draft among monitor swear swing novel track"
// );
// private key for "default account", should be index 0
const androidWalletPrivKey =
    "c284c25b3a1458b59423bc289e83703b125c8eefec4d5aa1b393c2beb9f2bae66188a344ba75c43918ab12fa2ea4a92960eca029a2320d8c6a1c3b94e06c9985";

const androidWalletKeyBytes = hex.decode(androidWalletPrivKey);
const androidWalletPrivKeyBytes = androidWalletKeyBytes.subarray(0, 32);
const androidWalletPubKeyBytes = androidWalletKeyBytes.subarray(32);

// const signTestData = utf8.encode("this is the test data to sign");

// const passphrase = "asdf1234";

// const pemString =
//     "-----BEGIN PRIVATE KEY-----\n" +
//     "MC4CAQAwBQYDK2VwBCIEINtIS4KOZLLY8SzjwKDpOguMznrxu485yXcyOUSCU44Q\n" +
//     "-----END PRIVATE KEY-----\n";

// const encryptedPem =
//     "-----BEGIN ENCRYPTED PRIVATE KEY-----\n" +
//     "MIGbMFcGCSqGSIb3DQEFDTBKMCkGCSqGSIb3DQEFDDAcBAi8WY7Gy2tThQICCAAw\n" +
//     "DAYIKoZIhvcNAgkFADAdBglghkgBZQMEAQIEEOq46NPss58chbjUn20NoK0EQG1x\n" +
//     "R88hIXcWDOECttPTNlMXWJt7Wufm1YwBibrxmCq1QykIyTYhy1TZMyxyPxlYW6aV\n" +
//     "9hlo4YEh3uEaCmfJzWM=\n" +
//     "-----END ENCRYPTED PRIVATE KEY-----\n";

// const pemPassphrase = "this is a passphrase";

describe("hedera/PrivateKey", function () {
    it("should be able to sign message", function () {
        expect(privateKey.sign(message)).to.deep.eq(signature);
    });

    it("should correctly verify signature", function () {
        expect(privateKey.publicKey.verify(message, signature)).to.be.true;
    });

    it("should produce correctly encoded string when toString() is called", function () {
        expect(privateKey.toString()).to.deep.equal(privKeyStr);
        expect(privateKey.toString(true)).to.deep.equal(rawPrivKeyStr);
    });

    it("should produce same publicKey", function () {
        expect(privateKey.publicKey.toBytes()).to.deep.equal(pubKeyBytes);
    });

    it("should return correct value when using fromString", function () {
        const privateKey = PrivateKey.fromString(privKeyStr);
        expect(privateKey.toBytes()).to.deep.equal(privKeyBytes);

        const privateKey2 = PrivateKey.fromString(privAndPubKeyStr);
        expect(privateKey2.toBytes()).to.deep.equal(privKeyBytes);

        const privateKey3 = PrivateKey.fromString(rawPrivKeyStr);
        expect(privateKey3.toBytes()).to.deep.equal(privKeyBytes);

        const privateKey4 = PrivateKey.fromString(iosWalletPrivKey);
        expect(privateKey4.toBytes()).to.deep.equal(iosWalletPrivKeyBytes);
        expect(privateKey4.publicKey.toBytes()).to.deep.equal(
            iosWalletPubKeyBytes
        );

        const privateKey5 = PrivateKey.fromString(androidWalletPrivKey);
        expect(privateKey5.toBytes()).to.deep.equal(androidWalletPrivKeyBytes);
        expect(privateKey5.publicKey.toBytes()).to.deep.equal(
            androidWalletPubKeyBytes
        );
    });

    // it("fromMnemonic() produces correct value", async function () {
    //     let key;

    //     // eslint-disable-next-line no-useless-catch
    //     try {
    //         key = await PrivateKey.fromMnemonic(mnemonic, "");
    //     } catch (error) {
    //         // to get actual stack trace before Promise mangles it
    //         throw error;
    //     }

    //     expect(key.toString()).to.deep.equal(mnemonicKey);
    // });

    // it("tokeystore() creates loadable keystores", async function () {
    //     const key1 = PrivateKey.fromBytes(privKeyBytes);
    //     const keystoreBytes = await key1.toKeystore(passphrase);
    //     const key2 = await PrivateKey.fromKeystore(keystoreBytes, passphrase);

    //     expect(key1.toBytes()).to.deep.equal(key2.toBytes());

    //     // keystore with the wrong password should reject with a `KeyMismatchError`
    //     await PrivateKey.fromKeystore(
    //         keystoreBytes,
    //         "some random password"
    //     ).catch((err) =>
    //         err.should.have.property(
    //             "message",
    //             "HMAC mismatch; passphrase is incorrect"
    //         )
    //     );
    // });

    // it("derive() produces correct value", async() => {
    //     const iosKey = await PrivateKey.fromMnemonic(iosWalletMnemonic, "");
    //     const iosChildKey = await iosKey.derive2(0);

    //     expect(iosChildKey.toBytes()).to.deep.equal(iosWalletPrivKeyBytes);
    //     expect(iosChildKey.publicKey.toBytes()).to.deep.equal(iosWalletPubKeyBytes);

    //     const androidKey = await PrivateKey.fromMnemonic(androidWalletMnemonic, "");
    //     const androidChildKey = await androidKey.derive2(0);

    //     expect(androidChildKey.toBytes()).to.deep.equal(androidWalletPrivKeyBytes);
    //     expect(androidChildKey.publicKey.toBytes()).to.deep.equal(androidWalletPubKeyBytes);
    // });

    // it("fromPem() produces a correct value", async () => {
    //     const key = await PrivateKey.fromPem(pemString);
    //     expect(key.toString()).to.deep.equal(privKeyStr);
    // });

    // it("fromPem() with passphrase produces a correct value", async () => {
    //     const key = await PrivateKey.fromPem(encryptedPem, pemPassphrase);
    //     expect(key.toString()).to.deep.equal(privKeyStr);
    // })
    // });

    // describe("PublicKey", () => {
    // it("toString() produces correctly encoded string", () => {
    //     const publicKey = PublicKey.fromBytes(pubKeyBytes);
    //     expect(publicKey.toString()).to.deep.equal(pubKeyStr);
    //     expect(publicKey.toString(true)).to.deep.equal(rawPubKeyStr);
    // });

    // it("fromString returns correct value", () => {
    //     const publicKey = PublicKey.fromString(pubKeyStr);
    //     expect(publicKey.toBytes()).to.deep.equal(pubKeyBytes);

    //     const publicKey2 = PublicKey.fromString(rawPubKeyStr);
    //     expect(publicKey2.toBytes()).to.deep.equal(pubKeyBytes);
    // });
    // });

    // describe("ThresholdKey", () => {
    // it("requires at least as many keys as its threshold", async() => {
    //     const key1 = await PrivateKey.generate();
    //     const key2 = await PrivateKey.generate();
    //     const key3 = await PrivateKey.generate();

    //     const thresholdKey = new ThresholdKey(3);

    //     expect(() => thresholdKey._toProtoKey())
    //         .toThrow("ThresholdKey must have at least one key");

    //     thresholdKey.addAll(key1.publicKey, key2.publicKey);

    //     expect(() => thresholdKey._toProtoKey())
    //         .toThrow("ThresholdKey must have at least as many keys as threshold: 3; # of keys currently: 2");

    //     thresholdKey.add(key3.publicKey);

    //     expect(() => thresholdKey._toProtoKey()).not.toThrow();
    // });
    // });

    // describe("KeyList", () => {
    // it("serializes correctly", async() => {
    //     const key1 = PublicKey.fromString(pubKeyStr);
    //     const key2 = PublicKey.fromBytes(iosWalletPubKeyBytes);

    //     const keyList = new KeyList();
    //     keyList.add(key1);
    //     keyList.add(key2);

    //     expect(keyList._toProtoKey().toObject()).to.deep.equal({
    //         contractid: undefined,
    //         ecdsa384: "",
    //         ed25519: "",
    //         keylist: {
    //             keysList: [
    //                 {
    //                     contractid: undefined,
    //                     ecdsa384: "",
    //                     ed25519: "4MjsJ1ilh5/6wiahPAxRa3mecuNRQaDdgo+U03mIpLc=",
    //                     keylist: undefined,
    //                     rsa3072: "",
    //                     thresholdkey: undefined
    //                 },
    //                 {
    //                     contractid: undefined,
    //                     ecdsa384: "",
    //                     ed25519: "K2DPfujPEOzVoHa/+tmnx7l983CtdYwPHdTvc44EzrY=",
    //                     keylist: undefined,
    //                     rsa3072: "",
    //                     thresholdkey: undefined
    //                 }
    //             ]
    //         },
    //         rsa3072: "",
    //         thresholdkey: undefined
    //     });
    // });
    // });

    // describe("Generate Mnemonic()", () => {
    // it("produces a 24-word mnemonic", () => {
    //     const mnemonic = Mnemonic.generate();
    //     expect(mnemonic.words).toHaveLength(24);
    // });

    // it("produces a recoverable private key", async() => {
    //     const mnemonic = Mnemonic.generate();

    //     const key1 = await mnemonic.toPrivateKey("");
    //     const key2 = await PrivateKey.fromMnemonic(mnemonic, "");
    //     expect(key1.toBytes()).to.deep.equal(key2.toBytes());
    // });
});
