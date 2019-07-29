import { CommandsType } from '../services/websocket.service';

export function getCommandsType(data: string): CommandsType|null {
    if (data.includes('help')) {
        return CommandsType.help;
    }
    if (data.includes('new')) {
        return CommandsType.new;
    }
    if (data.includes('map')) {
        return CommandsType.map;
    }
    if (data.includes('open')) {
        return CommandsType.open;
    }
    return null;
}