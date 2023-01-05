<?php

namespace App\Services;

use App\Entity\Card;
use App\Entity\CardCategory;
use App\Exception\CardException;
use App\Repository\CardCategoryRepository;
use App\Repository\CardRepository;
use Exception;
use const App\Entity\CATEGORY_KNOWN;

class CardService
{
    public function __construct(
        private CardRepository $cardRepository,
        private CardCategoryRepository $cardCategoryRepository
    ) {
    }

    /**
     * @throws Exception
     */
    public function getRandomCardInCategory(): ?Card
    {
        $category = $this->getRandomCategory();
        if ($category->getName() === CATEGORY_KNOWN) {
            $firstLetter = $this->getRandomLetter();
            $secondLetter = $this->getRandomLetter();
            while($firstLetter === $secondLetter) {
                $firstLetter = $this->getRandomLetter();
                $secondLetter = $this->getRandomLetter();
            }
            $value = $firstLetter . $secondLetter;
            $card = new Card();
            $card->setCategory($category);
            $card->setValue($value);
            return $card;
        }

        $possibleCards = $this->cardRepository->findCardsByCategory($category);
        $randomIndex = random_int(0, count($possibleCards)-1);
        $finalCard = $possibleCards[$randomIndex];

        if(isset($value)) {
            $finalCard->setValue($value);
        }

        return $finalCard;
    }

    /**
     * @throws Exception
     */
    private function getRandomCategory(): CardCategory {
        $categories = $this->cardCategoryRepository->findAllCardCategories();
        $randomIndex = random_int(0, count($categories)-1);
        return $categories[$randomIndex];
    }

    private function getRandomLetter(): string {
        return chr(rand(65,90));
    }
}