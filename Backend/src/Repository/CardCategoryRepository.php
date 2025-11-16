<?php

namespace App\Repository;

use App\Entity\CardCategory;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Exception\ORMException;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\Persistence\ManagerRegistry;

class CardCategoryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CardCategory::class);
    }

    public function findCategoryById(int $id): ?CardCategory
    {
        return $this->findOneBy(['id' => $id]);
    }

    public function findAllCardCategories(): array {
        return $this->findAll();
    }
}
