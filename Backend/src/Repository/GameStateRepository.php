<?php

namespace App\Repository;

use App\Entity\GameState;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Exception\ORMException;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<GameState>
 */
class GameStateRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, GameState::class);
    }

    public function findGameStateById(int $id): GameState
    {
        return $this->findOneBy(['id' => $id]);
    }
}
