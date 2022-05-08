<?php

namespace App\Controller;

use App\Services\GameService;
use App\Services\Serializer\GameSerializer;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;

class GameController extends AbstractController
{
    public function __construct(
        private GameService $gameService,
        private GameSerializer $gameSerializer
    ) {
    }

    public function createGame(Request $request): JsonResponse
    {
        $data = $this->getData($request);
        $deserializedGame = $this->gameSerializer->deserialize($data);

       $game = $this->gameService->createGame($deserializedGame);
        return new JsonResponse($game->toArray());
    }

    public function getGame(string $joinKey): JsonResponse
    {
        $game = $this->gameService->getGameByJoinKey($joinKey);
        return new JsonResponse($game->toArray());
    }

    private function getData(Request $request): array {
        return json_decode($request->getContent(), true);
    }

}
