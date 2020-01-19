export interface SocketEvent {

    Action: string;
    Entity: string;
    Id: string;
    roomId: string;
}

export enum SocketEventType
{
    LEAVE_ROOM = "LEAVE_ROOM",
    JOIN_ROOM = "JOIN_ROOM",
    WORRY_EVENT = "WORRY_EVENT"
}
