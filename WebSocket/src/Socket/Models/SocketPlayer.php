<?php

use Ratchet\ConnectionInterface;

class SocketPlayer {

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
            'resourceId' => (int) $this->resourceId,
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