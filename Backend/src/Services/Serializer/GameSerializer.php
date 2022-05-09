<?php

namespace App\Services\Serializer;

use App\Entity\Game;
use App\Exception\GameException;
use App\Repository\GameStateRepository;

class GameSerializer
{
    public function __construct(
        private GameStateRepository $gameStateRepository
    ) {
    }

    public function deserialize(array $data): Game {
        $mustHave = [
            'gameState',
            'minPlayers',
            'maxPlayers',
            'minBombTime',
            'maxBombTime',
            'allowKnown',
            'allowAsked',
            'allowOriginal',
            'allowShaked',
            'allowSetted'
        ];

        foreach($mustHave as $item) {
            if (!isset($data[$item])) {
               throw new GameException('Deserialization failed - Missing "' . $item . "'");
            }
        }

        $game = new Game();

        $gameState = $this->gameStateRepository->findGameStateById($data['gameState']['id']);
        $game->setGameState($gameState);

        $game->setMinPlayers($data['minPlayers']);
        $game->setMaxPlayers($data['maxPlayers']);
        $game->setMinBombTime($data['minBombTime']);
        $game->setMaxBombTime($data['maxBombTime']);
        $game->setAllowKnown($data['allowKnown']);
        $game->setAllowAsked($data['allowAsked']);
        $game->setAllowOriginal($data['allowOriginal']);
        $game->setAllowShaked($data['allowShaked']);
        $game->setAllowSetted($data['allowSetted']);

        if(isset($data['joinKey'])) {
            $game->setJoinKey($data['joinKey']);
        }

        if(isset($data['password'])) {
            if (password_get_info($data['password'])['algo'] === 0) {
                $game->setPassword(password_hash($data['password'], PASSWORD_DEFAULT));
            } else {
                $game->setPassword($data['password']);
            }
        } else {
            $game->setPassword(null);
        }

        return $game;
    }
}