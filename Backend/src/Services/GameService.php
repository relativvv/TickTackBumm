<?php

namespace App\Services;

use App\Entity\Game;
use App\Repository\GameRepository;
use App\Repository\GameStateRepository;
use Exception;

class GameService
{
    public function __construct(
        private GameRepository $gameRepository,
        private GameStateRepository $gameStateRepository
    ) {
    }

    public function createGame(Game $game): Game
    {
        $key = $this->generateJoinKey(33);
        $game->setJoinKey($key);
        return $this->gameRepository->createGame($game);
    }

    public function getGameByJoinKey(string $key): Game
    {
        return $this->gameRepository->findGameByJoinKey($key);
    }

    public function getGameById(int $id): Game
    {
        return $this->gameRepository->findGameById($id);
    }

    public function mergeGame(Game $game, Game $newGame): Game
    {
        $game->setAllowAsked($newGame->getAllowAsked());
        $game->setAllowKnown($newGame->getAllowKnown());
        $game->setAllowOriginal($newGame->getAllowOriginal());
        $game->setAllowSetted($newGame->getAllowSetted());
        $game->setAllowShaked($newGame->getAllowShaked());
        $game->setJokerEnabled($newGame->getJokerEnabled());

        $game->setMinBombTime($newGame->getMinBombTime());
        $game->setMaxBombTime($newGame->getMaxBombTime());
        $game->setMinPlayers($newGame->getMinPlayers());
        $game->setMaxPlayers($newGame->getMaxPlayers());

        $gameState = $this->gameStateRepository->findGameStateById($newGame->getGameState()->getId());
        $game->setGameState($gameState);

        return $this->gameRepository->updateGame($game);
    }

    public function getAllInactiveGames(): array {
        return $this->gameRepository->findAllInactiveGames();
    }

    /**
     * @throws Exception
     */
    private function generateJoinKey(int $maxLength): string
    {
        $allowed = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $rnd = '';
        for ($i = 0; $i < random_int(10, $maxLength); $i++) {
            $rnd .= $allowed[random_int(0, strlen($allowed))-1];
        }
        return $rnd;
    }
}
