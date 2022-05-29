<?php

namespace App\Controller;

use App\Exception\CardException;
use App\Services\CardService;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;

class CardController extends AbstractController
{
    public function __construct(
        private CardService $cardService
    ) {
    }

    /**
     * @throws Exception
     */
    public function getCard(): JsonResponse {
        $card = $this->cardService->getRandomCardInCategory();
        if($card === null) {
            throw new CardException('An error ocurred. No satisfying data was found to provide a card', 404);
        }

        return new JsonResponse($card->toArray());
    }
}
