<?php

namespace App\Command;

use App\Services\GameService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'RemoveInactiveGames',
    description: 'Removes inactive games from database',
)]
class RemoveInactiveGamesCommand extends Command
{

    public function __construct(
        private GameService $gameService,
        private EntityManagerInterface $entityManager
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $style = new SymfonyStyle($input, $output);
        $games = $this->gameService->getAllInactiveGames();
        $max = count($games);

        $progressbar = $style->createProgressBar($max);

        foreach($games as $game) {
            $this->entityManager->remove($game);
            $progressbar->advance();
        }

        $this->entityManager->flush();
        $style->success('All inactive games has been deleted');

        return Command::SUCCESS;
    }
}
