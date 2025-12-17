import { Client, Session, Socket } from '@heroiclabs/nakama-js';
import { v4 as uuidV4 } from 'uuid';

class Nakama {
    private client!: Client;
    private session!: Session;
    private socket!: Socket;
    private matchID!: string;
    private useSSL = false;

    async authenticate(): Promise<void> {
        this.client = new Client('defaultkey', 'localhost', '7350', this.useSSL);

        let deviceId: string | null = localStorage.getItem('deviceId');
        if (!deviceId) {
            deviceId = uuidV4();
            localStorage.setItem('deviceId', deviceId);
        }

        // Store user session
        this.session = await this.client.authenticateDevice(deviceId, true);
        if (this.session?.user_id == null) {
            throw new Error('Not logged in');
        }
        localStorage.setItem('user_id', this.session.user_id);

        const trace = false;
        this.socket = this.client.createSocket(this.useSSL, trace);

        const appearOnline = false;
        await this.socket.connect(this.session, appearOnline);
    }

    async findMatch(ai: boolean = false): Promise<void> {
        const rpcId = 'match_join';

        const result = await this.client.rpc(
            this.session,
            rpcId,
            { ai }
        );

        const payload = JSON.parse(result.payload) as {
            matchIds: string[];
        };

        this.matchID = payload.matchIds[0];
        await this.socket.joinMatch(this.matchID);
        console.log('Match joined!');
    }

    async makeMove(index: number): Promise<void> {
        const data = { position: index };
        await this.socket.sendMatchState(
            this.matchID,
            4,
            JSON.stringify(data)
        );
        console.log('Match data sent');
    }

    async inviteAI(): Promise<void> {
        await this.socket.sendMatchState(this.matchID, 7, '');
        console.log('AI player invited');
    }
}

export default new Nakama();
