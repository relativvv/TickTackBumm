<?php
namespace App\Socket;

use Exception;
use JsonException;
use Ratchet\ConnectionInterface;
use Ratchet\MessageComponentInterface;
use SplObjectStorage;

class Player {

    private string $resourceId;
    private string $userName;
    private string $image;
    private bool $creator;
    private int $lives;
    private ?ConnectionInterface $conn;

    public function __construct(string $resourceId, string $userName, string $image, bool $creator, int $lives = 0)
    {
        $this->resourceId = $resourceId;
        $this->userName = $userName;
        $this->image = $image;
        $this->creator = $creator;
        $this->lives = $lives;
    }

    public function toArray(): array {
        return [
            'resourceId' => $this->resourceId,
            'userName' => $this->userName,
            'image' => $this->image,
            'creator' => $this->creator,
            'lives' => $this->lives
        ];
    }

    /**
     * @param ConnectionInterface $conn
     */
    public function setConn(ConnectionInterface $conn): void
    {
        $this->conn = $conn;
    }

    /**
     * @return ConnectionInterface
     */
    public function getConn(): ConnectionInterface
    {
        return $this->conn;
    }

    public function getResourceId(): string {
        return $this->resourceId;
    }

    public function isCreator(): bool
    {
        return $this->creator;
    }

    public function setCreator(bool $creator): void
    {
        $this->creator = $creator;
    }
}

class MessageHandler implements MessageComponentInterface {

    protected SplObjectStorage $connections;
    private array $rooms;

