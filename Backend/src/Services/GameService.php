<?php

namespace App\Services;

use App\Entity\Game;
use App\Repository\GameRepository;

class GameService
{
    public function __construct(
        private GameRepository $gameRepository
    ) {
    }

    public function createGame(Game $game): Game {
        $key = $this->generateJoinKey(33);
        $game->setJoinKey($key);
        return $this->gameRepository->createGame($game);
    }

    public function getGameByJoinKey(string $key): Game {
        return $this->gameRepository->findGameByJoinKey($key);
    }

    private function generateJoinKey(int $maxLength): string {
        $allowed = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $rnd = '';
        for ($i = 0; $i < rand(10, $maxLength); $i++) {
            $rnd .= $allowed[rand(0, strlen($allowed))-1];
        }
        return $rnd;
    }
}