<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220508193659 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE game (id INT AUTO_INCREMENT NOT NULL, game_state_id INT NOT NULL, join_key VARCHAR(255) DEFAULT NULL, min_players INT NOT NULL, max_players INT NOT NULL, min_bomb_time INT NOT NULL, max_bomb_time INT NOT NULL, allow_known TINYINT(1) NOT NULL, allow_asked TINYINT(1) NOT NULL, allow_original TINYINT(1) NOT NULL, allow_shaked TINYINT(1) NOT NULL, allow_setted TINYINT(1) NOT NULL, password VARCHAR(255) DEFAULT NULL, INDEX IDX_232B318CAE9CC3E7 (game_state_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE game_state (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE game ADD CONSTRAINT FK_232B318CAE9CC3E7 FOREIGN KEY (game_state_id) REFERENCES game_state (id)');
        $this->addSql('INSERT INTO game_state (name) VALUES ("lobby"), ("ingame"), ("end")');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DELETE FROM game_state');
        $this->addSql('ALTER TABLE game DROP FOREIGN KEY FK_232B318CAE9CC3E7');
        $this->addSql('DROP TABLE game');
        $this->addSql('DROP TABLE game_state');
    }
}
