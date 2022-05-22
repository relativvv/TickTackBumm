<?php

namespace App\Controller;

use App\Exception\GameException;
use App\Services\GameService;
use App\Services\Serializer\GameSerializer;
use Ratchet\Wamp\JsonException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class GameController extends AbstractController
{
    public function __construct(
        private GameService $gameService,
        private GameSerializer $gameSerializer
    ) {
    }

    /**
     * @throws \JsonException
     */
    public function createGame(Request $request): JsonResponse
    {
        $data = $this->getData($request);
        $deserializedGame = $this->gameSerializer->deserialize($data);

       $game = $this->gameService->createGame($deserializedGame);
        return new JsonResponse($game->toArray());
    }

    public function verifyPassword(Request $request, string $joinKey): JsonResponse
    {
        $game = $this->gameService->getGameByJoinKey($joinKey);

        if($request->get('password') === null) {
            throw new GameException('No password given!');
        }
        $password = $request->get('password');

        if (!password_verify($password, $game->getPassword())) {
            throw new GameException('Invalid password', 400);
        }

        return new JsonResponse(Response::HTTP_OK);
    }

    public function getGame(string $joinKey): JsonResponse
    {
        $game = $this->gameService->getGameByJoinKey($joinKey);
        return new JsonResponse($game->toArray());
    }

    public function updateGame(int $id, Request $request): JsonResponse
    {
        $data = $this->getData($request);
        $deserializedGame = $this->gameSerializer->deserialize($data);

        $oldGame = $this->gameService->getGameById($id);
        $updatedGame = $this->gameService->mergeGame($oldGame, $deserializedGame);

        return new JsonResponse($updatedGame->toArray());
    }

    /**
     * @throws \JsonException
     */
    private function getData(Request $request): array
    {
        return json_decode($request->getContent(), true, 512, JSON_THROW_ON_ERROR);
    }

}
