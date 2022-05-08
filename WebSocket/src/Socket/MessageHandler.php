<?php
namespace App\Socket;

use Exception;
use Ratchet\ConnectionInterface;
use Ratchet\MessageComponentInterface;
use SplObjectStorage;

class Player {

    private string $resourceId;
    private string $userName;
    private string $image;
    private bool $creator;

    public function __construct(string $resourceId, string $userName, string $image, bool $creator)
    {
        $this->resourceId = $resourceId;
        $this->userName = $userName;
        $this->image = $image;
        $this->creator = $creator;
    }

    public function toArray(): array {
        return [
            'resourceId' => $this->resourceId,
            'userName' => $this->userName,
            'image' => $this->image,
            'creator' => $this->creator
        ];
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
            case 'createRoom':
                $key = $data->joinKey;

                $userName = $data->player->userName;
                $image = $data->player->image;
                $creator = $data->player->creator;

                $player = new Player($from->resourceId, $userName, $image, $creator);
                $this->rooms[$key] = [$player];
                $players = $this->getSerializedPlayers($key);
                $this->sendToClient($from, ['players' => $players, 'type' => 'players']);
                break;
            case 'joinRoom':
                $key = $data->joinKey;

                $userName = $data->player->userName;
                $image = $data->player->image;
                $creator = $data->player->creator;

                $player = new Player($from->resourceId, $userName, $image, $creator);
                array_push($this->rooms[$key][0], $player);
                $players = $this->getSerializedPlayers($key);
                $this->sendToClient($from, ['players' => $players, 'type' => 'players']);
                break;
            case 'getPlayersFromCurrentRoom':
                $key = $data->joinKey;
                $players = $this->rooms[$key][0];
                $payload = [
                    'players' => $players
                ];
                $this->sendToClient($from, $payload);
                break;
            default:
                $this->sendToClient($from, $data);
                break;
        }
    }

    public function onClose(ConnectionInterface $conn): void
    {
        foreach ($this->rooms as $room) {
            foreach ($room[0] as $player) {
                if ($player->resourceId === $conn->resourceId) {
                    unset($player);
                    if(sizeof($room[0]) === 0) {
                        unset($room);
                    }
                }
            }
        }
        $this->connections->detach($conn);
    }

    public function onError(ConnectionInterface $conn, Exception $e): void
    {
        foreach ($this->rooms as $room) {
            foreach ($room[0] as $player) {
                if ($player->resourceId === $conn->resourceId) {
                    unset($player);
                    if(sizeof($room[0]) === 0) {
                        unset($room);
                    }
                }
            }
        }
        $this->connections->detach($conn);
        $conn->close();
    }

    /**
     * @throws \JsonException
     */
    private function sendToClient(ConnectionInterface $user, array $jsonData): void {
        $user->send(json_encode($jsonData, JSON_THROW_ON_ERROR));
    }

    private function getSerializedPlayers(string $roomKey): array {
        $serializedPlayers = [];
        foreach($this->rooms[$roomKey] as $player) {
            $serializedPlayers[] = $player->toArray();
        }
        return $serializedPlayers;
    }
}
