<?php

namespace App\Repository;

use App\Entity\Game;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Exception\ORMException;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Game>
 */
class GameRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Game::class);
    }

    public function createGame(Game $entity): Game
    {
        $this->getEntityManager()->persist($entity);
        $this->getEntityManager()->flush();
        return $entity;
    }

    public function findGameByJoinKey(string $key): Game
    {
        return $this->findOneBy(['joinKey' => $key]);
    }

    public function findGameById(int $id)
    {
        return $this->findOneBy(['id' => $id]);
    }

    public function updateGame(Game $game)
    {
        $this->getEntityManager()->persist($game);
        $this->getEntityManager()->flush();
        return $game;
    }
}
