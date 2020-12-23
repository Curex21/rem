import { Reply } from "zeromq";

export const zmqBroker = async () => {
    const sock = new Reply();

    await sock.bind("tcp://127.0.0.1:3000");

    for await (const [msg] of sock) {
        const result = 2 * parseInt(msg.toString(), 10);
        await sock.send(result.toString());
    }
};
