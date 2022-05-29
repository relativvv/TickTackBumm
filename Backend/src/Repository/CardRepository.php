<?php

namespace App\Repository;

use App\Entity\Card;
use App\Entity\CardCategory;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Exception\ORMException;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\Persistence\ManagerRegistry;

class CardRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Card::class);
    }

    public function findCardsByCategory(CardCategory $category): array
    {
        return $this->findBy(['category' => $category]);
    }

}