    public function __construct()
    {
        $this->rooms = [];
        $this->connections = new SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn): void
    {
        $this->connections->attach($conn);
        echo "New connection! ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg): void
    {
        $data = json_decode($msg, false, 512, JSON_THROW_ON_ERROR);
        $type = $data->type;
        switch ($type) {
            case 'gameInfos':
                $key = $data->joinKey;
                if(!isset($this->rooms[$key])) {
                    $this->sendToClient($from, ['end' => true, 'type' => 'triggerEnd']);
                }
                $players = $this->getSerializedPlayers($key);
                $this->sendToClient($from, ['players' => $players, 'type' => 'players']);
                break;

            case 'createRoom':
                $key = $data->joinKey;

                $userName = $data->player->userName;
                $image = $data->player->image;
                $creator = $data->player->creator;

                $player = new Player($from->resourceId, $userName, $image, $creator, 3);
                $player->setConn($from);
                $this->rooms[$key] = [$player];
                break;

            case 'clientIsInRoom':
                $key = $data->joinKey;
                $room = $this->findRoomPlayersByKey($key);
                $fromId = $from->resourceId;

                foreach($room as $player) {
                    if((string) $fromId === $player->getResourceId()) {
                        $this->sendToClient($from, ['type' => 'isInRoom', 'isInRoom' => true]);
                        return;
                    }
                }

                $this->sendToClient($from, ['type' => 'isInRoom', 'isInRoom' => false]);
                break;

            case 'joinRoom':
                $key = $data->joinKey;

                $userName = $data->player->userName;
                $image = $data->player->image;
                $players = $this->getSerializedPlayers($key);

                if(count($players) < 1) {
                    return;
                }

                $player = new Player($from->resourceId, $userName, $image, false, 3);
                $player->setConn($from);
                array_push($this->rooms[$key], $player);

                $players = $this->getSerializedPlayers($key);
                $this->broadcastToAllPlayersInRoom($key, ['players' => $players, 'type' => 'players']);
                break;

            case 'getPlayersFromCurrentRoom':
                $key = $data->joinKey;
                $players = $this->getSerializedPlayers($key);
                $payload = [
                    'players' => $players
                ];
                $this->sendToClient($from, $payload);
                break;

            case 'getResourceId':
                $payload = [
                    'type' => 'resourceId',
                    'resourceId' => $from->resourceId
                ];
                $this->sendToClient($from, $payload);
                break;

            case 'settingsUpdate':
                $key = $data->joinKey;
                $values = $data->values;

                $this->broadcastToAllPlayersInRoom($key, ["type" => "updateSettings", "values" => $this->serializeGame($values)]);
                break;

            case 'sendMessage':
                $key = $data->joinKey;
                $message = $data->msg;
                $player = new Player($data->player->resourceId, $data->player->userName, $data->player->image, $data->player->creator);

                $payload = [
                    'type' => 'receiveMessage',
                    'player' => $player->toArray(),
                    'message' => $message
                ];

                $this->broadcastToAllPlayersInRoom($key, $payload, $from);
                break;



            // ------------------------------ Game Mechanics ------------------------- //
            case 'gameUpdate':
                $key = $data->joinKey;
                $game = $data->game;

                $payload = [
                    'type' => 'updateGame',
                    'game' => $this->serializeGame($game)
                ];
                $this->broadcastToAllPlayersInRoom($key, $payload);
                break;

            case 'answerSubmit':
                break;
            default:
                $this->sendToClient($from, []);
                break;
        }
    }

    public function onClose(ConnectionInterface $conn): void
    {
        $this->removePlayer($conn);
        $this->connections->detach($conn);
    }

    public function onError(ConnectionInterface $conn, Exception $e): void
    {
        $this->removePlayer($conn);
        $this->connections->detach($conn);
        $conn->close();
    }

    /**
     * @throws JsonException
     */
    private function removePlayer(ConnectionInterface $conn): void {
        foreach ($this->rooms as $room => $roomValue) {
            foreach ($roomValue as $key => $value) {
                if ($value->getResourceId() === (string) $conn->resourceId) {
                    unset($this->rooms[$room][$key]);

                    if($value->isCreator()) {
                        $this->rooms[$room][array_key_first($this->rooms[$room])]->setCreator(true);
                    }
                    $players = $this->getSerializedPlayers($room);
                    $this->broadcastToAllPlayersInRoom($room, ['players' => $players, 'type' => 'players']);

                    if(count($roomValue) === 0) {
                        unset($this->rooms[$room]);
                    }
                }
            }
        }
    }

    /**
     * @throws JsonException
     */
    private function sendToClient(ConnectionInterface $user, array $jsonData): void {
        $user->send(json_encode($jsonData, JSON_THROW_ON_ERROR));
    }

    /**
     * @throws JsonException
     */
    private function broadcastToAllPlayersInRoom(string $roomKey, array $jsonData, ?ConnectionInterface $current = null): void {
        $connectionInterfaces = [];
        $players = $this->findRoomPlayersByKey($roomKey);
        foreach($players as $player) {
            $connectionInterfaces[] = $player->getConn();
            foreach($connectionInterfaces as $interface) {
                if($interface->resourceId !== $current->resourceId) {
                    $this->sendToClient($interface, $jsonData);
                }
            }
        }
    }

    private function findRoomPlayersByKey(string $roomJoin): array {
        return $this->rooms[$roomJoin];
    }

    private function getSerializedPlayers(string $roomKey): array {
        $serializedPlayers = [];
        foreach($this->rooms[$roomKey] as $player) {
            $serializedPlayers[] = $player->toArray();
        }
        return $serializedPlayers;
    }

    private function serializeGame($item): array {
        return [
            'minPlayers' => $item->minPlayers,
            'maxPlayers' => $item->maxPlayers,
            'gameState' => $this->serializeGameState($item->gameState),
            'minBombTime' => $item->minBombTime,
            'maxBombTime' => $item->maxBombTime,
            'allowKnown' => $item->allowKnown,
            'allowAsked' => $item->allowAsked,
            'allowOriginal' => $item->allowOriginal,
            'allowShaked' => $item->allowShaked,
            'allowSetted' => $item->allowSetted,
            'enableJoker' => $item->enableJoker,
            'joinKey' => $item->joinKey,
            'players' => $this->getSerializedPlayers($item->joinKey),
            'currentPlayer' => $item->currentPlayer ?? null,
            'bombTime' => $item->bombTime ?? null
        ];
    }

    private function serializeGameState($item): array {
        return [
            'id' => $item->id,
            'name' => $item->name ?? null
        ];
    }
}
