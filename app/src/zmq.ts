// import { Request } from "zeromq";

// export const zmqSetup = async () => {
//     const sock = new Request();

//     sock.connect("tcp://127.0.0.1:3000");
//     console.log("Producer bound to port 3000");

//     await sock.send("4");
//     const [result] = await sock.receive();

//     console.log(result);
// };
