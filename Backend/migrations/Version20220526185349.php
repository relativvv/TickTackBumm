<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220526185349 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE card (id INT AUTO_INCREMENT NOT NULL, category_id INT NOT NULL, value VARCHAR(255) NOT NULL, INDEX IDX_161498D312469DE2 (category_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE card_category (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE card ADD CONSTRAINT FK_161498D312469DE2 FOREIGN KEY (category_id) REFERENCES card_category (id)');
        $this->addSql('INSERT INTO card_category (name) VALUES ("known"), ("asked"), ("setted"), ("shaked"), ("original"), ("joker")');

        $this->addSql('INSERT INTO card (category_id, value) VALUES
                                              (2, "Was findet man in der Schule?"),
                                              (2, "Ein Gegenstand im Wohnzimmer?"),
                                              (2, "Eine Straftat mit Gefängnisstrafe?"),
                                              (2, "Womit kann ich mich fortbewegen?"),
                                              (3, "Hase"),
                                              (3, "Sex"),
                                              (3, "Arzt"),
                                              (3, "Liebe"),
                                              (4, "PEISBTETRL"),
                                              (4, "RDNIHCIFLSE"),
                                              (5, "SE"),
                                              (5, "BOR"),
                                              (6, "* Joker *")');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE card DROP FOREIGN KEY FK_161498D312469DE2');
        $this->addSql('DROP TABLE card');
        $this->addSql('DROP TABLE card_category');
    }
}
