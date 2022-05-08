<?php

namespace App\Entity;

use App\Repository\GameRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: GameRepository::class)]
class Game
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $joinKey;

    #[ORM\ManyToOne(targetEntity: GameState::class)]
    #[ORM\JoinColumn(nullable: false)]
    private GameState $gameState;

    #[ORM\Column(type: 'integer')]
    private int $minPlayers;

    #[ORM\Column(type: 'integer')]
    private int $maxPlayers;

    #[ORM\Column(type: 'integer')]
    private int $minBombTime;

    #[ORM\Column(type: 'integer')]
    private int $maxBombTime;

    #[ORM\Column(type: 'boolean')]
    private int $allowKnown;

    #[ORM\Column(type: 'boolean')]
    private int $allowAsked;

    #[ORM\Column(type: 'boolean')]
    private int $allowOriginal;

    #[ORM\Column(type: 'boolean')]
    private int $allowShaked;

    #[ORM\Column(type: 'boolean')]
    private int $allowSetted;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $password;

    public function toArray(): array {
        return [
            'id' => $this->getId(),
            'joinKey' => $this->getJoinKey(),
            'password' => $this->getPassword(),
            'gameState' => $this->getGameState()->toArray(),
            'minPlayers' => $this->getMinPlayers(),
            'maxPlayers' => $this->getMaxPlayers(),
            'minBombTime' => $this->getMinBombTime(),
            'maxBombTime' => $this->getMaxBombTime(),
            'allowKnown' => $this->getAllowKnown(),
            'allowAsked' => $this->getAllowAsked(),
            'allowOriginal' => $this->getAllowOriginal(),
            'allowShaked' => $this->getAllowShaked(),
            'allowSetted' => $this->getAllowSetted()
        ];
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getJoinKey(): ?string
    {
        return $this->joinKey;
    }

    public function setJoinKey(?string $joinKey): self
    {
        $this->joinKey = $joinKey;

        return $this;
    }

    public function getGameState(): ?GameState
    {
        return $this->gameState;
    }

    public function setGameState(?GameState $gameState): self
    {
        $this->gameState = $gameState;

        return $this;
    }

    public function getMinPlayers(): ?int
    {
        return $this->minPlayers;
    }

    public function setMinPlayers(int $minPlayers): self
    {
        $this->minPlayers = $minPlayers;

        return $this;
    }

    public function getMaxPlayers(): ?int
    {
        return $this->maxPlayers;
    }

    public function setMaxPlayers(int $maxPlayers): self
    {
        $this->maxPlayers = $maxPlayers;

        return $this;
    }

    public function getMinBombTime(): ?int
    {
        return $this->minBombTime;
    }

    public function setMinBombTime(int $minBombTime): self
    {
        $this->minBombTime = $minBombTime;

        return $this;
    }

    public function getMaxBombTime(): ?int
    {
        return $this->maxBombTime;
    }

    public function setMaxBombTime(int $maxBombTime): self
    {
        $this->maxBombTime = $maxBombTime;

        return $this;
    }

    public function getAllowKnown(): ?bool
    {
        return $this->allowKnown;
    }

    public function setAllowKnown(bool $allowKnown): self
    {
        $this->allowKnown = $allowKnown;

        return $this;
    }

    public function getAllowAsked(): ?bool
    {
        return $this->allowAsked;
    }

    public function setAllowAsked(bool $allowAsked): self
    {
        $this->allowAsked = $allowAsked;

        return $this;
    }

    public function getAllowOriginal(): ?bool
    {
        return $this->allowOriginal;
    }

    public function setAllowOriginal(bool $allowOriginal): self
    {
        $this->allowOriginal = $allowOriginal;

        return $this;
    }

    public function getAllowShaked(): ?bool
    {
        return $this->allowShaked;
    }

    public function setAllowShaked(bool $allowShaked): self
    {
        $this->allowShaked = $allowShaked;

        return $this;
    }

    public function getAllowSetted(): ?bool
    {
        return $this->allowSetted;
    }

    public function setAllowSetted(bool $allowSetted): self
    {
        $this->allowSetted = $allowSetted;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(?string $password): self
    {
        $this->password = $password;

        return $this;
    }
}
